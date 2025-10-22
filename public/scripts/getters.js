// Global functions
import { getValueFromDataKey } from "../../src/functions/helpers.js";
import { beautifyJson } from "./formatters.js";

// Local functions
import { handleDataModelDataOnChange, handleDataModelTypeOnChange } from "./handlers.js";
import { addValueToLocalStorage, getDataModels, getValueFromLocalStorage } from "./localStorage.js";
import { renderResults, renderSidebar } from "./renderers.js";
import { setActiveSidebarElement, updateDataInputElement } from "./UI.js";

/**
 * Retrieves data for a given component based on its data model bindings.
 *
 * Iterates over the component's `dataModelBindings` and fetches corresponding values
 * from the data models. If a binding is a string, it uses the first data model.
 * If a binding is an object, it finds the data model matching the specified `dataType`.
 *
 * @param {Object} component - The component object containing data model bindings.
 * @param {Object} component.dataModelBindings - Key-value pairs mapping component fields to data model bindings.
 * @returns {Object} An object containing the resolved data for each binding key.
 */
export function getDataForComponent(component) {
    const dataModels = getDataModels();
    const data = {};
    component?.dataModelBindings &&
        Object.keys(component?.dataModelBindings).forEach((key) => {
            const dataModelBinding = component.dataModelBindings[key];
            if (typeof dataModelBinding === "string") {
                const index = 0;
                const dataModel = dataModels[index]?.data;
                const dataModelData = getValueFromDataKey(dataModel, dataModelBinding);
                data[key] = dataModelData;
            } else if (typeof dataModelBinding === "object") {
                const index = dataModels.findIndex((dataModel) => dataModel?.dataType === dataModelBinding?.dataType);
                const dataModel = dataModels[index]?.data;
                const dataModelData = getValueFromDataKey(dataModel, dataModelBinding?.field);
                data[key] = dataModelData !== undefined ? dataModelData : dataModelBinding?.data;
            }
        });
    return data;
}

/**
 * Generates a summary text for a data model based on its type and index.
 *
 * @param {Object} dataModel - The data model object.
 * @param {string} [dataModel.dataType] - The type of the data model.
 * @param {number} index - The index of the data model in the list.
 * @returns {string} The summary text for the data model.
 */
export function getDataModelSummaryText(dataModel, index) {
    const dataTypeName = dataModel.dataType?.length > 0 ? dataModel.dataType : `Data model ${index + 1}`;
    const dataModelType = index === 0 ? `[main] ${dataModel.dataType}` : dataTypeName;
    return dataModelType;
}

/**
 * Generates a list element (<ul>) containing data model items from local storage.
 * Each item includes controls for editing the data type, viewing a summary, and removing the data model.
 *
 * @returns {HTMLUListElement} The list element containing all data model items.
 */
export function getDataModelListElements() {
    const dataModels = JSON.parse(getValueFromLocalStorage("dataModels")) || [];
    const dataModelListElement = document.createElement("ul");
    dataModelListElement.id = "data-model-list";
    dataModelListElement.classList.add("data-model-list");
    dataModels.forEach((dataModel, index) => {
        const itemId = `data-model-list-item-${index}`;
        const dataModelListItemElement = document.createElement("li");
        dataModelListItemElement.id = itemId;

        const buttonsContainerElement = document.createElement("div");
        buttonsContainerElement.classList.add("buttons-container");

        const typeInputElement = document.createElement("input");
        typeInputElement.classList.add("type-input");
        typeInputElement.setAttribute("placeholder", "Data type");
        typeInputElement.id = `data-model-type-input-${index}`;
        typeInputElement.value = dataModel.dataType;
        typeInputElement.onchange = function () {
            handleDataModelTypeOnChange(index);
            renderSidebar();
            renderResults();
        };
        typeInputElement.onblur = function () {
            dataModelListItemElement.classList.remove("editable");
        };

        const dataModelListItemButtonElement = document.createElement("button");
        dataModelListItemButtonElement.innerHTML = `💾 ${getDataModelSummaryText(dataModel, index)}`;
        dataModelListItemButtonElement.onclick = function () {
            const codeInputElement = getCodeInputElementForDataModel(index);
            updateDataInputElement(codeInputElement);
            setActiveSidebarElement(itemId);
        };

        // Option buttons
        const optionButtonsContainerElement = document.createElement("div");
        optionButtonsContainerElement.classList.add("option-buttons-container");

        // Option button for edit data model type
        const dataModelListItemEditNameButtonElement = document.createElement("button");
        dataModelListItemEditNameButtonElement.classList.add("edit-type-button");
        dataModelListItemEditNameButtonElement.innerHTML = "Type";
        dataModelListItemEditNameButtonElement.onclick = function () {
            dataModelListItemElement.classList.add("editable");
            typeInputElement.focus();
        };
        optionButtonsContainerElement.appendChild(dataModelListItemEditNameButtonElement);

        // Option button for remove data model
        const dataModelListItemRemoveButtonElement = document.createElement("button");
        dataModelListItemRemoveButtonElement.classList.add("remove-button");
        dataModelListItemRemoveButtonElement.innerHTML = "Remove";
        dataModelListItemRemoveButtonElement.onclick = function () {
            if (!confirm("Are you sure you want to remove this data model? This action cannot be undone.")) {
                return;
            }
            const dataModels = JSON.parse(getValueFromLocalStorage("dataModels")) || [];
            dataModels.splice(index, 1);
            addValueToLocalStorage("dataModels", JSON.stringify(dataModels));
            renderSidebar();
            renderResults();
        };
        optionButtonsContainerElement.appendChild(dataModelListItemRemoveButtonElement);

        buttonsContainerElement.appendChild(dataModelListItemButtonElement);
        buttonsContainerElement.appendChild(optionButtonsContainerElement);

        dataModelListItemElement.appendChild(buttonsContainerElement);
        dataModelListItemElement.appendChild(typeInputElement);
        dataModelListElement.appendChild(dataModelListItemElement);
    });
    return dataModelListElement;
}

