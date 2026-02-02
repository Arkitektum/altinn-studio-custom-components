// Local functions
import { fetchDisplayLayouts } from "./apiHelpers.js";
import { fetchDefaultTextResources } from "./getters.js";
import {
    renderDefaultTextResourcesList,
    renderRadioButtonsFilterForTextResourcesList,
    renderSelectApplicationFilterForTextResourcesList,
    renderTextInputFilterForTextResourcesList
} from "./textResourceUsageRenderers.js";
import { getMissingResourceBindings, getResourceBindingsWithUsageFromApplications, getUsageForResources } from "./validators.js";

globalThis.onload = async function () {
    const defaultTextResources = await fetchDefaultTextResources("nb");
    globalThis.defaultTextResources = defaultTextResources;
    const layouts = await fetchDisplayLayouts();
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

    const mainAdminElement = document.getElementById("admin-main");
    mainAdminElement.appendChild(renderRadioButtonsFilterForTextResourcesList(mainAdminElement, allTextResourceUsage));
    mainAdminElement.appendChild(renderSelectApplicationFilterForTextResourcesList(mainAdminElement, allTextResourceUsage, layouts));
    mainAdminElement.appendChild(renderTextInputFilterForTextResourcesList(mainAdminElement, allTextResourceUsage));
    mainAdminElement.appendChild(renderDefaultTextResourcesList(allTextResourceUsage, allTextResourceUsage));
};
