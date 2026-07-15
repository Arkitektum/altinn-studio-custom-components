/**
 * Get the number of unique apps using a component.
 * A component can be used multiple times in the same app, but we only want to count unique apps using the component.
 * We can identify unique apps by their appOwner and appName.
 * If a component has no usages, return 0.
 * @param {Object} component - The component object containing usage information.
 * @returns {number} - The number of unique apps using the component.
 */
function getAppUsageCountForComponent(component) {
    if (!component?.usages) {
        return 0;
    }
    const uniqueAppIds = new Set(component.usages.map((usage) => `${usage?.appOwner}-${usage?.appName}`));
    return uniqueAppIds.size;
}

/**
 * Groups a list of usages by unique app, and within each app by the display layout the usage was found in.
 * Only usages matching the provided predicate are included.
 * @param {Array} usages - The usages to group.
 * @param {Function} predicate - A function returning true for usages that should be included.
 * @returns {Array} - An array of objects like { appOwner, appName, layouts: [{ layoutName, usages: [] }] }.
 */
function groupUsagesByAppAndLayout(usages, predicate) {
    if (!Array.isArray(usages)) {
        return [];
    }
    const appUsageMap = {};
    usages.forEach((usage) => {
        if (!predicate(usage)) {
            return;
        }
        const appKey = `${usage.appOwner}-${usage.appName}`;
        if (!appUsageMap[appKey]) {
            appUsageMap[appKey] = {
                appOwner: usage.appOwner,
                appName: usage.appName,
                layouts: {}
            };
        }
        const layoutKey = usage.layoutName ?? "";
        if (!appUsageMap[appKey].layouts[layoutKey]) {
            appUsageMap[appKey].layouts[layoutKey] = {
                layoutName: usage.layoutName,
                usages: []
            };
        }
        appUsageMap[appKey].layouts[layoutKey].usages.push(usage);
    });
    return Object.values(appUsageMap).map((app) => ({
        appOwner: app.appOwner,
        appName: app.appName,
        layouts: Object.values(app.layouts)
    }));
}

/**
 * Get the direct usages of a component, grouped by unique apps and by display layout within each app.
 * A direct usage is identified by the presence of an id in the usage object.
 * If a component has no direct usages, return an empty array.
 * @param {Object} component - The component object containing usage information.
 * @returns {Array} - An array of objects representing unique apps using the component directly.
 */
function getDirectComponentUsages(component) {
    if (!component?.usages) {
        return [];
    }
    return groupUsagesByAppAndLayout(component.usages, (usage) => usage?.id);
}

/**
 * Get the indirect usages of a component, grouped by unique apps and by display layout within each app.
 * An indirect usage is identified by the presence of a parent in the usage object.
 * If a component has no indirect usages, return an empty array.
 * @param {Object} component - The component object containing usage information.
 * @returns {Array} - An array of objects representing unique apps using the component indirectly.
 */
function getIndirectComponentUsages(component) {
    if (!component?.usages) {
        return [];
    }
    return groupUsagesByAppAndLayout(component.usages, (usage) => usage?.parent);
}

/**
 * Render a list item for an app using a component.
 * @param {Object} appUsage - The app usage object containing app information.
 * @returns {HTMLElement} - The list item element representing the app usage.
 */
function renderAppUsingComponentListItem(appUsage) {
    const appUsageListItemElement = document.createElement("li");
    appUsageListItemElement.classList.add("app-using-component-list-item");
    appUsageListItemElement.innerHTML = appUsage?.id;
    return appUsageListItemElement;
}

/**
 * Count the total number of component usages across all display layouts of an app.
 * @param {Array} layouts - The layouts array: [{ layoutName, usages }].
 * @returns {number} - The total number of usages.
 */
function getTotalUsageCountForLayouts(layouts) {
    if (!Array.isArray(layouts)) {
        return 0;
    }
    return layouts.reduce((total, layout) => total + (layout?.usages?.length || 0), 0);
}

