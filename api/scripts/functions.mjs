// Data
import altinnStudioApps from "../data/altinnStudioApps.mjs";
import subforms from "../data/subforms.mjs";

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
            throw new Error(`Failed to fetch file content: ${response.statusText}`);
        }
        const content = await response.text();
        return content;
    } catch (error) {
        console.error("Error fetching file content:", error);
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
    const layoutPromises = altinnStudioApps.map(({ appOwner, appName }) =>
        fetchDisplayLayoutFromAltinnStudio(appOwner, appName)
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
