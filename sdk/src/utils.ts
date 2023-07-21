const Utils = {
    throwError: (errMsg: string) => {
        console.error(`[BuyWithCrypto Error]: errMsg`);
        throw new Error(errMsg);
    },
};

export default Utils;
