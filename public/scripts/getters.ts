import type { ApiValue } from "./types.ts";
// Global functions
import { beautifyJson, parseJsonInput } from "./formatters.ts";

// Local functions
import { addValueToLocalStorage, getDataModels, getTextResourcesStorageKey, getValueFromLocalStorage } from "./localStorage.ts";
import { handleDataModelDataOnChange, handleDataModelTypeOnChange } from "./handlers.ts";
import { renderJsonInputError, setActiveSidebarElement, updateDataInputElement } from "./UI.ts";
import { renderResults, renderSidebar, renderTextResourceStatusIndicators } from "./devTools/renderers.ts";
import { createCodeEditor } from "./devTools/codeEditor.ts";
import { setIconLabel } from "./icons.ts";
import { validateResources } from "./validators.ts";

/**
 * Generates a summary text for a data model based on its type and index.
 *
 * @param {Object} dataModel - The data model object.
 * @param {string} [dataModel.dataType] - The type of the data model.
 * @param {number} index - The index of the data model in the list.
 * @returns {string} The summary text for the data model.
 */
export function getDataModelSummaryText(dataModel: ApiValue, index: number) {
    const dataTypeName = dataModel.dataType?.length > 0 ? dataModel.dataType : `Data model ${index + 1}`;
    const dataModelType = index === 0 ? `[main] ${dataTypeName}` : dataTypeName;
    return dataModelType;
}

/**
 * Generates a list element (<ul>) containing data model items from local storage.
 * Each item includes controls for editing the data type, viewing a summary, and removing the data model.
 *
 * @returns {HTMLUListElement} The list element containing all data model items.
 */
export function getDataModelListElements() {
    const dataModels = getDataModels();
    const dataModelListElement = document.createElement("ul");
    dataModelListElement.id = "data-model-list";
    dataModelListElement.classList.add("data-model-list");
    dataModels.forEach((dataModel: ApiValue, index: number) => {
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
        const summaryText = getDataModelSummaryText(dataModel, index);
        setIconLabel(dataModelListItemButtonElement, "database", summaryText);
        // The whole name, for when the sidebar cuts it short.
        dataModelListItemButtonElement.title = summaryText;
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
            // The editor for an open data model writes back by index, which no longer points at the same model.
            const dataModelEditorOpen = document.querySelector("#data-model-list li.active") !== null;
            const dataModels = getDataModels();
            dataModels.splice(index, 1);
            addValueToLocalStorage("dataModels", JSON.stringify(dataModels));
            renderSidebar();
            renderResults();
            if (dataModelEditorOpen) {
                updateDataInputElement(getCodeInputElementForLayoutCode());
                setActiveSidebarElement("layout-code");
            }
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

/** How long typing has to pause before an editor's JSON is saved and drawn. */
export const PREVIEW_DELAY_MS = 300;

/**
 * Saves and draws an editor's JSON once typing pauses, so the preview follows what is typed rather than waiting for the editor to be left.
 *
 * The save it is given leaves invalid JSON alone without a word, since JSON is mostly invalid halfway through typing it, and leaves the text as typed. Leaving the editor saves at once, reports invalid JSON and beautifies, so a save still waiting is dropped then. So is one for an editor no longer on the page.
 *
 * @param {HTMLElement} codeInputElement - The editor.
 * @param {Function} saveWhileTyping - Saves and draws what is typed, when it is valid.
 */
export function previewWhileTyping(codeInputElement: HTMLElement, saveWhileTyping: () => void) {
    let timer: ReturnType<typeof setTimeout> | undefined;
    codeInputElement.addEventListener("input", () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            if (codeInputElement.isConnected) saveWhileTyping();
        }, PREVIEW_DELAY_MS);
    });
    codeInputElement.addEventListener("change", () => clearTimeout(timer));
}

/**
 * Trims text, and leaves anything else as it is, so a resource still being typed, with no value yet, does not stop the rest being saved.
 *
 * @param {unknown} value - The value.
 * @returns {unknown} The value, trimmed when it is text.
 */
function trimIfText(value: ApiValue) {
    return typeof value === "string" ? value.trim() : value;
}

/**
 * Creates and returns an editor for the data of a specific data model.
 * The editor is populated with the JSON stringified data of the selected data model.
 * On change, it triggers data model update and re-renders results. Invalid JSON saves nothing and is reported above the input.
 * While typing, valid JSON is saved and drawn once typing pauses, see previewWhileTyping.
 *
 * @param {number} dataModelIndex - The index of the data model to edit.
 * @returns {CodeEditorElement} The editor for the data model.
 */
