// Classes
import CustomElementHtmlAttributes from "../../src/classes/system-classes/CustomElementHtmlAttributes.js";

// Global functions
import { addContainerElement, appendChildren, createCustomElement } from "../../src/functions/helpers.js";

// Local functions
import { fetchAltinnStudioForms, fetchExampleData, getUpdatedApiData } from "./apiHelpers.js";
import { getDataForComponent } from "./getters.js";
import { addDataToGlobalThis, addValuesToLocalStorage, addValueToLocalStorage } from "./localStorage.js";
import {
    renderDefaultTextResourcesList,
    renderRadioButtonsFilterForTextResourcesList,
    renderSelectApplicationFilterForTextResourcesList,
    renderTextInputFilterForTextResourcesList
} from "./textResourceUsageRenderers.js";

/**
 * Renders the resource usage page by appending various filter controls and the default text resources list
 * to the specified container element. Utilizes global variables for resource usage data and layout information.
 *
 * @param {HTMLElement} containerElement - The DOM element to which the resource usage page components will be appended.
 */
function renderResourceUsagePage(containerElement) {
    const allTextResourceUsage = globalThis.allTextResourceUsage;
    const displayLayouts = globalThis.displayLayouts;

    const titleElement = document.createElement("h2");
    titleElement.textContent = "Resource usage";

    containerElement.appendChild(titleElement);
    containerElement.appendChild(renderRadioButtonsFilterForTextResourcesList(containerElement, allTextResourceUsage));
    containerElement.appendChild(renderSelectApplicationFilterForTextResourcesList(containerElement, allTextResourceUsage, displayLayouts));
    containerElement.appendChild(renderTextInputFilterForTextResourcesList(containerElement, allTextResourceUsage));
    containerElement.appendChild(renderDefaultTextResourcesList(allTextResourceUsage, allTextResourceUsage));
}

/**
 * Renders the package versions page, displaying the versions of the altinn-studio-custom-components package and the altinn-app-frontend assets for all Altinn Studio apps.
 *
 * @param {HTMLElement} containerElement - The DOM element to render the package versions page into.
 */
function renderPackageVersionsPage(containerElement) {
    const titleElement = document.createElement("h2");
    titleElement.textContent = "Package versions";
    containerElement.appendChild(titleElement);

    const contentContainerElement = document.createElement("div");
    contentContainerElement.classList.add("content-container");

    const tableElement = document.createElement("table");
    const tableHeaderElement = document.createElement("thead");
    const headerRow = document.createElement("tr");
    const appHeader = document.createElement("th");
    appHeader.textContent = "Application";
    const altinnStudioCustomComponentsHeader = document.createElement("th");
    altinnStudioCustomComponentsHeader.textContent = "Altinn Studio Custom Components";
    const altinnAppFrontendCSSHeader = document.createElement("th");
    altinnAppFrontendCSSHeader.textContent = "Altinn App Frontend CSS";
    const altinnAppFrontendJSHeader = document.createElement("th");
    altinnAppFrontendJSHeader.textContent = "Altinn App Frontend JS";

    headerRow.appendChild(appHeader);
    headerRow.appendChild(altinnStudioCustomComponentsHeader);
    headerRow.appendChild(altinnAppFrontendCSSHeader);
    headerRow.appendChild(altinnAppFrontendJSHeader);
    tableHeaderElement.appendChild(headerRow);
    tableElement.appendChild(tableHeaderElement);

    const tableBodyElement = document.createElement("tbody");

    globalThis.packageVersions.forEach((app) => {
        const row = document.createElement("tr");
        const appCell = document.createElement("td");
        appCell.textContent = `${app.appOwner}/${app.appName}`;
        const altinnStudioCustomComponentsCell = document.createElement("td");
        altinnStudioCustomComponentsCell.textContent = app.packageVersions.altinnStudioCustomComponents || "N/A";
        const altinnAppFrontendCSSCell = document.createElement("td");
        altinnAppFrontendCSSCell.textContent = app.packageVersions.altinnAppFrontendCSS || "N/A";
        const altinnAppFrontendJSCell = document.createElement("td");
        altinnAppFrontendJSCell.textContent = app.packageVersions.altinnAppFrontendJS || "N/A";

        row.appendChild(appCell);
        row.appendChild(altinnStudioCustomComponentsCell);
        row.appendChild(altinnAppFrontendCSSCell);
        row.appendChild(altinnAppFrontendJSCell);
        tableBodyElement.appendChild(row);
    });

    tableElement.appendChild(tableBodyElement);
    contentContainerElement.appendChild(tableElement);
    containerElement.appendChild(contentContainerElement);
}

