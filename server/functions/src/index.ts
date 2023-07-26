/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { ethers } from "ethers";

const rpcUrlConfig: { [key: string]: string } = {
    "0x1": "https://mainnet.infura.io/v3/56f3c243604845ea85dbdb42cf8f6ce3",
    "0x89": "https://polygon-mainnet.infura.io/v3/56f3c243604845ea85dbdb42cf8f6ce3",
};

// const nativeTokenSymbols: { [key: string]: string } = {
//     "0x1": "ETH",
//     "0x89": "MATC",
// };

/**
 * @param rpcUrl
 * @param txHash
 * @returns Returns the transaction with hash or null if the transaction is unknown.
 */
const getTransactionDetails = async (
    rpcUrl: string,
    txHash: string,
    isErc20: boolean
): Promise<{
    receiveAddress: string;
    value: number;
    currentPrice: number;
    valueInUSD: number;
}> => {
    console.log("get transaction details:");
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
    const txInfo = await provider.getTransaction(txHash);

    console.log("origin transaction details: ", txInfo);

    if (!txInfo) {
        return Promise.reject("Transaction not exist or has not been mined");
    }

    const result = {
        receiveAddress: "",
        value: 0,
        currentPrice: 0,
        valueInUSD: 0,
    };

    // extract target address
    result.receiveAddress = txInfo.to || "";
    if (isErc20) {
        // TODO: extract target address from data
        result.receiveAddress = "";
    }
    // extract value
    result.value = parseFloat(ethers.utils.formatEther(txInfo.value));
    if (isErc20) {
        // TODO: extract value from data
        result.value = 0;
    }

    if (isErc20) {
        result.currentPrice = 1;
        result.valueInUSD = result.value;
    } else {
        // TODO: get current price
    }

    return result;
};

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

export const helloWorld = onRequest((request, response) => {
    logger.info("Hello logs!", { structuredData: true });
    response.send("Hello from Firebase!");
});

export const checkPaymentAndSave = onRequest(async (request, response) => {
    const { txHash, chainId, appId, isErc20 } = request.body ?? {};
    if (!txHash || !chainId || !appId) {
        response.status(400).send("Params invalid");
        return;
    }
    // TODO: get target paymentAddress with appId;
    const rpcUrl: string = rpcUrlConfig[chainId];
    if (!rpcUrl) {
        response.status(400).send(`Chain id not support: ${chainId}`);
        return;
    }
    try {
        const txInfo = await getTransactionDetails(rpcUrl, txHash, isErc20);
        if (!txInfo) {
            response.status(400).send(`Transaction not exist or has not been mined`);
            return;
        }
        // TODO: check receive address equals paymentAddress & save to database
    } catch (error) {
        response.status(500).send(error);
    }
});
