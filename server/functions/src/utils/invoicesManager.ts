import moment = require("moment");
import * as logger from "firebase-functions/logger";
import { getPaymentRecord } from "./firestoreUtils";
import { decodeReceiptId } from "./general";
import { getFirestore } from "firebase-admin/firestore";

/*some constant for updateVipInfo function*/
// uid & project id for console project
const consoleProjectUserId = "7eOuUvMKqhOiYjFBPgrxu050Wno1";
const consoleProjectAppId = "zLO6MpxSlR0uL8IvDwRU";
/**/

const verifyInvoicePaymentReceipt = async (receiptId: string): Promise<any> => {
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

const calcBill = (paymentCount: number): number => {
    const segement1 = 1000;
    const segement2 = 10000;
    const segement3 = 100000;

    const fullTier1: number = 0.1 * segement1;
    const fullTier2: number = 0.05 * (segement2 - segement1);
    const fullTier3: number = 0.03 * (segement3 - segement2);

    if (paymentCount > segement3) {
        return 0.02 * (paymentCount - segement3) + fullTier1 + fullTier2 + fullTier3;
    }
    if (paymentCount > segement2) {
        return 0.03 * (paymentCount - segement2) + fullTier1 + fullTier2;
    }
    if (paymentCount > segement1) {
        return 0.05 * (paymentCount - segement1) + fullTier1;
    }

    return 0.1 * paymentCount;
};

const generatePreviewMonthInvoice = async (uid: string): Promise<void> => {
    const previewMonthStart: number = moment().subtract(1, "months").startOf("month").toDate().getTime();
    const previewMonthEnd: number = moment().subtract(1, "months").endOf("month").toDate().getTime();
    const invoiceMonthStr: string = moment().subtract(1, "months").startOf("month").format("YYYYMM");

    const db = getFirestore();
    const recordsRef = db.collection("paymentRecords").doc(uid).collection("paymentRecords");
    // query & count payment record of preview month
    const qureyResult = await recordsRef
        .where("recordTimestamp", ">=", previewMonthStart)
        .where("recordTimestamp", "<=", previewMonthEnd)
        .count()
        .get();
    const previewMonthPaymentsCount: number = qureyResult.data().count;

    // calculate bill
    const bill: number = calcBill(previewMonthPaymentsCount);

    // save invoice
    // create new doc incase it not created
    await db.collection("invoices").doc(`${uid}`).set({}, { merge: true });
    await db
        .collection("invoices")
        .doc(`${uid}`)
        .collection("invoices")
        .doc(invoiceMonthStr)
        .set({
            paymentCount: previewMonthPaymentsCount,
            bill: bill,
            paied: bill > 0 ? false : true,
        });
};

const scheduledGenerateAllUserInvoices = async (): Promise<void> => {
    const db = getFirestore();
    const uidWithPaymentRecords = await db.collection("paymentRecords").select().get();
    uidWithPaymentRecords.forEach(async docRef => {
        try {
            await generatePreviewMonthInvoice(docRef.id);
        } catch (error) {
            logger.error(error);
        }
    });
};

const setIfNeedPayBill = async (uid: string): Promise<void> => {
    const db = getFirestore();
    const invoicesRef = db.collection("invoices").doc(uid).collection("invoices");
    // query & count payment record of preview month
    const qureyResult = await invoicesRef.where("paied", "!=", true).count().get();
    const hasUnpaied: boolean = qureyResult.data().count > 0;
    await db.collection("userAppConfigs").doc(`${uid}`).set(
        {
            hasUnpaiedBill: hasUnpaied,
        },
        { merge: true }
    );
};

const scheduledSetUnpaiedState = async (): Promise<any> => {
    const db = getFirestore();
    const uidHasInvoices = await db.collection("invoices").select().get();

    uidHasInvoices.forEach(async docRef => {
        try {
            await setIfNeedPayBill(docRef.id);
        } catch (error) {
            logger.error(error);
        }
    });
};

export { verifyInvoicePaymentReceipt, scheduledGenerateAllUserInvoices, scheduledSetUnpaiedState };
