// Local functions
import { renderAdminSidebar } from "./adminRenderers.js";
import { fetchDisplayLayouts, fetchPackageVersions } from "./apiHelpers.js";
import { fetchDefaultTextResources } from "./getters.js";
import { getMissingResourceBindings, getResourceBindingsWithUsageFromApplications, getUsageForResources } from "./validators.js";

globalThis.onload = async function () {
    const defaultTextResources = await fetchDefaultTextResources("nb");
    globalThis.defaultTextResources = defaultTextResources;
    const layouts = await fetchDisplayLayouts();
    globalThis.displayLayouts = layouts;
    const packageVersions = await fetchPackageVersions();
    globalThis.packageVersions = packageVersions;
    const resourceBindingsInApplications = getResourceBindingsWithUsageFromApplications(layouts, "custom");
    const { missingResourceBindings } = getMissingResourceBindings(resourceBindingsInApplications, globalThis.defaultTextResources);
    const missingTextResourceBindingsUsage = getUsageForResources(
        layouts,
        missingResourceBindings.map((res) => ({ id: res }))
    ).map((resBinding) => ({
        ...resBinding,
        missingFromDefaultTextResources: true
    }));
    const textResourceUsage = getUsageForResources(layouts, globalThis.defaultTextResources?.resources);
    const allTextResourceUsage = [...textResourceUsage, ...missingTextResourceBindingsUsage];
    globalThis.allTextResourceUsage = allTextResourceUsage;

    renderAdminSidebar();
};