/**
 * Retrieves the local text resources for a specific application based on its name and owner.
 *
 * @param {string} appName - The name of the application.
 * @param {string} appOwner - The owner of the application.
 * @param {Array<{ appName: string, appOwner: string, resourceValues: Array }>} appResourceValues -
 *   An array of objects containing application names, owners, and their associated resource values.
 * @returns {Array} The resource values for the specified application, or an empty array if not found.
 */
function getLocalTextResourcesForApp(appName, appOwner, appResourceValues) {
    return appResourceValues.find((app) => app.appName === appName && app.appOwner === appOwner)?.resourceValues || [];
}

/** Renders a filter for selecting an application and displays the corresponding display layout components.
 *
 * @param {HTMLElement} containerElement - The DOM element to render the display layouts page into.
 * @param {string} selectedAppName - The name of the currently selected application (optional).
 * @param {string} selectedAppOwner - The owner of the currently selected application (optional).
 */
function renderSelectDisplayLayoutApplicationFilter(containerElement, selectedAppName, selectedAppOwner) {
    const formElement = document.createElement("form");
    formElement.classList.add("filter-container");
    const labelElement = document.createElement("label");
    labelElement.textContent = "Application";
    labelElement.setAttribute("for", "select-display-layout-application");

    const selectElement = document.createElement("select");
    selectElement.id = "select-display-layout-application";

    const defaultOptionElement = document.createElement("option");
    defaultOptionElement.value = "";
    defaultOptionElement.textContent = "Select an application";
    selectElement.appendChild(defaultOptionElement);

    globalThis.displayLayouts.forEach((layout) => {
        const optionElement = document.createElement("option");
        optionElement.value = `${layout.appOwner}/${layout.appName}`;
        optionElement.textContent = `${layout.appOwner}/${layout.appName}`;
        if (layout.appName === selectedAppName && layout.appOwner === selectedAppOwner) {
            optionElement.selected = true;
        }
        selectElement.appendChild(optionElement);
    });

    selectElement.onchange = async (event) => {
        const [appOwner, appName] = event.target.value.split("/");
        globalThis.selectedDisplayLayoutAppOwner = appOwner;
        globalThis.selectedDisplayLayoutAppName = appName;
        const exampleData = globalThis.exampleData || (await fetchExampleData());
        globalThis.exampleData = exampleData;
        const localTextResources = getLocalTextResourcesForApp(appName, appOwner, globalThis.appResourceValues);
        globalThis.textResources = localTextResources;
        const mainElement = document.getElementById("admin-main");
        mainElement.innerHTML = "";
        await renderDisplayLayoutsPage(mainElement, exampleData);
    };

    formElement.appendChild(labelElement);
    formElement.appendChild(selectElement);
    containerElement.appendChild(formElement);
}

/**
 * Renders a select dropdown to filter display layouts by filename.
 *
 * @param {HTMLElement} containerElement - The DOM element to which the filter form will be appended.
 * @param {Object} displayLayout - The current display layout object, expected to have a `dataType` property.
 * @param {Object} selectedFileNames - An object mapping data types to the filenames that should be selected by default in the dropdown.
 * @param {Array<Object>} appData - Array of application data objects, each expected to have a `dataType` and `data` property.
 *
 * @returns {void}
 */
function renderSelectDisplayLayoutFilenameFilter(containerElement, displayLayout, selectedFileNames, appData) {
    if (!displayLayout) {
        return;
    }

    const dataType = displayLayout?.dataType;
    const appExampleData = appData.find((app) => app.dataType === dataType);
    if (!appExampleData) {
        return;
    }

    const files = Object.keys(appExampleData.data);

    if (files.length === 0) {
        return;
    }

    const formElement = document.createElement("form");
    formElement.classList.add("filter-container");
    const labelElement = document.createElement("label");
    labelElement.textContent = "Data";
    labelElement.setAttribute("for", "select-display-layout-file");

    const selectElement = document.createElement("select");
    selectElement.id = "select-display-layout-file";

    const defaultOptionElement = document.createElement("option");
    defaultOptionElement.value = "";
    defaultOptionElement.textContent = "Select a file";
    selectElement.appendChild(defaultOptionElement);

    files.forEach((file) => {
        const optionElement = document.createElement("option");
        optionElement.value = file;
        optionElement.textContent = file;
        if (file === selectedFileNames?.[dataType]) {
            optionElement.selected = true;
        }
        selectElement.appendChild(optionElement);
    });

    selectElement.onchange = async (event) => {
        const fileName = event.target.value;
        const mainElement = document.getElementById("admin-main");
        mainElement.innerHTML = "";
        await renderDisplayLayoutsPage(mainElement, appData, { ...selectedFileNames, [dataType]: fileName });
    };

    formElement.appendChild(labelElement);
    formElement.appendChild(selectElement);
    containerElement.appendChild(formElement);
}