/**
 * Render a details element for a single display layout within an app, listing the usages found in that layout.
 * @param {Object} layoutUsage - The layout usage object: { layoutName, usages }.
 * @param {Function} renderUsageItem - Function that renders a single usage list item.
 * @returns {HTMLElement} - The details element representing the layout and its usages.
 */
function renderLayoutUsageDetailsListItem(layoutUsage, renderUsageItem) {
    const layoutUsageListItemElement = document.createElement("details");
    layoutUsageListItemElement.classList.add("layout-usage-details-list-item");
    const layoutName = layoutUsage?.layoutName || "DisplayLayout";
    const componentUsageNumber = layoutUsage?.usages?.length || 0;

    const layoutUsageSummaryElement = document.createElement("summary");

    const expandCollapseIconElement = document.createElement("span");
    expandCollapseIconElement.classList.add("expand-collapse-icon");
    expandCollapseIconElement.innerHTML = "▶";
    layoutUsageSummaryElement.appendChild(expandCollapseIconElement);

    const layoutUsageSummaryTitleElement = document.createElement("span");
    layoutUsageSummaryTitleElement.classList.add("layout-usage-summary-title");
    layoutUsageSummaryTitleElement.innerHTML = layoutName;

    const layoutUsageSummaryCountElement = document.createElement("span");
    layoutUsageSummaryCountElement.classList.add("layout-usage-summary-count");
    layoutUsageSummaryCountElement.innerHTML = `Components: ${componentUsageNumber}`;

    layoutUsageSummaryElement.appendChild(layoutUsageSummaryTitleElement);
    layoutUsageSummaryElement.appendChild(layoutUsageSummaryCountElement);
    layoutUsageListItemElement.appendChild(layoutUsageSummaryElement);

    const layoutUsageListElement = document.createElement("ul");
    layoutUsageListElement.classList.add("component-usage-list");
    layoutUsage?.usages?.forEach((usage) => {
        layoutUsageListElement.appendChild(renderUsageItem(usage));
    });
    layoutUsageListItemElement.appendChild(layoutUsageListElement);

    return layoutUsageListItemElement;
}

/**
 * Render a details element for an app using a component, grouped by the display layouts the component is used in.
 * @param {Object} appUsage - The app usage object: { appOwner, appName, layouts: [{ layoutName, usages }] }.
 * @returns {HTMLElement} - The details element representing the app usage and its layouts.
 */
function renderAppUsageDetailsListItem(appUsage) {
    const appUsageListItemElement = document.createElement("details");
    const appName = appUsage ? `${appUsage?.appOwner}/${appUsage?.appName}` : "Unknown app";
    const componentUsageNumber = getTotalUsageCountForLayouts(appUsage?.layouts);
    const appUsageSummaryElement = document.createElement("summary");

    const expandCollapseIconElement = document.createElement("span");
    expandCollapseIconElement.classList.add("expand-collapse-icon");
    expandCollapseIconElement.innerHTML = "▶";
    appUsageSummaryElement.appendChild(expandCollapseIconElement);

    const appUsageSummaryTitleElement = document.createElement("span");
    appUsageSummaryTitleElement.classList.add("app-usage-summary-title");
    appUsageSummaryTitleElement.innerHTML = appName;

    const appUsageSummaryCountElement = document.createElement("span");
    appUsageSummaryCountElement.classList.add("app-usage-summary-count");
    appUsageSummaryCountElement.innerHTML = `Components: ${componentUsageNumber}`;

    appUsageSummaryElement.appendChild(appUsageSummaryTitleElement);
    appUsageSummaryElement.appendChild(appUsageSummaryCountElement);

    appUsageListItemElement.appendChild(appUsageSummaryElement);

    const appUsageLayoutListElement = document.createElement("div");
    appUsageLayoutListElement.classList.add("layout-usage-details-list");
    appUsage?.layouts?.forEach((layoutUsage) => {
        appUsageLayoutListElement.appendChild(renderLayoutUsageDetailsListItem(layoutUsage, renderAppUsingComponentListItem));
    });
    appUsageListItemElement.appendChild(appUsageLayoutListElement);

    return appUsageListItemElement;
}

