import type { ApiValue, Layout, LayoutComponent } from "./types.ts";
import { filterResources, filterResourcesByApplication, filterTextResourcesByTextInput, getResourcesWithSameValue } from "./filters.ts";
import { renderApplicationFilter, renderFormFilter, renderLabelledSelectFilter, renderTextFilter, storedChoice } from "./filterControls.ts";
import type { AppFormChoices } from "./filterControls.ts";
import { getLanguageNameFromCode } from "./languages.ts";

/**
 * Renders a component as a collapsible list item using a <details> element.
 * The summary displays the component's id and tagName, and the details show the component's JSON data.
 *
 * @param {Object} component - The component object to render.
 * @param {string} [component.id] - The unique identifier of the component.
 * @param {string} [component.tagName] - The tag name of the component.
 * @returns {HTMLDetailsElement} The constructed <details> element representing the component.
 */
function renderComponentUsingResourceListItem(component: LayoutComponent | undefined) {
    const componentListItemElement = document.createElement("details");
    const componentSummaryElement = document.createElement("summary");

    const expandCollapseIconElement = document.createElement("span");
    expandCollapseIconElement.classList.add("expand-collapse-icon");
    expandCollapseIconElement.innerHTML = "▶";
    componentSummaryElement.appendChild(expandCollapseIconElement);

    const componentSummaryTitleElement = document.createElement("span");
    componentSummaryTitleElement.classList.add("component-summary-title");
    componentSummaryTitleElement.innerHTML = `${component?.id} (${component?.tagName})`;
    componentSummaryElement.appendChild(componentSummaryTitleElement);

    componentListItemElement.appendChild(componentSummaryElement);

    const componentJsonDataElement = document.createElement("pre");
    componentJsonDataElement.innerHTML = JSON.stringify(component, null, 2);
    componentListItemElement.appendChild(componentJsonDataElement);
    return componentListItemElement;
}

/**
 * Counts the total number of components using a resource across all display layouts of an app.
 *
 * @param {Array<Object>} layouts - Per display layout usage, each containing a `componentsUsingResource` array.
 * @returns {number} The total number of components using the resource.
 */
function getTotalComponentsForLayouts(layouts: ApiValue) {
    if (!Array.isArray(layouts)) {
        return 0;
    }
    return layouts.reduce((total: number, layout: Layout | undefined) => total + (layout?.componentsUsingResource?.length || 0), 0);
}

/**
 * Creates a <details> element representing a single display layout's usage of a resource, including
 * the layout name, the number of components using the resource, and a list of those components.
 *
 * @param {Object} layoutUsage - The usage details for a display layout: { layoutName, componentsUsingResource }.
 * @returns {HTMLDetailsElement} The constructed <details> element representing the layout usage.
 */
function renderLayoutUsageDetailsListItem(layoutUsage: ApiValue) {
    const layoutUsageListItemElement = document.createElement("details");
    layoutUsageListItemElement.classList.add("layout-usage-details-list-item");
    const layoutName = layoutUsage?.layoutName || "DisplayLayout";
    const componentUsageNumber = layoutUsage?.componentsUsingResource?.length || 0;

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

    const componentUsageListElement = document.createElement("div");
    componentUsageListElement.classList.add("component-usage-list");
    layoutUsage?.componentsUsingResource?.forEach((component: LayoutComponent | undefined) => {
        componentUsageListElement.appendChild(renderComponentUsingResourceListItem(component));
    });
    layoutUsageListItemElement.appendChild(componentUsageListElement);

    return layoutUsageListItemElement;
}

/**
 * Creates a <details> element representing an application's usage details, including
 * the app name, the number of components using a resource, and its display layouts.
 *
 * @param {Object} appUsage - The usage details for an application.
 * @param {string} [appUsage.appName] - The name of the application.
 * @param {Array<Object>} [appUsage.layouts] - Per display layout usage, each with a `layoutName` and `componentsUsingResource`.
 * @returns {HTMLElement} The constructed <details> element containing the app usage information.
 */
function renderAppUsageDetailsListItem(appUsage: ApiValue) {
    const appUsageListItemElement = document.createElement("details");
    const appName = appUsage ? `${appUsage?.appOwner}/${appUsage?.appName}` : "Unknown app";
    const componentUsageNumber = getTotalComponentsForLayouts(appUsage?.layouts);
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
    appUsage?.layouts?.forEach((layoutUsage: ApiValue) => {
        appUsageLayoutListElement.appendChild(renderLayoutUsageDetailsListItem(layoutUsage));
    });
    appUsageListItemElement.appendChild(appUsageLayoutListElement);
    return appUsageListItemElement;
}

