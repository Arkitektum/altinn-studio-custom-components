// Local functions
import { removeTrailingOrLeadingComma } from "./formatters.js";

/**
 * Adds a key-value pair to the browser's localStorage.
 *
 * @param {string} key - The key under which the value will be stored.
 * @param {string} value - The value to store in localStorage.
 */
export function addValueToLocalStorage(key, value) {
    localStorage.setItem(key, value);
}

/**
 * Retrieves a value from the browser's localStorage for the specified key.
 *
 * @param {string} key - The key whose value should be retrieved from localStorage.
 * @returns {string|null} The value associated with the key, or null if the key does not exist.
 */
export function getValueFromLocalStorage(key) {
    return localStorage.getItem(key);
}

/**
 * Retrieves and parses the layout code from local storage.
 * The value is fetched using the key "code", and any trailing or leading commas are removed before parsing.
 * If no layout code is found, returns an empty object.
 *
 * @returns {any} The parsed layout code object from local storage.
 */
export function getLayoutCode() {
    const layoutCode = getValueFromLocalStorage("code") || "{}";
    return JSON.parse(removeTrailingOrLeadingComma(layoutCode));
}

/**
 * Retrieves and parses the data models from local storage.
 * If no data models are found, returns an empty array.
 * Removes any trailing or leading commas from the stored value before parsing.
 *
 * @returns {any} The parsed data models from local storage.
 */
export function getDataModels() {
    const dataModels = getValueFromLocalStorage("dataModels") || "[]";
    return JSON.parse(removeTrailingOrLeadingComma(dataModels));
}

/**
 * Retrieves and parses the text resources from local storage.
 * If no text resources are found, returns an empty object.
 * Removes any trailing or leading commas before parsing the JSON.
 *
 * @returns {Object} The parsed text resources object from local storage.
 */
export function getTextResources() {
    const textResources = getValueFromLocalStorage("textResources") || "{}";
    return JSON.parse(removeTrailingOrLeadingComma(textResources));
}

/**
 * Adds a new data model to the local storage.
 * The new data model has default values for its properties.
 * Existing data models are retrieved, the new one is appended,
 * and the updated list is saved back to local storage.
 *
 * @function
 */
export function addDataModel() {
    const dataModels = getDataModels() || [];
    dataModels.push({ data: "", dataType: "", expanded: true });
    addValueToLocalStorage("dataModels", JSON.stringify(dataModels));
}
