// Local functions
import { renderAdminSidebar, showLoadingIndicator } from "./adminRenderers.js";
import { fetchAppResources, fetchDisplayLayouts, fetchExampleData, fetchPackageVersions } from "./apiHelpers.js";
import { fetchDefaultTextResources } from "./getters.js";
import {
    getMissingResourceBindings,
    getResourceBindingsWithUsageFromApplications,
    getUsageForMissingResources,
    getUsageForResources
} from "./validators.js";

globalThis.onload = async function () {
    const defaultTextResourcesPromise = fetchDefaultTextResources("nb");
    const layoutsPromise = fetchDisplayLayouts();
    const packageVersionsPromise = fetchPackageVersions();
    const appResourceValuesPromise = fetchAppResources("nb");
    const exampleDataPromise = fetchExampleData();

    showLoadingIndicator([defaultTextResourcesPromise, layoutsPromise, packageVersionsPromise, appResourceValuesPromise, exampleDataPromise]);

    const defaultTextResources = await defaultTextResourcesPromise;
    globalThis.defaultTextResources = defaultTextResources;
    const layouts = await layoutsPromise;
    globalThis.displayLayouts = layouts;
    const packageVersions = await packageVersionsPromise;
    globalThis.packageVersions = packageVersions;
    const appResourceValues = await appResourceValuesPromise;
    globalThis.appResourceValues = appResourceValues;
    const exampleData = await exampleDataPromise;
    globalThis.exampleData = exampleData;

    const resourceBindingsInApplications = getResourceBindingsWithUsageFromApplications(layouts, "custom");
    const { missingResourceBindings } = getMissingResourceBindings(resourceBindingsInApplications, null, globalThis.defaultTextResources);
    const { missingResourcesUsage, missingResourcesWithLocalValueUsage } = getUsageForMissingResources(
        layouts,
        missingResourceBindings.map((res) => ({ id: res })),
        appResourceValues
    );
    const textResourceUsage = getUsageForResources(layouts, globalThis.defaultTextResources?.resources);
    const allTextResourceUsage = [...textResourceUsage, ...missingResourcesUsage, ...missingResourcesWithLocalValueUsage];
    globalThis.allTextResourceUsage = allTextResourceUsage;
    renderAdminSidebar();
};
