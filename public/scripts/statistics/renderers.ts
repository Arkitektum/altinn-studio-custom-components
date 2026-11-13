import type { ApiData, ApiValue, FlattenedLayout, Layout } from "../types.ts";
import type { DisplayLayoutsOptions, StatisticsPageId } from "./pageLinks.ts";
import type { DisplayLayoutForDevTools } from "./openInDevTools.ts";
import type { UpgradePreviewOptions } from "./upgradePreview.ts";
// Dependencies
import { appendChildren } from "@arkitektum/altinn-studio-custom-components-utils";

// Local functions
import { addDataToGlobalThis, setSelectedLanguage } from "../localStorage.ts";
import {
    applyPageFilters,
    getDisplayLayoutsHash,
    getDisplayLayoutsOptions,
    getPageHash,
    parsePageHash,
    resetPageFilters,
    setLocationHash
} from "./pageLinks.ts";
import { applyTextResourcesForLanguage, getLocalTextResourcesForApp } from "./textResourceLanguage.ts";
import { fetchAltinnStudioForms, fetchApplicationMetadata, fetchExampleData, getUpdatedApiData } from "./apiHelpers.ts";
import {
    filterComponentsBySelectedFilters,
    renderComponentUsageList,
    renderSelectApplicationFilterForComponentUsageList,
    renderSelectComponentTypeFilterForComponentUsageList,
    renderSelectFormFilterForComponentUsageList,
    renderTextInputFilterForComponentUsageList,
    renderUsageFilterForComponentUsageList
} from "./componentUsageRenderers.ts";
import {
    filterDataModelBindingDriftBySelectedFilters,
    renderDataModelBindingDriftFilters,
    renderDataModelBindingDriftList
} from "./dataModelBindingRenderers.ts";
import {
    filterSubformDataModelDriftBySelectedFilters,
    renderSubformDataModelFilters,
    renderSubformDataModelList
} from "./subformDataModelRenderers.ts";
import {
    filterTextResourcesBySelectedFilters,
    renderDefaultTextResourcesList,
    renderSelectApplicationFilterForTextResourcesList,
    renderSelectFormFilterForTextResourcesList,
    renderTextInputFilterForTextResourcesList,
    renderUsageFilterForTextResourcesList
} from "../textResourceUsageRenderers.ts";
import { getInstalledVersion, renderUpgradePreview } from "./upgradePreview.ts";
import { drawLayoutComponents } from "./drawComponents.ts";
import { getAppEntries } from "./displayLayoutHelpers.ts";
import { getDevToolsWorkspaceForDisplayLayout } from "./openInDevTools.ts";
import { languages } from "../languages.ts";
import { renderDataAge } from "./dataAge.ts";
import { renderRenderHealthPage } from "./renderHealth.ts";
import { renderUnshownDataPage } from "./unshownData.ts";
import { setIconLabel } from "../icons.ts";
import { storeWorkspace } from "../devTools/workspace.ts";
import { updateBodyClassNamesForApplication } from "../../../src/functions/htmlElementHelpers.ts";

/**
 * How to draw the open page again, set by each page as it renders, and null until one has been opened.
 */
let drawOpenPageAgain: (() => void | Promise<void>) | null = null;

/**
 * Draws the open page again from the data on globalThis, keeping the choices made on it.
 *
 * Called after a synchronization, which replaces that data, so the open page shows the new data without being opened
 * again from the sidebar.
 *
 * @async
 * @returns {Promise<void>}
 */
export async function redrawOpenPage() {
    await drawOpenPageAgain?.();
    writeOpenPageHash();
}

/**
 * Which page is open, null until one has been.
 */
let openPageId: StatisticsPageId | null = null;

/**
 * Puts the open page's filter choices in the address. The display layouts page puts its own there each time it is drawn.
 */
export function writeOpenPageHash() {
    if (openPageId && openPageId !== "display-layouts") {
        setLocationHash(getPageHash(openPageId));
    }
}

/**
 * Renders the resource usage page by appending various filter controls and the default text resources list
 * to the specified container element. Utilizes global variables for resource usage data and layout information.
 *
 * Opened from the sidebar, every filter starts at its default. With `keepFilters` the filters keep the choices made
 * before, and the list is filtered by them, which is how the page is drawn again after a synchronization. A choice
 * that is no longer offered falls back to its default.
 *
 * @param {HTMLElement} containerElement - The DOM element to which the resource usage page components will be appended.
 * @param {Object} [options]
 * @param {boolean} [options.keepFilters] - Keep the filter choices made before rather than resetting them.
 */
export function renderResourceUsagePage(containerElement: HTMLElement, { keepFilters = false }: { keepFilters?: boolean } = {}) {
    openPageId = "resource-usage";
    drawOpenPageAgain = () => {
        containerElement.innerHTML = "";
        renderResourceUsagePage(containerElement, { keepFilters: true });
    };
    const allTextResourceUsage = globalThis.allTextResourceUsage;
    const applications = getAppEntries(globalThis.displayLayouts);

    // The filter controls start from their defaults (in pageFilters), so a fresh visit resets them. Left as they were, the controls would show
    // the last visit's choices while the list below showed everything.
    if (!keepFilters) {
        resetPageFilters("resource-usage");
    }

    const titleElement = document.createElement("h2");
    titleElement.textContent = "Resource usage";

    containerElement.appendChild(titleElement);
    containerElement.appendChild(renderUsageFilterForTextResourcesList(containerElement!, allTextResourceUsage));
    containerElement.appendChild(renderSelectApplicationFilterForTextResourcesList(containerElement!, allTextResourceUsage, applications));
    containerElement.appendChild(renderSelectFormFilterForTextResourcesList(containerElement!, allTextResourceUsage, applications));
    containerElement.appendChild(renderTextInputFilterForTextResourcesList(containerElement!, allTextResourceUsage));
    // Filtered only when the choices were kept. A fresh visit shows the whole list.
    const listedTextResources = keepFilters ? filterTextResourcesBySelectedFilters(allTextResourceUsage) : allTextResourceUsage;
    containerElement.appendChild(renderDefaultTextResourcesList(listedTextResources, allTextResourceUsage));
}

/**
 * Renders the data model bindings page: for each component that declares the bindings it reads, the uses whose layouts bind other keys, by app and layout.
 *
 * Opened from the sidebar, every filter starts at its default. With `keepFilters` the filters keep the choices made before, which is how the page is drawn again after a synchronization. A choice that is no longer offered falls back to its default.
 *
 * @param {HTMLElement} containerElement - The element the page is drawn in.
 * @param {Object} [options]
 * @param {boolean} [options.keepFilters] - Keep the filter choices made before rather than resetting them.
 */
export function renderDataModelBindingsPage(containerElement: HTMLElement, { keepFilters = false }: { keepFilters?: boolean } = {}) {
    openPageId = "data-model-bindings";
    drawOpenPageAgain = () => {
        containerElement.innerHTML = "";
        renderDataModelBindingsPage(containerElement, { keepFilters: true });
    };
    const dataModelBindingDrift = globalThis.dataModelBindingDrift;
    const applications = getAppEntries(globalThis.displayLayouts);

    if (!keepFilters) {
        resetPageFilters("data-model-bindings");
    }

    const titleElement = document.createElement("h2");
    titleElement.textContent = "Data model bindings";
    containerElement.appendChild(titleElement);
    containerElement.append(...renderDataModelBindingDriftFilters(containerElement, dataModelBindingDrift, applications));
    containerElement.appendChild(renderDataModelBindingDriftList(filterDataModelBindingDriftBySelectedFilters(dataModelBindingDrift)));
}

