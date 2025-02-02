const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = {
    entry: "./src/components/index.js",
    output: {
        filename: "main.js",
        path: path.resolve(__dirname, "dist")
    },
    plugins: [new MiniCssExtractPlugin()],
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, "css-loader"]
            }
        ]
    },
    optimization: {
        minimizer: [`...`, new CssMinimizerPlugin()]
    },
    devServer: {
        static: [
            {
                directory: path.join(__dirname, "public")
            },
            {
                directory: path.join(__dirname, "src"),
                publicPath: "/src/"
            }
        ],
        compress: true,
        port: 9000
    }
};
