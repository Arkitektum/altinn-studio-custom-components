// Local functions
import { renderAdminSidebar, renderSynchronizeButton } from "./adminRenderers.js";
import { getUpdatedApiData } from "./apiHelpers.js";
import { getAppResourceValuesForLanguage, getResourcesForLanguage } from "./getters.js";
import {
    addDataToGlobalThis,
    addValuesToLocalStorage,
    addValueToLocalStorage,
    getValueFromLocalStorage,
    getValuesFromLocalStorage
} from "./localStorage.js";
import {
    getMissingResourceBindings,
    getResourceBindingsWithUsageFromApplications,
    getUsageForMissingResources,
    getUsageForResources
} from "./validators.js";

function getDataFromLocalStorage() {
    const lastUpdated = getValueFromLocalStorage("lastUpdated");
    return {
        lastUpdated,
        ...getValuesFromLocalStorage([
            "multilingualDefaultTextResources",
            "displayLayouts",
            "packageVersions",
            "multilingualAppResourceValues",
            "exampleData"
        ])
    };
}

function getMissingResourceBindingsWithUsage(displayLayouts, appResourceValues, defaultTextResources) {
    const resourceBindingsInApplications = getResourceBindingsWithUsageFromApplications(displayLayouts, "custom");
    const { missingResourceBindings } = getMissingResourceBindings(resourceBindingsInApplications, null, defaultTextResources);
    const { missingResourcesUsage, missingResourcesWithLocalValueUsage } = getUsageForMissingResources(
        displayLayouts,
        missingResourceBindings.map((res) => ({ id: res })),
        appResourceValues
    );
    return { missingResourceBindings, missingResourcesUsage, missingResourcesWithLocalValueUsage };
}

function getAllTextResourceUsage(displayLayouts, appResourceValues, defaultTextResources) {
    const textResourceUsage = getUsageForResources(displayLayouts, defaultTextResources);
    const { missingResourcesUsage, missingResourcesWithLocalValueUsage } = getMissingResourceBindingsWithUsage(
        displayLayouts,
        appResourceValues,
        defaultTextResources
    );
    return [...textResourceUsage, ...missingResourcesUsage, ...missingResourcesWithLocalValueUsage];
}

globalThis.onload = async function () {
    let { multilingualDefaultTextResources, displayLayouts, packageVersions, multilingualAppResourceValues, exampleData, lastUpdated } =
        getDataFromLocalStorage();
    if (!multilingualDefaultTextResources || !displayLayouts || !packageVersions || !multilingualAppResourceValues || !exampleData) {
        [multilingualDefaultTextResources, displayLayouts, packageVersions, multilingualAppResourceValues, exampleData] = await getUpdatedApiData();
        lastUpdated = new Date().toISOString();
        addValueToLocalStorage("lastUpdated", lastUpdated);
    }
    const defaultTextResources = getResourcesForLanguage(multilingualDefaultTextResources, "nb");
    const appResourceValues = getAppResourceValuesForLanguage(multilingualAppResourceValues, "nb");
    addValuesToLocalStorage({
        defaultTextResources,
        multilingualDefaultTextResources,
        displayLayouts,
        packageVersions,
        appResourceValues,
        multilingualAppResourceValues,
        exampleData
    });
    const allTextResourceUsage = getAllTextResourceUsage(displayLayouts, multilingualAppResourceValues, multilingualDefaultTextResources);
    addDataToGlobalThis({
        defaultTextResources,
        multilingualDefaultTextResources,
        displayLayouts,
        packageVersions,
        appResourceValues,
        multilingualAppResourceValues,
        exampleData,
        allTextResourceUsage,
        lastUpdated
    });

    renderAdminSidebar();
    renderSynchronizeButton();
};
