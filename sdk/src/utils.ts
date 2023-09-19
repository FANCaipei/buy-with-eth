const Utils = {
    throwError: (errMsg: string) => {
        console.error(`[OcelotPay Error]: ${errMsg}`);
        throw new Error(errMsg);
    },
};

export default Utils;
