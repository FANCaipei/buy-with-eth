enum ResponseErrorType {
    UserDenyPayment,
}

const Utils = {
    generateErrorMsg: (type: ResponseErrorType): { errorCode: number; errorMsg: string } => {
        switch (type) {
            case ResponseErrorType.UserDenyPayment:
                return {
                    errorCode: 40007,
                    errorMsg: "user deny payment",
                };

            default:
                return {
                    errorCode: 40000,
                    errorMsg: "unknow error",
                };
        }
    },
};

export { Utils, ResponseErrorType };