export function getCodeInputElementForDataModel(dataModelIndex: number) {
    const dataModels = getDataModels();
    const dataModel = dataModels[dataModelIndex];
    const codeInputElement = createCodeEditor(JSON.stringify(dataModel.data, null, 2));
    codeInputElement.id = "code-input";
    const save = (whileTyping: boolean) => {
        const error = handleDataModelDataOnChange(dataModelIndex);
        if (error) {
            if (!whileTyping) renderJsonInputError(error);
            return;
        }
        renderJsonInputError();
        renderResults();
    };
    codeInputElement.onchange = () => save(false);
    previewWhileTyping(codeInputElement, () => save(true));
    return codeInputElement;
}

/**
 * Creates and returns the layout code editor, initializes its value from local storage,
 * and sets up an onchange handler to beautify the JSON, update local storage, render results,
 * validate resources, and update status indicators.
 * Invalid JSON saves nothing and is reported above the input.
 * While typing, valid JSON is saved and drawn once typing pauses, see previewWhileTyping.
 *
 * @returns {CodeEditorElement} The layout code editor.
 */
export function getCodeInputElementForLayoutCode() {
    const codeInputElement = createCodeEditor(getValueFromLocalStorage("code") || "");
    codeInputElement.id = "code-input";
    codeInputElement.dataset.editor = "layout";
    const save = (whileTyping: boolean) => {
        const { value, error } = parseJsonInput(codeInputElement.value);
        if (error) {
            if (!whileTyping) renderJsonInputError(error);
            return;
        }
        renderJsonInputError();
        const json = JSON.stringify(value, null, 2);
        // Beautified only once the editor is left, so the text does not move under the cursor while typing.
        if (!whileTyping) codeInputElement.value = json;
        addValueToLocalStorage("code", json);
        renderResults();

        const validationResults = validateResources();
        renderTextResourceStatusIndicators(validationResults);
    };
    codeInputElement.onchange = () => save(false);
    previewWhileTyping(codeInputElement, () => save(true));
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
function cleanUpTextResources(textResources: ApiValue) {
    // Implement any necessary cleanup logic here
    if (!textResources?.resources?.length) {
        return { resources: [] };
    }
    textResources.resources = textResources.resources.map((res: ApiValue) => {
        const textResource: { id: string; value: string; variables?: ApiValue } = {
            id: trimIfText(res.id),
            value: trimIfText(res.value)
        };
        if (res.variables) {
            textResource.variables = res?.variables.map((variable: ApiValue) => {
                const cleanedVariable: { key: string; dataSource: string; defaultValue?: string } = {
                    key: trimIfText(variable.key),
                    dataSource: trimIfText(variable.dataSource)
                };
                if (variable.defaultValue) {
                    cleanedVariable.defaultValue = trimIfText(variable.defaultValue);
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
 * Creates and returns an editor for text resources.
 * The editor is pre-filled with the value from local storage (if available).
 * On change, it parses, cleans, beautifies, and saves the text resources,
 * updates the global `window.textResources`, and triggers rendering and validation.
 * Invalid JSON saves nothing and is reported above the input.
 * While typing, valid JSON is saved and drawn once typing pauses, see previewWhileTyping.
 *
 * @returns {CodeEditorElement} The text resources editor.
 */
export function getCodeInputElementForTextResources() {
    const storageKey = getTextResourcesStorageKey();
    const codeInputElement = createCodeEditor(getValueFromLocalStorage(storageKey) || "");
    codeInputElement.id = "code-input";
    const save = (whileTyping: boolean) => {
        const { value: textResources, error } = parseJsonInput(codeInputElement.value);
        if (error) {
            if (!whileTyping) renderJsonInputError(error);
            return;
        }
        renderJsonInputError();
        const cleanedTextResources = cleanUpTextResources(textResources);
        const cleanedTextResourcesJson = beautifyJson(JSON.stringify(cleanedTextResources, null, 2));
        // Cleaned up and beautified in the editor only once it is left, so the text does not move under the cursor while typing.
        if (!whileTyping) codeInputElement.value = cleanedTextResourcesJson;
        addValueToLocalStorage(storageKey, cleanedTextResourcesJson);
        globalThis.textResources = JSON.parse(cleanedTextResourcesJson);
        renderResults();

        const validationResults = validateResources();
        renderTextResourceStatusIndicators(validationResults);
    };
    codeInputElement.onchange = () => save(false);
    previewWhileTyping(codeInputElement, () => save(true));
    return codeInputElement;
}
