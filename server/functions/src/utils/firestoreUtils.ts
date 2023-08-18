import * as logger from "firebase-functions/logger";
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// const { initializeApp, applicationDefault, cert } = require("firebase-admin/app");
// const { getFirestore, Timestamp, FieldValue, Filter } = require("firebase-admin/firestore");

const initFirestore = () => {
    initializeApp();
};

const getReceiveAccoutWithAppId = async (appId: string): Promise<string> => {
    // appId format: {user document id}-{app document id}
    const documentIds = appId?.split("-");
    if ((documentIds?.length ?? 0) < 2) {
        return Promise.reject();
    }
    const userDocId = documentIds[0];
    const appDocId = documentIds[1];
    const db = getFirestore();
    const appConfig = await db.collection("userAppConfigs").doc(userDocId).collection("apps").doc(appDocId).get();
    const address = appConfig.data()?.paymentAddress;
    return address != null && address !== "" ? address : Promise.reject();
};

const savePaymentRecord = async (
    appId: string,
    txHash: string,
    chainId: string,
    tokenSymbol: string,
    txInfo: {
        receiveAddress: string;
        value: number;
        currentPrice: number;
        valueInUSD: number;
    },
    productId?: string
): Promise<{
    appId: string;
    txHash: string;
    chainId: string;
    tokenSymbol: string;
    value: number;
    recordPrice: number;
    recordValueInUSD: number;
    recordTimestamp: number;
    receiveAddress: string;
    productId: string | number;
}> => {
    const documentIds = appId?.split("-");
    if ((documentIds?.length ?? 0) < 2) {
        return Promise.reject();
    }
    if (!txHash || txHash === "" || !chainId || chainId === "") {
        return Promise.reject();
    }
    const userDocId = documentIds[0];
    const userAppDocId = documentIds[1];
    const db = getFirestore();
    // check if record already exist
    const recordDocData = await getPaymentRecord(userDocId, txHash, chainId);
    if (recordDocData != null) {
        // if record exist, return directly
        return {
            appId: (recordDocData as any).appId,
            txHash: (recordDocData as any).txHash,
            chainId: (recordDocData as any).chainId,
            tokenSymbol: (recordDocData as any).tokenSymbol,
            value: (recordDocData as any).value,
            recordPrice: (recordDocData as any).recordPrice,
            recordValueInUSD: (recordDocData as any).recordValueInUSD,
            recordTimestamp: (recordDocData as any).recordTimestamp,
            receiveAddress: (recordDocData as any).receiveAddress,
            productId: (recordDocData as any).productId,
        };
    }

    // if record not exist, add record
    const recordData = {
        appId: userAppDocId,
        txHash: txHash,
        chainId: chainId,
        tokenSymbol: tokenSymbol,
        value: txInfo.value,
        recordPrice: txInfo.currentPrice,
        recordValueInUSD: txInfo.valueInUSD,
        recordTimestamp: Date.now(),
        receiveAddress: txInfo.receiveAddress,
        productId: productId ?? "",
    };
    try {
        await db
            .collection("paymentRecords")
            .doc(userDocId)
            .collection("paymentRecords")
            .doc(`${txHash}${chainId}`)
            .set({ ...recordData });
        return recordData;
    } catch (error) {
        logger.error(error);
        return Promise.reject(error);
    }
};

/**
 *
 * @param userId
 * @param txHash
 * @param chainId
 * @returns {
 *      appId: string,
 *      chainId: string,
 *      productId: string,
 *      receiveAddress: string,
 *      recordPrice: number,
 *      recordTimestamp: timestamp
 *      recordValueInUSD: number,
 *      tokenSymbol: string,
 *      txHash: string,
 *      value: number
 * }
 */
const getPaymentRecord = async (userId: string, txHash: string, chainId: string): Promise<any> => {
    if (!txHash || !chainId || txHash === "" || chainId === "") {
        return null;
    }
    const db = getFirestore();
    try {
        const doc = await db
            .collection("paymentRecords")
            .doc(userId)
            .collection("paymentRecords")
            .doc(`${txHash}${chainId}`)
            .get();
        return doc.data();
    } catch (error) {
        logger.error(error);
        return null;
    }
};

const addApp = async (
    uid: string,
    name: string,
    paymentAddress: string,
    logoUrl: string,
    callbackApi: string,
    secretPhrase: string
): Promise<string> => {
    const db = getFirestore();
    const res = await db.collection(`userAppConfigs/${uid}/apps`).add({
        name: name,
        paymentAddress: paymentAddress,
        logoUrl: logoUrl,
        callbackApi: callbackApi,
    });
    await db.doc(`userAppConfigs/${uid}/apps/${res.id}/private/privateInfo`).set({
        secretPhrase: secretPhrase,
    });
    return res.id;
};

// const updateVipInfo = async (receiptId: string, targetUser: AuthData): Promise<void> => {
//     // TODO: decode product info
//     // TODO: calculate vip info & expired date
// };

export { initFirestore, getReceiveAccoutWithAppId, savePaymentRecord, getPaymentRecord, addApp };