/**
 * Creates and returns a list item element representing a duplicate resource.
 *
 * @param {Object} duplicateResource - The duplicate resource object to render.
 * @param {Object} [duplicateResource.resource] - The resource object within the duplicate resource.
 * @param {string|number} [duplicateResource.resource.id] - The unique identifier of the resource.
 * @returns {HTMLLIElement} The list item element representing the duplicate resource.
 */
function renderDuplicateResourcesListItem(duplicateResource: ApiValue) {
    const duplicateResourceElement = document.createElement("li");
    duplicateResourceElement.classList.add("duplicate-resource-item");
    duplicateResourceElement.innerHTML = `${duplicateResource?.resource?.id}`;
    return duplicateResourceElement;
}

/**
 * Renders a container element displaying a list of duplicate resources.
 *
 * @param {Array<Object>} duplicateResources - An array of duplicate resource objects to be rendered in the list.
 * @returns {HTMLDivElement} The container div element containing the rendered list of duplicate resources.
 */
function renderDuplicateResourcesList(duplicateResources: ApiValue) {
    const duplicateResourcesContainerElement = document.createElement("div");
    duplicateResourcesContainerElement.classList.add("duplicate-resources-container");

    const duplicateResourcesTitleElement = document.createElement("h4");
    duplicateResourcesTitleElement.innerHTML = "Resources with same value";
    duplicateResourcesContainerElement.appendChild(duplicateResourcesTitleElement);

    const duplicateResourcesListElement = document.createElement("ul");
    duplicateResourcesListElement.classList.add("duplicate-resources-list");
    duplicateResourcesContainerElement.appendChild(duplicateResourcesListElement);

    duplicateResources.forEach((duplicateResource: ApiValue) => {
        const duplicateResourceElement = renderDuplicateResourcesListItem(duplicateResource);
        duplicateResourcesListElement.appendChild(duplicateResourceElement);
    });

    duplicateResourcesContainerElement.appendChild(duplicateResourcesListElement);
    return duplicateResourcesContainerElement;
}

function getPresenceLabel(presence: ApiValue) {
    switch (presence) {
        case "missing":
            return "Missing";
        case "localValue":
            return "Local";
        default:
            return "";
    }
}

/**
 * Renders a default list item element for a text resource, displaying its usage across apps and components,
 * as well as any duplicate resources with the same value.
 *
 * @param {Object} textResource - The text resource object to render.
 * @param {Object[]} textResource.usage - Array of app usage objects, each representing an app using the resource.
 * @param {Object} textResource.resource - The resource details.
 * @param {string} textResource.resource.id - The unique identifier of the resource.
 * @param {Object<string, string>} textResource.resource.values - The values of the resource in different languages.
 * @param {Object[]} allTextResources - Array of all text resource objects, used to find duplicates.
 * @returns {HTMLElement} The constructed list item element representing the text resource and its usage.
 */
