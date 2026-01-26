// Global functions
import { getValueFromDataKey, hasValue } from "../../src/functions/helpers.js";
import { beautifyJson } from "./formatters.js";

// Local functions
import { handleDataModelDataOnChange, handleDataModelTypeOnChange } from "./handlers.js";
import { addValueToLocalStorage, getDataModels, getValueFromLocalStorage } from "./localStorage.js";
import { renderResults, renderSidebar, renderTextResourceStatusIndicators } from "./renderers.js";
import { setActiveSidebarElement, updateDataInputElement } from "./UI.js";
import { validateResources } from "./validators.js";

/**
 * Retrieves data for a given component based on its data model bindings.
 *
 * @param {Object} component - The component object containing data model bindings.
 * @param {Array<Object>} [dataModels] - Optional array of data model objects. If not provided, `getDataModels()` will be called to retrieve them.
 * @returns {Object} An object mapping each binding key to its corresponding data value.
 */
export function getDataForComponent(component, dataModels) {
    if (!dataModels) {
        dataModels = getDataModels();
    }
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
 * Creates and returns a textarea element for code input, initializes its value from local storage,
 * and sets up an onchange handler to beautify the JSON, update local storage, render results,
 * validate resources, and update status indicators.
 *
 * @returns {HTMLTextAreaElement} The configured textarea element for code input.
 */
export function getCodeInputElementForLayoutCode() {
    const codeInputElement = document.createElement("textarea");
    codeInputElement.id = "code-input";
    codeInputElement.value = getValueFromLocalStorage("code") || "";
    codeInputElement.onchange = function () {
        codeInputElement.value = beautifyJson(codeInputElement.value);
        addValueToLocalStorage("code", codeInputElement.value);
        renderResults();

        const validationResults = validateResources();
        renderTextResourceStatusIndicators(validationResults);
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
    if (!textResources?.resources?.length) {
        return { resources: [] };
    }
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
 * The textarea is pre-filled with the value from local storage (if available).
 * On change, it parses, cleans, beautifies, and saves the text resources,
 * updates the global `window.textResources`, and triggers rendering and validation.
 *
 * @returns {HTMLTextAreaElement} The textarea element for text resource input.
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
        globalThis.textResources = JSON.parse(cleanedTextResourcesJson);
        renderResults();

        const validationResults = validateResources();
        renderTextResourceStatusIndicators(validationResults);
    };
    return codeInputElement;
}

/**
 * Fetches the default text resources for a given language.
 * If fetching for the specified language fails, attempts to fetch resources for the fallback language ("nb").
 *
 * @async
 * @param {string} language - The language code to fetch text resources for (e.g., "en", "nb").
 * @returns {Promise<Object|null>} The fetched text resources object if successful, or null if both attempts fail.
 */
export async function fetchDefaultTextResources(language) {
    const fallbackLanguage = "nb";
    const defaultTextResourcesApiUrl = `data/resource.${language}.json`;
    let defaultTextResourcesData;
    try {
        defaultTextResourcesData = await fetch(defaultTextResourcesApiUrl).then((response) => response.json());
    } catch (error) {
        console.error("Could not retrieve default text resources for the selected language.", error);
        try {
            const fallbackDefaultTextResourcesApiUrl = `data/resource.${fallbackLanguage}.json`;
            defaultTextResourcesData = await fetch(fallbackDefaultTextResourcesApiUrl).then((response) => response.json());
        } catch (fallbackError) {
            console.error("Could not retrieve default text resources for the fallback language.", fallbackError);
            return null;
        }
    }

    console.log("Fetched default text resources for language:", { defaultTextResourcesData, hasValue: hasValue(defaultTextResourcesData) });

    if (hasValue(defaultTextResourcesData)) {
        return defaultTextResourcesData;
    } else {
        console.error("Could not retrieve default text resources for the selected language.");
        return null;
    }
}

/**
 * Retrieves the default value for a given resource ID from the global defaultTextResources.
 *
 * @param {string} resourceId - The ID of the resource to look up.
 * @returns {(string|null)} The default value of the resource if found, otherwise null.
 */
export function getDefaultValueForResource(resourceId) {
    const defaultResources =
        globalThis.defaultTextResources && Array.isArray(globalThis.defaultTextResources.resources) ? globalThis.defaultTextResources.resources : [];
    const defaultResource = defaultResources.find((res) => res.id === resourceId);
    return defaultResource ? defaultResource.value : null;
}
