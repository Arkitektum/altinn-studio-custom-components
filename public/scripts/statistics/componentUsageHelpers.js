// Dependencies
import { customElementTagNames } from "@arkitektum/altinn-studio-custom-components-utils";

// Global functions
import { instantiateComponent } from "../../../src/functions/componentHelpers";

/**
 * Adds usage information to the grouped usage object under the appropriate tagName group.
 *
 * @param {string} tagName - The tagName of the component being analyzed.
 * @param {Object} usageInfo - An object containing usage information for the component, including id, appOwner, appName, and parent info.
 * @param {Object} groupedUsage - An object that accumulates usage information grouped by tagName. The function will add the usageInfo to the array corresponding to the tagName key.
 */
function addUsageToGroup(tagName, usageInfo, groupedUsage) {
    if (!groupedUsage[tagName]) groupedUsage[tagName] = [];
    groupedUsage[tagName].push(usageInfo);
}

/**
 * Recursively collects component usage information for a given component and its sub-components, grouping the results by tagName.
 *
 * @param {Object} component - The component instance to analyze for usage.
 * @param {Object} layoutInfo - Information about the layout the component is part of, including appOwner and appName.
 * @param {Object|null} parentInfo - Information about the parent component, including tagName and id, or null if it's a top-level component.
 * @param {Object} groupedUsage - An object that accumulates usage information grouped by tagName.
 * @param {string|number|null} [explicitId] - An optional explicit ID to use for the usage information instead of the component's own ID.
 */
function handleSubComponentUsages(component, layoutInfo, usageInfo, groupedUsage) {
    if (typeof component.getComponentUsage !== "function") return;
    const subComponentTagNames = component.getComponentUsage();
    if (!Array.isArray(subComponentTagNames)) return;
    for (const subTagName of subComponentTagNames) {
        const subComponent = instantiateComponent({ tagName: subTagName });
        if (subComponent) {
            collectComponentUsageTreeGrouped(
                subComponent,
                layoutInfo,
                { tagName: component.tagName, id: usageInfo.id, appOwner: layoutInfo.appOwner, appName: layoutInfo.appName },
                groupedUsage
            );
        }
    }
}

/**
 * Recursively collects component usage information for a given component and its sub-components, grouping the results by tagName.
 *
 * @param {Object} component - The component instance to analyze for usage.
 * @param {Object} layoutInfo - Information about the layout the component is part of, including appOwner and appName.
 * @param {Object|null} parentInfo - Information about the parent component, including tagName and id, or null if it's a top-level component.
 * @param {Object} groupedUsage - An object that accumulates usage information grouped by tagName.
 * @param {string|number|null} [explicitId] - An optional explicit ID to use for the usage information instead of the component's own ID.
 * @returns {void}
 */
function collectComponentUsageTreeGrouped(component, layoutInfo, parentInfo, groupedUsage, explicitId) {
    if (!component?.tagName) return;
    const tagName = component.tagName;
    const usageInfo = {
        tagName,
        id: explicitId === undefined ? component.id || null : explicitId,
        appOwner: layoutInfo.appOwner,
        appName: layoutInfo.appName,
        parent: parentInfo
    };
    addUsageToGroup(tagName, usageInfo, groupedUsage);
    handleSubComponentUsages(component, layoutInfo, usageInfo, groupedUsage);
}

/**
 * Recursively collects component usage information for all layouts, grouping the results by tagName.
 *
 * @param {Array} displayLayouts - An array of layout objects to analyze for component usage.
 * @returns {Array} An array of objects, each containing a tagName and an array of usage information for that tagName.
 */
export function getComponentUsageTreeForAllLayouts(displayLayouts) {
    const groupedUsage = {};
    for (const layout of displayLayouts) {
        const layoutInfo = { appOwner: layout.appOwner, appName: layout.appName };
        const componentsInLayout = Array.isArray(layout?.layout?.data?.layout) ? layout.layout.data.layout : null;
        if (!componentsInLayout) continue;
        for (const component of componentsInLayout) {
            const isCustomComponent = component?.tagName?.length && component?.type === "Custom";
            if (!isCustomComponent) continue;
            const instance = instantiateComponent(component);
            if (instance) {
                collectComponentUsageTreeGrouped(instance, layoutInfo, null, groupedUsage, component.id);
            }
        }
    }
    // Ensure all tagNames are present in the result, even if unused
    customElementTagNames.forEach((tagName) => {
        if (!groupedUsage[tagName]) groupedUsage[tagName] = [];
    });
    return Object.entries(groupedUsage).map(([tagName, usages]) => ({ tagName, usages }));
}
