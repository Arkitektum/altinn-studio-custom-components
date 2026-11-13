import type { ApiValue, LayoutComponent } from "../types.ts";
import type { LayoutFinding } from "./layoutChecks.ts";
// Dependencies
import {
    CustomElementHtmlAttributes,
    addContainerElement,
    appendChildren,
    createCustomElement,
    getDataForComponent
} from "@arkitektum/altinn-studio-custom-components-utils";

// Local functions
import {
    addDataModel,
    addValueToLocalStorage,
    getDataModels,
    getLayoutCode,
    getSelectedLanguage,
    getTextResources,
    getTextResourcesStorageKey,
    setSelectedLanguage
} from "../localStorage.ts";
import { closeValidationDialog, openValidationDialog, setActiveSidebarElement, updateDataInputElement } from "../UI.ts";
import { getCodeInputElementForLayoutCode, getCodeInputElementForTextResources, getDataModelListElements } from "../getters.ts";
import { renderValidationMessages, validateResources } from "../validators.ts";
import { applyLanguage } from "./language.ts";
import { checkLayoutComponents } from "./layoutChecks.ts";

// Global functions
import { languages } from "../languages.ts";
import { renderFeedbackListElement } from "../../../src/functions/feedbackHelpers.ts";
import { setIconLabel } from "../icons.ts";

/**
 * Renders the results by generating and displaying custom components based on the current layout code.
 *
 * This function retrieves the layout code, processes it into an array of components, and for each component:
 * - Retrieves its associated data.
 * - Constructs the appropriate HTML attributes.
 * - Creates a custom element and wraps it in a container.
 *
 * The resulting elements are then appended to the container element with the ID "code-results".
 */
