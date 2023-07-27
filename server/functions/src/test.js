const axios = require("axios");

const getTokenPrice = async cryptoSymbol => {
    console.log("gettting token price....");
    const { data } = await axios.get(`https://api.coinbase.com/v2/prices/${cryptoSymbol}-USD/buy`, {
        headers: {
            Accept: "application/json",
        },
    });
    console.log("token price: ", data?.data?.amount);
    console.log("token price: ", data);
    return data?.price ? parseFloat(data?.data?.amount) : null;
};

getTokenPrice("eth");
