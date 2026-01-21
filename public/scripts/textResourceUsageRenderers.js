import { filterResources, getResourcesWithSameValue } from "./filters.js";

/**
 * Renders a component as a collapsible list item using a <details> element.
 * The summary displays the component's id and tagName, and the details show the component's JSON data.
 *
 * @param {Object} component - The component object to render.
 * @param {string} [component.id] - The unique identifier of the component.
 * @param {string} [component.tagName] - The tag name of the component.
 * @returns {HTMLDetailsElement} The constructed <details> element representing the component.
 */
function renderComponentUsingResourceListItem(component) {
    const componentListItemElement = document.createElement("details");
    const componentSummaryElement = document.createElement("summary");
    componentSummaryElement.innerHTML = `${component?.id} (${component?.tagName})`;

    componentListItemElement.appendChild(componentSummaryElement);

    const componentJsonDataElement = document.createElement("pre");
    componentJsonDataElement.innerHTML = JSON.stringify(component, null, 2);
    componentListItemElement.appendChild(componentJsonDataElement);
    return componentListItemElement;
}

/**
 * Creates a <details> element representing an application's usage details, including
 * the app name, the number of components using a resource, and a list of those components.
 *
 * @param {Object} appUsage - The usage details for an application.
 * @param {string} [appUsage.appName] - The name of the application.
 * @param {Array<Object>} [appUsage.componentsUsingResource] - Array of components using the resource.
 * @returns {HTMLElement} The constructed <details> element containing the app usage information.
 */
function renderAppUsageDetailsListItem(appUsage) {
    const appUsageListItemElement = document.createElement("details");
    const appName = appUsage?.appName || "Unknown app";
    const componentUsageNumber = appUsage?.componentsUsingResource?.length || 0;
    const appUsageSummaryElement = document.createElement("summary");
    const appUsageSummaryTitleElement = document.createElement("span");
    appUsageSummaryTitleElement.classList.add("app-usage-summary-title");
    appUsageSummaryTitleElement.innerHTML = appName;

    const appUsageSummaryCountElement = document.createElement("span");
    appUsageSummaryCountElement.classList.add("app-usage-summary-count");
    appUsageSummaryCountElement.innerHTML = `Components: ${componentUsageNumber}`;

    appUsageSummaryElement.appendChild(appUsageSummaryTitleElement);
    appUsageSummaryElement.appendChild(appUsageSummaryCountElement);

    appUsageListItemElement.appendChild(appUsageSummaryElement);

    const componentUsageListElement = document.createElement("div");
    componentUsageListElement.classList.add("component-usage-list");
    appUsage?.componentsUsingResource?.forEach((component) => {
        componentUsageListElement.appendChild(renderComponentUsingResourceListItem(component));
    });
    appUsageListItemElement.appendChild(componentUsageListElement);
    return appUsageListItemElement;
}

export function renderDefaultTextResourceListItem(textResource, allTextResources) {
    const numberOfAppsUsingResource = textResource?.usage?.length;
    const numberOfComponentsUsingResource = textResource?.usage?.reduce((total, app) => total + app?.componentsUsingResource?.length, 0) || 0;
    const resourcesWithSameValue = getResourcesWithSameValue(allTextResources, textResource);

    const listItemElement = document.createElement("details");
    listItemElement.classList.add("default-text-resource-list-item");
    const summaryElement = document.createElement("summary");

    const resourceIdAndValueContainer = document.createElement("div");
    resourceIdAndValueContainer.classList.add("resource-id-and-value");

    const resourceIdElement = document.createElement("div");
    resourceIdElement.classList.add("resource-id");
    resourceIdElement.innerHTML = `${textResource?.resource?.id}`;
    resourceIdAndValueContainer.appendChild(resourceIdElement);

    const resourceValueElement = document.createElement("div");
    resourceValueElement.classList.add("resource-value");
    resourceValueElement.innerHTML = `${textResource?.resource?.value}`;
    resourceIdAndValueContainer.appendChild(resourceValueElement);

    summaryElement.appendChild(resourceIdAndValueContainer);

    const usageContainerElement = document.createElement("div");
    usageContainerElement.classList.add("usage-container");

    const appUsageElement = document.createElement("span");
    appUsageElement.classList.add("app-usage");
    appUsageElement.innerHTML = `Apps: ${numberOfAppsUsingResource}`;
    usageContainerElement.appendChild(appUsageElement);

    const componentUsageElement = document.createElement("span");
    componentUsageElement.classList.add("component-usage");
    componentUsageElement.innerHTML = `Components: ${numberOfComponentsUsingResource}`;
    usageContainerElement.appendChild(componentUsageElement);

    const duplicateUsageElement = document.createElement("span");
    duplicateUsageElement.classList.add("duplicate-usage");
    duplicateUsageElement.innerHTML = `Duplicates: ${resourcesWithSameValue.length}`;
    usageContainerElement.appendChild(duplicateUsageElement);

    summaryElement.appendChild(usageContainerElement);

    listItemElement.appendChild(summaryElement);

    const usageDetailsElement = document.createElement("div");
    usageDetailsElement.classList.add("usage-details");

    const appUsageDetailsListElement = document.createElement("div");
    appUsageDetailsListElement.classList.add("app-usage-details-list");

    if (textResource?.usage?.length > 0) {
        const appUsageTitleElement = document.createElement("h4");
        appUsageTitleElement.innerHTML = "Apps using this resource";
        appUsageDetailsListElement.appendChild(appUsageTitleElement);

        textResource?.usage?.forEach((appUsage) => {
            const appUsageListItemElement = renderAppUsageDetailsListItem(appUsage);
            appUsageDetailsListElement.appendChild(appUsageListItemElement);
        });
        usageDetailsElement.appendChild(appUsageDetailsListElement);
    } else {
        const noUsageElement = document.createElement("p");
        noUsageElement.innerHTML = "This resource is not used in any app.";
        usageDetailsElement.appendChild(noUsageElement);
    }

    if (resourcesWithSameValue.length > 0) {
        const duplicateResourcesContainerElement = document.createElement("div");
        duplicateResourcesContainerElement.classList.add("duplicate-resources-container");

        const duplicateResourcesTitleElement = document.createElement("h4");
        duplicateResourcesTitleElement.innerHTML = "Resources with same value";
        duplicateResourcesContainerElement.appendChild(duplicateResourcesTitleElement);

        const duplicateResourcesListElement = document.createElement("ul");
        duplicateResourcesListElement.classList.add("duplicate-resources-list");
        duplicateResourcesContainerElement.appendChild(duplicateResourcesListElement);

        resourcesWithSameValue.forEach((duplicateResource) => {
            const duplicateResourceElement = document.createElement("li");
            duplicateResourceElement.classList.add("duplicate-resource-item");
            duplicateResourceElement.innerHTML = `${duplicateResource?.resource?.id}`;
            duplicateResourcesListElement.appendChild(duplicateResourceElement);
        });

        duplicateResourcesContainerElement.appendChild(duplicateResourcesListElement);
        usageDetailsElement.appendChild(duplicateResourcesContainerElement);
    }

    listItemElement.appendChild(usageDetailsElement);

    return listItemElement;
}

