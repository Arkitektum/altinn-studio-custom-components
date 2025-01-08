const path = require('path');

module.exports = {
    entry: ["./src/functions/helpers.js", "./src/components/custom-field-adresse.js"],
    output: {
        filename: "main.js",
        path: path.resolve(__dirname, "dist")
    }
};
