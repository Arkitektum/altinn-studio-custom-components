// Classes
import CustomElementHtmlAttributes from "../../src/classes/system-classes/CustomElementHtmlAttributes.js";
import { renderFeedbackListElement } from "../../src/functions/feedbackHelpers.js";

// Global function
import { addContainerElement, appendChildren, createCustomElement } from "../../src/functions/helpers.js";

// Local functions
import { getCodeInputElementForLayoutCode, getCodeInputElementForTextResources, getDataForComponent, getDataModelListElements } from "./getters.js";
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
            return addContainerElement(createCustomElement(component?.tagName, htmlAttributes));
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

    const missingResourcesCount = validationResults.missingResourceBindings.length;
    const unusedResourcesCount = validationResults.unusedResourceBindings.length;
    const emptyResourcesCount = validationResults.emptyTextResources.length;

    const missingResourcesIndicator = document.createElement("span");
    missingResourcesIndicator.classList.add("status-indicator", missingResourcesCount === 0 ? "success" : "missing");
    missingResourcesIndicator.innerHTML = `${missingResourcesCount === 0 ? "" : "-"}${missingResourcesCount}`;
    statusIndicatorsContainerElement.appendChild(missingResourcesIndicator);

    const unusedResourcesIndicator = document.createElement("span");
    unusedResourcesIndicator.classList.add("status-indicator", unusedResourcesCount === 0 ? "success" : "unused");
    unusedResourcesIndicator.innerHTML = `${unusedResourcesCount === 0 ? "" : "+"}${unusedResourcesCount}`;
    statusIndicatorsContainerElement.appendChild(unusedResourcesIndicator);

    const emptyResourcesIndicator = document.createElement("span");
    emptyResourcesIndicator.classList.add("status-indicator", emptyResourcesCount === 0 ? "success" : "empty");
    emptyResourcesIndicator.innerHTML = `${emptyResourcesCount}`;
    statusIndicatorsContainerElement.appendChild(emptyResourcesIndicator);
}

/**
 * Renders the sidebar UI, including layout code and text resources options,
 * as well as data model management controls. This function dynamically creates
 * and appends DOM elements for sidebar navigation, validation, and resource management.
 *
 * The sidebar includes:
 * - A button to view and edit layout code.
 * - A section for managing text resources, including validation and removal of unused resources.
 * - A dynamically generated list of data models.
 * - A button to add new data models.
 *
 * Relies on several helper functions for DOM manipulation, validation, and local storage:
 * - getCodeInputElementForLayoutCode
 * - updateDataInputElement
 * - setActiveSidebarElement
 * - getCodeInputElementForTextResources
 * - validateResources
 * - renderValidationMessages
 * - renderFeedbackListElement
 * - openValidationDialog
 * - closeValidationDialog
 * - getTextResources
 * - addValueToLocalStorage
 * - renderResults
 * - getDataModelListElements
 * - addDataModel
 *
 * @function
 * @returns {void}
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

        // If there are no unused resource bindings, open the validation dialog and return
        if (validationResults.unusedResourceBindings.length === 0) {
            openValidationDialog(contentElement);
            return;
        }

        // Add button to remove unused resources from text resources and update the code input element accordingly
        const removeUnusedResourcesButtonElement = document.createElement("button");
        removeUnusedResourcesButtonElement.innerHTML = "Remove unused resources";
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
