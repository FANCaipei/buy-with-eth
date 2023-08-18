import { getPaymentRecord } from "./firestoreUtils";
import { decodeReceiptId } from "./general";

/*some constant for updateVipInfo function*/
// uid & project id for console project
const consoleProjectUserId = "7eOuUvMKqhOiYjFBPgrxu050Wno1";
const consoleProjectAppId = "zLO6MpxSlR0uL8IvDwRU";
/**/

const verifyVipPaymentReceipt = async (receiptId: string): Promise<any> => {
    const receiptInfo = decodeReceiptId(receiptId);
    if (receiptInfo?.uid !== consoleProjectUserId || receiptInfo?.appId !== consoleProjectAppId) {
        return Promise.reject("receipt info error");
    }
    const paymentInfo = await getPaymentRecord(consoleProjectUserId, receiptInfo.txHash, receiptInfo.chainId);
    if (paymentInfo?.appId !== consoleProjectAppId || paymentInfo?.consumed) {
        return Promise.reject("payment info error");
    }

    return paymentInfo;
};

export { verifyVipPaymentReceipt };