/**
 * Renders the subform data models page: for each subform, the variants its copies form across the apps carrying it, and the fields they disagree on.
 *
 * Opened from the sidebar, every filter starts at its default. With `keepFilters` the filters keep the choices made before, which is how the page is drawn again after a synchronization. A choice that is no longer offered falls back to its default.
 *
 * @param {HTMLElement} containerElement - The element the page is drawn in.
 * @param {Object} [options]
 * @param {boolean} [options.keepFilters] - Keep the filter choices made before rather than resetting them.
 */
export function renderSubformDataModelsPage(containerElement: HTMLElement, { keepFilters = false }: { keepFilters?: boolean } = {}) {
    openPageId = "subform-data-models";
    drawOpenPageAgain = () => {
        containerElement.innerHTML = "";
        renderSubformDataModelsPage(containerElement, { keepFilters: true });
    };
    const drift = globalThis.subformDataModelDrift;

    if (!keepFilters) {
        resetPageFilters("subform-data-models");
    }

    const titleElement = document.createElement("h2");
    titleElement.textContent = "Subform data models";
    containerElement.appendChild(titleElement);
    containerElement.append(...renderSubformDataModelFilters(containerElement, drift));
    containerElement.appendChild(renderSubformDataModelList(filterSubformDataModelDriftBySelectedFilters(drift)));
}

/**
 * Renders the component usage page by appending a title and a list of component usages to the specified container element. Utilizes global variables for component usage data.
 *
 * Opened from the sidebar, every filter starts at its default. With `keepFilters` the filters keep the choices made
 * before, and the list is filtered by them. A choice that is no longer offered falls back to its default.
 *
 * @param {HTMLElement} containerElement - The DOM element to which the component usage page components will be appended.
 * @param {Object} [options]
 * @param {boolean} [options.keepFilters] - Keep the filter choices made before rather than resetting them.
 */
export function renderComponentUsagePage(containerElement: HTMLElement, { keepFilters = false }: { keepFilters?: boolean } = {}) {
    openPageId = "component-usage";
    drawOpenPageAgain = () => {
        containerElement.innerHTML = "";
        renderComponentUsagePage(containerElement, { keepFilters: true });
    };
    const componentUsage = globalThis.componentUsage;
    const applications = getAppEntries(globalThis.displayLayouts);

    // The filter controls start from their defaults (in pageFilters), so a fresh visit resets them. Left as they were, the controls would show
    // the last visit's choices while the list below showed everything.
    if (!keepFilters) {
        resetPageFilters("component-usage");
    }

    const titleElement = document.createElement("h2");
    titleElement.textContent = "Component usage";
    containerElement.appendChild(titleElement);
    containerElement.appendChild(renderUsageFilterForComponentUsageList(containerElement!, componentUsage));
    containerElement.appendChild(renderSelectApplicationFilterForComponentUsageList(containerElement!, componentUsage, applications));
    containerElement.appendChild(renderSelectFormFilterForComponentUsageList(containerElement!, componentUsage, applications));
    containerElement.appendChild(renderSelectComponentTypeFilterForComponentUsageList(containerElement!, componentUsage));
    containerElement.appendChild(renderTextInputFilterForComponentUsageList(containerElement!, componentUsage));
    // Filtered only when the choices were kept. A fresh visit shows the whole list.
    containerElement.appendChild(renderComponentUsageList(keepFilters ? filterComponentsBySelectedFilters(componentUsage) : componentUsage));
}

/**
 * Parses a version string into an object containing major, minor, and patch numbers. The version string is expected to be in the format "major.minor.patch", where minor and patch are optional. If the version string is not in a valid format, the function returns null.
 *
 * @param {string} version - The version string to parse.
 * @returns {{major: number, minor: number, patch: number} | null} An object containing the major, minor, and patch numbers, or null if the version string is invalid.
 */
function parseVersion(version: string | undefined) {
    if (!version) return null;
    const match = new RegExp(/^(\d+)(?:\.(\d+))?(?:\.(\d+))?/).exec(String(version));
    if (!match) return null;
    return {
        major: Number.parseInt(match[1]!, 10),
        minor: Number.parseInt(match[2] ?? "0", 10),
        patch: Number.parseInt(match[3] ?? "0", 10)
    };
}

/**
 * Determines the CSS class for a version based on its comparison with the latest version.
 *
 * @param {string} version - The version string to compare.
 * @param {string} latestVersion - The latest version string to compare against.
 * @returns {string | null} The CSS class representing the version status, or null if the version strings are invalid.
 */
function getVersionColorClass(version: string | undefined, latestVersion: string | undefined) {
    const v = parseVersion(version);
    const latest = parseVersion(latestVersion);
    if (!v || !latest) return null;
    if (v.major < latest.major) return "version-outdated-major";
    if (v.major === latest.major && v.minor < latest.minor) return "version-outdated-minor";
    if (v.major === latest.major && v.minor === latest.minor && v.patch < latest.patch) return "version-outdated-patch";
    return null;
}

/**
 * Renders the package versions page, displaying the versions of the altinn-studio-custom-components package, the altinn-app-frontend assets and the Dibk.Ftpb.Common.AltinnApps NuGet package for all Altinn Studio apps.
 *
 * @param {HTMLElement} containerElement - The DOM element to render the package versions page into.
 */
export function renderPackageVersionsPage(containerElement: HTMLElement) {
    openPageId = "package-versions";
    drawOpenPageAgain = () => {
        containerElement.innerHTML = "";
        renderPackageVersionsPage(containerElement);
    };
    const titleElement = document.createElement("h2");
    titleElement.textContent = "Package versions";
    containerElement.appendChild(titleElement);

    const contentContainerElement = document.createElement("div");
    contentContainerElement.classList.add("content-container");

    const tableElement = document.createElement("table");
    tableElement.classList.add("table-dark");
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
    const dibkFtpbCommonAltinnAppsHeader = document.createElement("th");
    dibkFtpbCommonAltinnAppsHeader.textContent = "Dibk.Ftpb.Common.AltinnApps";

    headerRow.appendChild(appHeader);
    headerRow.appendChild(altinnStudioCustomComponentsHeader);
    headerRow.appendChild(altinnAppFrontendCSSHeader);
    headerRow.appendChild(altinnAppFrontendJSHeader);
    headerRow.appendChild(dibkFtpbCommonAltinnAppsHeader);
    tableHeaderElement.appendChild(headerRow);
    tableElement.appendChild(tableHeaderElement);

    const tableBodyElement = document.createElement("tbody");

    const versionCells = globalThis.packageVersions.map((app: ApiValue) => {
        const row = document.createElement("tr");
        const appCell = document.createElement("td");
        appCell.textContent = `${app.appOwner}/${app.appName}`;
        const altinnStudioCustomComponentsCell = document.createElement("td");
        altinnStudioCustomComponentsCell.textContent = app.packageVersions.altinnStudioCustomComponents || "N/A";
        const altinnAppFrontendCSSCell = document.createElement("td");
        altinnAppFrontendCSSCell.textContent = app.packageVersions.altinnAppFrontendCSS || "N/A";
        const altinnAppFrontendJSCell = document.createElement("td");
        altinnAppFrontendJSCell.textContent = app.packageVersions.altinnAppFrontendJS || "N/A";
        const dibkFtpbCommonAltinnAppsCell = document.createElement("td");
        dibkFtpbCommonAltinnAppsCell.textContent = app.packageVersions.dibkFtpbCommonAltinnApps || "N/A";

        row.appendChild(appCell);
        row.appendChild(altinnStudioCustomComponentsCell);
        row.appendChild(altinnAppFrontendCSSCell);
        row.appendChild(altinnAppFrontendJSCell);
        row.appendChild(dibkFtpbCommonAltinnAppsCell);
        tableBodyElement.appendChild(row);

        return {
            ccCell: altinnStudioCustomComponentsCell,
            cssCell: altinnAppFrontendCSSCell,
            jsCell: altinnAppFrontendJSCell,
            dibkCell: dibkFtpbCommonAltinnAppsCell,
            versions: app.packageVersions
        };
    });

    tableElement.appendChild(tableBodyElement);
    contentContainerElement.appendChild(tableElement);
    containerElement.appendChild(contentContainerElement);

    const latestPackageVersions = globalThis.latestPackageVersions;
    versionCells.forEach(({ ccCell, cssCell, jsCell, dibkCell, versions }: ApiValue) => {
        const ccClass = getVersionColorClass(versions.altinnStudioCustomComponents, latestPackageVersions.altinnStudioCustomComponents);
        if (ccClass) ccCell.classList.add(ccClass);
        const cssClass = getVersionColorClass(versions.altinnAppFrontendCSS, latestPackageVersions.altinnAppFrontend);
        if (cssClass) cssCell.classList.add(cssClass);
        const jsClass = getVersionColorClass(versions.altinnAppFrontendJS, latestPackageVersions.altinnAppFrontend);
        if (jsClass) jsCell.classList.add(jsClass);
        const dibkClass = getVersionColorClass(versions.dibkFtpbCommonAltinnApps, latestPackageVersions.dibkFtpbCommonAltinnApps);
        if (dibkClass) dibkCell.classList.add(dibkClass);
    });
}

