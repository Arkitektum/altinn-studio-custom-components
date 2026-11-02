const path = require("node:path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const ResourceGeneratorPlugin = require("./scripts/ResourceGeneratorPlugin");

module.exports = {
    mode: "production",
    entry: "./src/components/index.ts",
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
    resolve: {
        extensions: [".ts", ".js"]
    },
    module: {
        rules: [
            {
                test: /\.ts$/i,
                exclude: /node_modules/,
                use: "babel-loader"
            },
            {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, "css-loader"]
            },
            // The fonts are embedded in main.css rather than written next to it. An Altinn app on backend v9 loads
            // every file in wwwroot/custom-css as a stylesheet, so the CSS has to be the only file there.
            {
                test: /\.woff2?$/i,
                type: "asset/inline"
            }
        ]
    },
    optimization: {
        minimizer: ["...", new CssMinimizerPlugin()]
    }
};
