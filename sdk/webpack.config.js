const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");

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
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    compress: {
                        drop_console: true,
                    },
                    mangle: true,
                },
            }),
        ],
    },
    output: {
        path: path.resolve(__dirname, "lib"),
        filename: "index.js",
        library: "BuyWithCrypto",
        libraryTarget: "umd",
        globalObject: "window",
        umdNamedDefine: true,
    },
};
