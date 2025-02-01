const path = require("path");

module.exports = {
    entry: "./src/components/index.js",
    output: {
        filename: "main.js",
        path: path.resolve(__dirname, "dist")
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"]
            }
        ]
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
