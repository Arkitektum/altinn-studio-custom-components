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
 * Get the direct usages of a component, grouped by unique apps.
 * A direct usage is identified by the presence of an id in the usage object.
 * If a component has no direct usages, return an empty array.
 * @param {Object} component - The component object containing usage information.
 * @returns {Array} - An array of objects representing unique apps using the component directly.
 */
function getDirectComponentUsages(component) {
    if (!component?.usages) {
        return [];
    }
    // Filter usages that have an id, and group them by app owner and app name to get unique apps using the component
    // Group them in a new array like this [{ appOwner: usage.appOwner, appName: usage.appName, usage: [usage] }]
    const appUsageMap = {};
    component.usages.forEach((usage) => {
        if (usage?.id) {
            const appKey = `${usage.appOwner}-${usage.appName}`;
            if (!appUsageMap[appKey]) {
                appUsageMap[appKey] = {
                    appOwner: usage.appOwner,
                    appName: usage.appName,
                    usages: []
                };
            }
            appUsageMap[appKey].usages.push(usage);
        }
    });
    return Object.values(appUsageMap);
}

/**
 * Get the indirect usages of a component, grouped by unique apps.
 * An indirect usage is identified by the presence of a parent in the usage object.
 * If a component has no indirect usages, return an empty array.
 * @param {Object} component - The component object containing usage information.
 * @returns {Array} - An array of objects representing unique apps using the component indirectly.
 */
function getIndirectComponentUsages(component) {
    if (!component?.usages) {
        return [];
    }
    const componentUsageMap = {};
    component.usages.forEach((usage) => {
        if (usage?.parent) {
            const appKey = `${usage.appOwner}-${usage.appName}`;
            if (!componentUsageMap[appKey]) {
                componentUsageMap[appKey] = {
                    appOwner: usage.appOwner,
                    appName: usage.appName,
                    usages: []
                };
            }
            componentUsageMap[appKey].usages.push(usage);
        }
    });
    return Object.values(componentUsageMap);
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
 * Render a details element for an app using a component, including its usages.
 * @param {Object} appUsage - The app usage object containing app information and component usages.
 * @returns {HTMLElement} - The details element representing the app usage and its component usages.
 */
function renderAppUsageDetailsListItem(appUsage) {
    const appUsageListItemElement = document.createElement("details");
    const appName = appUsage ? `${appUsage?.appOwner}/${appUsage?.appName}` : "Unknown app";
    const componentUsageNumber = appUsage?.usages?.length || 0;
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

    const appUsageListElement = document.createElement("ul");
    appUsageListElement.classList.add("component-usage-list");
    appUsage?.usages?.forEach((usage) => {
        appUsageListElement.appendChild(renderAppUsingComponentListItem(usage));
    });
    appUsageListItemElement.appendChild(appUsageListElement);

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
 * Render a details element for a component using another component, including its usages.
 * @param {Object} componentUsage - The component usage object containing parent component information and its usages.
 * @returns {HTMLElement} - The details element representing the component usage and its usages.
 */
function renderComponentUsageDetailsListItem(componentUsage) {
    const componentUsageListItemElement = document.createElement("details");
    const appName = componentUsage ? `${componentUsage?.appOwner}/${componentUsage?.appName}` : "Unknown app";
    const componentUsageNumber = componentUsage?.usages?.length || 0;
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

    const componentUsageListElement = document.createElement("ul");
    componentUsageListElement.classList.add("component-usage-list");
    componentUsage?.usages?.forEach((usage) => {
        componentUsageListElement.appendChild(renderComponentUsingComponentListItem(usage));
    });
    componentUsageListItemElement.appendChild(componentUsageListElement);

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