/**
 * Renders a select dropdown to filter display layouts by form type (main form or subform).
 * The options in the dropdown are generated based on the `subForms` property of the provided `displayLayout` object.
 * When the selected form type changes, the display layouts page is re-rendered to show the components of the selected form type.
 *
 * @param {HTMLElement} containerElement - The DOM element to which the filter form will be appended.
 * @param {Object} displayLayout - The current display layout object, expected to have a `subForms` property which is an array of subform objects.
 * @param {Object} selectedFileNames - An object mapping data types to the filenames that should be selected by default in the dropdown.
 * @param {string} selectedFormType - The form type that should be selected by default in the dropdown (e.g., "main" for main form or the name of a subform).
 * @param {Array<Object>} appData - Array of application data objects, each expected to have a `dataType` and `data` property.
 *
 * @return {void}
 */
function renderSelectFormTypeFilter(containerElement, displayLayout, selectedFileNames, selectedFormType, appData) {
    if (!displayLayout?.subForms || displayLayout.subForms.length === 0) {
        return;
    }

    const formElement = document.createElement("form");
    formElement.classList.add("filter-container");
    const labelElement = document.createElement("label");
    labelElement.textContent = "Form type";
    labelElement.setAttribute("for", "select-form-type");

    const selectElement = document.createElement("select");
    selectElement.id = "select-form-type";

    const mainFormOptionElement = document.createElement("option");
    mainFormOptionElement.value = "main";
    mainFormOptionElement.textContent = "Main form";
    selectElement.appendChild(mainFormOptionElement);

    displayLayout.subForms.forEach((subForm) => {
        const optionElement = document.createElement("option");
        optionElement.value = subForm.appName;
        optionElement.textContent = subForm.appName;
        if (subForm.appName === selectedFormType) {
            optionElement.selected = true;
        }
        selectElement.appendChild(optionElement);
    });

    selectElement.onchange = async (event) => {
        const formType = event.target.value;
        const mainElement = document.getElementById("admin-main");
        mainElement.innerHTML = "";
        if (formType === "main") {
            await renderDisplayLayoutsPage(mainElement, appData, selectedFileNames, "main");
        } else {
            const subForm = displayLayout.subForms.find((form) => form.appName === formType);
            if (subForm) {
                await renderDisplayLayoutsPage(mainElement, appData, selectedFileNames, formType);
            }
        }
    };

    formElement.appendChild(labelElement);
    formElement.appendChild(selectElement);
    containerElement.appendChild(formElement);
}

/**
 * Renders a select dropdown to filter subform display layouts by filename. This function is intended to be used in conjunction with the form type filter, and will only render if a subform is selected.
 * The options in the dropdown are generated based on the available example data files for the selected subform's data type. When the selected file changes, the display layouts page is re-rendered to show the components of the selected subform with data from the selected file.
 * @param {HTMLElement} containerElement - The DOM element to which the filter form will be appended.
 * @param {Object} displayLayout - The current display layout object, expected to have a `subForms` property which is an array of subform objects.
 * @param {Object} selectedFileNames - An object mapping data types to the filenames that should be selected by default in the dropdown.
 * @param {string} selectedFormType - The form type that should be selected by default in the form type filter dropdown (e.g., "main" for main form or the name of a subform).
 * @param {Array<Object>} appData - Array of application data objects, each expected to have a `dataType` and `data` property.
 *
 * @return {void}
 */
