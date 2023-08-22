/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { HttpsError, onCall, onRequest } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import * as logger from "firebase-functions/logger";
import { getTransactionDetails, nativeTokenSymbols, rpcUrlConfig } from "./utils/tokenInfoUtils";
import { getReceiveAccoutWithAppId, initFirestore, savePaymentRecord, addApp } from "./utils/firestoreUtils";
import { decodeReceiptId } from "./utils/general";
import { ethers } from "ethers";
import { scheduledGenerateAllUserInvoices } from "./utils/invoicesManager";

// firstly init firestore
initFirestore();

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

export const helloWorld = onRequest((request, response) => {
    logger.info("Hello logs!", { structuredData: true });
    response.send("Hello from Firebase!");
});

export const checkPaymentAndSave = onRequest({ cors: true }, async (request, response) => {
    const { txHash, chainId, appId, isErc20, productId } = request.body ?? {};
    if (!txHash || !chainId || !appId) {
        response.status(400).send("Params invalid");
        return;
    }

    const rpcUrl: string = rpcUrlConfig[chainId];
    if (!rpcUrl) {
        response.status(400).send(`Chain id not support: ${chainId}`);
        return;
    }
    // same logic with verifyPaymentReceiptAndSave
    try {
        const queryResult = await Promise.all([
            getTransactionDetails(rpcUrl, txHash, isErc20, chainId),
            getReceiveAccoutWithAppId(appId),
        ]);

        const txInfo = queryResult[0];
        if (!txInfo) {
            response.status(400).send(`Transaction not exist or has not been mined`);
            return;
        }
        // check if receive address equals app paymentAddress
        const appPaymentAddr: string = queryResult[1];
        if (txInfo.receiveAddress?.toLocaleLowerCase() !== appPaymentAddr.toLocaleLowerCase()) {
            response.status(400).send(`Transaction receive address is not correct`);
            return;
        }
        // only support chain native token & USDT now
        let tokenSymbol = nativeTokenSymbols[chainId];
        if (isErc20) {
            tokenSymbol = "USDT";
        }
        // save record
        const savedRecord = await savePaymentRecord(appId, txHash, chainId, tokenSymbol, txInfo, productId);
        const receiptId = `${appId}#${savedRecord.txHash}#${savedRecord.chainId}#${tokenSymbol}#${isErc20 ? 1 : 0}#${
            productId ?? ""
        }`;
        response.send({ ...savedRecord, receiptId: receiptId });
    } catch (error) {
        logger.error(error);
        response.status(500).send(error);
    }
});

export const verifyPaymentReceiptAndSave = onRequest(async (request, response) => {
    const { receiptId } = request.body ?? {};
    if (!receiptId) {
        response.status(400).send("Params invalid");
        return;
    }

    const receiptParams = decodeReceiptId(receiptId);
    if (!receiptParams) {
        response.status(400).send("Wrong receipt id");
        return;
    }

    const { txHash, isErc20, chainId, appId, tokenSymbol, productId } = receiptParams;
    const rpcUrl: string = rpcUrlConfig[receiptParams.chainId];
    // same logic with checkPaymentAndSave
    try {
        const queryResult = await Promise.all([
            getTransactionDetails(rpcUrl, txHash, isErc20, chainId),
            getReceiveAccoutWithAppId(appId),
        ]);

        const txInfo = queryResult[0];
        if (!txInfo) {
            response.status(400).send(`Transaction not exist or has not been mined`);
            return;
        }
        // check if receive address equals app paymentAddress
        const appPaymentAddr: string = queryResult[1];
        if (txInfo.receiveAddress?.toLocaleLowerCase() !== appPaymentAddr.toLocaleLowerCase()) {
            response.status(400).send(`Transaction receive address is not correct`);
            return;
        }
        // save record
        const savedRecord = await savePaymentRecord(appId, txHash, chainId, tokenSymbol, txInfo, productId);
        const receiptId = `${appId}#${savedRecord.txHash}#${savedRecord.chainId}#${tokenSymbol}#${isErc20 ? 1 : 0}#${
            productId ?? ""
        }`;
        response.send({ ...savedRecord, receiptId: receiptId });
    } catch (error) {
        logger.error(error);
        response.status(500).send(error);
    }
});

export const testScheduledGenerateInvoices = onRequest({ cors: true }, async (request, response) => {
    try {
        await scheduledGenerateAllUserInvoices();
        response.send({ success: true });
    } catch (error) {
        logger.error(error);
        response.status(500).send(error);
    }
});

// for api uni test
// export const getAppAddrExample = onRequest(async (request, response) => {
//     const { appId } = request.body ?? {};
//     if (!appId) {
//         response.status(400).send(`appId must be provided`);
//         return;
//     }
//     try {
//         const addr = await getReceiveAccoutWithAppId(appId);
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

export const registerVipWithPaymentReceipt = onCall(async request => {
    if (!request.auth) {
        throw new HttpsError("unauthenticated", "not authed");
    }

    const { receiptId, paymentType /* by crypto or by 3rd part*/ } = request.data ?? {};
    if (!receiptId || !paymentType) {
        throw new HttpsError("invalid-argument", "receiptId and paymentType are required");
    }
    // TODO: verify payment info, calculate vipLevel

    // TODO: update user vip expire timestamp, !!attention if expire time < now, the start time should be now!!
    // TODO: caculate expired timestamp
    const nextExpiredTimestamp = 12341242344234;
    const vipLevel = "test";
    await admin.auth().setCustomUserClaims(request.auth.uid, {
        vipExpired: nextExpiredTimestamp,
        vipLevel: vipLevel,
    });

    // response value
    return {
        success: true,
    };
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
