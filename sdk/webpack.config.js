const path = require("path");

module.exports = {
    target: "web",
    entry: {
        index: "./src/index.ts",
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "index.js",
        library: "BuyWithCrypto",
        libraryTarget: "umd",
        globalObject: "window",
        umdNamedDefine: true,
    },
};