function renderSelectSubFormDisplayLayoutFilenameFilter(containerElement, displayLayout, selectedFileNames, selectedFormType, appData) {
    if (selectedFormType === "main") {
        return;
    }
    const subForm = displayLayout.subForms.find((form) => form.appName === selectedFormType);
    if (!subForm) {
        return;
    }
    const dataType = subForm?.dataType;
    const appExampleData = appData.find((app) => app.dataType === dataType);
    if (!appExampleData) {
        return;
    }
    const files = Object.keys(appExampleData.data);
    if (files.length === 0) {
        return;
    }
    const formElement = document.createElement("form");
    formElement.classList.add("filter-container");
    const labelElement = document.createElement("label");
    labelElement.textContent = "Subform data";
    labelElement.setAttribute("for", "select-subform-display-layout-file");
    const selectElement = document.createElement("select");
    selectElement.id = "select-subform-display-layout-file";
    const defaultOptionElement = document.createElement("option");
    defaultOptionElement.value = "";
    defaultOptionElement.textContent = "Select a file";
    selectElement.appendChild(defaultOptionElement);
    files.forEach((file) => {
        const optionElement = document.createElement("option");
        optionElement.value = file;
        optionElement.textContent = file;
        if (file === selectedFileNames?.[dataType]) {
            optionElement.selected = true;
        }
        selectElement.appendChild(optionElement);
    });
    selectElement.onchange = async (event) => {
        const fileName = event.target.value;
        const mainElement = document.getElementById("admin-main");
        mainElement.innerHTML = "";
        await renderDisplayLayoutsPage(mainElement, appData, { ...selectedFileNames, [dataType]: fileName }, selectedFormType);
    };
    formElement.appendChild(labelElement);
    formElement.appendChild(selectElement);
    containerElement.appendChild(formElement);
}

/**
 * Creates and returns an <h1> element containing the main heading for the display layout.
 * The heading text is retrieved from the global text resources using the resource ID "appName".
 * If the resource is not found, it defaults to "Display layout".
 *
 * @returns {HTMLHeadingElement} The <h1> element with the appropriate heading text.
 */
function getDisplayLayoutMainHeading() {
    const localAppResources = globalThis.textResources;
    const headingElement = document.createElement("h1");
    const headingResourceId = "appName";
    const headingText = localAppResources?.resources?.length
        ? localAppResources.resources.find((res) => res.id === headingResourceId)?.value
        : "Display layout";
    headingElement.textContent = headingText;
    return headingElement;
}

/**
 * Sets the default selected file name for the display layout filters based on the provided display layout, selected file names, application data, and selected form type.
 *
 * This function checks if there is a selected file name for the data type associated with the display layout. If not, it retrieves the example data for the display layout's data type and sets the default selected file name to the first file in the example data.
 *
 * @param {Object} displayLayout - The display layout object, expected to have a `dataType` property and optionally a `subForms` property which is an array of subform objects.
 * @param {Object} selectedFileNames - An object mapping data types to the filenames that are currently selected in the filters.
 * @param {Array<Object>} appData - Array of application data objects, each expected to have a `dataType` and `data` property.
 * @param {string} selectedFormType - The form type that is currently selected in the form type filter dropdown (e.g., "main" for main form or the name of a subform).
 *
 * @returns {Object} An updated object mapping data types to the filenames that should be selected by default.
 */
function setDefaultSelectedFileNameForDisplayLayouts(displayLayout, selectedFileNames, appData, selectedFormType) {
    const dataType =
        selectedFormType === "main" ? displayLayout?.dataType : displayLayout?.subForms?.find((form) => form.appName === selectedFormType)?.dataType;
    if (!dataType) {
        return selectedFileNames;
    }
    const appExampleData = appData.find((app) => app.dataType === dataType);
    if (!appExampleData) {
        return selectedFileNames;
    }
    const files = Object.keys(appExampleData.data);
    if (files.length === 0) {
        return selectedFileNames;
    }
    if (!selectedFileNames?.[dataType]) {
        return { ...selectedFileNames, [dataType]: files[0] };
    }
    return selectedFileNames;
}

/** Renders the display layouts page, showing the components of the selected application's display layout.
 *
 * @param {HTMLElement} containerElement - The DOM element to render the display layouts page into.
 * @param {Object} appData - The application data containing resource values and other relevant information for rendering the components.
 * @param {Object} selectedFileNames - An object mapping data types to the filenames that should be selected by default in the filename filter dropdown.
 * @param {string} selectedFormType - The form type that should be selected by default in the form type filter dropdown (e.g., "main" for main form or the name of a subform).
 * @returns {Promise<void>} A promise that resolves when the display layouts page has been rendered.
 */
