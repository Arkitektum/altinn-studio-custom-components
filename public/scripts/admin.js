// Local functions
import { renderAdminSidebar, renderSynchronizeButton } from "./adminRenderers.js";
import { getUpdatedApiData } from "./apiHelpers.js";
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
        ...getValuesFromLocalStorage(["defaultTextResources", "displayLayouts", "packageVersions", "appResourceValues", "exampleData"])
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
    let { defaultTextResources, displayLayouts, packageVersions, appResourceValues, exampleData, lastUpdated } = getDataFromLocalStorage();
    if (!defaultTextResources || !displayLayouts || !packageVersions || !appResourceValues || !exampleData) {
        [defaultTextResources, displayLayouts, packageVersions, appResourceValues, exampleData] = await getUpdatedApiData();
        lastUpdated = new Date().toISOString();
        addValueToLocalStorage("lastUpdated", lastUpdated);
    }
    addValuesToLocalStorage({
        defaultTextResources,
        displayLayouts,
        packageVersions,
        appResourceValues,
        exampleData
    });
    const allTextResourceUsage = getAllTextResourceUsage(displayLayouts, appResourceValues, defaultTextResources);
    addDataToGlobalThis({
        defaultTextResources,
        displayLayouts,
        packageVersions,
        appResourceValues,
        exampleData,
        allTextResourceUsage,
        lastUpdated
    });

    renderAdminSidebar();
    renderSynchronizeButton();
};
