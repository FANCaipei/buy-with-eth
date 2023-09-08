import Axios from "axios";

Axios.interceptors.request.use(
    function (config) {
        // Do something before request is sent
        // if (!config?.url?.startsWith("http") && localStorage.getItem("jwt") != null) {
        //     config.headers["Authorization"] = `Bearer ${localStorage.getItem("jwt")}`;
        // }
        return config;
    },
    function (error) {
        // Do something with request error
        return Promise.reject(error);
    }
);

Axios.interceptors.response.use(
    function (response) {
        // Any status code that lie within the range of 2xx cause this function to trigger
        // Do something with response data
        return response;
    },
    function (error) {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error
        if (error?.response?.status === 400) {
            if (error?.response?.data?.msg && typeof error.response.data.msg === "string") {
                // message.error(error.response.data.msg);
            }
        }
        if (error?.response?.status === 500) {
            // message.error("Server error");
        }
        return Promise.reject(error);
    }
);

const RestService = {
    getCryptoPrice: (cryptoSymbol: string) => {
        return Axios.get(`https://api.coinbase.com/v2/prices/${cryptoSymbol}-USD/spot`);
    },
    getTokenConfig: () => {
        return Axios.get(
            "https://firebasestorage.googleapis.com/v0/b/paywithcrypto-9283c.appspot.com/o/tokenConfigs%2FtokenConfig.json?alt=media"
        );
    },
    savePaymentInfo: (
        txHash: string,
        chainId: string,
        appId: string,
        isErc20: boolean,
        productId?: string,
        extraInfo?: string
    ) => {
        const params = {
            txHash: txHash,
            chainId: chainId,
            appId: appId,
            isErc20: isErc20,
            productId: productId,
            extraInfo: extraInfo,
        };
        return Axios.post("https://checkpaymentandsave-cjurgglvma-uc.a.run.app", params);
    },
};

export default RestService;
