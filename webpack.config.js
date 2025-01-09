const path = require("path");

module.exports = {
    entry: [
        "./src/functions/helpers.js",
        "./src/components/custom-field-adresse/index.js",
        "./src/components/custom-field-ansvarlig-soeker/index.js",
        "./src/components/custom-field-data/index.js",
        "./src/components/custom-field-kommunens-saksnummer/index.js",
        "./src/components/custom-field-prosjekt/index.js",
        "./src/components/custom-field-telefonnummer/index.js",
        "./src/components/custom-field-utfall-svar-status/index.js",
        "./src/components/custom-list-data/index.js",
        "./src/components/custom-list-vedlegg/index.js"
    ],
    output: {
        filename: "main.js",
        path: path.resolve(__dirname, "dist")
    }
};
