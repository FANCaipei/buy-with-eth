const path = require("path");

module.exports = {
    target: "web",
    entry: {
        index: "./src/index.js",
    },
    output: {
        path: path.resolve(__dirname),
        filename: "index.js",
        library: "BuyWithCrypto",
        libraryTarget: "umd",
        globalObject: "this",
        umdNamedDefine: true,
    },
};