export function renderResults() {
    const componentCode = getLayoutCode();

    const components = Array.isArray(componentCode) ? componentCode : [componentCode];

    const containerElement = document.getElementById("code-results");
    containerElement!.innerHTML = "";
    const dataModels = getDataModels();
    const resultsElements = components
        .map((component: LayoutComponent | undefined) => {
            if (!component?.tagName) {
                return;
            }
            const data = getDataForComponent(component, dataModels);
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
        .filter((attr: ApiValue) => attr !== undefined);
    appendChildren(containerElement!, resultsElements);
    renderLayoutFindings();
}

/**
 * Renders the language picker for the sidebar. Choosing a language stores it, puts its text resources on globalThis, and draws the sidebar, the preview and the text resource counts again.
 * An open editor stays open, and the text resources editor is filled with the chosen language's text resources.
 *
 * @returns {HTMLElement} The picker.
 */
export function renderLanguagePicker() {
    const containerElement = document.createElement("div");
    containerElement.classList.add("language-picker");
    const labelElement = document.createElement("label");
    labelElement.setAttribute("for", "devtools-language");
    labelElement.textContent = "Language";
    const selectElement = document.createElement("select");
    selectElement.id = "devtools-language";
    const selectedLanguage = getSelectedLanguage();
    for (const { code, name } of languages) {
        const optionElement = document.createElement("option");
        optionElement.value = code;
        optionElement.textContent = name;
        optionElement.selected = code === selectedLanguage;
        selectElement.appendChild(optionElement);
    }
    selectElement.onchange = function () {
        const activeItemId = document.querySelector("#sidebar li.active")?.id;
        setSelectedLanguage(selectElement.value);
        applyLanguage(selectElement.value);
        renderSidebar();
        renderResults();
        renderTextResourceStatusIndicators(validateResources());
        if (activeItemId === "text-resources-code") {
            updateDataInputElement(getCodeInputElementForTextResources());
        }
        if (activeItemId) {
            setActiveSidebarElement(activeItemId);
        }
        document.getElementById("devtools-language")?.focus();
    };
    containerElement.append(labelElement, selectElement);
    return containerElement;
}

/**
 * Checks the layout code against what each component reads and the loaded data models, then shows the counts in the sidebar and the findings above the layout code editor when it is open.
 */
export function renderLayoutFindings() {
    const layoutCode = getLayoutCode();
    const components = Array.isArray(layoutCode) ? layoutCode : [layoutCode];
    const findings = checkLayoutComponents(components, getDataModels());
    renderLayoutFindingsIndicators(findings);
    renderLayoutFindingsPanel(findings);
}

/**
 * Shows the number of warnings and of information findings on the layout code item in the sidebar.
 *
 * @param {Array} findings - The layout findings.
 */
export function renderLayoutFindingsIndicators(findings: LayoutFinding[]) {
    const indicatorsContainerElement = document.getElementById("layout-findings-indicators");
    if (!indicatorsContainerElement) return;
    indicatorsContainerElement.innerHTML = "";
    const warningsCount = findings.filter((finding) => finding.severity === "warning").length;
    const infoCount = findings.filter((finding) => finding.severity === "info").length;
    for (const [count, className, label] of [
        [warningsCount, "unused", "warnings"],
        [infoCount, "empty", "notes"]
    ] as [number, string, string][]) {
        const indicatorElement = document.createElement("span");
        indicatorElement.classList.add("status-indicator", count === 0 ? "success" : className);
        indicatorElement.textContent = String(count);
        indicatorElement.title = `${count} ${label}`;
        indicatorsContainerElement.appendChild(indicatorElement);
    }
}

/**
 * Lists the layout findings above the layout code editor, when that editor is open and there is something to list.
 * Whether the list was folded is kept from the one it replaces.
 *
 * @param {Array} findings - The layout findings.
 */
export function renderLayoutFindingsPanel(findings: LayoutFinding[]) {
    const dataInputElement = document.getElementById("data-input");
    const layoutCodeInputElement = dataInputElement?.querySelector('#code-input[data-editor="layout"]');
    const previousPanelElement = dataInputElement?.querySelector(".layout-findings") as HTMLDetailsElement | null | undefined;
    const wasOpen = previousPanelElement ? previousPanelElement.open : true;
    previousPanelElement?.remove();
    if (!layoutCodeInputElement || !findings.length) return;

    const panelElement = document.createElement("details");
    panelElement.classList.add("layout-findings");
    panelElement.open = wasOpen;
    const warningsCount = findings.filter((finding) => finding.severity === "warning").length;
    const infoCount = findings.length - warningsCount;
    const summaryElement = document.createElement("summary");
    summaryElement.textContent = `Layout check: ${warningsCount} ${warningsCount === 1 ? "warning" : "warnings"}, ${infoCount} ${infoCount === 1 ? "note" : "notes"}`;
    panelElement.appendChild(summaryElement);

    const listElement = document.createElement("ul");
    for (const finding of findings) {
        const itemElement = document.createElement("li");
        itemElement.classList.add(finding.severity);
        const componentElement = document.createElement("strong");
        componentElement.textContent = finding.component;
        itemElement.append(componentElement, ` ${finding.message}`);
        listElement.appendChild(itemElement);
    }
    panelElement.appendChild(listElement);
    layoutCodeInputElement.before(panelElement);
}

/**
 * Renders status indicators for text resource validation results.
 *
 * Updates the DOM element with id "text-resource-status-indicators" to display
 * the counts of missing, unused, and empty text resources, each with a corresponding
 * status indicator.
 *
 * @param {Object} validationResults - The validation results for text resources.
 * @param {Array} validationResults.missingResourceBindings - List of missing resource bindings.
 * @param {Array} validationResults.unusedResourceBindings - List of unused resource bindings.
 * @param {Array} validationResults.literalValues - List of literal values.
 * @param {Array} validationResults.emptyTextResources - List of empty text resources.
 */
export function renderTextResourceStatusIndicators(validationResults: ApiValue) {
    const statusIndicatorsContainerElement = document.getElementById("text-resource-status-indicators");
    statusIndicatorsContainerElement!.innerHTML = "";

    const resourceErrorsCount = validationResults.missingResourceBindings.length + validationResults.duplicateTextResources.length;
    const resourceWarningsCount = validationResults.unusedResourceBindings.length + validationResults.literalValues.length;
    const resourceInfoCount = validationResults.emptyTextResources.length;

    const resourceErrorsIndicator = document.createElement("span");
    resourceErrorsIndicator.classList.add("status-indicator", resourceErrorsCount === 0 ? "success" : "missing");
    resourceErrorsIndicator.innerHTML = resourceErrorsCount;
    statusIndicatorsContainerElement!.appendChild(resourceErrorsIndicator);

    const resourceWarningsIndicator = document.createElement("span");
    resourceWarningsIndicator.classList.add("status-indicator", resourceWarningsCount === 0 ? "success" : "unused");
    resourceWarningsIndicator.innerHTML = resourceWarningsCount;
    statusIndicatorsContainerElement!.appendChild(resourceWarningsIndicator);

    const resourceInfoIndicator = document.createElement("span");
    resourceInfoIndicator.classList.add("status-indicator", resourceInfoCount === 0 ? "success" : "empty");
    resourceInfoIndicator.innerHTML = resourceInfoCount;
    statusIndicatorsContainerElement!.appendChild(resourceInfoIndicator);
}

/**
 * Renders the sidebar UI, including layout code, text resources, data model list, and related actions.
 *
 * The sidebar includes:
 * - Layout code button to edit layout code.
 * - Text resources button with validation and management options (validate, order, remove unused/duplicates).
 * - Data model list and button to add new data models.
 *
 * This function manipulates the DOM directly to construct the sidebar and attaches event handlers for user interactions.
 */
export function renderSidebar() {
    const sidebarElement = document.getElementById("sidebar");
    sidebarElement!.innerHTML = "";

    sidebarElement!.appendChild(renderLanguagePicker());

    const fileListElement = document.createElement("ul");
    fileListElement.id = "file-list";
    fileListElement.classList.add("file-list");

    // Layout code
    const layoutCodeItemId = "layout-code";
    const layoutCodeListElement = document.createElement("li");
    layoutCodeListElement.id = layoutCodeItemId;
    const openLayoutCodeEditor = function () {
        const codeInputElement = getCodeInputElementForLayoutCode();
        updateDataInputElement(codeInputElement);
        setActiveSidebarElement(layoutCodeItemId);
        renderLayoutFindings();
    };
    const layoutCodeButtonsContainerElement = document.createElement("div");
    layoutCodeButtonsContainerElement.classList.add("buttons-container");
    const layoutCodeButtonElement = document.createElement("button");
    setIconLabel(layoutCodeButtonElement, "layout", "Layout code");
    layoutCodeButtonElement.onclick = openLayoutCodeEditor;
    const layoutCodeOptionButtonsContainerElement = document.createElement("div");
    layoutCodeOptionButtonsContainerElement.classList.add("option-buttons-container");
    const layoutFindingsButtonElement = document.createElement("button");
    layoutFindingsButtonElement.classList.add("layout-findings-button");
    layoutFindingsButtonElement.setAttribute("aria-label", "Show the layout check");
    layoutFindingsButtonElement.onclick = openLayoutCodeEditor;
    const layoutFindingsIndicatorsElement = document.createElement("div");
    layoutFindingsIndicatorsElement.id = "layout-findings-indicators";
    layoutFindingsIndicatorsElement.classList.add("status-indicators-container");
    layoutFindingsButtonElement.appendChild(layoutFindingsIndicatorsElement);
    layoutCodeOptionButtonsContainerElement.appendChild(layoutFindingsButtonElement);
    layoutCodeButtonsContainerElement.append(layoutCodeButtonElement, layoutCodeOptionButtonsContainerElement);
    layoutCodeListElement.appendChild(layoutCodeButtonsContainerElement);
    fileListElement.appendChild(layoutCodeListElement);

    // Text resources code
    const textResourcesItemId = "text-resources-code";
    const textResourcesCodeListElement = document.createElement("li");
    textResourcesCodeListElement.id = textResourcesItemId;

    const buttonsContainerElement = document.createElement("div");
    buttonsContainerElement.classList.add("buttons-container");

    const textResourcesCodeButtonElement = document.createElement("button");
    setIconLabel(textResourcesCodeButtonElement, "book", "Text resources");
    textResourcesCodeButtonElement.onclick = function () {
        const codeInputElement = getCodeInputElementForTextResources();
        updateDataInputElement(codeInputElement);
        setActiveSidebarElement(textResourcesItemId);
    };

    // Option buttons
    const optionButtonsContainerElement = document.createElement("div");
    optionButtonsContainerElement.classList.add("option-buttons-container");

    // Status indicators
    const statusIndicatorsContainerElement = document.createElement("div");
    statusIndicatorsContainerElement.id = "text-resource-status-indicators";
    statusIndicatorsContainerElement.classList.add("status-indicators-container");

    const validateTextResourcesButtonElement = document.createElement("button");
    validateTextResourcesButtonElement.classList.add("validate-text-resources-button");
    validateTextResourcesButtonElement.onclick = function () {
        // Open validation dialog
        const validationResults = validateResources();
        const feedbackMessages = renderValidationMessages(validationResults);
        const contentElement = document.createElement("div");
        const feedbackListElement = renderFeedbackListElement(feedbackMessages);
        contentElement.appendChild(feedbackListElement);

        // Add button to order resources alphabetically by ID
        const orderResourcesAlphabeticallyByIdButtonElement = document.createElement("button");
        orderResourcesAlphabeticallyByIdButtonElement.classList.add("order-resources-alphabetically-button");
        setIconLabel(orderResourcesAlphabeticallyByIdButtonElement, "sort", "Order by ID");
        orderResourcesAlphabeticallyByIdButtonElement.onclick = function () {
            const currentTextResourcesValue = getTextResources();
            const orderedResources = [...currentTextResourcesValue.resources].sort((a, b) => a.id.localeCompare(b.id));
            const updatedTextResourcesValue = {
                ...currentTextResourcesValue,
                resources: orderedResources
            };
            const updatedResourcesJson = JSON.stringify(updatedTextResourcesValue, null, 2);
            addValueToLocalStorage(getTextResourcesStorageKey(), updatedResourcesJson);
            const textResourcesInputElement = getCodeInputElementForTextResources();
            updateDataInputElement(textResourcesInputElement);
            setActiveSidebarElement(textResourcesItemId);
            closeValidationDialog();
            renderResults();
            renderTextResourceStatusIndicators(validationResults);
        };
        contentElement.appendChild(orderResourcesAlphabeticallyByIdButtonElement);

        if (validationResults?.duplicateTextResources?.length) {
            const removeDuplicateResourcesButtonElement = document.createElement("button");
            removeDuplicateResourcesButtonElement.classList.add("remove-duplicate-resources-button");
            setIconLabel(removeDuplicateResourcesButtonElement, "trash", "Remove duplicates");
            removeDuplicateResourcesButtonElement.onclick = function () {
                const currentTextResourcesValue = getTextResources();
                const duplicateResourceIds = validationResults.duplicateTextResources;
                const seenIds = new Set();
                const updatedTextResourcesValue = {
                    ...currentTextResourcesValue,
                    resources: currentTextResourcesValue.resources.filter((res: ApiValue) => {
                        if (duplicateResourceIds.includes(res.id)) {
                            if (seenIds.has(res.id)) {
                                return false;
                            } else {
                                seenIds.add(res.id);
                                return true;
                            }
                        }
                        return true;
                    })
                };
                const updatedResourcesJson = JSON.stringify(updatedTextResourcesValue, null, 2);
                addValueToLocalStorage(getTextResourcesStorageKey(), updatedResourcesJson);
                const textResourcesInputElement = getCodeInputElementForTextResources();
                updateDataInputElement(textResourcesInputElement);
                setActiveSidebarElement(textResourcesItemId);
                closeValidationDialog();
                renderResults();
                renderTextResourceStatusIndicators({
                    ...validationResults,
                    duplicateTextResources: []
                });
            };
            contentElement.appendChild(removeDuplicateResourcesButtonElement);
        }

        if (validationResults.unusedResourceBindings.length) {
            // Add button to remove unused resources from text resources and update the code input element accordingly
            const removeUnusedResourcesButtonElement = document.createElement("button");
            removeUnusedResourcesButtonElement.classList.add("remove-unused-resources-button");
            setIconLabel(removeUnusedResourcesButtonElement, "trash", "Remove unused");
            removeUnusedResourcesButtonElement.onclick = function () {
                const currentTextResourcesValue = getTextResources();
                const unusedResourceIds = validationResults.unusedResourceBindings;
                const updatedTextResourcesValue = {
                    ...currentTextResourcesValue,
                    resources: currentTextResourcesValue.resources.filter((res: ApiValue) => !unusedResourceIds.includes(res.id))
                };
                const updatedResourcesJson = JSON.stringify(updatedTextResourcesValue, null, 2);
                addValueToLocalStorage(getTextResourcesStorageKey(), updatedResourcesJson);
                const textResourcesInputElement = getCodeInputElementForTextResources();
                updateDataInputElement(textResourcesInputElement);
                setActiveSidebarElement(textResourcesItemId);
                closeValidationDialog();
                renderResults();
                renderTextResourceStatusIndicators({ ...validationResults, unusedResourceBindings: [] });
            };
            contentElement.appendChild(removeUnusedResourcesButtonElement);
        }

        openValidationDialog(contentElement);
    };

    validateTextResourcesButtonElement.appendChild(statusIndicatorsContainerElement);
    optionButtonsContainerElement.appendChild(validateTextResourcesButtonElement);

    buttonsContainerElement.appendChild(textResourcesCodeButtonElement);
    buttonsContainerElement.appendChild(optionButtonsContainerElement);
    textResourcesCodeListElement.appendChild(buttonsContainerElement);
    fileListElement.appendChild(textResourcesCodeListElement);

    sidebarElement!.appendChild(fileListElement);

    sidebarElement!.appendChild(getDataModelListElements());

    const addDataModelButtonElement = document.createElement("button");
    addDataModelButtonElement.id = "add-data-model-button";
    addDataModelButtonElement.innerHTML = "Add Data Model";
    addDataModelButtonElement.classList.add("add-button");
    addDataModelButtonElement.onclick = function () {
        addDataModel();
        renderSidebar();
    };
    sidebarElement!.appendChild(addDataModelButtonElement);
    renderLayoutFindings();
}
