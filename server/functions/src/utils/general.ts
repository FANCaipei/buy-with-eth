import axios from "axios";
import * as logger from "firebase-functions/logger";
import { getAppSecretPhrase } from "./firestoreUtils";
import * as CryptoJS from "crypto-js";
import Configs from "../config";

const sendPaymentResult = async (appId: string, appConfigs: any, result: any) => {
    const url = appConfigs?.callbackApi;
    const secretPhrase = await getAppSecretPhrase(appId);
    if (!url || !secretPhrase || !result) {
        return;
    }
    const resultJsonStr = JSON.stringify(result);
    const checkHash = CryptoJS.SHA256(secretPhrase + resultJsonStr);

    axios.post<any>(url, {
        resultJsonStr: resultJsonStr,
        checkHexStr: checkHash.toString(CryptoJS.enc.Hex),
    });
};

const encryptReceiptId = (receipt: string): string => {
    return CryptoJS.AES.encrypt(receipt, Configs.ReceiptEncryptPassword).toString();
};

const decryptReceiptId = (encryptedReceipt: string): string => {
    return CryptoJS.AES.decrypt(encryptedReceipt, Configs.ReceiptEncryptPassword).toString(CryptoJS.enc.Utf8);
};

const isCorrectReceiptInfoObj = (receiptInfo: object): boolean => {
    const expectKeys = ["appId", "txHash", "chainId", "tokenSymbol", "isErc20", "productId", "extraInfo"];
    const allkeys = Object.keys(receiptInfo);

    for (let i = 0; i < expectKeys.length; i++) {
        const key = expectKeys[i];
        if (!allkeys.includes(key)) {
            return false;
        }
    }
    return true;
};

const generateReceiptId = (
    appId: string,
    txHash: string,
    chainId: string,
    tokenSymbol: string,
    isErc20: boolean,
    productId: string = "",
    extraInfo: string = ""
): string | null => {
    const dataObj = {
        appId: appId,
        txHash: txHash,
        chainId: chainId,
        tokenSymbol: tokenSymbol,
        isErc20: isErc20,
        productId: productId,
        extraInfo: extraInfo,
    };
    const dataStr = JSON.stringify(dataObj);
    return encryptReceiptId(dataStr);
};

const decodeReceiptId = (
    receiptId: string
): {
    uid: string;
    appId: string;
    txHash: string;
    chainId: string;
    tokenSymbol: string;
    isErc20: boolean;
    productId: string;
    extraInfo: string;
} | null => {
    try {
        const decryptedStr = decryptReceiptId(receiptId);
        const receiptData = JSON.parse(decryptedStr);
        if (!isCorrectReceiptInfoObj(receiptData)) {
            return null;
        }
        const [uid, realAppId] = receiptData.appId?.split("-") ?? [];
        if (!uid || !realAppId) {
            return null;
        }
        return {
            uid: uid,
            appId: receiptData.appId,
            txHash: receiptData.txHash,
            chainId: receiptData.chainId,
            tokenSymbol: receiptData.tokenSymbol,
            isErc20: receiptData.isErc20,
            productId: receiptData.productId,
            extraInfo: receiptData.extraInfo,
        };
    } catch (error) {
        logger.error(error);
        return null;
    }
};

export { decodeReceiptId, sendPaymentResult, generateReceiptId };