export function renderDefaultTextResourceListItem(textResource: ApiValue, allTextResources: ApiValue) {
    const numberOfAppsUsingResource = textResource?.usage?.length;
    const numberOfComponentsUsingResource =
        textResource?.usage?.reduce((total: number, app: ApiValue) => total + getTotalComponentsForLayouts(app?.layouts), 0) || 0;
    const resourcesWithSameValue = getResourcesWithSameValue(allTextResources, textResource);

    const listItemElement = document.createElement("details");
    listItemElement.classList.add("default-text-resource-list-item");
    const summaryElement = document.createElement("summary");

    const expandCollapseIconElement = document.createElement("span");
    expandCollapseIconElement.classList.add("expand-collapse-icon");
    expandCollapseIconElement.innerHTML = "▶";
    summaryElement.appendChild(expandCollapseIconElement);

    const resourceIdAndValueContainer = document.createElement("div");
    resourceIdAndValueContainer.classList.add("resource-id-and-value");

    const resourceIdElement = document.createElement("div");
    resourceIdElement.classList.add("resource-id");
    resourceIdElement.innerHTML = `${textResource?.resource?.id}`;
    resourceIdAndValueContainer.appendChild(resourceIdElement);

    if (textResource?.presence?.length > 0) {
        const presenceIndicatorElement = document.createElement("span");
        presenceIndicatorElement.classList.add("indicator", `indicator-${textResource.presence}`);
        presenceIndicatorElement.innerHTML = getPresenceLabel(textResource.presence);
        resourceIdElement.appendChild(presenceIndicatorElement);
    }
    if (textResource?.usage?.length === 0) {
        const unusedIndicatorElement = document.createElement("span");
        unusedIndicatorElement.classList.add("indicator", "indicator-unused");
        unusedIndicatorElement.innerHTML = "Unused";
        resourceIdElement.appendChild(unusedIndicatorElement);
    }
    if (textResource?.resource?.replacedWithId?.length > 0) {
        const deprecatedIndicatorElement = document.createElement("span");
        deprecatedIndicatorElement.classList.add("indicator", "indicator-deprecated");
        deprecatedIndicatorElement.innerHTML = "Replaced with: " + textResource.resource.replacedWithId;
        resourceIdElement.appendChild(deprecatedIndicatorElement);
    }

    const resourceValuesListElement = document.createElement("dl");
    resourceValuesListElement.classList.add("resource-values-list");

    if (textResource?.resource?.values) {
        Object.entries(textResource?.resource?.values).forEach(([language, value]) => {
            const languageElement = document.createElement("dt");
            languageElement.classList.add("resource-value-language");
            languageElement.innerHTML = `${language}`;
            resourceValuesListElement.appendChild(languageElement);

            const valueElement = document.createElement("dd");
            valueElement.classList.add("resource-value");
            valueElement.innerHTML = `${value}`;
            resourceValuesListElement.appendChild(valueElement);
        });
    }

    resourceIdAndValueContainer.appendChild(resourceValuesListElement);

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

        textResource?.usage?.forEach((appUsage: ApiValue) => {
            const appUsageListItemElement = renderAppUsageDetailsListItem(appUsage);
            appUsageDetailsListElement.appendChild(appUsageListItemElement);
        });
        usageDetailsElement.appendChild(appUsageDetailsListElement);
    } else {
        const noUsageElement = document.createElement("span");
        noUsageElement.classList.add("message");
        noUsageElement.innerHTML = "This resource is not used in any app.";
        usageDetailsElement.appendChild(noUsageElement);
    }

    if (resourcesWithSameValue.length > 0) {
        const duplicateResourcesContainerElement = renderDuplicateResourcesList(resourcesWithSameValue);
        usageDetailsElement.appendChild(duplicateResourcesContainerElement);
    }

    listItemElement.appendChild(usageDetailsElement);

    return listItemElement;
}

/**
 * Renders a list of default text resources as a DOM element.
 *
 * @param {Array<Object>} filteredTextResources - The array of text resource objects to render, already filtered based on criteria.
 * @param {Array<Object>} allTextResources - The array of all text resource objects, used to find duplicates for each resource.
 * @returns {HTMLDivElement} The DOM element containing the rendered list of text resources.
 */
export function renderDefaultTextResourcesList(filteredTextResources: ApiValue, allTextResources: ApiValue) {
    const defaultResourcesListElement = document.createElement("div");
    defaultResourcesListElement.id = "default-text-resources-list";
    defaultResourcesListElement.classList.add("paper");
    defaultResourcesListElement.innerHTML = "";
    filteredTextResources.forEach((textResource: ApiValue) => {
        const listItemElement = renderDefaultTextResourceListItem(textResource, allTextResources);
        defaultResourcesListElement.appendChild(listItemElement);
    });
    return defaultResourcesListElement;
}

/**
 * The text resources that pass the filters currently chosen on the page, which are stored on globalThis.
 *
 * @param {Array<Object>} textResources - The text resources to filter.
 * @returns {Array<Object>} The ones that pass every filter.
 */
export function filterTextResourcesBySelectedFilters(textResources: ApiValue) {
    const textFilter = globalThis.textFilter || "";
    const matchBy = globalThis.matchBy || "id";
    const selectedFilter = globalThis.selectedFilter || "all";
    const selectedAppOwner = globalThis.selectedAppOwner || "";
    const selectedAppName = globalThis.selectedAppName || "";
    const selectedForm = globalThis.selectedForm || "";
    let filteredResources = filterTextResourcesByTextInput(textResources, textFilter, matchBy);
    filteredResources = filterResources(filteredResources, selectedFilter);
    return filterResourcesByApplication(filteredResources, selectedAppOwner, selectedAppName, selectedForm);
}

/**
 * Handles changes to the text resource filter and updates the rendered list accordingly.
 *
 * @param {HTMLElement} containerElement - The DOM element that contains the text resources list.
 * @param {Array<Object>} textResources - The array of text resource objects to be filtered and rendered.
 */
