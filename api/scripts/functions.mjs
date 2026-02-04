// Data
import altinnStudioApps from "../data/altinnStudioApps.mjs";
import subforms from "../data/subforms.mjs";
import { JSDOM } from "jsdom";

/**
 * Fetches the DisplayLayout.json file from an Altinn Studio app repository.
 *
 * @async
 * @param {string} altinnStudioUrl - The base URL of the Altinn Studio instance.
 * @param {string} appOwner - The owner of the app repository.
 * @param {string} appName - The name of the app repository.
 * @returns {Promise<Object>} The parsed JSON content of DisplayLayout.json.
 * @throws {Error} If the fetch request fails or the response is not OK.
 */
async function fetchDisplayLayoutFromAltinnStudio(altinnStudioUrl, appOwner, appName) {
    const url = `${altinnStudioUrl}/repos/${appOwner}/${appName}/raw/branch/master/App/ui/form/layouts/DisplayLayout.json`;
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
            throw new Error(`Failed to fetch DisplayLayout.json: ${response.statusText}`);
        }
        const jsonResponse = await response.json();
        return jsonResponse;
    } catch (error) {
        console.error("Error fetching DisplayLayout.json:", error);
        throw error;
    }
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
    const altinnStudioUrl = "https://altinn.studio";
    const layoutPromises = altinnStudioApps.map(({ appOwner, appName }) =>
        fetchDisplayLayoutFromAltinnStudio(altinnStudioUrl, appOwner, appName)
            .then((layout) => ({ appOwner, appName, layout }))
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
 * Fetches the package.json file from an Altinn Studio app repository.
 *
 * @async
 * @param {string} altinnStudioUrl - The base URL of the Altinn Studio instance.
 * @param {string} appOwner - The owner of the app repository.
 * @param {string} appName - The name of the app repository.
 * @returns {Promise<Object>} The parsed JSON content of the package.json file.
 * @throws {Error} If the fetch request fails or the response is not OK.
 */
async function fetchPackageJsonFromAltinnStudio(altinnStudioUrl, appOwner, appName) {
    const url = `${altinnStudioUrl}/repos/${appOwner}/${appName}/raw/branch/master/App/wwwroot/altinn-studio-custom-components/package.json`;
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
            throw new Error(`Failed to fetch package.json: ${response.statusText}`);
        }
        const jsonResponse = await response.json();
        return jsonResponse;
    } catch (error) {
        console.error("Error fetching package.json:", error);
        throw error;
    }
}

async function fetchAltinnAppIndexHtml(altinnStudioUrl, appOwner, appName) {
    const url = `${altinnStudioUrl}/repos/${appOwner}/${appName}/raw/branch/master/App/views/Home/Index.cshtml`;
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
            throw new Error(`Failed to fetch index.cshtml: ${response.statusText}`);
        }
        const htmlString = await response.text();
        return htmlString;
    } catch (error) {
        console.error("Error fetching index.cshtml:", error);
        throw error;
    }
}

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

export async function getPackageVersions() {
    const altinnStudioUrl = "https://altinn.studio";
    const versionPromises = altinnStudioApps.map(async ({ appOwner, appName }) => {
        try {
            const [packageJson, indexHtml] = await Promise.all([
                fetchPackageJsonFromAltinnStudio(altinnStudioUrl, appOwner, appName),
                fetchAltinnAppIndexHtml(altinnStudioUrl, appOwner, appName)
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
