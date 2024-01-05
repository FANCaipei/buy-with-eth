/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { HttpsError, onCall, onRequest } from "firebase-functions/v2/https";
import { onSchedule } from "firebase-functions/v2/scheduler";
import * as logger from "firebase-functions/logger";
import * as CryptoJS from "crypto-js";
import { getTransactionDetails, nativeTokenSymbols, rpcUrlConfig } from "./utils/tokenInfoUtils";
import { getAppConfig, initFirestore, savePaymentRecord, addApp, getPaymentRecord } from "./utils/firestoreUtils";
import { decodeReceiptId, generateReceiptId, sendPaymentResult } from "./utils/general";
import { ethers } from "ethers";
import {
    calcInvoicesBillAmount,
    saveInvoicesPaiedState,
    scheduledGenerateAllUserInvoices,
    scheduledSetUnpaiedState,
    verifyInvoicePaymentReceipt,
} from "./utils/invoicesManager";
// import { sendBillingEmailWithTemplate } from "./utils/mailManager";
import Configs from "./config";

// firstly init firestore
initFirestore();

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

export const checkPaymentAndSave = onRequest({ cors: true }, async (request, response) => {
    const { txHash, chainId, appId, isErc20, productId, extraInfo } = request.body ?? {};
    if (!txHash || !chainId || !appId) {
        response.status(400).send("Params invalid");
        return;
    }

    const rpcUrl: string = rpcUrlConfig[chainId];
    if (!rpcUrl) {
        response.status(400).send(`Chain id not support: ${chainId}`);
        return;
    }

    try {
        const queryResult = await Promise.all([
            getTransactionDetails(rpcUrl, txHash, isErc20, chainId),
            getAppConfig(appId),
        ]);

        // only support chain native token & USDT now
        let tokenSymbol = nativeTokenSymbols[chainId];
        if (isErc20) {
            tokenSymbol = "USDT";
        }

        const txInfo = queryResult[0];
        if (!txInfo) {
            const preGenerateReceiptId = generateReceiptId(
                appId,
                txHash,
                chainId,
                tokenSymbol,
                isErc20,
                productId ?? "",
                extraInfo ?? ""
            );
            response.status(400).send({
                error: {
                    receiptId: preGenerateReceiptId,
                    msg: `Transaction not exist or has not been mined`,
                },
            });
            return;
        }
        // check if receive address equals app paymentAddress
        const appPaymentAddr: string = queryResult[1]?.paymentAddress;
        if (txInfo.receiveAddress?.toLocaleLowerCase() !== appPaymentAddr?.toLocaleLowerCase()) {
            response.status(400).send(`Transaction receive address is not correct`);
            return;
        }

        // save record
        const savedRecord = await savePaymentRecord(appId, txHash, chainId, tokenSymbol, txInfo, productId, extraInfo);
        const receiptId = generateReceiptId(
            appId,
            txHash,
            chainId,
            tokenSymbol,
            isErc20,
            productId ?? "",
            extraInfo ?? ""
        );
        const result = { ...savedRecord, receiptId: receiptId };
        // call callback api if configed
        sendPaymentResult(appId, queryResult[1], result);

        response.send(result);
    } catch (error) {
        logger.error(error);
        response.status(500).send(error);
    }
});

export const verifyPaymentReceiptAndSave = onRequest({ cors: true }, async (request, response) => {
    const { receiptId } = request.body ?? {};
    if (!receiptId) {
        response.status(400).send("Params invalid");
        return;
    }
    try {
        const receiptParams = decodeReceiptId(receiptId);
        if (!receiptParams) {
            response.status(400).send("Wrong receipt id");
            return;
        }

        const { txHash, isErc20, chainId, appId, tokenSymbol, productId, extraInfo, uid } = receiptParams;
        const rpcUrl: string = rpcUrlConfig[receiptParams.chainId];

        const recordDocData = await getPaymentRecord(uid, txHash, chainId);
        if (recordDocData) {
            response.send({ ...recordDocData, receiptId: receiptId });
            return;
        }

        const queryResult = await Promise.all([
            getTransactionDetails(rpcUrl, txHash, isErc20, chainId),
            getAppConfig(appId),
        ]);

        const txInfo = queryResult[0];
        if (!txInfo) {
            response.status(400).send(`Transaction not exist or has not been mined`);
            return;
        }
        // check if receive address equals app paymentAddress
        const appPaymentAddr: string = queryResult[1]?.paymentAddress;
        if (txInfo.receiveAddress?.toLocaleLowerCase() !== appPaymentAddr?.toLocaleLowerCase()) {
            response.status(400).send(`Transaction receive address is not correct`);
            return;
        }
        // save record
        const savedRecord = await savePaymentRecord(appId, txHash, chainId, tokenSymbol, txInfo, productId, extraInfo);
        response.send({ ...savedRecord, receiptId: receiptId });
    } catch (error) {
        logger.error(error);
        response.status(500).send(error);
    }
});

export const billPayCallback = onRequest({ cors: true }, async (request, response) => {
    const { resultJsonStr, checkHexStr } = request.body ?? {};
    if (!resultJsonStr || !checkHexStr) {
        response.status(400).send("Params invalid");
        return;
    }
    // verify result data string
    const verifyHash = CryptoJS.SHA256(Configs.PaymenstResultVerifySecret + resultJsonStr).toString(CryptoJS.enc.Hex);
    if (checkHexStr !== verifyHash) {
        response.status(400).send("Data verification not passed");
        return;
    }

    try {
        const paymentData = JSON.parse(resultJsonStr);
        const { receiptId, extraInfo } = paymentData;
        const [paymentUserId, periodStr] = (extraInfo ?? "").split("#");
        const periods = JSON.parse(periodStr);

        if (!receiptId || !paymentUserId || !periods || !periods.length) {
            response.status(400).send("Missing some detail info");
            return;
        }

        const paymentInfo = await verifyInvoicePaymentReceipt(receiptId);
        const shouldPayAmount = await calcInvoicesBillAmount(paymentUserId, periods);
        if (shouldPayAmount > paymentInfo.recordValueInUSD * 1.02 /** 2% price buffer */) {
            response.status(400).send("Payment amount error");
        }
        await saveInvoicesPaiedState(paymentUserId, periods, receiptId);

        response.send({ success: true });
        return;
    } catch (error) {
        logger.error(error);
        response.status(500).send(error);
    }
});

