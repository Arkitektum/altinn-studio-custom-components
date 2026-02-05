// Classes
import CustomElementHtmlAttributes from "../../src/classes/system-classes/CustomElementHtmlAttributes.js";

// Global functions
import { addContainerElement, appendChildren, createCustomElement } from "../../src/functions/helpers.js";

// Local functions
import { getDataForComponent } from "./getters.js";
import {
    renderDefaultTextResourcesList,
    renderRadioButtonsFilterForTextResourcesList,
    renderSelectApplicationFilterForTextResourcesList,
    renderTextInputFilterForTextResourcesList
} from "./textResourceUsageRenderers.js";

function renderResourceUsagePage(containerElement) {
    const allTextResourceUsage = globalThis.allTextResourceUsage;
    const displayLayouts = globalThis.displayLayouts;
    containerElement.appendChild(renderRadioButtonsFilterForTextResourcesList(containerElement, allTextResourceUsage));
    containerElement.appendChild(renderSelectApplicationFilterForTextResourcesList(containerElement, allTextResourceUsage, displayLayouts));
    containerElement.appendChild(renderTextInputFilterForTextResourcesList(containerElement, allTextResourceUsage));
    containerElement.appendChild(renderDefaultTextResourcesList(allTextResourceUsage, allTextResourceUsage));
}

function renderPackageVersionsPage(containerElement) {
    const titleElement = document.createElement("h2");
    titleElement.textContent = "Package Versions";
    containerElement.appendChild(titleElement);

    const tableElement = document.createElement("table");
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
    tableElement.appendChild(headerRow);

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
        tableElement.appendChild(row);
    });

    containerElement.appendChild(tableElement);
}

function renderSelectDisplayLayoutApplicationFilter(containerElement, selectedAppName, selectedAppOwner) {
    const formElement = document.createElement("form");
    formElement.classList.add("filter-container");
    const labelElement = document.createElement("label");
    labelElement.textContent = "Select Application: ";
    labelElement.setAttribute("for", "select-display-layout-application");

    const selectElement = document.createElement("select");
    selectElement.id = "select-display-layout-application";

    globalThis.displayLayouts.forEach((layout) => {
        const optionElement = document.createElement("option");
        optionElement.value = `${layout.appOwner}/${layout.appName}`;
        optionElement.textContent = `${layout.appOwner}/${layout.appName}`;
        if (layout.appName === selectedAppName && layout.appOwner === selectedAppOwner) {
            optionElement.selected = true;
        }
        selectElement.appendChild(optionElement);
    });

    selectElement.onchange = (event) => {
        const [appOwner, appName] = event.target.value.split("/");
        globalThis.selectedDisplayLayoutAppOwner = appOwner;
        globalThis.selectedDisplayLayoutAppName = appName;
        const mainElement = document.getElementById("admin-main");
        mainElement.innerHTML = "";
        renderDisplayLayoutsPage(mainElement);
    };

    formElement.appendChild(labelElement);
    formElement.appendChild(selectElement);
    containerElement.appendChild(formElement);
}

function renderDisplayLayoutsPage(containerElement) {
    const selectedDisplayLayoutAppName = globalThis.selectedDisplayLayoutAppName
        ? globalThis.selectedDisplayLayoutAppName
        : globalThis.displayLayouts[0].appName;
    const selectedDisplayLayoutAppOwner = globalThis.selectedDisplayLayoutAppOwner
        ? globalThis.selectedDisplayLayoutAppOwner
        : globalThis.displayLayouts[0].appOwner;
    renderSelectDisplayLayoutApplicationFilter(containerElement, selectedDisplayLayoutAppName, selectedDisplayLayoutAppOwner);

    const displayLayout = globalThis.displayLayouts.find(
        (layout) => layout.appName === selectedDisplayLayoutAppName && layout.appOwner === selectedDisplayLayoutAppOwner
    );

    const titleElement = document.createElement("h2");
    titleElement.textContent = `Display Layout: ${selectedDisplayLayoutAppOwner}/${selectedDisplayLayoutAppName}`;
    containerElement.appendChild(titleElement);

    if (!displayLayout) {
        const errorElement = document.createElement("p");
        errorElement.textContent = "Display layout not found.";
        containerElement.appendChild(errorElement);
        return;
    }

    const components = displayLayout?.layout?.data?.layout || [];

    const pageElement = document.createElement("div");
    pageElement.classList.add("page");
    const codeResultsElement = document.createElement("div");

    if (components.length === 0) {
        const noComponentsElement = document.createElement("p");
        noComponentsElement.textContent = "No components found in the selected display layout.";
        containerElement.appendChild(noComponentsElement);
        return;
    }
    const resultsElements = components
        .map((component) => {
            if (!component?.tagName) {
                return;
            }
            const data = getDataForComponent(component);
            const htmlAttributes = new CustomElementHtmlAttributes({
                ...component,
                formData: data
            });
            const containerElement = addContainerElement(createCustomElement(component?.tagName, htmlAttributes));
            if (component?.tagName === "custom-header-text") {
                containerElement.style.margin = "0 -.75rem";
            }
            return containerElement;
        })
        .filter((attr) => attr !== undefined);
    appendChildren(codeResultsElement, resultsElements);

    pageElement.appendChild(codeResultsElement);
    containerElement.appendChild(pageElement);
}

export function renderAdminSidebar() {
    const mainElement = document.getElementById("admin-main");
    const sidebarElement = document.getElementById("sidebar");

    const sidebarList = document.createElement("ul");

    const resourceUsageListItem = document.createElement("li");
    const resourceUsageButton = document.createElement("button");
    resourceUsageButton.textContent = "Resource Usage";
    resourceUsageButton.onclick = () => {
        mainElement.innerHTML = "";
        renderResourceUsagePage(mainElement);
    };
    resourceUsageListItem.appendChild(resourceUsageButton);
    sidebarList.appendChild(resourceUsageListItem);

    const packageVersionsListItem = document.createElement("li");
    const packageVersionsButton = document.createElement("button");
    packageVersionsButton.textContent = "Package Versions";
    packageVersionsButton.onclick = () => {
        mainElement.innerHTML = "";
        renderPackageVersionsPage(mainElement);
    };
    packageVersionsListItem.appendChild(packageVersionsButton);
    sidebarList.appendChild(packageVersionsListItem);

    const displayLayoutsListItem = document.createElement("li");
    const displayLayoutsButton = document.createElement("button");
    displayLayoutsButton.textContent = "Display Layouts";
    displayLayoutsButton.onclick = () => {
        mainElement.innerHTML = "";
        renderDisplayLayoutsPage(mainElement);
    };
    displayLayoutsListItem.appendChild(displayLayoutsButton);
    sidebarList.appendChild(displayLayoutsListItem);

    sidebarElement.appendChild(sidebarList);
}