/**
 * Renders a select dropdown to filter text resources by language. When the selected language changes, the display layouts page is re-rendered with the text resources for the selected language.
 * @param {HTMLElement} containerElement - The DOM element to which the filter form will be appended.
 * @param {Array} multilingualDefaultTextResources - An array of default text resources for multiple languages.
 * @param {Array} multilingualAppResourceValues - An array of application resource values for multiple languages.
 * @param {Object} selectedOptions - An object containing the selected options for the display layouts page, including file names, form type, language, display layout app name, and display layout app owner.
 * @param {Object} applicationMetadata - The metadata for the application, including information about the application's structure and configuration.
 * @return {void}
 */
function renderSelectLanguageForResources(
    containerElement: HTMLElement,
    multilingualDefaultTextResources: ApiValue,
    multilingualAppResourceValues: ApiValue,
    selectedOptions: ApiValue,
    applicationMetadata: ApiValue
) {
    const formElement = document.createElement("form");
    formElement.classList.add("filter-container");
    const labelElement = document.createElement("label");
    labelElement.textContent = "Language";
    labelElement.setAttribute("for", "select-language-for-resources");

    const selectElement = document.createElement("select");
    selectElement.id = "select-language-for-resources";

    languages.forEach((language: { code: string; name: string }) => {
        const optionElement = document.createElement("option");
        optionElement.value = language.code;
        optionElement.textContent = language.name;
        if (language.code === selectedOptions.language) {
            optionElement.selected = true;
        }
        selectElement.appendChild(optionElement);
    });

    selectElement.onchange = async (event: Event) => {
        const selectedLanguage = (event.target as HTMLInputElement).value;
        applyTextResourcesForLanguage(
            multilingualDefaultTextResources,
            multilingualAppResourceValues,
            selectedLanguage,
            selectedOptions.displayLayoutAppOwner,
            selectedOptions.displayLayoutAppName
        );
        selectedOptions.language = selectedLanguage;
        const mainElement = document.getElementById("admin-main");
        mainElement!.innerHTML = "";
        await renderDisplayLayoutsPage(mainElement!, globalThis.exampleData, applicationMetadata, selectedOptions);
    };

    formElement.appendChild(labelElement);
    formElement.appendChild(selectElement);
    containerElement.appendChild(formElement);
}

/** Renders a filter for selecting an application and displays the corresponding display layout components.
 *
 * @param {HTMLElement} containerElement - The DOM element to render the display layouts page into.
 * @param {Object} selectedOptions - An object containing the selected options for the display layouts page, including file names, form type, language, display layout app name, and display layout app owner.
 * @param {Object} applicationMetadata - The metadata for the application, including information about the application's structure and configuration.
 */
function renderSelectDisplayLayoutApplicationFilter(containerElement: HTMLElement, selectedOptions: ApiValue, applicationMetadata: ApiValue) {
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

    const mainFormDisplayLayouts = getAppEntries(globalThis.displayLayouts);

    mainFormDisplayLayouts.forEach((layout: Layout | undefined) => {
        const optionElement = document.createElement("option");
        optionElement.value = `${layout!.appOwner}/${layout!.appName}`;
        optionElement.textContent = `${layout!.appOwner}/${layout!.appName}`;
        if (layout!.appName === selectedOptions.displayLayoutAppName && layout!.appOwner === selectedOptions.displayLayoutAppOwner) {
            optionElement.selected = true;
        }
        selectElement.appendChild(optionElement);
    });

    selectElement.onchange = async (event: Event) => {
        const [appOwner, appName] = (event.target as HTMLInputElement).value.split("/");
        selectedOptions.displayLayoutAppName = appName;
        selectedOptions.displayLayoutAppOwner = appOwner;
        // Reset the per-application selections so a form type / data file from the previously selected application
        // isn't carried over to one that doesn't have it (which would leave nothing to render). They fall back to the
        // first entry in each list: "main" resolves to the first display layout, and empty fileNames get defaulted
        // to the first available data file by setDefaultSelectedFileNameForDisplayLayouts.
        selectedOptions.formType = "main";
        selectedOptions.fileNames = {};
        updateBodyClassNamesForApplication(appOwner, appName);
        const exampleData = globalThis.exampleData || (await fetchExampleData());
        const localTextResources = getLocalTextResourcesForApp(appName, appOwner, globalThis.appResourceValues);
        addDataToGlobalThis({
            exampleData,
            textResources: localTextResources
        });
        const mainElement = document.getElementById("admin-main");
        mainElement!.innerHTML = "";
        await renderDisplayLayoutsPage(mainElement!, exampleData, applicationMetadata, selectedOptions);
    };

    formElement.appendChild(labelElement);
    formElement.appendChild(selectElement);
    containerElement.appendChild(formElement);
}

/**
 * Finds the example data for one data type, as seen by one app.
 *
 * Example data is keyed on the app and not only on the data type, because the API reads the main form examples from
 * the FtPB testmotor, which is keyed by app id: dibk/fa-v3 and dibk/fa-v5 are both filed under the data type FA and
 * hold different files, so matching on the data type alone would show one of them the other's examples.
 *
 * A subform's examples are matched the same way. The testmotor files them per app, so each app declaring a subform has
 * an entry of its own for it, and two apps can hold different files for the same subform.
 *
 * @param {Array<Object>} exampleData - The /api/exampleData payload.
 * @param {Object} displayLayout - The selected display layout, naming the app with `appOwner` and `appName`.
 * @param {string} dataType - The data type wanted.
 * @returns {Object|undefined} The entry, or undefined when there is none for this data type.
 */