// for api uni test

export const testScheduledGenerateInvoices3 = onRequest({ cors: true }, async (request, response) => {
    try {
        await scheduledGenerateAllUserInvoices();
        response.send({ success: true });
    } catch (error) {
        logger.error(error);
        response.status(500).send(error);
    }
});

// export const testScheduledSetUnpaiedState = onRequest({ cors: true }, async (request, response) => {
//     try {
//         const result = await scheduledSetUnpaiedState();
//         response.send({ success: true, updateUids: result });
//     } catch (error) {
//         logger.error(error);
//         response.status(500).send(error);
//     }
// });

// export const testSendBillEmail = onRequest({ cors: true }, async (request, response) => {
//     try {
//         await sendBillingEmailWithTemplate("202308", 12.89, "fancaipei@gmail.com");
//         response.send({ success: true });
//     } catch (error) {
//         logger.error(error);
//         response.status(500).send(error);
//     }
// });

// export const getAppAddrExample = onRequest(async (request, response) => {
//     const { appId } = request.body ?? {};
//     if (!appId) {
//         response.status(400).send(`appId must be provided`);
//         return;
//     }
//     try {
//         const addr = await getAppConfig(appId);
//         response.send({
//             address: addr,
//         });
//     } catch (error) {
//         logger.error(error);
//         response.status(500).send(error);
//     }
// });

// export const saveRecordExample = onRequest(async (request, response) => {
//     const { appId } = request.body ?? {};
//     if (!appId) {
//         response.status(400).send(`appId must be provided`);
//         return;
//     }
//     try {
//         const savedRecord = await savePaymentRecord(appId, "0xsdfghhhsdf", "0x1", "ETH", {
//             receiveAddress: "0x367D2G",
//             value: 0.2,
//             currentPrice: 1886,
//             valueInUSD: 123,
//         });
//         response.send(savedRecord);
//     } catch (error) {
//         logger.error(error);
//         response.status(500).send(error);
//     }
// });

/**
 * app call functions.
 * those functions can only be called by firebase client app.
 * Callables have these key difference from HTTP functions:
    # With callables, Firebase Authentication tokens, FCM tokens, and App Check tokens, when available, are automatically included in requests.
    # The trigger automatically deserializes the request body and validates auth tokens.
 * ref: https://firebase.google.com/docs/functions/callable 
 * */

export const payBills = onCall({ cors: true }, async request => {
    if (!request.auth) {
        throw new HttpsError("unauthenticated", "not authed");
    }

    const { receiptId, paymentType /* by crypto or by 3rd part*/, periods } = request.data ?? {};
    if (!receiptId || !paymentType || !periods) {
        throw new HttpsError("invalid-argument", "receiptId and paymentType are required");
    }
    if (!Array.isArray(periods) || !periods.length) {
        throw new HttpsError("invalid-argument", "periods must not be empty");
    }
    // only support crypto pay now
    if (paymentType !== "crypto") {
        throw new HttpsError("invalid-argument", "payment type not support");
    }
    try {
        const paymentInfo = await verifyInvoicePaymentReceipt(receiptId);
        const shouldPayAmount = await calcInvoicesBillAmount(request.auth.uid, periods);
        if (shouldPayAmount > paymentInfo.recordValueInUSD * 1.02 /** 2% price buffer */) {
            throw new HttpsError("internal", "not paying enough");
        }
        await saveInvoicesPaiedState(request.auth.uid, periods, receiptId);

        return {
            success: true,
        };
    } catch (error) {
        logger.error(error);
        throw new HttpsError("internal", error?.toString() ?? "unknow error", error);
    }
});

// user creat app, must check if user can create
// TODO: set dave cors, exapmle: { cors: [/firebase\.com$/, "flutter.com"] }
export const createApp = onCall({ cors: true }, async request => {
    // TODO: check if user has right to add app

    if (!request.auth) {
        throw new HttpsError("unauthenticated", "not authed");
    }
    const { logoUrl, name, paymentAddress, callbackApi, secretPhrase } = request.data;

    if (!name || !paymentAddress || !secretPhrase) {
        throw new HttpsError("invalid-argument", "name, paymentAddress, secretPhrase must be provided");
    }
    if (!ethers.utils.isAddress(paymentAddress)) {
        throw new HttpsError("invalid-argument", "invalid paymentAddress");
    }

    const uid = request.auth.uid;

    try {
        const appId = await addApp(uid, name, paymentAddress, logoUrl ?? "", callbackApi ?? "", secretPhrase);
        return {
            id: appId,
        };
    } catch (error) {
        logger.error(error);
        throw new HttpsError("internal", "create failed", error);
    }
});

/**
 * schedule functions
 *
 * schedule expression format: 'minute hour dayOfMonth month dayOfWeek'
 * https://www.ibm.com/docs/en/db2/11.5?topic=task-unix-cron-format
 */
export const generateInvoices = onSchedule("0 0 1 * *", scheduledGenerateAllUserInvoices); // every 1st day of month
export const setUnpaiedState = onSchedule("0 0 8 * *", scheduledSetUnpaiedState); // every 7th day of month
