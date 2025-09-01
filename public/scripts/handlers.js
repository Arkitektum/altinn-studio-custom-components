// Local functions
import { removeTrailingOrLeadingComma } from "./formatters.js";
import { addValueToLocalStorage, getValueFromLocalStorage } from "./localStorage.js";

/**
 * Handles the change event for the data model type input element at the specified index.
 * Updates the corresponding data model's type in local storage.
 *
 * @param {number} index - The index of the data model to update.
 */
export function handleDataModelTypeOnChange(index) {
    const dataModels = JSON.parse(getValueFromLocalStorage("dataModels")) || [];
    const dataModelTypeInputElement = document.getElementById(`data-model-type-input-${index}`);
    dataModels[index].dataType = dataModelTypeInputElement.value;
    addValueToLocalStorage("dataModels", JSON.stringify(dataModels));
}

/**
 * Handles the change event for a data model's data input.
 * Updates the data for the specified data model at the given index
 * by parsing the input value, removing any trailing or leading commas,
 * and saving the updated data models array to local storage.
 *
 * @param {number} index - The index of the data model to update.
 */
export function handleDataModelDataOnChange(index) {
    const dataModels = JSON.parse(getValueFromLocalStorage("dataModels")) || [];
    const dataModelDataInputElement = document.getElementById("code-input");
    dataModels[index].data = JSON.parse(removeTrailingOrLeadingComma(dataModelDataInputElement.value));
    addValueToLocalStorage("dataModels", JSON.stringify(dataModels));
}