/**
 * Creates and returns a textarea element for editing the data of a specific data model.
 * The textarea is populated with the JSON stringified data of the selected data model.
 * On change, it triggers data model update and re-renders results.
 *
 * @param {number} dataModelIndex - The index of the data model to edit.
 * @returns {HTMLTextAreaElement} The textarea element for editing the data model.
 */
export function getCodeInputElementForDataModel(dataModelIndex) {
    const codeInputElement = document.createElement("textarea");
    codeInputElement.id = "code-input";
    const dataModels = JSON.parse(getValueFromLocalStorage("dataModels")) || [];
    const dataModel = dataModels[dataModelIndex];
    codeInputElement.value = JSON.stringify(dataModel.data, null, 2);
    codeInputElement.onchange = function () {
        handleDataModelDataOnChange(dataModelIndex);
        renderResults();
    };
    return codeInputElement;
}

/**
 * Creates and returns a textarea element for code input, pre-populated with the value from local storage.
 * On change, the input is beautified, saved to local storage, and results are rendered.
 *
 * @returns {HTMLTextAreaElement} The textarea element for code input.
 */
export function getCodeInputElementForLayoutCode() {
    const codeInputElement = document.createElement("textarea");
    codeInputElement.id = "code-input";
    codeInputElement.value = getValueFromLocalStorage("code") || "";
    codeInputElement.onchange = function () {
        codeInputElement.value = beautifyJson(codeInputElement.value);
        addValueToLocalStorage("code", codeInputElement.value);
        renderResults();
    };
    return codeInputElement;
}

/**
 * Cleans up the text resources object by trimming whitespace from resource IDs, values,
 * and variable properties. Removes unnecessary properties such as "id" and "org" from the input object.
 *
 * @param {Object} textResources - The text resources object to clean up.
 * @param {Array<Object>} textResources.resources - Array of text resource objects.
 * @param {string} textResources.resources[].id - The ID of the text resource.
 * @param {string} textResources.resources[].value - The value of the text resource.
 * @param {Array<Object>} [textResources.resources[].variables] - Optional array of variable objects.
 * @param {string} textResources.resources[].variables[].key - The key of the variable.
 * @param {string} textResources.resources[].variables[].dataSource - The data source of the variable.
 * @param {string} [textResources.resources[].variables[].defaultValue] - Optional default value for the variable.
 * @returns {Object} The cleaned-up text resources object.
 */
function cleanUpTextResources(textResources) {
    // Implement any necessary cleanup logic here
    textResources.resources = textResources.resources.map((res) => {
        const textResource = {
            id: res.id.trim(),
            value: res.value.trim()
        };
        if (res.variables) {
            textResource.variables = res?.variables.map((variable) => {
                const cleanedVariable = {
                    key: variable.key.trim(),
                    dataSource: variable.dataSource.trim()
                };
                if (variable.defaultValue) {
                    cleanedVariable.defaultValue = variable.defaultValue.trim();
                }
                return cleanedVariable;
            });
        }
        return textResource;
    });
    delete textResources["id"];
    delete textResources["org"];
    return textResources;
}

/**
 * Creates and returns a textarea element for editing text resources.
 * The textarea is initialized with the value from local storage (key: "textResources").
 * On change, it parses, cleans, beautifies, and saves the updated text resources back to local storage,
 * updates the global `window.textResources`, and triggers a re-render of results.
 *
 * @returns {HTMLTextAreaElement} The textarea element for text resources input.
 */
export function getCodeInputElementForTextResources() {
    const codeInputElement = document.createElement("textarea");
    codeInputElement.id = "code-input";
    codeInputElement.value = getValueFromLocalStorage("textResources") || "";
    codeInputElement.onchange = function () {
        const textResources = JSON.parse(codeInputElement?.value);
        const cleanedTextResources = cleanUpTextResources(textResources);
        const cleanedTextResourcesJson = beautifyJson(JSON.stringify(cleanedTextResources, null, 2));
        codeInputElement.value = cleanedTextResourcesJson;
        addValueToLocalStorage("textResources", cleanedTextResourcesJson);
        window.textResources = JSON.parse(cleanedTextResourcesJson);
        renderResults();
    };
    return codeInputElement;
}
