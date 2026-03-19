const path = require("node:path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const ResourceGeneratorPlugin = require("./scripts/ResourceGeneratorPlugin");

module.exports = {
    mode: "production",
    entry: "./src/components/index.js",
    output: {
        filename: "main.js",
        path: path.resolve(__dirname, "dist")
    },
    plugins: [
        new MiniCssExtractPlugin(),
        new ResourceGeneratorPlugin({
            input: path.resolve(__dirname, "src/data/resources.json"),
            output: path.resolve(__dirname, "src/data")
        })
    ],
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, "css-loader"]
            }
        ]
    },
    optimization: {
        minimizer: ["...", new CssMinimizerPlugin()]
    }
};