/**
 * Renders a list of default text resources as a DOM element.
 *
 * @param {Array<Object>} textResources - An array of text resource objects to render.
 * @returns {HTMLDivElement} The DOM element containing the rendered list of text resources.
 */
export function renderDefaultTextResourcesList(filteredTextResources, allTextResources) {
    const defaultResourcesListElement = document.createElement("div");
    defaultResourcesListElement.id = "default-text-resources-list";
    defaultResourcesListElement.classList.add("default-text-resources-list");
    defaultResourcesListElement.innerHTML = "";
    filteredTextResources.forEach((textResource) => {
        const listItemElement = renderDefaultTextResourceListItem(textResource, allTextResources);
        defaultResourcesListElement.appendChild(listItemElement);
    });
    return defaultResourcesListElement;
}

export function renderRadioButtonsFilterForTextResourcesList(containerElement, textResources) {
    const filterContainerElement = document.createElement("div");
    filterContainerElement.classList.add("text-resources-filter-container");

    const allResourcesLabelElement = document.createElement("label");
    allResourcesLabelElement.innerHTML = "All";
    const allResourcesRadioElement = document.createElement("input");
    allResourcesRadioElement.type = "radio";
    allResourcesRadioElement.name = "text-resources-filter";
    allResourcesRadioElement.value = "all";
    allResourcesRadioElement.checked = true;

    const unusedResourcesLabelElement = document.createElement("label");
    unusedResourcesLabelElement.innerHTML = "Unused";
    const unusedResourcesRadioElement = document.createElement("input");
    unusedResourcesRadioElement.type = "radio";
    unusedResourcesRadioElement.name = "text-resources-filter";
    unusedResourcesRadioElement.value = "unused";

    const usedOnceResourcesLabelElement = document.createElement("label");
    usedOnceResourcesLabelElement.innerHTML = "Used once";
    const usedOnceResourcesRadioElement = document.createElement("input");
    usedOnceResourcesRadioElement.type = "radio";
    usedOnceResourcesRadioElement.name = "text-resources-filter";
    usedOnceResourcesRadioElement.value = "used-once";

    const missingResourcesLabelElement = document.createElement("label");
    missingResourcesLabelElement.innerHTML = "Missing";
    const missingResourcesRadioElement = document.createElement("input");
    missingResourcesRadioElement.type = "radio";
    missingResourcesRadioElement.name = "text-resources-filter";
    missingResourcesRadioElement.value = "missing";

    const updateResourceListBasedOnFilter = () => {
        const selectedFilter = filterContainerElement.querySelector('input[name="text-resources-filter"]:checked').value;
        const filteredResources = filterResources(textResources, selectedFilter);
        const existingListElement = containerElement.querySelector("#default-text-resources-list");
        if (existingListElement) {
            existingListElement.remove();
        }
        const newListElement = renderDefaultTextResourcesList(filteredResources, textResources);
        containerElement.appendChild(newListElement);
    };

    allResourcesRadioElement.onchange = updateResourceListBasedOnFilter;
    unusedResourcesRadioElement.onchange = updateResourceListBasedOnFilter;
    usedOnceResourcesRadioElement.onchange = updateResourceListBasedOnFilter;
    missingResourcesRadioElement.onchange = updateResourceListBasedOnFilter;

    filterContainerElement.appendChild(allResourcesRadioElement);
    filterContainerElement.appendChild(allResourcesLabelElement);
    filterContainerElement.appendChild(unusedResourcesRadioElement);
    filterContainerElement.appendChild(unusedResourcesLabelElement);
    filterContainerElement.appendChild(usedOnceResourcesRadioElement);
    filterContainerElement.appendChild(usedOnceResourcesLabelElement);
    filterContainerElement.appendChild(missingResourcesRadioElement);
    filterContainerElement.appendChild(missingResourcesLabelElement);

    return filterContainerElement;
}