export function findExampleDataForApp(exampleData: ApiValue, displayLayout: FlattenedLayout | undefined, dataType: string | undefined) {
    if (!Array.isArray(exampleData) || !dataType) {
        return undefined;
    }
    return exampleData.find(
        (entry) => entry.dataType === dataType && entry.appName === displayLayout?.appName && entry.appOwner === displayLayout?.appOwner
    );
}

/**
 * The file names one entry offers, in the order they are meant to be offered in.
 *
 * Read off the array rather than off object keys: the ordering prefix is stripped from the names before they reach
 * here, so the array is the only thing that still carries the order.
 *
 * @param {Object} [exampleDataEntry]
 * @returns {string[]}
 */
function getExampleFileNames(exampleDataEntry: ApiValue) {
    return exampleDataEntry?.files?.map((file: ApiValue) => file.name) ?? [];
}

/**
 * Says so when example data could not be fetched, rather than rendering nothing.
 *
 * "This data type has no examples" and "the examples could not be fetched" are different answers, and only one of
 * them is a problem worth chasing, so the second is said out loud rather than left as a picker with no dropdown.
 *
 * @param {HTMLElement} containerElement - Where to append the message.
 * @param {Object} [exampleDataEntry] - The entry, which carries `error` when there was one.
 * @param {string} dataType - The data type the message is about.
 * @returns {boolean} Whether a message was rendered, in which case there is no dropdown to render.
 */
export function renderExampleDataError(containerElement: HTMLElement, exampleDataEntry: ApiValue, dataType: string | undefined) {
    if (!exampleDataEntry?.error) {
        return false;
    }
    const errorElement = document.createElement("p");
    errorElement.textContent = `Example data for ${dataType} could not be fetched: ${exampleDataEntry.error}`;
    containerElement.appendChild(errorElement);
    return true;
}

/**
 * The example data in the shape getDataForComponent expects: one entry per data type, files keyed by name.
 *
 * Only the app's own entries are kept, its subforms among them, so each data type appears once and the data-type
 * matching inside getDataForComponent, which takes the first model with a matching data type, finds this app's data.
 * An entry naming no app is left out: it would be another app's copy of a subform, and coming first it would win.
 *
 * @param {Array<Object>} exampleData - The /api/exampleData payload.
 * @param {Object} displayLayout - The selected display layout, naming the app.
 * @returns {Array<{dataType: string, data: Object}>}
 */
export function getDataModelsForApp(exampleData: ApiValue, displayLayout: FlattenedLayout | undefined) {
    if (!Array.isArray(exampleData)) {
        return [];
    }
    return exampleData
        .filter((entry: ApiValue) => entry.appName === displayLayout?.appName && entry.appOwner === displayLayout?.appOwner)
        .map((entry: ApiValue) => ({
            dataType: entry.dataType,
            data: Object.fromEntries((entry.files ?? []).map((file: ApiValue) => [file.name, file.data]))
        }));
}

/**
 * Renders a select dropdown to filter display layouts by filename.
 *
 * @param {HTMLElement} containerElement - The DOM element to which the filter form will be appended.
 * @param {Object} displayLayout - The current display layout object, expected to have a `dataType` property.
 * @param {Object} selectedFileNames - An object mapping data types to the filenames that should be selected by default in the dropdown.
 * @param {Array<Object>} appData - The /api/exampleData payload: one entry per app and one per subform each app declares, each with a `dataType`, the app it belongs to, and an ordered `files` array.
 * @param {Object} applicationMetadata - The metadata for the application, including information about the application's structure and configuration.
 * @returns {void}
 */
function renderSelectDisplayLayoutFilenameFilter(
    containerElement: HTMLElement,
    displayLayout: FlattenedLayout | undefined,
    selectedOptions: ApiValue,
    appData: ApiValue,
    applicationMetadata: ApiValue
) {
    if (!displayLayout) {
        return;
    }

    const dataType = displayLayout?.dataType;
    const appExampleData = findExampleDataForApp(appData, displayLayout, dataType);
    if (renderExampleDataError(containerElement!, appExampleData, dataType)) {
        return;
    }

    const files = getExampleFileNames(appExampleData);

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

    files.forEach((file: ApiValue) => {
        const optionElement = document.createElement("option");
        optionElement.value = file;
        optionElement.textContent = file;
        if (file === selectedOptions?.fileNames?.[dataType!]) {
            optionElement.selected = true;
        }
        selectElement.appendChild(optionElement);
    });

    selectElement.onchange = async (event: Event) => {
        const fileName = (event.target as HTMLInputElement).value;
        const mainElement = document.getElementById("admin-main");
        mainElement!.innerHTML = "";
        await renderDisplayLayoutsPage(mainElement!, appData, applicationMetadata, {
            ...selectedOptions,
            fileNames: { ...selectedOptions.fileNames, [dataType!]: fileName }
        });
    };

    formElement.appendChild(labelElement);
    formElement.appendChild(selectElement);
    containerElement.appendChild(formElement);
}

/**
 * The prefix used to encode a main display layout selection in the `formType` option (e.g. "layout:DisplayLayout").
 * Subform selections use the subform's `appName` as the `formType` value.
 */
const LAYOUT_FORM_TYPE_PREFIX = "layout:";

/**
 * Resolves which main display layout a `formType` value refers to.
 * Falls back to the first display layout when the `formType` is the legacy/default "main", empty, or unknown.
 *
 * @param {Object} displayLayout - The app display layout object, expected to have a `displayLayouts` array.
 * @param {string} formType - The selected form type value.
 * @returns {Object|null} The matching display layout ({ name, path, layout }), or null if none exist.
 */
function getDisplayLayoutByFormType(displayLayout: FlattenedLayout | undefined, formType: string | undefined) {
    const displayLayouts = displayLayout?.displayLayouts || [];
    if (!displayLayouts.length) {
        return null;
    }
    if (typeof formType === "string" && formType.startsWith(LAYOUT_FORM_TYPE_PREFIX)) {
        const layoutName = formType.slice(LAYOUT_FORM_TYPE_PREFIX.length);
        return displayLayouts.find((layout: Layout | undefined) => layout!.name === layoutName) || null;
    }
    return displayLayouts[0];
}

/**
 * Finds the subform that a `formType` value refers to, if any.
 *
 * @param {Object} displayLayout - The app display layout object, expected to have a `subForms` array.
 * @param {string} formType - The selected form type value.
 * @returns {Object|undefined} The matching subform, or undefined when the form type is a main display layout.
 */
function getSubFormByFormType(displayLayout: FlattenedLayout | undefined, formType: string | undefined) {
    return displayLayout?.subForms?.find((form: ApiValue) => form.appName === formType);
}

/**
 * Normalizes a `formType` value to its canonical option value, so the correct dropdown option is selected.
 * Subform selections keep their `appName`; main layout selections are normalized to "layout:<name>".
 *
 * @param {Object} displayLayout - The app display layout object.
 * @param {string} formType - The selected form type value.
 * @returns {string} The canonical form type value.
 */
function getSelectedFormType(displayLayout: FlattenedLayout | undefined, formType: string | undefined) {
    if (getSubFormByFormType(displayLayout, formType)) {
        return formType;
    }
    const selectedLayout = getDisplayLayoutByFormType(displayLayout, formType);
    return selectedLayout ? `${LAYOUT_FORM_TYPE_PREFIX}${selectedLayout.name}` : formType;
}

