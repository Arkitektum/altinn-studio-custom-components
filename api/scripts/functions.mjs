// Dependencies
import { JSDOM } from "jsdom";
import fs from "fs";

// Data
import altinnStudioApps from "../data/altinnStudioApps.mjs";
import subforms from "../data/subforms.mjs";

// Utils
import { convertXmlToJson } from "../utils/xmlToJsonConverter.mjs";

/**
 * Fetches the content of a file from a Gitea repository using the Altinn Studio API.
 *
 * @async
 * @function
 * @param {string} appOwner - The owner of the application repository.
 * @param {string} appName - The name of the application repository.
 * @param {string} filePath - The path to the file within the repository.
 * @returns {Promise<string>} The content of the requested file as a string.
 * @throws {Error} If the fetch operation fails or the response is not OK.
 */
async function fetchGiteaFileContent(appOwner, appName, filePath) {
    const url = `https://altinn.studio/repos/${appOwner}/${appName}/raw/branch/master/${filePath}`;
    const token = process.env.GITEA_TOKEN;
    const options = {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`Failed to fetch file content from ${url}: ${response.statusText}`);
        }
        const content = await response.text();
        return content;
    } catch (error) {
        console.error(`Error fetching file content from ${url}:`, error);
        throw error;
    }
}

/**
 * Fetches the display layout JSON from an Altinn Studio app repository.
 *
 * @async
 * @function
 * @param {string} appOwner - The owner of the application repository.
 * @param {string} appName - The name of the application repository.
 * @returns {Promise<Object>} The parsed JSON content of the display layout.
 * @throws {Error} If fetching or parsing the display layout fails.
 */
async function fetchDisplayLayoutFromAltinnStudio(appOwner, appName) {
    const filePath = "App/ui/form/layouts/DisplayLayout.json";
    const fileContent = await fetchGiteaFileContent(appOwner, appName, filePath);
    const jsonResponse = JSON.parse(fileContent);
    return jsonResponse;
}

/**
 * Fetches and returns display layouts for all Altinn Studio apps.
 *
 * Iterates over the list of Altinn Studio applications, fetches their display layouts,
 * and returns an array of layout objects. If fetching a layout fails for an app, it logs
 * the error and skips that app. The resulting array also includes any additional layouts
 * from the `subforms` array.
 *
 * @async
 * @function
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of layout objects for each app and subform.
 */
export async function getDisplayLayouts() {
    const layoutPromises = altinnStudioApps.map(({ appOwner, appName, dataType }) =>
        fetchDisplayLayoutFromAltinnStudio(appOwner, appName)
            .then((layout) => ({ appOwner, appName, dataType, layout }))
            .catch((error) => {
                console.error(`Error fetching layout for ${appOwner}/${appName}:`, error);
                return null;
            })
    );
    const layouts = await Promise.all(layoutPromises);
    const allLayouts = layouts.filter((layout) => layout !== null).concat(subforms);
    return allLayouts;
}

/**
 * Fetches the package.json file from an Altinn Studio app repository and extracts the version information.
 *
 * @async
 * @function
 * @param {string} appOwner - The owner of the application repository.
 * @param {string} appName - The name of the application repository.
 * @returns {Promise<Object>} An object containing the version information from the package.json file.
 * @throws {Error} If fetching or parsing the package.json file fails.
 */
async function fetchPackageJsonFromAltinnStudio(appOwner, appName) {
    const filePath = "App/wwwroot/altinn-studio-custom-components/package.json";
    const fileContent = await fetchGiteaFileContent(appOwner, appName, filePath);
    const jsonResponse = JSON.parse(fileContent);
    return jsonResponse;
}

/**
 * Fetches the resource file for a given app and language from Gitea.
 *
 * @async
 * @param {string} appOwner - The owner of the app repository.
 * @param {string} appName - The name of the app repository.
 * @param {string} [language="nb"] - The language code for the resource file (default is "nb").
 * @returns {Promise<Object>} The parsed JSON content of the resource file.
 */
async function fetchAppResourceFile(appOwner, appName, language = "nb") {
    const filePath = `App/config/texts/resource.${language}.json`;
    const fileContent = await fetchGiteaFileContent(appOwner, appName, filePath);
    const jsonResponse = JSON.parse(fileContent);
    return jsonResponse;
}

