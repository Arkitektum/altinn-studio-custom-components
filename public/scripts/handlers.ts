// Local functions
import { addValueToLocalStorage, getDataModels } from "./localStorage.ts";
import { removeTrailingOrLeadingComma } from "./formatters.ts";

/**
 * Handles the change event for the data model type input element at the specified index.
 * Updates the corresponding data model's type in local storage.
 *
 * @param {number} index - The index of the data model to update.
 */
export function handleDataModelTypeOnChange(index: number) {
    const dataModels = getDataModels();
    const dataModelTypeInputElement = document.getElementById(`data-model-type-input-${index}`);
    dataModels[index].dataType = (dataModelTypeInputElement as HTMLInputElement).value;
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
export function handleDataModelDataOnChange(index: number) {
    const dataModels = getDataModels();
    const dataModelDataInputElement = document.getElementById("code-input");
    dataModels[index].data = JSON.parse(removeTrailingOrLeadingComma((dataModelDataInputElement as HTMLInputElement).value));
    addValueToLocalStorage("dataModels", JSON.stringify(dataModels));
}
