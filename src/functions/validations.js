// Classes
import ValidationMessages from "../classes/system-classes/ValidationMessages.js";
import { getDefaultTextResources, getTextResources } from "./helpers.js";

/**
 * Checks if there are any validation messages present.
 *
 * @param {Object} validationMessages - An object containing validation messages.
 * @returns {boolean} Returns `true` if there are any validation messages with a length greater than 0, otherwise `false`.
 */
export function hasValidationMessages(validationMessages) {
    return !!validationMessages && Object.values(validationMessages).some((validationMessage) => validationMessage.length > 0);
}

/**
 * Checks for missing or empty text resources in the provided text resource bindings.
 *
 * Iterates through each component and its associated text resource keys, verifying if the corresponding
 * text resource exists and is not empty. If a text resource is missing, an error message is added to
 * the validationMessages. If a text resource exists but its value is empty, an info message is added.
 *
 * @param {Object} textResourceBindings - An object mapping component names to their text resource keys.
 * @param {ValidationMessages} [validationMessages=new ValidationMessages()] - An optional ValidationMessages instance to collect errors and info.
 * @returns {ValidationMessages} The updated ValidationMessages instance containing any errors or info about missing or empty text resources.
 */
export function hasMissingTextResources(textResourceBindings, validationMessages = new ValidationMessages()) {
    const textResources = getTextResources();
    const defaultTextResources = getDefaultTextResources();
    for (const componentName in textResourceBindings) {
        for (const textResourceKey in textResourceBindings[componentName]) {
            const key = textResourceBindings[componentName][textResourceKey];
            let textResource = textResources?.resources?.find((resource) => resource.id === key);
            if (!textResource) {
                textResource = defaultTextResources?.resources?.find((resource) => resource.id === key);
            }
            if (!textResource) {
                validationMessages.error.push(`Missing text resource for "${textResourceKey}" with id: "${key}" in component "${componentName}"`);
            } else if (textResource.value === "") {
                validationMessages.info.push(`Empty text resource for "${textResourceKey}" with id: "${key}" in component "${componentName}"`);
            }
        }
    }
    return validationMessages;
}

/**
 * Validates that all table column header text resource bindings exist and are not empty.
 *
 * Checks each column's `textResourceBindings` against available text resources and default text resources.
 * Adds error messages for missing bindings and info messages for empty bindings to the provided `ValidationMessages` object.
 *
 * @param {Array<Object>} tableColumns - Array of table column objects, each possibly containing `textResourceBindings`.
 * @param {ValidationMessages} [validationMessages=new ValidationMessages()] - An optional ValidationMessages instance to collect errors and infos.
 * @returns {ValidationMessages} The updated ValidationMessages object containing any errors or info messages found.
 */
export function validateTableHeadersTextResourceBindings(tableColumns, validationMessages = new ValidationMessages()) {
    const textResources = getTextResources();
    const defaultTextResources = getDefaultTextResources();
    for (let columnIndex = 0; columnIndex < tableColumns.length; columnIndex++) {
        const column = tableColumns[columnIndex];
        for (const textResourceKey of Object.keys(column?.textResourceBindings || {})) {
            let textResource = textResources?.resources?.find((resource) => resource.id === column.textResourceBindings[textResourceKey]);
            if (!textResource) {
                textResource = defaultTextResources?.resources?.find((resource) => resource.id === column.textResourceBindings[textResourceKey]);
            }
            if (!textResource) {
                validationMessages.error.push(
                    `Missing text resource binding with id: "${column.textResourceBindings[textResourceKey]}" for "${textResourceKey}" at table column [${columnIndex}]`
                );
            } else if (textResource.value === "") {
                validationMessages.info.push(
                    `Empty text resource binding with id: "${column.textResourceBindings[textResourceKey]}" for "${textResourceKey}" at table column [${columnIndex}]`
                );
            }
        }
    }
    return validationMessages;
}
