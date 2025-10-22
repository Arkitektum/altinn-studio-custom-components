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
    if (!Array.isArray(componentCode)) {
        components = [componentCode];
    } else {
        components = componentCode;
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
 * Renders the sidebar UI, including file list items for "Layout code" and "Text resources",
 * a dynamic data model list, and an "Add Data Model" button.
 *
 * The sidebar allows users to select and interact with different code/data sections.
 *
 * Dependencies:
 * - getCodeInputElementForLayoutCode: Returns the code input element for layout code.
 * - getCodeInputElementForTextResources: Returns the code input element for text resources.
 * - updateDataInputElement: Updates the data input element with the provided code input.
 * - setActiveSidebarElement: Sets the active sidebar element by ID.
 * - getDataModelListElements: Returns DOM elements representing the data model list.
 * - addDataModel: Adds a new data model.
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

    const validateTextResourcesButtonElement = document.createElement("button");
    validateTextResourcesButtonElement.classList.add("validate-text-resources-button");
    validateTextResourcesButtonElement.innerHTML = "Validate";
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
        };

        contentElement.appendChild(removeUnusedResourcesButtonElement);
        openValidationDialog(contentElement);
    };

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
