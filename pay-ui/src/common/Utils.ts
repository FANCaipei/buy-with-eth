enum ResponseErrorType {
    UserDenyPayment,
    PaymentError,
}

const Utils = {
    generateErrorMsg: (
        type: ResponseErrorType,
        errorDetailMsg?: any
    ): { errorCode: number; errorMsg: string; errorDetail?: any } => {
        switch (type) {
            case ResponseErrorType.UserDenyPayment:
                return {
                    errorCode: 40007,
                    errorMsg: "user deny payment",
                    errorDetail: null,
                };
            case ResponseErrorType.PaymentError:
                return {
                    errorCode: 41001,
                    errorMsg: "payment error",
                    errorDetail: errorDetailMsg,
                };
            default:
                return {
                    errorCode: 40000,
                    errorMsg: "unknow error",
                    errorDetail: null,
                };
        }
    },
};

export { Utils, ResponseErrorType };
