import type { ApiData, ApiValue, DisplayLayoutEntry } from "../types.ts";
// Local functions
import { fetchDefaultTextResources, getUpdatedApiData } from "./apiHelpers.ts";
import { getAppResourceValuesForLanguage, getResourcesForLanguage } from "../getters.ts";
import {
    getMissingResourceBindings,
    getResourceBindingsWithUsageFromApplications,
    getUsageForMissingResources,
    getUsageForResources
} from "../validators.ts";
import { loadApiData, removeLegacyLocalStorage, saveApiData } from "./apiDataStore.ts";
import { openPageFromLocation, redrawOpenPage, renderAdminSidebar, renderNoDataMessage, renderSynchronizeButton } from "./renderers.ts";
import { addDataToGlobalThis } from "../localStorage.ts";
import { flattenAppLayouts } from "./displayLayoutHelpers.ts";
import { getComponentUsageTreeForAllLayouts } from "./componentUsageHelpers.ts";
import { getDataModelBindingDriftForAllLayouts } from "./dataModelBindingHelpers.ts";
import { getSubformDataModelDrift } from "./subformDataModelHelpers.ts";

/** What a synchronization fetches, by the name it is stored and put on globalThis under. */
const API_DATA_KEYS = [
    "displayLayouts",
    "packageVersions",
    "latestPackageVersions",
    "multilingualAppResourceValues",
    "exampleData",
    "applicationMetadata",
    "subformDataModels"
];

/**
 * Reads what the last synchronization stored, and when it ran.
 *
 * When the store cannot be read at all, that counts as nothing stored, so the tools synchronize instead.
 *
 * @returns {Promise<Object>} The stored data and `lastUpdated`, each undefined when nothing is stored.
 */
async function getStoredApiData(): Promise<Record<string, ApiValue>> {
    try {
        return await loadApiData([...API_DATA_KEYS, "lastUpdated"]);
    } catch (error) {
        console.error("Could not read the stored data, synchronizing instead:", error);
        return {};
    }
}

/**
 * Stores what a synchronization fetched and when, so the next page load can use it without synchronizing.
 *
 * A failure to store does not stop the tools: the data is still shown, and the next page load synchronizes again.
 *
 * @param {ApiData} apiData - The fetched data.
 * @param {string} lastUpdated - When it was fetched.
 * @returns {Promise<void>}
 */
export async function storeApiData(apiData: ApiData, lastUpdated: string) {
    try {
        await saveApiData({ ...apiData, lastUpdated });
    } catch (error) {
        console.error("Could not store the synchronized data, the next page load synchronizes again:", error);
    }
}

export function getMissingResourceBindingsWithUsage(
    displayLayouts: DisplayLayoutEntry[] | undefined,
    appResourceValues: ApiValue,
    defaultTextResources: ApiValue
) {
    const resourceBindingsInApplications = getResourceBindingsWithUsageFromApplications(displayLayouts, "custom");
    const { missingResourceBindings } = getMissingResourceBindings(resourceBindingsInApplications, null, defaultTextResources);
    const { missingResourcesUsage, missingResourcesWithLocalValueUsage } = getUsageForMissingResources(
        displayLayouts,
        missingResourceBindings,
        appResourceValues
    );
    return { missingResourceBindings, missingResourcesUsage, missingResourcesWithLocalValueUsage };
}

export function getAllTextResourceUsage(
    displayLayouts: DisplayLayoutEntry[] | undefined,
    appResourceValues: ApiValue,
    defaultTextResources: ApiValue
) {
    const textResourceUsage = getUsageForResources(displayLayouts, defaultTextResources);
    const { missingResourcesUsage, missingResourcesWithLocalValueUsage } = getMissingResourceBindingsWithUsage(
        displayLayouts,
        appResourceValues,
        defaultTextResources
    );
    return [...textResourceUsage, ...missingResourcesUsage, ...missingResourcesWithLocalValueUsage];
}

/**
 * Works out everything the pages read from what a synchronization fetched, and puts both on globalThis. Storing the
 * data for the next page load is storeApiData's job.
 *
 * The usage pages read the text resource and component usage worked out here rather than the raw layouts, so this
 * has to run after every synchronization and not only on page load, or the usage pages would go on counting the old
 * layouts until the page was reloaded.
 *
 * @param {ApiData} apiData - The fetched data.
 * @param {string|number|undefined} lastUpdated - When it was fetched.
 */
