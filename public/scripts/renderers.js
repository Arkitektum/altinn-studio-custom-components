// Classes
import CustomElementHtmlAttributes from "../../src/classes/system-classes/CustomElementHtmlAttributes.js";

// Global function
import { addContainerElement, createCustomElement } from "../../src/functions/helpers.js";

// Local functions
import { getCodeInputElementForLayoutCode, getCodeInputElementForTextResources, getDataForComponent, getDataModelListElements } from "./getters.js";
import { addDataModel, getLayoutCode } from "./localStorage.js";
import { setActiveSidebarElement, updateDataInputElement } from "./UI.js";

/**
 * Renders the results by creating and displaying a custom component element.
 * - Retrieves the layout code and corresponding data for the component.
 * - Constructs HTML attributes for the custom element.
 * - Creates the custom element and appends it to the container element with ID "code-results".
 *
 * @returns {void}
 */
export function renderResults() {
    const component = getLayoutCode();
    const data = getDataForComponent(component);
    const htmlAttributes = new CustomElementHtmlAttributes({
        ...component,
        formData: data
    });
    const element = createCustomElement(component?.tagName, htmlAttributes);
    const testElement = document.getElementById("code-results");
    testElement.innerHTML = "";
    testElement.appendChild(addContainerElement(element));
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
