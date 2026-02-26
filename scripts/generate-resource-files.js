#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

/**
 * Generates language-specific resource files from a JSON input file.
 *
 * Reads an array of resource objects from the input file, organizes them by language,
 * and writes separate JSON files for each language to the specified output directory.
 *
 * @param {string} inputFilePath - Path to the input JSON file containing resource definitions.
 * @param {string} outputDir - Directory where the generated language resource files will be saved.
 *
 * @throws {TypeError} If the input JSON is not an array.
 * @throws {Error} If the input file does not exist or cannot be read.
 */
function generateLanguageResourceFiles(inputFilePath, outputDir) {
    try {
        if (!fs.existsSync(inputFilePath)) {
            throw new Error(`Input file not found: ${inputFilePath}`);
        }

        const rawData = fs.readFileSync(inputFilePath, "utf8");
        const resources = JSON.parse(rawData);

        if (!Array.isArray(resources)) {
            throw new Error("Input JSON must be an array.");
        }

        const languageMap = {};

        resources.forEach((resource) => {
            if (!resource.id || typeof resource.values !== "object") return;

            Object.entries(resource.values).forEach(([lang, value]) => {
                if (!languageMap[lang]) {
                    languageMap[lang] = [];
                }

                languageMap[lang].push({
                    id: resource.id,
                    value
                });
            });
        });

        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        Object.keys(languageMap).forEach((lang) => {
            const outputData = {
                language: lang,
                resources: languageMap[lang]
            };

            const outputFilePath = path.join(outputDir, `resource.${lang}.json`);

            fs.writeFileSync(outputFilePath, JSON.stringify(outputData, null, 4), "utf8");
        });

        console.log(`✔ Generated ${Object.keys(languageMap).length} language files`);
    } catch (err) {
        console.error("❌ Error:", err.message);
    }
}

// CLI handling

const args = process.argv.slice(2);

const watchMode = args.includes("--watch");
const filteredArgs = args.filter((arg) => arg !== "--watch");

if (filteredArgs.length === 0) {
    console.log(`
Usage:
  node generate-resources.js <input-file> [output-directory] [--watch]

Example:
  node generate-resources.js resources.json ./output --watch
`);
    process.exit(0);
}

const inputFile = path.resolve(filteredArgs[0]);
const outputDir = path.resolve(filteredArgs[1] || "./output");

// Initial run
generateLanguageResourceFiles(inputFile, outputDir);

// Watch mode
if (watchMode) {
    console.log("👀 Watching for changes...");

    fs.watch(inputFile, { persistent: true }, () => {
        console.log("🔄 Change detected. Regenerating...");
        generateLanguageResourceFiles(inputFile, outputDir);
    });
}
