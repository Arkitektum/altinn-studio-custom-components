// Local functions
import { showLoadingIndicator } from "./adminRenderers.js";
import { fetchDefaultTextResources } from "./getters.js";

/**
 * Fetches display layouts from the local API endpoint.
 *
 * @async
 * @function fetchDisplayLayouts
 * @returns {Promise<Object>} A promise that resolves to the JSON response containing display layouts.
 * @throws {Error} If the fetch request fails or the response is not OK.
 */
export async function fetchDisplayLayouts() {
    const url = `http://localhost:9001/api/displayLayouts`;
    return fetch(url)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Failed to fetch DisplayLayout.json: ${response.statusText}`);
            }
            return response.json();
        })
        .catch((error) => {
            console.error("Error fetching DisplayLayout.json:", error);
            throw error;
        });
}

/**
 * Fetches the available package versions from the local API.
 *
 * Makes a GET request to `http://localhost:9001/api/packageVersions` and returns the parsed JSON response.
 * Throws an error if the request fails or the response is not OK.
 *
 * @async
 * @returns {Promise<Object>} A promise that resolves to the JSON object containing package versions.
 * @throws {Error} If the fetch request fails or the response is not OK.
 */
export async function fetchPackageVersions() {
    const url = `http://localhost:9001/api/packageVersions`;
    return fetch(url)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Failed to fetch package.json files: ${response.statusText}`);
            }
            return response.json();
        })
        .catch((error) => {
            console.error("Error fetching package.json files:", error);
            throw error;
        });
}

/**
 * Fetches application resource values for a given language.
 *
 * @param {string} language - The language code to fetch resources for.
 * @returns {Promise<Object>} A promise that resolves to the app resource values as a JSON object.
 * @throws {Error} If the fetch request fails or the response is not OK.
 */
export async function fetchAppResources(language) {
    const url = `http://localhost:9001/api/appResources?language=${language}`;
    return fetch(url)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Failed to fetch app resource values: ${response.statusText}`);
            }
            return response.json();
        })
        .catch((error) => {
            console.error("Error fetching app resource values:", error);
            throw error;
        });
}

/**
 * Fetches example data from the local API endpoint.
 *
 * @async
 * @function fetchExampleData
 * @returns {Promise<Object>} A promise that resolves to the example data as a JSON object.
 * @throws {Error} If the network request fails or the response is not OK.
 */
export async function fetchExampleData() {
    const url = `http://localhost:9001/api/exampleData`;
    return fetch(url)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Failed to fetch example data: ${response.statusText}`);
            }
            return response.json();
        })
        .catch((error) => {
            console.error("Error fetching example data:", error);
            throw error;
        });
}

/**
 * Fetches Altinn Studio forms from the local API.
 *
 * Makes a GET request to the `/api/altinnStudioForms` endpoint on localhost.
 * Throws an error if the request fails or the response is not OK.
 *
 * @async
 * @function fetchAltinnStudioForms
 * @returns {Promise<Object[]>} A promise that resolves to an array of Altinn Studio form objects.
 * @throws {Error} If the fetch operation fails or the response is not OK.
 */
export async function fetchAltinnStudioForms() {
    const url = `http://localhost:9001/api/altinnStudioForms`;
    return fetch(url)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Failed to fetch Altinn Studio forms: ${response.statusText}`);
            }
            return response.json();
        })
        .catch((error) => {
            console.error("Error fetching Altinn Studio forms:", error);
            throw error;
        });
}

/**
 * Fetches updated API data required for the application.
 * Initiates parallel requests for default text resources, display layouts, package versions,
 * application resource values, and example data. Displays a loading indicator while fetching.
 *
 * @async
 * @function
 * @returns {Promise<Array>} A promise that resolves to an array containing:
 *   [defaultTextResources, layouts, packageVersions, appResourceValues, exampleData]
 */
export async function getUpdatedApiData() {
    const defaultTextResourcesPromise = fetchDefaultTextResources("nb");
    const layoutsPromise = fetchDisplayLayouts();
    const packageVersionsPromise = fetchPackageVersions();
    const appResourceValuesPromise = fetchAppResources("nb");
    const exampleDataPromise = fetchExampleData();

    showLoadingIndicator([defaultTextResourcesPromise, layoutsPromise, packageVersionsPromise, appResourceValuesPromise, exampleDataPromise]);
    return Promise.all([defaultTextResourcesPromise, layoutsPromise, packageVersionsPromise, appResourceValuesPromise, exampleDataPromise]);
}
