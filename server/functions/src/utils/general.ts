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
} | null => {
    // correct receiptId fomat: ${appId}#${savedRecord.txHash}#${savedRecord.chainId}#${tokenSymbol}#${isErc20 ? 1 : 0}#${productId}
    // appId format: ${userId}-${userAppId}
    if (!receiptId || receiptId === "") {
        return null;
    }
    const data = receiptId.split("#");
    if (data.length < 6) {
        return null;
    }
    const combinedAppIdData = data[0].split("-");
    if (combinedAppIdData.length < 2) {
        return null;
    }
    if (data[4] !== "1" && data[4] !== "0") {
        // isErc20 must be '1' or '0'
        return null;
    }
    const uid = combinedAppIdData[0];
    // const appId = combinedAppIdData[1]; // app id is not needed in return value
    const txHash = data[1];
    const chaiId = data[2];
    const tokenSymbol = data[3];
    const isErc20 = data[4] === "1" ? true : false;
    const productId = data[5];
    return {
        uid: uid,
        appId: data[0],
        txHash: txHash,
        chainId: chaiId,
        tokenSymbol: tokenSymbol,
        isErc20: isErc20,
        productId: productId,
    };
};

export { decodeReceiptId };
