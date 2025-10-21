// Classes
import CustomElementHtmlAttributes from "../../src/classes/system-classes/CustomElementHtmlAttributes.js";

// Global function
import { addContainerElement, appendChildren, createCustomElement } from "../../src/functions/helpers.js";

// Local functions
import { getCodeInputElementForLayoutCode, getCodeInputElementForTextResources, getDataForComponent, getDataModelListElements } from "./getters.js";
import { addDataModel, getLayoutCode } from "./localStorage.js";
import { setActiveSidebarElement, updateDataInputElement } from "./UI.js";

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
    layoutCodeButtonElement.innerHTML = "Layout code";
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
    const textResourcesCodeButtonElement = document.createElement("button");
    textResourcesCodeButtonElement.innerHTML = "Text resources";
    textResourcesCodeButtonElement.onclick = function () {
        const codeInputElement = getCodeInputElementForTextResources();
        updateDataInputElement(codeInputElement);
        setActiveSidebarElement(textResourcesItemId);
    };
    textResourcesCodeListElement.appendChild(textResourcesCodeButtonElement);
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
