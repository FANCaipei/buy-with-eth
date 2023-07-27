import { message } from "antd";
import Axios from "axios";
// import { request as gqlRequest, gql } from "graphql-request";
// import useGlobalIpfsStore from "../common/GlobalIpfsStore";
// import Utils from "../common/Utils";

Axios.defaults.baseURL = process.env.REACT_APP_SERVER_URL || "";
Axios.interceptors.request.use(
    function (config) {
        // Do something before request is sent
        if (!config?.url?.startsWith("http") && localStorage.getItem("jwt") != null) {
            config.headers["Authorization"] = `Bearer ${localStorage.getItem("jwt")}`;
        }
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
                message.error(error.response.data.msg);
            }
        }
        if (error?.response?.status === 500) {
            message.error("Server error");
        }
        return Promise.reject(error);
    }
);

const RestService = {
    getCryptoPrice: cryptoSymbol => {
        return Axios.get(`https://api.coinbase.com/v2/prices/${cryptoSymbol}-USD/spot`);
    },
    // getUniSwapV3Tokens: symbol => {
    //     const query = gql`
    //         {
    //             tokens(where: { symbol: "${symbol}" }) {
    //                 id
    //                 symbol
    //             }
    //         }
    //     `;
    //     return gqlRequest("https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3", query);
    // },
};

export default RestService;