async function renderDisplayLayoutsPage(containerElement, appData, selectedFileNames, selectedFormType = "main") {
    const titleElement = document.createElement("h2");
    titleElement.textContent = "Display layouts";
    containerElement.appendChild(titleElement);

    const selectedDisplayLayoutAppName = globalThis.selectedDisplayLayoutAppName;
    const selectedDisplayLayoutAppOwner = globalThis.selectedDisplayLayoutAppOwner;
    renderSelectDisplayLayoutApplicationFilter(containerElement, selectedDisplayLayoutAppName, selectedDisplayLayoutAppOwner);

    const displayLayout = globalThis.displayLayouts.find(
        (layout) => layout.appName === selectedDisplayLayoutAppName && layout.appOwner === selectedDisplayLayoutAppOwner
    );

    if (!displayLayout) {
        const errorElement = document.createElement("p");
        errorElement.textContent = "Display layout not found.";
        containerElement.appendChild(errorElement);
        return;
    }

    selectedFileNames = setDefaultSelectedFileNameForDisplayLayouts(displayLayout, selectedFileNames, appData, selectedFormType);

    renderSelectDisplayLayoutFilenameFilter(containerElement, displayLayout, selectedFileNames, appData);
    renderSelectFormTypeFilter(containerElement, displayLayout, selectedFileNames, selectedFormType, appData);
    renderSelectSubFormDisplayLayoutFilenameFilter(containerElement, displayLayout, selectedFileNames, selectedFormType, appData);

    const components =
        selectedFormType === "main"
            ? displayLayout?.layout?.data?.layout || []
            : displayLayout?.subForms?.find((form) => form.appName === selectedFormType)?.layout?.data?.layout || [];

    const pageElement = document.createElement("div");
    pageElement.classList.add("page");
    const codeResultsElement = document.createElement("div");

    if (components.length === 0) {
        const noComponentsElement = document.createElement("p");
        noComponentsElement.textContent = "No components found in the selected display layout.";
        containerElement.appendChild(noComponentsElement);
        return;
    }

    const altinnStudioForms = globalThis.altinnStudioForms || (await fetchAltinnStudioForms());
    globalThis.altinnStudioForms = altinnStudioForms;

    const dataType = altinnStudioForms.find(
        (app) => app.appName === selectedDisplayLayoutAppName && app.appOwner === selectedDisplayLayoutAppOwner
    )?.dataType;

    const resultsElements = components
        .map((component) => {
            if (!component?.tagName) {
                return;
            }
            const formData = getDataForComponent(component, appData, dataType, selectedFileNames);
            const htmlAttributes = new CustomElementHtmlAttributes({
                ...component,
                formData
            });
            const containerElement = addContainerElement(createCustomElement(component?.tagName, htmlAttributes));
            if (component?.tagName === "custom-header-text") {
                containerElement.style.margin = "0 -.75rem";
            }
            return containerElement;
        })
        .filter((attr) => attr !== undefined);
    appendChildren(codeResultsElement, resultsElements);

    if (selectedFormType === "main") {
        const mainHeadingElement = getDisplayLayoutMainHeading();
        pageElement.appendChild(mainHeadingElement);
    }

    pageElement.appendChild(codeResultsElement);
    containerElement.appendChild(pageElement);
}

/**
 * Renders the admin sidebar with navigation buttons for different admin pages.
 *
 * This function creates a sidebar containing buttons for "Resource Usage",
 * "Package Versions", and "Display Layouts". When a button is clicked,
 * the corresponding page is rendered in the main admin area.
 *
 * Dependencies:
 * - Assumes the existence of elements with IDs "admin-main" and "sidebar" in the DOM.
 * - Assumes the existence of the functions: renderResourceUsagePage, renderPackageVersionsPage, and renderDisplayLayoutsPage.
 */
