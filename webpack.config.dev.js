const path = require("node:path");
const Dotenv = require('dotenv-webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ResourceGeneratorPlugin = require("./scripts/ResourceGeneratorPlugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    mode: "development",
    entry: {
        main: "./src/components/index.js",
        devTools: "./public/scripts/devTools/index.js",
        statistics: "./public/scripts/statistics/index.js"
    },
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "dist")
    },
    plugins: [
        new Dotenv(),
        new MiniCssExtractPlugin(),
        new ResourceGeneratorPlugin({
            input: path.resolve(__dirname, "src/data/resources.json"),
            output: path.resolve(__dirname, "src/data")
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "public/index.html"),
            filename: "index.html",
            inject: "body",
            chunks: ["main"]
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "public/devTools.html"),
            filename: "devTools.html",
            inject: "body",
            chunks: ["main", "devTools"]
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "public/statistics.html"),
            filename: "statistics.html",
            inject: "body",
            chunks: ["main", "statistics"]
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
    devServer: {
        historyApiFallback: {
            rewrites: [
                { from: /^\/statistics/, to: "/statistics.html" },
                { from: /^\/devTools/, to: "/devTools.html" },
                { from: /./, to: "/index.html" }
            ]
        },
        static: [
            {
                directory: path.join(__dirname, "public")
            }
        ],
        compress: true,
        port: process.env.PORT || 9000
    }
};
