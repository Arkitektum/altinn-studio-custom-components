import type { ApiValue, DisplayLayoutEntry } from "../types.ts";
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
import { renderAdminSidebar, renderSynchronizeButton } from "./renderers.ts";
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

globalThis.onload = async function () {
    let { displayLayouts, packageVersions, latestPackageVersions, multilingualAppResourceValues, exampleData, lastUpdated, applicationMetadata } =
        getDataFromLocalStorage();
    if (!displayLayouts || !packageVersions || !latestPackageVersions || !multilingualAppResourceValues || !exampleData || !applicationMetadata) {
        [displayLayouts, packageVersions, latestPackageVersions, multilingualAppResourceValues, exampleData, applicationMetadata] =
            await getUpdatedApiData();
        lastUpdated = new Date().toISOString();
        addValueToLocalStorage("lastUpdated", lastUpdated);
    }
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

    renderAdminSidebar();
    renderSynchronizeButton();
};