export function renderAdminSidebar() {
    const mainElement = document.getElementById("admin-main");
    const sidebarElement = document.getElementById("sidebar");

    const sidebarList = document.createElement("ul");

    const resourceUsageListItem = document.createElement("li");
    const resourceUsageButton = document.createElement("button");
    resourceUsageButton.textContent = "Resource usage";
    resourceUsageButton.onclick = () => {
        mainElement.innerHTML = "";
        renderResourceUsagePage(mainElement);
    };
    resourceUsageListItem.appendChild(resourceUsageButton);
    sidebarList.appendChild(resourceUsageListItem);

    const packageVersionsListItem = document.createElement("li");
    const packageVersionsButton = document.createElement("button");
    packageVersionsButton.textContent = "Package versions";
    packageVersionsButton.onclick = () => {
        mainElement.innerHTML = "";
        renderPackageVersionsPage(mainElement);
    };
    packageVersionsListItem.appendChild(packageVersionsButton);
    sidebarList.appendChild(packageVersionsListItem);

    const displayLayoutsListItem = document.createElement("li");
    const displayLayoutsButton = document.createElement("button");
    displayLayoutsButton.textContent = "Display layouts";
    displayLayoutsButton.onclick = async () => {
        mainElement.innerHTML = "";
        const exampleData = globalThis.exampleData || (await fetchExampleData());
        globalThis.exampleData = exampleData;
        renderDisplayLayoutsPage(mainElement, exampleData);
    };
    displayLayoutsListItem.appendChild(displayLayoutsButton);
    sidebarList.appendChild(displayLayoutsListItem);

    sidebarElement.appendChild(sidebarList);
}

/**
 * Displays a loading indicator with a progress percentage based on the completion of provided data fetch promises.
 * The indicator is appended to the document body and removed when all promises are resolved.
 *
 * @param {Promise<any>[]} dataFetchPromises - An array of promises representing data fetch operations.
 */
export function showLoadingIndicator(dataFetchPromises) {
    const loadingIndicator = document.createElement("div");
    loadingIndicator.classList.add("progress-indicator");

    const spinner = document.createElement("div");
    spinner.classList.add("spinner");
    loadingIndicator.appendChild(spinner);

    const loadingText = document.createElement("span");
    loadingText.textContent = "Loading... 0%";
    loadingIndicator.appendChild(loadingText);

    document.body.appendChild(loadingIndicator);

    let completedFetches = 0;
    const totalFetches = dataFetchPromises.length;

    dataFetchPromises.forEach((promise) => {
        promise.then(() => {
            completedFetches++;
            const progress = Math.round((completedFetches / totalFetches) * 100);
            loadingText.textContent = `Loading... ${progress}%`;

            if (completedFetches === totalFetches) {
                loadingIndicator.remove();
            }
        });
    });
}

/**
 * Renders a "Synchronize data" button and last updated timestamp in the sidebar.
 *
 * When the button is clicked, it fetches updated API data, stores it in localStorage,
 * updates the global context, and refreshes the last updated timestamp.
 *
 * Dependencies:
 * - Assumes existence of `getUpdatedApiData`, `addValueToLocalStorage`, `addValuesToLocalStorage`, and `addDataToGlobalThis` functions.
 * - Uses `globalThis.lastUpdated` for initial timestamp display.
 * - Expects an element with id "sidebar" to exist in the DOM.
 */
export function renderSynchronizeButton() {
    const sidebarElement = document.getElementById("sidebar");

    const synchronizeElementsContainer = document.createElement("div");
    synchronizeElementsContainer.classList.add("synchronize-container");

    sidebarElement.appendChild(synchronizeElementsContainer);

    const synchronizeButton = document.createElement("button");

    const lastUpdatedElement = document.createElement("span");
    lastUpdatedElement.classList.add("last-updated");
    const lastUpdated = globalThis.lastUpdated ? new Date(globalThis.lastUpdated) : null;
    lastUpdatedElement.textContent = lastUpdated ? `Last updated: ${lastUpdated.toLocaleString()}` : "Last updated: N/A";
    synchronizeElementsContainer.appendChild(lastUpdatedElement);

    synchronizeButton.textContent = "Synchronize data";
    synchronizeButton.onclick = async () => {
        const [defaultTextResources, displayLayouts, packageVersions, appResourceValues, exampleData] = await getUpdatedApiData();

        const lastUpdated = new Date().toISOString();
        addValueToLocalStorage("lastUpdated", lastUpdated);
        addValuesToLocalStorage({
            defaultTextResources,
            displayLayouts,
            packageVersions,
            appResourceValues,
            exampleData
        });
        addDataToGlobalThis({
            defaultTextResources,
            displayLayouts,
            packageVersions,
            appResourceValues,
            exampleData,
            lastUpdated
        });

        lastUpdatedElement.textContent = `Last updated: ${new Date(lastUpdated).toLocaleString()}`;
    };
    synchronizeElementsContainer.appendChild(synchronizeButton);
}
