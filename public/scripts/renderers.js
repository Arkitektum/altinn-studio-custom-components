// Classes
import CustomElementHtmlAttributes from "../../src/classes/system-classes/CustomElementHtmlAttributes.js";
import { renderFeedbackListElement } from "../../src/functions/feedbackHelpers.js";

// Global function
import { addContainerElement, appendChildren, createCustomElement } from "../../src/functions/helpers.js";

// Local functions
import {
    getCodeInputElementForLayoutCode,
    getCodeInputElementForTextResources,
    getDataForComponent,
    getDataModelListElements,
    getDefaultValueForResource
} from "./getters.js";
import { addDataModel, addValueToLocalStorage, getLayoutCode, getTextResources } from "./localStorage.js";
import { closeValidationDialog, openValidationDialog, setActiveSidebarElement, updateDataInputElement } from "./UI.js";
import { renderValidationMessages, validateResources } from "./validators.js";

/**
 * Renders the results by generating and displaying custom components based on the current layout code.
 *
 * This function retrieves the layout code, processes it into an array of components, and for each component:
 * - Retrieves its associated data.
 * - Constructs the appropriate HTML attributes.
 * - Creates a custom element and wraps it in a container.
 *
 * The resulting elements are then appended to the container element with the ID "code-results".
 *
 * Dependencies:
 * - getLayoutCode(): Function that returns the current layout code (single component or array).
 * - getDataForComponent(component): Function that returns data for a given component.
 * - CustomElementHtmlAttributes: Class for constructing HTML attributes for custom elements.
 * - createCustomElement(tagName, attributes): Function that creates a custom element.
 * - addContainerElement(element): Function that wraps an element in a container.
 * - appendChildren(parent, children): Function that appends multiple children to a parent element.
 */
