// Local functions
import { showSyncProgress } from "./syncProgress.ts";

// Data
import defaultTextResources from "../../../src/data/resources.json";

// Written as the literal `process.env.API_PORT` because that is the only form webpack's Dotenv plugin substitutes at
// build time. `process` is not a runtime global in the browser: an unset variable comes out as undefined.
declare const process: { env: Record<string, string | undefined> };
const API_PORT = process.env.API_PORT || 9001;

/**
 * Fetches one of the local API's endpoints and answers its JSON.
 *
 * A failure is logged and thrown again, with the message the sync progress panel shows for that request.
 *
 * @param {string} path - The path under `/api/`, with its query if it has one.
 * @param {string} what - What the endpoint answers with, as the error message names it.
 * @returns {Promise<any>} The parsed JSON.
 * @throws {Error} If the request fails or the response is not OK.
 */
async function fetchApiJson(path: string, what: string) {
    try {
        const response = await fetch(`http://localhost:${API_PORT}/api/${path}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch ${what}: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error fetching ${what}:`, error);
        throw error;
    }
}

/**
 * Fetches display layouts from the local API endpoint.
 *
 * @async
 * @function fetchDisplayLayouts
 * @returns {Promise<Object>} A promise that resolves to the JSON response containing display layouts.
 * @throws {Error} If the fetch request fails or the response is not OK.
 */
export async function fetchDisplayLayouts() {
    return fetchApiJson("displayLayouts", "DisplayLayout.json");
}

/**
 * Fetches the available package versions from the local API.
 *
 * Makes a GET request to `http://localhost:${API_PORT}/api/packageVersions` and returns the parsed JSON response.
 * Throws an error if the request fails or the response is not OK.
 *
 * @async
 * @returns {Promise<Object>} A promise that resolves to the JSON object containing package versions.
 * @throws {Error} If the fetch request fails or the response is not OK.
 */
export async function fetchPackageVersions() {
    return fetchApiJson("packageVersions", "package.json files");
}

/**
 * Fetches the latest package versions from the local API.
 *
 * Makes a GET request to `http://localhost:${API_PORT}/api/latestPackageVersions` and returns the parsed JSON response.
 * Throws an error if the request fails or the response is not OK.
 *
 * @async
 * @function fetchLatestPackageVersions
 * @returns {Promise<Object>} A promise that resolves to the JSON object containing the latest package versions.
 * @throws {Error} If the fetch request fails or the response is not OK.
 */
export async function fetchLatestPackageVersions() {
    return fetchApiJson("latestPackageVersions", "latest package versions");
}

/**
 * Fetches application resource values, for one language or for all of them.
 *
 * Called with no language on purpose by the multilingual caller: the API answers with every supported language when
 * it is not told which one. The parameter is left off rather than sent as the string "undefined", which the API
 * narrows to the same thing but which reads like a mistake in a request log.
 *
 * @param {string} [language] - The language code to fetch resources for. Omitted means every supported language.
 * @returns {Promise<Object>} A promise that resolves to the app resource values as a JSON object.
 * @throws {Error} If the fetch request fails or the response is not OK.
 */
export async function fetchAppResources(language?: string) {
    const path = language ? `appResources?language=${encodeURIComponent(language)}` : "appResources";
    return fetchApiJson(path, "app resource values");
}

/**
 * The default text resources bundled with the dev tools, from `src/data/resources.json`. Nothing is fetched.
 *
 * @function fetchDefaultTextResources
 * @returns {Object} The default text resources.
 */
export function fetchDefaultTextResources() {
    return defaultTextResources;
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
    return fetchApiJson("exampleData", "example data");
}

/**
 * Fetches every app's copy of each subform's data model from the local API endpoint.
 *
 * @async
 * @returns {Promise<Array<Object>>} One entry per subform data type, `{ dataType, copies }`.
 * @throws {Error} If the network request fails or the response is not OK.
 */
export async function fetchSubformDataModels() {
    return fetchApiJson("subformDataModels", "subform data models");
}

/**
 * Fetches application metadata from the local API endpoint.
 *
 * @async
 * @function fetchApplicationMetadata
 * @returns {Promise<Object>} A promise that resolves to the application metadata as a JSON object.
 * @throws {Error} If the network request fails or the response is not OK.
 */
export async function fetchApplicationMetadata() {
    return fetchApiJson("applicationMetadata", "application metadata");
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
    return fetchApiJson("altinnStudioForms", "Altinn Studio forms");
}

/**
 * Fetches updated API data required for the application.
 * Initiates parallel requests for display layouts, package versions, latest package versions, application resource
 * values, example data, application metadata and subform data models, and shows each one's progress while they run.
 *
 * @async
 * @function
 * @returns {Promise<Array>} A promise that resolves to an array containing:
 *   [layouts, packageVersions, latestPackageVersions, multilingualAppResourceValues, exampleData, applicationMetadata, subformDataModels]
 */
export async function getUpdatedApiData() {
    const layoutsPromise = fetchDisplayLayouts();
    const packageVersionsPromise = fetchPackageVersions();
    const latestPackageVersionsPromise = fetchLatestPackageVersions();
    const multilingualAppResourceValuesPromise = fetchAppResources();
    const exampleDataPromise = fetchExampleData();
    const applicationMetadataPromise = fetchApplicationMetadata();
    const subformDataModelsPromise = fetchSubformDataModels();

    showSyncProgress([
        { label: "Display layouts", promise: layoutsPromise, unit: ["app", "apps"] },
        { label: "Package versions", promise: packageVersionsPromise, unit: ["app", "apps"] },
        { label: "Latest package versions", promise: latestPackageVersionsPromise, unit: ["package", "packages"] },
        { label: "App text resources", promise: multilingualAppResourceValuesPromise, unit: ["app", "apps"] },
        { label: "Example data", promise: exampleDataPromise, unit: ["entry", "entries"] },
        { label: "Application metadata", promise: applicationMetadataPromise, unit: ["app", "apps"] },
        { label: "Subform data models", promise: subformDataModelsPromise, unit: ["subform", "subforms"] }
    ]);
    return Promise.all([
        layoutsPromise,
        packageVersionsPromise,
        latestPackageVersionsPromise,
        multilingualAppResourceValuesPromise,
        exampleDataPromise,
        applicationMetadataPromise,
        subformDataModelsPromise
    ]);
}
