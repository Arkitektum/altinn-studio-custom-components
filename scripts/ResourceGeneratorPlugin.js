const fs = require("fs");
const path = require("path");

/**
 * @class ResourceGeneratorPlugin
 * @classdesc A Webpack plugin for generating language-specific resource files from a JSON input.
 * Reads a resource JSON file, organizes entries by language, and writes each language's resources
 * to separate output files. Integrates with Webpack to generate resources before compilation and
 * watches the input file for changes.
 *
 * @param {Object} options - Plugin configuration options.
 * @param {string} options.input - Path to the input JSON resource file.
 * @param {string} options.output - Directory where generated resource files will be written.
 */
class ResourceGeneratorPlugin {
    constructor(options) {
        this.input = options.input;
        this.output = options.output;
    }

    /**
     * Generates language-specific resource files from an input JSON file.
     * Reads the input file, parses resource entries, and organizes them by language.
     * Writes each language's resources to a separate output file in the specified directory.
     * Logs a success message upon completion.
     *
     * @returns {void}
     */
    generate() {
        if (!fs.existsSync(this.input)) {
            console.warn(`Resource file not found: ${this.input}`);
            return;
        }

        const rawData = fs.readFileSync(this.input, "utf8");
        const resources = JSON.parse(rawData);

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

        if (!fs.existsSync(this.output)) {
            fs.mkdirSync(this.output, { recursive: true });
        }

        Object.keys(languageMap).forEach((lang) => {
            const outputFilePath = path.join(this.output, `resource.${lang}.json`);

            fs.writeFileSync(
                outputFilePath,
                JSON.stringify(
                    {
                        language: lang,
                        resources: languageMap[lang]
                    },
                    null,
                    4
                ),
                "utf8"
            );
        });

        console.log("✔ Resource files generated");
    }

    /**
     * Applies the ResourceGeneratorPlugin to the webpack compiler.
     * Registers hooks to generate resources before compilation and to watch the input file for changes.
     *
     * @param {import('webpack').Compiler} compiler - The webpack compiler instance.
     */
    apply(compiler) {
        // Run once on startup
        compiler.hooks.beforeCompile.tap("ResourceGeneratorPlugin", () => {
            this.generate();
        });

        // Tell webpack to watch the input file
        compiler.hooks.thisCompilation.tap("ResourceGeneratorPlugin", (compilation) => {
            compilation.fileDependencies.add(path.resolve(this.input));
        });
    }
}

module.exports = ResourceGeneratorPlugin;
