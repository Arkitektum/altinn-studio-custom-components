// Data
import altinnStudioApps from "../data/altinnStudioApps.mjs";
import subforms from "../data/subforms.mjs";

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