export function applyApiData(apiData: ApiData, lastUpdated: string | number | undefined) {
    const {
        displayLayouts,
        packageVersions,
        latestPackageVersions,
        multilingualAppResourceValues,
        exampleData,
        applicationMetadata,
        subformDataModels
    } = apiData;
    const multilingualDefaultTextResources = fetchDefaultTextResources();
    const defaultTextResources = getResourcesForLanguage(multilingualDefaultTextResources, "nb");
    const appResourceValues = getAppResourceValuesForLanguage(multilingualAppResourceValues, "nb");
    const flattenedLayouts = flattenAppLayouts(displayLayouts);
    const allTextResourceUsage = getAllTextResourceUsage(flattenedLayouts, multilingualAppResourceValues, multilingualDefaultTextResources);
    const componentUsage = getComponentUsageTreeForAllLayouts(flattenedLayouts);
    const dataModelBindingDrift = getDataModelBindingDriftForAllLayouts(flattenedLayouts);
    const subformDataModelDrift = getSubformDataModelDrift(subformDataModels);
    addDataToGlobalThis({
        defaultTextResources,
        multilingualDefaultTextResources,
        displayLayouts,
        packageVersions,
        latestPackageVersions,
        appResourceValues,
        multilingualAppResourceValues,
        exampleData,
        applicationMetadata,
        allTextResourceUsage,
        componentUsage,
        dataModelBindingDrift,
        subformDataModels,
        subformDataModelDrift,
        lastUpdated
    });
}

/**
 * Whether Back and Forward are followed already, since loadDevTools runs again when the first synchronization fails and is retried.
 */
let followsAddress = false;

/**
 * Loads the dev tools: the stored data, or a fresh synchronization when nothing is stored, then the sidebar, then the page the address names, if any.
 *
 * When that first synchronization fails there is nothing to show, so it says so, offers to try again, and renders no
 * sidebar until there is data for its pages to read.
 *
 * @async
 * @returns {Promise<void>}
 */
export async function loadDevTools() {
    removeLegacyLocalStorage();
    let {
        displayLayouts,
        packageVersions,
        latestPackageVersions,
        multilingualAppResourceValues,
        exampleData,
        lastUpdated,
        applicationMetadata,
        subformDataModels
    } = await getStoredApiData();
    if (
        !displayLayouts ||
        !packageVersions ||
        !latestPackageVersions ||
        !multilingualAppResourceValues ||
        !exampleData ||
        !applicationMetadata ||
        !subformDataModels
    ) {
        try {
            [
                displayLayouts,
                packageVersions,
                latestPackageVersions,
                multilingualAppResourceValues,
                exampleData,
                applicationMetadata,
                subformDataModels
            ] = await getUpdatedApiData();
        } catch {
            // The progress panel says which request failed and why.
            renderNoDataMessage(loadDevTools);
            return;
        }
        lastUpdated = new Date().toISOString();
        await storeApiData(
            {
                displayLayouts,
                packageVersions,
                latestPackageVersions,
                multilingualAppResourceValues,
                exampleData,
                applicationMetadata,
                subformDataModels
            },
            lastUpdated
        );
    }
    applyApiData(
        {
            displayLayouts,
            packageVersions,
            latestPackageVersions,
            multilingualAppResourceValues,
            exampleData,
            applicationMetadata,
            subformDataModels
        },
        lastUpdated
    );

    renderAdminSidebar();
    // After a synchronization the open page is drawn again from the new data, keeping what was chosen on it.
    renderSynchronizeButton(async (apiData: ApiData, synchronizedAt: string) => {
        await storeApiData(apiData, synchronizedAt);
        applyApiData(apiData, synchronizedAt);
        await redrawOpenPage();
    });
    // Back, Forward and an address typed in open the page the address names.
    if (!followsAddress) {
        globalThis.addEventListener("popstate", openPageFromLocation);
        followsAddress = true;
    }
    await openPageFromLocation();
}

globalThis.onload = loadDevTools;