export function renderResults() {
    const componentCode = getLayoutCode();
    let components = [];
    if (Array.isArray(componentCode)) {
        components = componentCode;
    } else {
        components = [componentCode];
    }
    const containerElement = document.getElementById("code-results");
    containerElement.innerHTML = "";
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
    appendChildren(containerElement, resultsElements);
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
 * @param {Array} validationResults.emptyTextResources - List of empty text resources.
 */
export function renderTextResourceStatusIndicators(validationResults) {
    const statusIndicatorsContainerElement = document.getElementById("text-resource-status-indicators");
    statusIndicatorsContainerElement.innerHTML = "";

    const resourceErrorsCount = validationResults.missingResourceBindings.length + validationResults.duplicateTextResources.length;
    const resourceWarningsCount = validationResults.unusedResourceBindings.length;
    const resourceInfoCount = validationResults.emptyTextResources.length;

    const resourceErrorsIndicator = document.createElement("span");
    resourceErrorsIndicator.classList.add("status-indicator", resourceErrorsCount === 0 ? "success" : "missing");
    resourceErrorsIndicator.innerHTML = resourceErrorsCount;
    statusIndicatorsContainerElement.appendChild(resourceErrorsIndicator);

    const resourceWarningsIndicator = document.createElement("span");
    resourceWarningsIndicator.classList.add("status-indicator", resourceWarningsCount === 0 ? "success" : "unused");
    resourceWarningsIndicator.innerHTML = resourceWarningsCount;
    statusIndicatorsContainerElement.appendChild(resourceWarningsIndicator);

    const resourceInfoIndicator = document.createElement("span");
    resourceInfoIndicator.classList.add("status-indicator", resourceInfoCount === 0 ? "success" : "empty");
    resourceInfoIndicator.innerHTML = resourceInfoCount;
    statusIndicatorsContainerElement.appendChild(resourceInfoIndicator);
}

/**
 * Renders the sidebar UI, including layout code, text resources, data model list, and related actions.
 *
 * The sidebar includes:
 * - Layout code button to edit layout code.
 * - Text resources button with validation and management options (validate, order, add defaults, remove unused/duplicates).
 * - Data model list and button to add new data models.
 *
 * This function manipulates the DOM directly to construct the sidebar and attaches event handlers for user interactions.
 *
 * Dependencies:
 * - getCodeInputElementForLayoutCode
 * - getCodeInputElementForTextResources
 * - updateDataInputElement
 * - setActiveSidebarElement
 * - validateResources
 * - renderValidationMessages
 * - renderFeedbackListElement
 * - getTextResources
 * - addValueToLocalStorage
 * - closeValidationDialog
 * - renderResults
 * - renderTextResourceStatusIndicators
 * - getDefaultValueForResource
 * - openValidationDialog
 * - getDataModelListElements
 * - addDataModel
 */
export function renderSidebar() {
    const sidebarElement = document.getElementById("sidebar");
    sidebarElement.innerHTML = "";

    const fileListElement = document.createElement("ul");
    fileListElement.id = "file-list";
    fileListElement.classList.add("file-list");

    // Layout code
    const layoutCodeItemId = "layout-code";
    const layoutCodeListElement = document.createElement("li");
    layoutCodeListElement.id = layoutCodeItemId;
    const layoutCodeButtonElement = document.createElement("button");
    layoutCodeButtonElement.innerHTML = "🎨 Layout code";
    layoutCodeButtonElement.onclick = function () {
        const codeInputElement = getCodeInputElementForLayoutCode();
        updateDataInputElement(codeInputElement);
        setActiveSidebarElement(layoutCodeItemId);
    };
    layoutCodeListElement.appendChild(layoutCodeButtonElement);
    fileListElement.appendChild(layoutCodeListElement);

    // Text resources code
    const textResourcesItemId = "text-resources-code";
    const textResourcesCodeListElement = document.createElement("li");
    textResourcesCodeListElement.id = textResourcesItemId;

    const buttonsContainerElement = document.createElement("div");
    buttonsContainerElement.classList.add("buttons-container");

    const textResourcesCodeButtonElement = document.createElement("button");
    textResourcesCodeButtonElement.innerHTML = "📚 Text resources";
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
        orderResourcesAlphabeticallyByIdButtonElement.innerHTML = "Order by ID";
        orderResourcesAlphabeticallyByIdButtonElement.onclick = function () {
            const currentTextResourcesValue = getTextResources();
            const orderedResources = [...currentTextResourcesValue.resources].sort((a, b) => a.id.localeCompare(b.id));
            const updatedTextResourcesValue = {
                ...currentTextResourcesValue,
                resources: orderedResources
            };
            const updatedResourcesJson = JSON.stringify(updatedTextResourcesValue, null, 2);
            addValueToLocalStorage("textResources", updatedResourcesJson);
            const textResourcesInputElement = getCodeInputElementForTextResources();
            updateDataInputElement(textResourcesInputElement);
            setActiveSidebarElement(textResourcesItemId);
            closeValidationDialog();
            renderResults();
            renderTextResourceStatusIndicators(validationResults);
        };
        contentElement.appendChild(orderResourcesAlphabeticallyByIdButtonElement);

        // Add default values for missing resources
        if (validationResults.missingResourceBindings?.length) {
            const addDefaultValuesForMissingResourcesButtonElement = document.createElement("button");
            addDefaultValuesForMissingResourcesButtonElement.classList.add("add-default-values-for-missing-resources-button");
            addDefaultValuesForMissingResourcesButtonElement.innerHTML = "Add default values";
            addDefaultValuesForMissingResourcesButtonElement.onclick = function () {
                const currentTextResourcesValue = getTextResources();
                const missingResourceIds = validationResults.missingResourceBindings;
                const newResources = [];
                const stillMissingResourceIds = [];

                missingResourceIds.forEach((resId) => {
                    const defaultValue = getDefaultValueForResource(resId);
                    if (defaultValue === null) {
                        stillMissingResourceIds.push(resId);
                    } else {
                        newResources.push({
                            id: resId,
                            value: defaultValue
                        });
                    }
                });

                const updatedTextResourcesValue = {
                    ...currentTextResourcesValue,
                    resources: [...currentTextResourcesValue.resources, ...newResources]
                };
                const updatedResourcesJson = JSON.stringify(updatedTextResourcesValue, null, 2);
                addValueToLocalStorage("textResources", updatedResourcesJson);
                const textResourcesInputElement = getCodeInputElementForTextResources();
                updateDataInputElement(textResourcesInputElement);
                setActiveSidebarElement(textResourcesItemId);
                closeValidationDialog();
                renderResults();
                renderTextResourceStatusIndicators({
                    ...validationResults,
                    missingResourceBindings: stillMissingResourceIds
                });
            };
            contentElement.appendChild(addDefaultValuesForMissingResourcesButtonElement);
        }

        if (validationResults.unusedResourceBindings.length) {
            // Add button to remove unused resources from text resources and update the code input element accordingly
            const removeUnusedResourcesButtonElement = document.createElement("button");
            removeUnusedResourcesButtonElement.classList.add("remove-unused-resources-button");
            removeUnusedResourcesButtonElement.innerHTML = "Remove unused";
            removeUnusedResourcesButtonElement.onclick = function () {
                const currentTextResourcesValue = getTextResources();
                const unusedResourceIds = validationResults.unusedResourceBindings;
                const updatedTextResourcesValue = {
                    ...currentTextResourcesValue,
                    resources: currentTextResourcesValue.resources.filter((res) => !unusedResourceIds.includes(res.id))
                };
                const updatedResourcesJson = JSON.stringify(updatedTextResourcesValue, null, 2);
                addValueToLocalStorage("textResources", updatedResourcesJson);
                const textResourcesInputElement = getCodeInputElementForTextResources();
                updateDataInputElement(textResourcesInputElement);
                setActiveSidebarElement(textResourcesItemId);
                closeValidationDialog();
                renderResults();
                renderTextResourceStatusIndicators({ ...validationResults, unusedResourceBindings: [] });
            };
            contentElement.appendChild(removeUnusedResourcesButtonElement);
        }

        if (validationResults?.duplicateTextResources?.length) {
            const removeDuplicateResourcesButtonElement = document.createElement("button");
            removeDuplicateResourcesButtonElement.classList.add("remove-duplicate-resources-button");
            removeDuplicateResourcesButtonElement.innerHTML = "Remove duplicates";
            removeDuplicateResourcesButtonElement.onclick = function () {
                const currentTextResourcesValue = getTextResources();
                const duplicateResourceIds = validationResults.duplicateTextResources;
                const seenIds = new Set();
                const updatedTextResourcesValue = {
                    ...currentTextResourcesValue,
                    resources: currentTextResourcesValue.resources.filter((res) => {
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
                addValueToLocalStorage("textResources", updatedResourcesJson);
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

        openValidationDialog(contentElement);
    };

    validateTextResourcesButtonElement.appendChild(statusIndicatorsContainerElement);
    optionButtonsContainerElement.appendChild(validateTextResourcesButtonElement);

    buttonsContainerElement.appendChild(textResourcesCodeButtonElement);
    buttonsContainerElement.appendChild(optionButtonsContainerElement);
    textResourcesCodeListElement.appendChild(buttonsContainerElement);
    fileListElement.appendChild(textResourcesCodeListElement);

    sidebarElement.appendChild(fileListElement);

    sidebarElement.appendChild(getDataModelListElements());

    const addDataModelButtonElement = document.createElement("button");
    addDataModelButtonElement.id = "add-data-model-button";
    addDataModelButtonElement.innerHTML = "Add Data Model";
    addDataModelButtonElement.classList.add("add-button");
    addDataModelButtonElement.onclick = function () {
        addDataModel();
        renderSidebar();
    };
    sidebarElement.appendChild(addDataModelButtonElement);
}
