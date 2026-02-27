const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const ResourceGeneratorPlugin = require("./scripts/ResourceGeneratorPlugin");

module.exports = {
    mode: "development",
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
        minimizer: [`...`, new CssMinimizerPlugin()]
    },
    devServer: {
        historyApiFallback: {
            rewrites: [{ from: /^\/admin/, to: "/admin.html" }]
        },
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
