const axios = require("axios");

const getTokenPrice = async () => {
    console.log("gettting token price....");
    const { data } = await axios.get(`https://catfact.ninja/fact`, {
        headers: {
            Accept: "application/json",
        },
    });
    console.log("token price: ", data?.price);
    console.log("token price: ", data);
    return data?.price ? parseFloat(data.price) : null;
};

getTokenPrice();