/**
 * Render a list item for a component using another component.
 * @param {Object} componentUsage - The component usage object containing parent component information.
 * @returns {HTMLElement} - The list item element representing the component usage.
 */
function renderComponentUsingComponentListItem(componentUsage) {
    const componentUsageListItemElement = document.createElement("li");
    componentUsageListItemElement.classList.add("component-using-component-list-item");
    const parentComponentId = componentUsage?.parent?.id ? ` id="${componentUsage.parent.id}"` : "";
    const parentComponentElementString = componentUsage?.parent?.tagName ? `<${componentUsage.parent.tagName}${parentComponentId} />` : "";
    componentUsageListItemElement.innerText = parentComponentElementString;
    return componentUsageListItemElement;
}

/**
 * Render a details element for an app using a component indirectly, grouped by the display layouts it is used in.
 * @param {Object} componentUsage - The app usage object: { appOwner, appName, layouts: [{ layoutName, usages }] }.
 * @returns {HTMLElement} - The details element representing the app usage and its layouts.
 */
function renderComponentUsageDetailsListItem(componentUsage) {
    const componentUsageListItemElement = document.createElement("details");
    const appName = componentUsage ? `${componentUsage?.appOwner}/${componentUsage?.appName}` : "Unknown app";
    const componentUsageNumber = getTotalUsageCountForLayouts(componentUsage?.layouts);
    const componentUsageSummaryElement = document.createElement("summary");

    const expandCollapseIconElement = document.createElement("span");
    expandCollapseIconElement.classList.add("expand-collapse-icon");
    expandCollapseIconElement.innerHTML = "▶";
    componentUsageSummaryElement.appendChild(expandCollapseIconElement);

    const componentUsageSummaryTitleElement = document.createElement("span");
    componentUsageSummaryTitleElement.classList.add("component-usage-summary-title");
    componentUsageSummaryTitleElement.innerHTML = appName;

    const componentUsageSummaryCountElement = document.createElement("span");
    componentUsageSummaryCountElement.classList.add("component-usage-summary-count");
    componentUsageSummaryCountElement.innerHTML = `Components: ${componentUsageNumber}`;

    componentUsageSummaryElement.appendChild(componentUsageSummaryTitleElement);
    componentUsageSummaryElement.appendChild(componentUsageSummaryCountElement);

    componentUsageListItemElement.appendChild(componentUsageSummaryElement);

    const componentUsageLayoutListElement = document.createElement("div");
    componentUsageLayoutListElement.classList.add("layout-usage-details-list");
    componentUsage?.layouts?.forEach((layoutUsage) => {
        componentUsageLayoutListElement.appendChild(renderLayoutUsageDetailsListItem(layoutUsage, renderComponentUsingComponentListItem));
    });
    componentUsageListItemElement.appendChild(componentUsageLayoutListElement);

    return componentUsageListItemElement;
}

/**
 * Render a list item for a component, including its usage details.
 * @param {Object} component - The component object containing usage information.
 * @returns {HTMLElement} - The list item element representing the component and its usage details.
 */
