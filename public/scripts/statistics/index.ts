import type { ApiData, ApiValue, DisplayLayoutEntry } from "../types.ts";
// Local functions
import {
    addDataToGlobalThis,
    addValueToLocalStorage,
    addValuesToLocalStorage,
    getValueFromLocalStorage,
    getValuesFromLocalStorage
} from "../localStorage.ts";
import { fetchDefaultTextResources, getUpdatedApiData } from "./apiHelpers.ts";
import { getAppResourceValuesForLanguage, getResourcesForLanguage } from "../getters.ts";
import {
    getMissingResourceBindings,
    getResourceBindingsWithUsageFromApplications,
    getUsageForMissingResources,
    getUsageForResources
} from "../validators.ts";
import { redrawOpenPage, renderAdminSidebar, renderNoDataMessage, renderSynchronizeButton } from "./renderers.ts";
import { flattenAppLayouts } from "./displayLayoutHelpers.ts";
import { getComponentUsageTreeForAllLayouts } from "./componentUsageHelpers.ts";

export function getDataFromLocalStorage(): Record<string, ApiValue> {
    const lastUpdated = getValueFromLocalStorage("lastUpdated");
    return {
        lastUpdated,
        ...getValuesFromLocalStorage([
            "displayLayouts",
            "packageVersions",
            "latestPackageVersions",
            "multilingualAppResourceValues",
            "exampleData",
            "applicationMetadata"
        ])
    };
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
 * Stores what a synchronization fetched, works out everything the pages read from it, and puts both on globalThis.
 *
 * The usage pages read the text resource and component usage worked out here rather than the raw layouts, so this
 * has to run after every synchronization and not only on page load. When it only ran on page load, a synchronization
 * stored the new layouts and left the usage pages counting the old ones until the page was reloaded.
 *
 * @param {ApiData} apiData - The fetched data.
 * @param {string|number|undefined} lastUpdated - When it was fetched.
 */
export function applyApiData(apiData: ApiData, lastUpdated: string | number | undefined) {
    const { displayLayouts, packageVersions, latestPackageVersions, multilingualAppResourceValues, exampleData, applicationMetadata } = apiData;
    const multilingualDefaultTextResources = fetchDefaultTextResources();
    const defaultTextResources = getResourcesForLanguage(multilingualDefaultTextResources, "nb");
    const appResourceValues = getAppResourceValuesForLanguage(multilingualAppResourceValues, "nb");
    addValuesToLocalStorage({
        defaultTextResources,
        multilingualDefaultTextResources,
        displayLayouts,
        packageVersions,
        latestPackageVersions,
        appResourceValues,
        multilingualAppResourceValues,
        exampleData,
        applicationMetadata
    });
    const flattenedLayouts = flattenAppLayouts(displayLayouts);
    const allTextResourceUsage = getAllTextResourceUsage(flattenedLayouts, multilingualAppResourceValues, multilingualDefaultTextResources);
    const componentUsage = getComponentUsageTreeForAllLayouts(flattenedLayouts);
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
        lastUpdated
    });
}

/**
 * Loads the dev tools: the stored data, or a fresh synchronization when nothing is stored, then the sidebar.
 *
 * When that first synchronization fails there is nothing to show, so it says so, offers to try again, and renders no
 * sidebar until there is data for its pages to read.
 *
 * @async
 * @returns {Promise<void>}
 */
export async function loadDevTools() {
    let { displayLayouts, packageVersions, latestPackageVersions, multilingualAppResourceValues, exampleData, lastUpdated, applicationMetadata } =
        getDataFromLocalStorage();
    if (!displayLayouts || !packageVersions || !latestPackageVersions || !multilingualAppResourceValues || !exampleData || !applicationMetadata) {
        try {
            [displayLayouts, packageVersions, latestPackageVersions, multilingualAppResourceValues, exampleData, applicationMetadata] =
                await getUpdatedApiData();
        } catch {
            // The progress panel says which request failed and why.
            renderNoDataMessage(loadDevTools);
            return;
        }
        lastUpdated = new Date().toISOString();
        addValueToLocalStorage("lastUpdated", lastUpdated);
    }
    applyApiData(
        { displayLayouts, packageVersions, latestPackageVersions, multilingualAppResourceValues, exampleData, applicationMetadata },
        lastUpdated
    );

    renderAdminSidebar();
    // After a synchronization the open page is drawn again from the new data, keeping what was chosen on it.
    renderSynchronizeButton((apiData: ApiData, synchronizedAt: string) => {
        applyApiData(apiData, synchronizedAt);
        void redrawOpenPage();
    });
}

globalThis.onload = loadDevTools;
