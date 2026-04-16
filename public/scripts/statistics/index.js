// Local functions
import {
    addDataToGlobalThis,
    addValueToLocalStorage,
    addValuesToLocalStorage,
    getValueFromLocalStorage,
    getValuesFromLocalStorage
} from "../localStorage.js";
import { fetchDefaultTextResources, getUpdatedApiData } from "./apiHelpers.js";
import { getAppResourceValuesForLanguage, getResourcesForLanguage } from "../getters.js";
import {
    getMissingResourceBindings,
    getResourceBindingsWithUsageFromApplications,
    getUsageForMissingResources,
    getUsageForResources
} from "../validators.js";
import { renderAdminSidebar, renderSynchronizeButton } from "./renderers.js";
import { getComponentUsageTreeForAllLayouts } from "./componentUsageHelpers.js";

export function getDataFromLocalStorage() {
    const lastUpdated = getValueFromLocalStorage("lastUpdated");
    return {
        lastUpdated,
        ...getValuesFromLocalStorage(["displayLayouts", "packageVersions", "multilingualAppResourceValues", "exampleData", "applicationMetadata"])
    };
}

export function getMissingResourceBindingsWithUsage(displayLayouts, appResourceValues, defaultTextResources) {
    const resourceBindingsInApplications = getResourceBindingsWithUsageFromApplications(displayLayouts, "custom");
    const { missingResourceBindings } = getMissingResourceBindings(resourceBindingsInApplications, null, defaultTextResources);
    const { missingResourcesUsage, missingResourcesWithLocalValueUsage } = getUsageForMissingResources(
        displayLayouts,
        missingResourceBindings,
        appResourceValues
    );
    return { missingResourceBindings, missingResourcesUsage, missingResourcesWithLocalValueUsage };
}

export function getAllTextResourceUsage(displayLayouts, appResourceValues, defaultTextResources) {
    const textResourceUsage = getUsageForResources(displayLayouts, defaultTextResources);
    const { missingResourcesUsage, missingResourcesWithLocalValueUsage } = getMissingResourceBindingsWithUsage(
        displayLayouts,
        appResourceValues,
        defaultTextResources
    );
    return [...textResourceUsage, ...missingResourcesUsage, ...missingResourcesWithLocalValueUsage];
}

globalThis.onload = async function () {
    let { displayLayouts, packageVersions, multilingualAppResourceValues, exampleData, lastUpdated, applicationMetadata } = getDataFromLocalStorage();
    if (!displayLayouts || !packageVersions || !multilingualAppResourceValues || !exampleData || !applicationMetadata) {
        [displayLayouts, packageVersions, multilingualAppResourceValues, exampleData, applicationMetadata] = await getUpdatedApiData();
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
        appResourceValues,
        multilingualAppResourceValues,
        exampleData,
        applicationMetadata
    });
    const allTextResourceUsage = getAllTextResourceUsage(displayLayouts, multilingualAppResourceValues, multilingualDefaultTextResources);
    const componentUsage = getComponentUsageTreeForAllLayouts(displayLayouts);
    addDataToGlobalThis({
        defaultTextResources,
        multilingualDefaultTextResources,
        displayLayouts,
        packageVersions,
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
