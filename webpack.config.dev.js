const path = require("node:path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const ResourceGeneratorPlugin = require("./scripts/ResourceGeneratorPlugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    mode: "development",
    entry: {
        main: "./src/components/index.js",
        examples: "./public/scripts/examples.js",
        admin: "./public/scripts/admin.js"
    },
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "dist")
    },
    plugins: [
        new MiniCssExtractPlugin(),
        new ResourceGeneratorPlugin({
            input: path.resolve(__dirname, "src/data/resources.json"),
            output: path.resolve(__dirname, "src/data")
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "public/index.html"),
            filename: "index.html",
            inject: "body",
            chunks: ["main", "examples"]
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "public/admin.html"),
            filename: "admin.html",
            inject: "body",
            chunks: ["main", "admin"]
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
        minimizer: [`...`, new CssMinimizerPlugin()]
    },
    devServer: {
        historyApiFallback: {
            rewrites: [{ from: /^\/admin/, to: "/admin.html" }]
        },
        static: [
            {
                directory: path.join(__dirname, "public")
            }
        ],
        compress: true,
        port: 9000
    }
};
