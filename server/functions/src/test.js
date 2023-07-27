const axios = require("axios");

const getTokenPrice = async cryptoSymbol => {
    console.log("gettting token price....");
    const { data } = await axios.get(`https://api.binance.com/api/v3/ticker/price?symbol=${cryptoSymbol}USDT`, {
        headers: {
            Accept: "application/json",
        },
    });
    console.log("token price: ", data?.price);
    console.log("token price: ", data);
    return data?.price ? parseFloat(data.price) : null;
};

getTokenPrice("ETH");