export function renderComponentUsageListItem(component) {
    const listItemElement = document.createElement("details");
    listItemElement.classList.add("component-usage-list-item");

    const summaryElement = document.createElement("summary");

    const expandCollapseIconElement = document.createElement("span");
    expandCollapseIconElement.classList.add("expand-collapse-icon");
    expandCollapseIconElement.innerHTML = "▶";
    summaryElement.appendChild(expandCollapseIconElement);

    const componentTagNameContainerElement = document.createElement("div");
    componentTagNameContainerElement.classList.add("component-tag-name-container");

    const componentTagNameElement = document.createElement("div");
    componentTagNameElement.classList.add("component-tag-name");
    componentTagNameElement.innerHTML = `${component?.tagName}`;
    componentTagNameContainerElement.appendChild(componentTagNameElement);

    summaryElement.appendChild(componentTagNameContainerElement);

    const usageContainerElement = document.createElement("div");
    usageContainerElement.classList.add("usage-container");

    const appUsageElement = document.createElement("span");
    appUsageElement.classList.add("app-usage");
    appUsageElement.innerHTML = `Apps: ${getAppUsageCountForComponent(component)}`;
    usageContainerElement.appendChild(appUsageElement);

    const componentUsageElement = document.createElement("span");
    componentUsageElement.classList.add("component-usage");
    componentUsageElement.innerHTML = `Components: ${component?.usages?.length || 0}`;
    usageContainerElement.appendChild(componentUsageElement);

    summaryElement.appendChild(usageContainerElement);

    const usageDetailsElement = document.createElement("div");
    usageDetailsElement.classList.add("usage-details");

    const directComponentUsages = getDirectComponentUsages(component);

    const appUsageDetailsListElement = document.createElement("div");
    appUsageDetailsListElement.classList.add("app-usage-details-list");

    if (directComponentUsages?.length > 0) {
        const appUsageTitleElement = document.createElement("h4");
        appUsageTitleElement.innerHTML = "Apps using this component";
        appUsageDetailsListElement.appendChild(appUsageTitleElement);

        directComponentUsages.forEach((appUsage) => {
            const appUsageListItemElement = renderAppUsageDetailsListItem(appUsage);
            appUsageDetailsListElement.appendChild(appUsageListItemElement);
        });
        usageDetailsElement.appendChild(appUsageDetailsListElement);
    } else {
        const noUsageElement = document.createElement("span");
        noUsageElement.classList.add("message");
        noUsageElement.innerHTML = "This component is not used directly in any app.";
        usageDetailsElement.appendChild(noUsageElement);
    }

    const indirectComponentUsages = getIndirectComponentUsages(component);

    const componentUsageDetailsListElement = document.createElement("div");
    componentUsageDetailsListElement.classList.add("component-usage-details-list");

    if (indirectComponentUsages?.length > 0) {
        const componentUsageTitleElement = document.createElement("h4");
        componentUsageTitleElement.innerHTML = "Components using this component";
        componentUsageDetailsListElement.appendChild(componentUsageTitleElement);

        indirectComponentUsages.forEach((componentUsage) => {
            const componentUsageListItemElement = renderComponentUsageDetailsListItem(componentUsage);
            componentUsageDetailsListElement.appendChild(componentUsageListItemElement);
        });
        usageDetailsElement.appendChild(componentUsageDetailsListElement);
    } else {
        const noComponentUsageElement = document.createElement("span");
        noComponentUsageElement.classList.add("message");
        noComponentUsageElement.innerHTML = "This component is not used in any other component.";
        usageDetailsElement.appendChild(noComponentUsageElement);
    }

    listItemElement.appendChild(summaryElement);
    listItemElement.appendChild(usageDetailsElement);

    return listItemElement;
}

/**
 * Render a list of component usages.
 * @param {Array} componentUsage - An array of component usage objects.
 * @returns {HTMLElement} - The list element representing the component usages.
 */
export function renderComponentUsageList(componentUsage) {
    const componentUsageListElement = document.createElement("div");
    componentUsageListElement.id = "component-usage-list";
    componentUsageListElement.classList.add("paper");
    componentUsageListElement.innerHTML = "";
    componentUsage.forEach((component) => {
        const listItemElement = renderComponentUsageListItem(component);
        componentUsageListElement.appendChild(listItemElement);
    });
    return componentUsageListElement;
}
