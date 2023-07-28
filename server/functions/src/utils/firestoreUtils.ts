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
    }
): Promise<{
    txHash: string;
    chainId: string;
    tokenSymbol: string;
    value: number;
    recordPrice: number;
    recordValueInUSD: number;
    recordTimestamp: number;
}> => {
    const documentIds = appId?.split("-");
    if ((documentIds?.length ?? 0) < 2) {
        return Promise.reject();
    }
    if (!txHash || txHash === "" || !chainId || chainId === "") {
        return Promise.reject();
    }
    const userDocId = documentIds[0];
    const recordData = {
        txHash: txHash,
        chainId: chainId,
        tokenSymbol: tokenSymbol,
        value: txInfo.value,
        recordPrice: txInfo.currentPrice,
        recordValueInUSD: txInfo.valueInUSD,
        recordTimestamp: Date.now(),
        receiveAddress: txInfo.receiveAddress,
    };
    const db = getFirestore();
    try {
        await db.collection("paymentRecords").doc(userDocId).collection("paymentRecords").doc(txHash).set(recordData);
        return recordData;
    } catch (error) {
        return Promise.reject(error);
    }
};

export { initFirestore, getReceiveAccoutWithAppId, savePaymentRecord };
