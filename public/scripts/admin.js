// Local functions
import { renderAdminSidebar } from "./adminRenderers.js";
import { fetchAppResources, fetchDisplayLayouts, fetchPackageVersions } from "./apiHelpers.js";
import { fetchDefaultTextResources } from "./getters.js";
import { getMissingResourceBindings, getResourceBindingsWithUsageFromApplications, getUsageForMissingResources, getUsageForResources } from "./validators.js";

globalThis.onload = async function () {
    const defaultTextResources = await fetchDefaultTextResources("nb");
    globalThis.defaultTextResources = defaultTextResources;
    const layouts = await fetchDisplayLayouts();
    globalThis.displayLayouts = layouts;
    const packageVersions = await fetchPackageVersions();
    globalThis.packageVersions = packageVersions;
    const appResourceValues = await fetchAppResources("nb");
    globalThis.appResourceValues = appResourceValues;
    const resourceBindingsInApplications = getResourceBindingsWithUsageFromApplications(layouts, "custom");
    const { missingResourceBindings } = getMissingResourceBindings(resourceBindingsInApplications, null, globalThis.defaultTextResources);
    const {missingResourcesUsage, missingResourcesWithLocalValueUsage} = getUsageForMissingResources(
        layouts,
        missingResourceBindings.map((res) => ({ id: res })),
        appResourceValues
    );
    const textResourceUsage = getUsageForResources(layouts, globalThis.defaultTextResources?.resources);
    const allTextResourceUsage = [...textResourceUsage, ...missingResourcesUsage, ...missingResourcesWithLocalValueUsage];
    globalThis.allTextResourceUsage = allTextResourceUsage;
    renderAdminSidebar();
};
