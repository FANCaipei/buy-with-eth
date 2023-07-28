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
import { getTransactionDetails, rpcUrlConfig } from "./utils/tokenInfoUtils";

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
        const txInfo = await getTransactionDetails(rpcUrl, txHash, isErc20, chainId);
        if (!txInfo) {
            response.status(400).send(`Transaction not exist or has not been mined`);
            return;
        }
        // TODO: check receive address equals paymentAddress & save to database
        response.send(txInfo);
    } catch (error) {
        logger.error(error);
        response.status(500).send(error);
    }
});