/**
 * Fetches resource values for all Altinn Studio apps for a given language.
 *
 * Iterates over the list of Altinn Studio apps, fetches the resource file for each app in the specified language,
 * and returns an array of objects containing the app owner, app name, and the fetched resource values.
 * If fetching fails for an app, it logs the error and excludes that app from the result.
 *
 * @async
 * @param {string} language - The language code for which to fetch resource values (e.g., 'en', 'nb').
 * @returns {Promise<Array<{ appOwner: string, appName: string, resourceValues: any }>>}
 *   A promise that resolves to an array of resource value objects for each app.
 */
export async function getAppResourceValues(language) {
    const appResourcePromises = altinnStudioApps.map(async ({ appOwner, appName }) => {
        try {
            const resourceValues = await fetchAppResourceFile(appOwner, appName, language);
            return {
                appOwner,
                appName,
                resourceValues
            };
        } catch (error) {
            console.error(`Error fetching resource values for ${appOwner}/${appName}:`, error);
            return null;
        }
    });

    const resources = await Promise.all(appResourcePromises);
    return resources.filter((resource) => resource !== null);
}

/**
 * Fetches the Index.cshtml file from an Altinn Studio app repository, which typically contains references to frontend assets.
 * This function is used to extract the versions of the altinn-app-frontend CSS and JS files referenced in the Index.cshtml.
 * @param {string} appOwner - The owner of the application repository.
 * @param {string} appName - The name of the application repository.
 * @returns {Promise<string>} The content of the Index.cshtml file as a string.
 * @throws {Error} If fetching the Index.cshtml file fails.
 */
async function fetchAltinnAppIndexHtml(appOwner, appName) {
    const filePath = "App/views/Home/Index.cshtml";
    const fileContent = await fetchGiteaFileContent(appOwner, appName, filePath);
    return fileContent;
}

/**
 * Extracts the versions of the altinn-app-frontend CSS and JS files referenced in the given HTML string.
 * @param {string} htmlString - The HTML content of the Index.cshtml file.
 * @returns {Object} An object containing the extracted CSS and JS versions.
 */
function extractAltinnAppFrontendVersions(htmlString) {
    const dom = new JSDOM(htmlString);
    const doc = dom.window.document;

    const result = {
        css: new Set(),
        js: new Set()
    };

    const cssRegex = /altinn-app-frontend\/([^/]+)\/altinn-app-frontend\.css$/;
    const jsRegex = /altinn-app-frontend\/([^/]+)\/altinn-app-frontend\.js$/;

    doc.querySelectorAll('link[rel="stylesheet"][href]').forEach((link) => {
        const match = link.href.match(cssRegex);
        if (match) {
            result.css.add(match[1]);
        }
    });

    doc.querySelectorAll("script[src]").forEach((script) => {
        const match = script.src.match(jsRegex);
        if (match) {
            result.js.add(match[1]);
        }
    });
    return {
        css: result.css.size > 0 ? Array.from(result.css)[0] : null,
        js: result.js.size > 0 ? Array.from(result.js)[0] : null
    };
}

/**
 * Fetches and returns the versions of the altinn-studio-custom-components package and the altinn-app-frontend assets for all Altinn Studio apps.
 *
 * Iterates over the list of Altinn Studio applications, fetches their package.json files and Index.cshtml files to extract version information,
 * and returns an array of objects containing the app owner, app name, and version details. If fetching version information fails for an app, it logs
 * the error and skips that app.
 *
 * @async
 * @function
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of objects with version information for each app.
 */
export async function getPackageVersions() {
    const versionPromises = altinnStudioApps.map(async ({ appOwner, appName }) => {
        try {
            const [packageJson, indexHtml] = await Promise.all([
                fetchPackageJsonFromAltinnStudio(appOwner, appName),
                fetchAltinnAppIndexHtml(appOwner, appName)
            ]);
            const altinnAppFrontendVersions = extractAltinnAppFrontendVersions(indexHtml);
            return {
                appOwner,
                appName,
                packageVersions: {
                    altinnStudioCustomComponents: packageJson.version,
                    altinnAppFrontendCSS: altinnAppFrontendVersions.css,
                    altinnAppFrontendJS: altinnAppFrontendVersions.js
                }
            };
        } catch (error) {
            console.error(`Error fetching package versions for ${appOwner}/${appName}:`, error);
            return null;
        }
    });

    const versions = await Promise.all(versionPromises);
    return versions.filter((version) => version !== null);
}