function handleFilterChange(containerElement: HTMLElement, textResources: ApiValue) {
    const filteredResources = filterTextResourcesBySelectedFilters(textResources);

    const existingListElement = containerElement.querySelector("#default-text-resources-list");
    if (existingListElement) {
        existingListElement.remove();
    }
    const newListElement = renderDefaultTextResourcesList(filteredResources, textResources);
    containerElement.appendChild(newListElement);
}

/** Where the text resource usage page keeps its application and form choices. */
const textResourceAppFormChoices: AppFormChoices = {
    appOwner: storedChoice("selectedAppOwner"),
    appName: storedChoice("selectedAppName"),
    form: storedChoice("selectedForm")
};

/**
 * Renders the "Filter by usage" dropdown for a text resources list.
 *
 * @param {HTMLElement} containerElement - The container element holding the resources list, re-filtered on change.
 * @param {Array} textResources - The full list of text resources to filter when the selection changes.
 * @returns {HTMLFormElement} The DOM element containing the usage filter.
 */
export function renderUsageFilterForTextResourcesList(containerElement: HTMLElement, textResources: ApiValue) {
    const filterElement = renderLabelledSelectFilter(
        "Filter by usage:",
        "text-resource-usage-filter-select",
        [
            { value: "all", text: "All" },
            { value: "unused", text: "Unused" },
            { value: "used-once", text: "Used once" },
            { value: "with-duplicates", text: "With duplicates" },
            { value: "deprecated", text: "Deprecated" },
            { value: "missing", text: "Missing" },
            { value: "missing-with-local-value", text: "Missing with local value" },
            ...["nb", "nn", "en"].map((code) => ({
                value: `missing-${code}-translations`,
                text: `Missing translation for ${getLanguageNameFromCode(code)}`
            }))
        ],
        (value: string) => {
            globalThis.selectedFilter = value;
            handleFilterChange(containerElement, textResources);
        },
        globalThis.selectedFilter
    );
    globalThis.selectedFilter = (filterElement.querySelector("select") as HTMLSelectElement).value;
    return filterElement;
}

/**
 * Renders a select dropdown for filtering a list of text resources by application.
 *
 * @param {HTMLElement} containerElement - The container element holding the resources list, re-filtered on change.
 * @param {Array} textResources - The full list of text resources to filter when the selection changes.
 * @param {Array<{ appName: string }>} applications - The list of applications to populate the filter dropdown.
 * @returns {HTMLFormElement} The DOM element containing the application filter select dropdown.
 */
export function renderSelectApplicationFilterForTextResourcesList(containerElement: HTMLElement, textResources: ApiValue, applications: ApiValue) {
    return renderApplicationFilter(containerElement, {
        selectId: "application-filter-select",
        formSelectId: "form-filter-select",
        applications,
        choices: textResourceAppFormChoices,
        onChange: () => handleFilterChange(containerElement, textResources)
    });
}

/**
 * Renders a select dropdown for filtering a list of text resources by form: the main form or one of the subforms.
 * Its options follow the application filter, which rebuilds them when the selected app changes.
 *
 * @param {HTMLElement} containerElement - The container element holding the resources list, re-filtered on change.
 * @param {Array} textResources - The full list of text resources to filter when the selection changes.
 * @param {Array<Object>} applications - The display layout entries, whose subforms populate the dropdown.
 * @returns {HTMLFormElement} The DOM element containing the form filter select dropdown.
 */
export function renderSelectFormFilterForTextResourcesList(containerElement: HTMLElement, textResources: ApiValue, applications: ApiValue) {
    return renderFormFilter({
        selectId: "form-filter-select",
        applications,
        choices: textResourceAppFormChoices,
        onChange: () => handleFilterChange(containerElement, textResources)
    });
}

/**
 * Renders a filter UI for a list of text resources, including a text input and a select dropdown
 * to filter by either resource ID or value. The filter values are stored globally and trigger
 * a filter change handler when updated.
 *
 * @param {HTMLElement} containerElement - The container element holding the resources list, re-filtered on change.
 * @param {Array<Object>} textResources - The full list of text resources to filter when the input changes.
 * @returns {HTMLDivElement} The DOM element containing the filter UI.
 */
export function renderTextInputFilterForTextResourcesList(containerElement: HTMLElement, textResources: ApiValue) {
    return renderTextFilter({
        inputId: "text-filter-input",
        matchById: "match-by-select",
        placeholder: "Enter text to filter resources",
        matchOptions: [
            { value: "id", text: "Match by ID" },
            { value: "value", text: "Match by Value" }
        ],
        text: storedChoice("textFilter"),
        matchBy: storedChoice("matchBy"),
        onChange: () => handleFilterChange(containerElement, textResources)
    });
}