/**
 * Renders a select dropdown to choose between an app's display layouts and its subforms.
 * The options list each named display layout followed by each subform. The selector is only rendered when there
 * is more than one thing to choose between. When the selection changes, the display layouts page is re-rendered.
 *
 * @param {HTMLElement} containerElement - The DOM element to which the filter form will be appended.
 * @param {Object} displayLayout - The current app display layout object, with `displayLayouts` and optional `subForms` arrays.
 * @param {Object} selectedOptions - An object containing the selected options for the display layouts page, including file names, form type, language, display layout app name, and display layout app owner.
 * @param {Array<Object>} appData - The /api/exampleData payload: one entry per app and one per subform each app declares, each with a `dataType`, the app it belongs to, and an ordered `files` array.
 * @param {Object} applicationMetadata - The metadata for the application, including information about the application's structure and configuration.
 *
 * @return {void}
 */
function renderSelectFormTypeFilter(
    containerElement: HTMLElement,
    displayLayout: FlattenedLayout | undefined,
    selectedOptions: ApiValue,
    appData: ApiValue,
    applicationMetadata: ApiValue
) {
    const displayLayouts = displayLayout?.displayLayouts || [];
    const subForms = displayLayout?.subForms || [];
    // Only offer the selector when there is more than one layout/subform to choose between.
    if (displayLayouts.length + subForms.length <= 1) {
        return;
    }

    const formElement = document.createElement("form");
    formElement.classList.add("filter-container");
    const labelElement = document.createElement("label");
    labelElement.textContent = "Form type";
    labelElement.setAttribute("for", "select-form-type");

    const selectElement = document.createElement("select");
    selectElement.id = "select-form-type";

    const selectedFormType = getSelectedFormType(displayLayout, selectedOptions.formType);

    displayLayouts.forEach((layout: Layout | undefined) => {
        const optionElement = document.createElement("option");
        const value = `${LAYOUT_FORM_TYPE_PREFIX}${layout!.name}`;
        optionElement.value = value;
        optionElement.textContent = layout!.name;
        if (value === selectedFormType) {
            optionElement.selected = true;
        }
        selectElement.appendChild(optionElement);
    });

    subForms.forEach((subForm: ApiValue) => {
        const optionElement = document.createElement("option");
        optionElement.value = subForm.appName;
        optionElement.textContent = `${subForm.appName} (subform)`;
        if (subForm.appName === selectedFormType) {
            optionElement.selected = true;
        }
        selectElement.appendChild(optionElement);
    });

    selectElement.onchange = async (event: Event) => {
        const formType = (event.target as HTMLInputElement).value;
        const mainElement = document.getElementById("admin-main");
        mainElement!.innerHTML = "";
        await renderDisplayLayoutsPage(mainElement!, appData, applicationMetadata, { ...selectedOptions, formType });
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
 * @param {Object} selectedOptions - An object containing the selected options for the display layouts page, including file names, form type, language, display layout app name, and display layout app owner.
 * @param {Array<Object>} appData - The /api/exampleData payload: one entry per app and one per subform each app declares, each with a `dataType`, the app it belongs to, and an ordered `files` array.
 * @param {Object} applicationMetadata - The metadata for the application, including information about the application's structure and configuration.
 *
 * @return {void}
 */
function renderSelectSubFormDisplayLayoutFilenameFilter(
    containerElement: HTMLElement,
    displayLayout: FlattenedLayout | undefined,
    selectedOptions: ApiValue,
    appData: ApiValue,
    applicationMetadata: ApiValue
) {
    const subForm = getSubFormByFormType(displayLayout, selectedOptions.formType);
    if (!subForm) {
        return;
    }
    const dataType = subForm?.dataType;
    const appExampleData = findExampleDataForApp(appData, displayLayout, dataType);
    if (renderExampleDataError(containerElement!, appExampleData, dataType)) {
        return;
    }
    const files = getExampleFileNames(appExampleData);
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
    files.forEach((file: ApiValue) => {
        const optionElement = document.createElement("option");
        optionElement.value = file;
        optionElement.textContent = file;
        if (file === selectedOptions.fileNames?.[dataType]) {
            optionElement.selected = true;
        }
        selectElement.appendChild(optionElement);
    });
    selectElement.onchange = async (event: Event) => {
        const fileName = (event.target as HTMLInputElement).value;
        const mainElement = document.getElementById("admin-main");
        mainElement!.innerHTML = "";
        await renderDisplayLayoutsPage(mainElement!, appData, applicationMetadata, {
            ...selectedOptions,
            fileNames: { ...selectedOptions.fileNames, [dataType!]: fileName }
        });
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
export function getDisplayLayoutMainHeading() {
    const localAppResources = globalThis.textResources as ApiValue;
    const headingElement = document.createElement("h1");
    const headingResourceId = "appName";
    const headingText = localAppResources?.resources?.find((res: ApiValue) => res.id === headingResourceId)?.value;
    headingElement.textContent = headingText || "Display layout";
    return headingElement;
}

/**
 * Sets the default selected file name for the display layout filters based on the provided display layout, selected options, application data, and selected form type.
 *
 * This function checks if there is a selected file name for the data type associated with the display layout. If not, it retrieves the example data for the display layout's data type and sets the default selected file name to the first file in the example data.
 *
 * @param {Object} displayLayout - The display layout object, expected to have a `dataType` property and optionally a `subForms` property which is an array of subform objects.
 * @param {Object} selectedOptions - An object containing the selected options for the display layouts page, including file names, form type, language, display layout app name, and display layout app owner.
 * @param {Array<Object>} appData - The /api/exampleData payload: one entry per app and one per subform each app declares, each with a `dataType`, the app it belongs to, and an ordered `files` array.
 *
 * @returns {Object} An updated object mapping data types to the filenames that should be selected by default.
 */
export function setDefaultSelectedFileNameForDisplayLayouts(
    displayLayout: FlattenedLayout | undefined,
    appData: ApiValue,
    selectedOptions: ApiValue
) {
    const selectedSubForm = getSubFormByFormType(displayLayout, selectedOptions.formType);
    const dataType = selectedSubForm ? selectedSubForm.dataType : displayLayout?.dataType;
    if (!dataType) {
        return selectedOptions.fileNames;
    }
    const appExampleData = findExampleDataForApp(appData, displayLayout, dataType);
    const files = getExampleFileNames(appExampleData);
    if (files.length === 0) {
        return selectedOptions.fileNames;
    }
    // A file chosen before a synchronization that no longer has it falls back to the first, like an unchosen one.
    if (!files.includes(selectedOptions.fileNames?.[dataType])) {
        return { ...selectedOptions.fileNames, [dataType]: files[0] };
    }
    return selectedOptions.fileNames;
}

/**
 * Retrieves the metadata for a specific application based on the provided app name and app owner.
 *
 * @param {string} appName - The name of the application.
 * @param {string} appOwner - The owner of the application.
 * @param {Array<Object>} applicationMetadata - An array of application metadata objects.
 * @returns {Object|null} The metadata for the specified application, or null if not found.
 */
export function getApplicationMetadataForSelectedApp(
    appName: string | null | undefined,
    appOwner: string | null | undefined,
    applicationMetadata: ApiValue
) {
    return applicationMetadata.find((app: ApiValue) => {
        return app.appName === appName && app.appOwner === appOwner;
    })?.metadata;
}

/**
 * Sanitizes a path segment by ensuring it contains only alphanumeric characters, underscores, or hyphens. If the input value is not a string or does not match the expected pattern, the function returns null.
 *
 * @param {string} value - The path segment to sanitize.
 * @returns {string|null} The sanitized path segment if valid, or null if the input is invalid.
 */
function sanitizePathSegment(value: ApiValue) {
    if (typeof value !== "string") {
        return null;
    }
    const trimmed = value.trim();
    return /^[A-Za-z0-9_-]+$/.test(trimmed) ? trimmed : null;
}

/**
 * Sanitizes a logo filename by ensuring it is a plain file name with a valid image extension (svg, png, jpg, jpeg, webp) and does not contain any path segments. If the input value is not a string or does not match the expected pattern, the function returns null.
 *
 * @param {string} value - The logo filename to sanitize.
 * @returns {string|null} The sanitized logo filename if valid, or null if the input is invalid.
 */
function sanitizeLogoFilename(value: ApiValue) {
    if (typeof value !== "string") {
        return null;
    }
    const trimmed = value.trim();
    // Allow plain file names only (no slashes), with common image extensions.
    return /^[A-Za-z0-9._-]+\.(svg|png|jpe?g|webp)$/i.test(trimmed) ? trimmed : null;
}

/**
 * Renders the logo image for the selected application based on the provided application metadata and selected options.
 *
 * @param {HTMLElement} containerElement - The DOM element to render the logo image into.
 * @param {Array<Object>} applicationMetadata - An array of application metadata objects.
 * @param {Object} selectedOptions - An object containing the selected options for the display layouts page, including display layout app name and display layout app owner.
 */
export function renderLogoImage(containerElement: HTMLElement, applicationMetadata: ApiValue, selectedOptions: ApiValue) {
    const appOwner = sanitizePathSegment(selectedOptions.displayLayoutAppOwner);
    const appName = sanitizePathSegment(selectedOptions.displayLayoutAppName);
    const applicationMetadataForSelectedApp = getApplicationMetadataForSelectedApp(appName, appOwner, applicationMetadata);
    const logoSourceType = applicationMetadataForSelectedApp?.logo?.source; // resource or org

    const logoImageElement = document.createElement("img");
    const imagePath = appOwner ? `/assets/images/orgs/${appOwner}/` : null;

    if (logoSourceType === "resource" && appName && appOwner && imagePath) {
        const localTextResources = getLocalTextResourcesForApp(appName, appOwner, globalThis.appResourceValues);
        const logoFilename = sanitizeLogoFilename(localTextResources?.resources?.find((res: ApiValue) => res.id === "appLogo.url")?.value);
        if (logoFilename) {
            logoImageElement.src = `${imagePath}${logoFilename}`;
        }
    } else if (logoSourceType === "org" && appOwner && imagePath) {
        logoImageElement.src = `${imagePath}${appOwner}.svg`;
    }
    logoImageElement.alt = `${appOwner || "Application"} logo`;
    logoImageElement.classList.add("logo-image");
    containerElement.appendChild(logoImageElement);
}

/** Renders the display layouts page, showing the components of the selected application's display layout.
 *
 * @param {HTMLElement} containerElement - The DOM element to render the display layouts page into.
 * @param {Object} appData - The application data containing resource values and other relevant information for rendering the components.
 * @param {Array<Object>} applicationMetadata - An array of application metadata objects.
 * @param {Object} selectedOptions - An object containing the selected options for the display layouts page, including file names, form type, language, display layout app name, and display layout app owner.
 * @returns {Promise<void>} A promise that resolves when the display layouts page has been rendered.
 */
async function renderDisplayLayoutsPage(containerElement: HTMLElement, appData: ApiValue, applicationMetadata: ApiValue, selectedOptions?: ApiValue) {
    selectedOptions = {
        fileNames: selectedOptions?.fileNames || {},
        formType: selectedOptions?.formType || "main",
        language: selectedOptions?.language || "nb",
        displayLayoutAppName: selectedOptions?.displayLayoutAppName || null,
        displayLayoutAppOwner: selectedOptions?.displayLayoutAppOwner || null
    };
    openPageId = "display-layouts";
    setLocationHash(getDisplayLayoutsHash(selectedOptions));
    // The text resources for the chosen language are on globalThis, and a synchronization puts the default language
    // back there, so they are set up again before the page is.
    const optionsToDrawAgainWith = selectedOptions;
    const drawThisPageAgain = async () => {
        applyTextResourcesForLanguage(
            globalThis.multilingualDefaultTextResources,
            globalThis.multilingualAppResourceValues,
            optionsToDrawAgainWith.language,
            optionsToDrawAgainWith.displayLayoutAppOwner,
            optionsToDrawAgainWith.displayLayoutAppName
        );
        containerElement.innerHTML = "";
        await renderDisplayLayoutsPage(containerElement, globalThis.exampleData, globalThis.applicationMetadata, optionsToDrawAgainWith);
    };
    drawOpenPageAgain = drawThisPageAgain;
    const titleElement = document.createElement("h2");
    titleElement.textContent = "Display layouts";
    containerElement.appendChild(titleElement);

    renderSelectLanguageForResources(
        containerElement,
        globalThis.multilingualDefaultTextResources,
        globalThis.multilingualAppResourceValues,
        selectedOptions,
        applicationMetadata
    );

    const selectedDisplayLayoutAppName = selectedOptions.displayLayoutAppName;
    const selectedDisplayLayoutAppOwner = selectedOptions.displayLayoutAppOwner;
    renderSelectDisplayLayoutApplicationFilter(containerElement!, selectedOptions, applicationMetadata);

    const displayLayout = globalThis.displayLayouts.find(
        (layout: ApiValue) => layout.appName === selectedDisplayLayoutAppName && layout.appOwner === selectedDisplayLayoutAppOwner
    );

    if (!displayLayout) {
        const errorElement = document.createElement("p");
        errorElement.textContent = "Display layout not found.";
        containerElement.appendChild(errorElement);
        return;
    }

    selectedOptions.fileNames = setDefaultSelectedFileNameForDisplayLayouts(displayLayout, appData, selectedOptions);
    setLocationHash(getDisplayLayoutsHash(selectedOptions));

    renderSelectDisplayLayoutFilenameFilter(containerElement!, displayLayout, selectedOptions, appData, applicationMetadata);
    renderSelectFormTypeFilter(containerElement!, displayLayout, selectedOptions, appData, applicationMetadata);
    renderSelectSubFormDisplayLayoutFilenameFilter(containerElement!, displayLayout, selectedOptions, appData, applicationMetadata);

    const selectedSubForm = getSubFormByFormType(displayLayout, selectedOptions.formType);
    const components = selectedSubForm
        ? selectedSubForm?.layout?.data?.layout || []
        : getDisplayLayoutByFormType(displayLayout, selectedOptions.formType)?.layout?.data?.layout || [];

    const pageElement = document.createElement("div");
    pageElement.classList.add("page");
    const codeResultsElement = document.createElement("div");

    renderLogoImage(pageElement, applicationMetadata, selectedOptions);

    if (components.length === 0) {
        const noComponentsElement = document.createElement("p");
        noComponentsElement.textContent = "No components found in the selected display layout.";
        containerElement.appendChild(noComponentsElement);
        return;
    }

    const altinnStudioForms = globalThis.altinnStudioForms || (await fetchAltinnStudioForms());
    globalThis.altinnStudioForms = altinnStudioForms;
    // Another page, or this one with other choices, was opened while the forms were fetched, and has the container.
    if (drawOpenPageAgain !== drawThisPageAgain) {
        return;
    }

    const dataType = altinnStudioForms.find(
        (app: ApiValue) => app.appName === selectedDisplayLayoutAppName && app.appOwner === selectedDisplayLayoutAppOwner
    )?.dataType;

    // Built once rather than per component, and narrowed to this app before the data types inside it are matched.
    const dataModels = getDataModelsForApp(appData, displayLayout);

    const drawnComponents = drawLayoutComponents(components, dataModels, dataType, selectedOptions.fileNames);
    const resultsElements = drawnComponents.map(({ element }) => element);
    // Taken before the elements are put in the page and draw themselves, so the upgrade preview gets the elements with their data and nothing drawn.
    const componentsHtml = resultsElements.map((element) => element.outerHTML).join("");
    appendChildren(codeResultsElement, resultsElements);

    if (!selectedSubForm) {
        const mainHeadingElement = getDisplayLayoutMainHeading();
        pageElement.appendChild(mainHeadingElement);
    }

    pageElement.appendChild(codeResultsElement);
    const actionsElement = renderOpenInDevToolsButton(
        {
            appOwner: selectedDisplayLayoutAppOwner,
            appName: selectedDisplayLayoutAppName,
            components,
            dataModels,
            mainDataType: dataType,
            fileNames: selectedOptions.fileNames,
            multilingualAppResourceValues: globalThis.multilingualAppResourceValues || []
        },
        selectedSubForm ? selectedSubForm.appName : getDisplayLayoutByFormType(displayLayout, selectedOptions.formType)?.name,
        selectedOptions.language
    );
    const previewElement = document.createElement("section");
    previewElement.classList.add("upgrade-preview");
    previewElement.hidden = true;
    actionsElement.appendChild(
        renderUpgradePreviewButton(previewElement, pageElement, {
            version: getInstalledVersion(globalThis.packageVersions, selectedDisplayLayoutAppOwner, selectedDisplayLayoutAppName),
            componentsHtml,
            componentNames: drawnComponents.map(({ component }) => component.id || component.tagName || ""),
            textResources: globalThis.textResources,
            localDefaultTextResources: globalThis.defaultTextResources,
            language: selectedOptions.language
        })
    );
    containerElement.append(actionsElement, previewElement, pageElement);
}

/**
 * Renders the button that compares the drawn form with the version of the package the app has installed, in place of the drawing, and back again.
 * Without a known installed version it is disabled and says why.
 *
 * @param {HTMLElement} previewElement - Where the comparison is shown.
 * @param {HTMLElement} pageElement - The drawing, hidden while the comparison shows.
 * @param {Object} options - What to compare, see renderUpgradePreview, with the installed version undefined when it is not known.
 * @returns {HTMLButtonElement} The button.
 */
export function renderUpgradePreviewButton(
    previewElement: HTMLElement,
    pageElement: HTMLElement,
    options: Omit<UpgradePreviewOptions, "version"> & { version: string | undefined }
) {
    const buttonElement = document.createElement("button");
    buttonElement.type = "button";
    buttonElement.classList.add("upgrade-preview-button");
    const { version } = options;
    const compareLabel = version ? `Compare with ${version}` : "Compare with installed version";
    setIconLabel(buttonElement, "package", compareLabel);
    if (!version) {
        buttonElement.disabled = true;
        buttonElement.title = "The app's installed version of the package is not known. Synchronize to read it from the app.";
        return buttonElement;
    }
    buttonElement.title = `Draw this form with version ${version}, which the app has installed, beside the local build`;
    buttonElement.onclick = async () => {
        if (!previewElement.hidden) {
            previewElement.hidden = true;
            previewElement.replaceChildren();
            pageElement.hidden = false;
            setIconLabel(buttonElement, "package", compareLabel);
            return;
        }
        previewElement.hidden = false;
        pageElement.hidden = true;
        setIconLabel(buttonElement, "package", "Close comparison");
        await renderUpgradePreview(previewElement, { ...options, version });
    };
    return buttonElement;
}

/**
 * Renders the button that opens the drawn form in devTools, in a new tab, after confirming that it replaces the devTools workspace.
 * devTools is given the form's components, the chosen example data and the app's text resources, and the language chosen here.
 *
 * @param {DisplayLayoutForDevTools} displayLayout - What the page draws.
 * @param {string} [formName] - The form's name, for the confirmation.
 * @param {string} language - The language chosen on the page.
 * @returns {HTMLElement} The button, in a container of its own.
 */
export function renderOpenInDevToolsButton(displayLayout: DisplayLayoutForDevTools, formName: string | undefined, language: string) {
    const containerElement = document.createElement("div");
    containerElement.classList.add("open-in-devtools");
    const buttonElement = document.createElement("button");
    buttonElement.type = "button";
    buttonElement.classList.add("open-in-devtools-button");
    setIconLabel(buttonElement, "layout", "Open in devTools");
    buttonElement.onclick = () => {
        const form = `${displayLayout.appOwner}/${displayLayout.appName}${formName ? ` (${formName})` : ""}`;
        if (
            !confirm(
                `Replace the layout code, data models and text resources in devTools with ${form}? Export the devTools workspace first to keep what is there.`
            )
        ) {
            return;
        }
        storeWorkspace(getDevToolsWorkspaceForDisplayLayout(displayLayout));
        setSelectedLanguage(language);
        globalThis.open("/devTools", "_blank", "noopener");
    };
    containerElement.appendChild(buttonElement);
    return containerElement;
}

/**
 * Renders the admin sidebar with navigation buttons for different admin pages.
 *
 * The sidebar has a button for each page: Resource usage, Component usage, Data model bindings, Subform data models,
 * Package versions, Display layouts, Render health and Unshown data. A click renders that page in the main admin area, and puts it in the address.
 * A filter changed on the open page is put in the address too.
 *
 * Expects elements with the ids "admin-main" and "sidebar" in the DOM.
 */
export function renderAdminSidebar() {
    const mainElement = document.getElementById("admin-main");
    const sidebarElement = document.getElementById("sidebar");

    const sidebarList = document.createElement("ul");
    const pages: [StatisticsPageId, Parameters<typeof setIconLabel>[1], string][] = [
        ["resource-usage", "book", "Resource usage"],
        ["component-usage", "components", "Component usage"],
        ["data-model-bindings", "link", "Data model bindings"],
        ["subform-data-models", "database", "Subform data models"],
        ["package-versions", "package", "Package versions"],
        ["display-layouts", "layout", "Display layouts"],
        ["render-health", "health", "Render health"],
        ["unshown-data", "hidden", "Unshown data"]
    ];
    for (const [pageId, icon, label] of pages) {
        const listItem = document.createElement("li");
        const button = document.createElement("button");
        setIconLabel(button, icon, label);
        button.onclick = () => openStatisticsPage(pageId);
        listItem.appendChild(button);
        sidebarList.appendChild(listItem);
    }

    // A filter control changes its global before the event reaches the page, so the address is written from the choices just made.
    mainElement?.addEventListener("change", writeOpenPageHash);
    mainElement?.addEventListener("input", writeOpenPageHash);

    sidebarElement!.appendChild(sidebarList);
}

/**
 * Opens a page. From the sidebar its filters start at their defaults and it gets an entry in the history. From an address its filters are those in the address.
 *
 * @param {StatisticsPageId} pageId - The page.
 * @param {Object} [options]
 * @param {URLSearchParams} [options.params] - The filter choices in the address the page is opened from.
 * @returns {Promise<void>}
 */
export async function openStatisticsPage(pageId: StatisticsPageId, { params }: { params?: URLSearchParams } = {}) {
    const mainElement = document.getElementById("admin-main")!;
    mainElement.innerHTML = "";
    const fromAddress = params !== undefined;
    if (fromAddress) {
        applyPageFilters(pageId, params);
    } else {
        setLocationHash(`#/${pageId}`, { newEntry: true });
    }
    const options = { keepFilters: fromAddress };
    switch (pageId) {
        case "resource-usage":
            renderResourceUsagePage(mainElement, options);
            break;
        case "component-usage":
            renderComponentUsagePage(mainElement, options);
            break;
        case "data-model-bindings":
            renderDataModelBindingsPage(mainElement, options);
            break;
        case "subform-data-models":
            renderSubformDataModelsPage(mainElement, options);
            break;
        case "package-versions":
            renderPackageVersionsPage(mainElement);
            break;
        case "display-layouts":
            await openDisplayLayoutsPage(mainElement, params ? getDisplayLayoutsOptions(params) : undefined);
            return;
        case "render-health":
            openPageId = "render-health";
            drawOpenPageAgain = () => {
                mainElement.innerHTML = "";
                renderRenderHealthPage(mainElement);
            };
            renderRenderHealthPage(mainElement);
            break;
        case "unshown-data":
            openPageId = "unshown-data";
            drawOpenPageAgain = () => {
                mainElement.innerHTML = "";
                renderUnshownDataPage(mainElement);
            };
            renderUnshownDataPage(mainElement);
            break;
    }
    writeOpenPageHash();
}

/**
 * Opens the page the address names, with the choices in it. An address that names no page leaves the open page as it is.
 *
 * @returns {Promise<void>}
 */
export async function openPageFromLocation() {
    const page = parsePageHash(globalThis.location.hash);
    if (page) {
        await openStatisticsPage(page.pageId, { params: page.params });
    }
}

/**
 * Opens the display layouts page, fetching the example data and application metadata first when they are not loaded.
 *
 * @param {HTMLElement} mainElement - The element the page is drawn in.
 * @param {DisplayLayoutsOptions} [selectedOptions] - The choices to open it with, from an address.
 * @returns {Promise<void>}
 */
async function openDisplayLayoutsPage(mainElement: HTMLElement, selectedOptions?: DisplayLayoutsOptions) {
    openPageId = "display-layouts";
    // Marks this page as the one opening, so a page opened while the data below is fetched keeps the container.
    const opening = () => {};
    drawOpenPageAgain = opening;
    try {
        const exampleData = globalThis.exampleData || (await fetchExampleData());
        const applicationMetadata = globalThis.applicationMetadata || (await fetchApplicationMetadata());
        if (drawOpenPageAgain !== opening) {
            return;
        }
        globalThis.exampleData = exampleData;
        globalThis.applicationMetadata = applicationMetadata;
        if (selectedOptions?.language) {
            applyTextResourcesForLanguage(
                globalThis.multilingualDefaultTextResources,
                globalThis.multilingualAppResourceValues,
                selectedOptions.language,
                selectedOptions.displayLayoutAppOwner ?? undefined,
                selectedOptions.displayLayoutAppName ?? undefined
            );
        }
        await renderDisplayLayoutsPage(mainElement, exampleData, applicationMetadata, selectedOptions);
    } catch (error) {
        console.error("Could not open the display layouts page:", error);
    }
}

export function renderNoDataMessage(onRetry: () => void) {
    const mainElement = document.getElementById("admin-main");
    if (!mainElement) {
        return;
    }
    const messageElement = document.createElement("div");
    messageElement.classList.add("paper", "no-data-message");

    const headingElement = document.createElement("h2");
    headingElement.textContent = "No data yet";
    messageElement.appendChild(headingElement);

    const textElement = document.createElement("p");
    textElement.textContent =
        "The first synchronization could not fetch everything the tools need, so there is nothing to show yet. Check that the API is running, then try again.";
    messageElement.appendChild(textElement);

    const retryButton = document.createElement("button");
    retryButton.type = "button";
    retryButton.textContent = "Try again";
    retryButton.onclick = () => {
        messageElement.remove();
        onRetry();
    };
    messageElement.appendChild(retryButton);

    mainElement.appendChild(messageElement);
}

/**
 * Keeps the age under the Synchronize button current, replaced when the button is drawn again.
 */
let dataAgeTimer: ReturnType<typeof setInterval> | undefined;

/**
 * Renders a "Synchronize data" button in the sidebar, with how long ago the data was synchronized under it, marked as stale after STALE_AFTER_DAYS.
 *
 * When the button is clicked, it fetches updated API data, hands it and when it was fetched to `onSynchronized`, and
 * shows the new age. Storing the data and working out what the pages read from it is
 * `onSynchronized`'s job, which is `storeApiData` and `applyApiData` in the dev tools, so a sync and a page load do
 * exactly the same.
 *
 * Uses `globalThis.lastUpdated` for the initial timestamp, and expects an element with id "sidebar" in the DOM.
 *
 * @param {Function} [onSynchronized] - Called with the fetched data and when it was fetched. The button stays disabled until what it returns has settled, and the age under the button changes only if it succeeds.
 */
export function renderSynchronizeButton(onSynchronized: (apiData: ApiData, lastUpdated: string) => unknown = () => {}) {
    const sidebarElement = document.getElementById("sidebar");

    const synchronizeElementsContainer = document.createElement("div");
    synchronizeElementsContainer.classList.add("synchronize-container");

    sidebarElement!.appendChild(synchronizeElementsContainer);

    const synchronizeButton = document.createElement("button");

    const lastUpdatedElement = document.createElement("span");
    lastUpdatedElement.classList.add("last-updated");
    renderDataAge(lastUpdatedElement, globalThis.lastUpdated);
    synchronizeElementsContainer.appendChild(lastUpdatedElement);
    // Kept current while the page stays open, so data left for days reads as days old.
    clearInterval(dataAgeTimer);
    dataAgeTimer = setInterval(() => renderDataAge(lastUpdatedElement, globalThis.lastUpdated), 60 * 1000);

    synchronizeButton.textContent = "Synchronize data";
    synchronizeButton.onclick = async () => {
        // One synchronization at a time, from the first request until onSynchronized has stored and applied the data.
        // A second click in that time would start another set of requests and open a second progress panel over the
        // first.
        synchronizeButton.disabled = true;
        synchronizeButton.textContent = "Synchronizing…";
        try {
            let apiData;
            try {
                apiData = await getUpdatedApiData();
            } catch {
                // The progress panel already says which request failed and why. Nothing is stored, so the tools keep
                // the data they had.
                return;
            }
            const [
                displayLayouts,
                packageVersions,
                latestPackageVersions,
                multilingualAppResourceValues,
                exampleData,
                applicationMetadata,
                subformDataModels
            ] = apiData;

            const lastUpdated = new Date().toISOString();
            await onSynchronized(
                {
                    displayLayouts,
                    packageVersions,
                    latestPackageVersions,
                    multilingualAppResourceValues,
                    exampleData,
                    applicationMetadata,
                    subformDataModels
                },
                lastUpdated
            );

            renderDataAge(lastUpdatedElement, lastUpdated);
        } catch (error) {
            console.error("Could not apply the synchronized data:", error);
        } finally {
            synchronizeButton.disabled = false;
            synchronizeButton.textContent = "Synchronize data";
        }
    };
    synchronizeElementsContainer.appendChild(synchronizeButton);
}