/**
 * Retrieves a combined list of Altinn Studio applications and subforms.
 *
 * This function maps over the `subforms` array to extract relevant properties
 * (`appOwner`, `appName`, `dataType`) from each subform, then merges these with
 * the existing `altinnStudioApps` array to produce a single array containing all apps.
 *
 * @returns {Array<Object>} An array of objects representing both Altinn Studio apps and subforms.
 */
export function getAltinnStudioForms() {
    const supFormApps = subforms?.map((subform) => ({
        appOwner: subform?.appOwner,
        appName: subform?.appName,
        dataType: subform?.dataType
    }));
    const allApps = [...altinnStudioApps, ...supFormApps];
    return allApps;
}

/**
 * Fetches the XML schema (XSD) file content for a given data type from an Altinn Studio app repository.
 *
 * @async
 * @param {string} appOwner - The owner of the Altinn Studio app.
 * @param {string} appName - The name of the Altinn Studio app.
 * @param {string} dataType - The data type whose XML schema should be fetched.
 * @returns {Promise<string>} The content of the XML schema file as a string.
 */
async function fetchXmlSchemaFromAltinnStudio(appOwner, appName, dataType) {
    const filePath = `App/models/${dataType}.xsd`;
    const fileContent = await fetchGiteaFileContent(appOwner, appName, filePath);
    return fileContent;
}

/**
 * Retrieves the app owner and app name for a given data type.
 *
 * Searches through the `altinnStudioApps` array for an app matching the provided `dataType`.
 * If not found, searches the `subforms` array for a subform matching the `dataType`.
 * Returns an object containing `appOwner` and `appName` if a match is found.
 * Throws an error if no matching app or subform is found.
 *
 * @param {string} dataType - The data type to search for.
 * @returns {{ appOwner: string, appName: string }} The app owner and app name associated with the data type.
 * @throws {Error} If no app or subform is found for the given data type.
 */
function getAppOwnerAndNameFromDataType(dataType) {
    const app = altinnStudioApps.find((app) => app.dataType === dataType);
    if (app) {
        return { appOwner: app.appOwner, appName: app.appName };
    }
    const subform = subforms.find((sub) => sub.dataType === dataType);
    if (subform) {
        return { appOwner: subform.appOwner, appName: subform.appName };
    }
    return { appOwner: null, appName: null };
}

/**
 * Reads example data from the local file system, converts XML files to JSON using their corresponding XML schemas,
 * and organizes the data by data type.
 *
 * @async
 * @function
 * @returns {Promise<Array<{ dataType: string, data: Record<string, any> }>>} 
 *   A promise that resolves to an array of objects, each containing a dataType and a data object mapping file names to their JSON content.
 *
 * @throws {Error} If reading directories or files fails.
 *
 * @example
 * const exampleData = await getJsonExampleData();
 * console.log(exampleData);
 */
export async function getJsonExampleData() {
    const exampleDataDir = "./api/data/exampleData";
    const folders = fs.readdirSync(exampleDataDir, { withFileTypes: true }).filter((dirent) => dirent.isDirectory());

    const result = [];

    for (const folder of folders) {
        const dataType = folder.name;
        const folderPath = `${exampleDataDir}/${dataType}`;
        const files = fs.readdirSync(folderPath, { withFileTypes: true }).filter((dirent) => dirent.isFile());

        for (const file of files) {
            const filePath = `${folderPath}/${file.name}`;
            const content = fs.readFileSync(filePath, "utf8");
            const { appOwner, appName } = getAppOwnerAndNameFromDataType(dataType);
            const xmlSchema = await fetchXmlSchemaFromAltinnStudio(appOwner, appName, dataType);
            const existing = result.find((r) => r.dataType === dataType);
            if (existing) {
                existing.data[file.name] = convertXmlToJson(content, xmlSchema);
            } else {
                result.push({ dataType, data: { [file.name]: convertXmlToJson(content, xmlSchema) } });
            }
        }
    }
    return result;
}
