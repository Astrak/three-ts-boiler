const path = require("path");
module.exports = {
    entry: "./index.ts",
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname),
    },
    resolve: {
        extensions: [".ts", ".js"],
    },
    module: {
        rules: [{ test: /\.ts$/, loader: "ts-loader" }],
    },
    plugins: [],
};
