// Classes
import ValidationMessages from "../classes/system-classes/ValidationMessages.js";
import { getTextResources } from "./helpers.js";

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
 * Checks for missing or empty text resources based on provided bindings and accumulates validation messages.
 *
 * @param {Object} textResources - The object containing available text resources, expected to have a `resources` array.
 * @param {Object} textResourceBindings - An object mapping component names to their text resource keys.
 * @param {ValidationMessages} [validationMessages=new ValidationMessages()] - An optional ValidationMessages instance to accumulate errors and info.
 * @returns {ValidationMessages} The updated ValidationMessages instance containing error and info messages about missing or empty text resources.
 */
export function hasMissingTextResources(textResources, textResourceBindings, validationMessages = new ValidationMessages()) {
    for (const componentName in textResourceBindings) {
        for (const textResourceKey in textResourceBindings[componentName]) {
            const key = textResourceBindings[componentName][textResourceKey];
            const textResource = textResources?.resources?.find((resource) => resource.id === key);
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
 * Validates that all text resource bindings in table columns exist and are not empty.
 *
 * @param {Array<Object>} tableColumns - The array of table column objects to validate.
 * @param {ValidationMessages} [validationMessages=new ValidationMessages()] - An optional ValidationMessages instance to collect errors and info messages.
 * @returns {ValidationMessages} The updated ValidationMessages instance with any errors or info messages found during validation.
 */
export function validateTableHeadersTextResourceBindings(tableColumns, validationMessages = new ValidationMessages()) {
    const textResources = getTextResources();
    tableColumns.forEach((column, columnIndex) => {
        Object.keys(column?.textResourceBindings || {}).forEach((textResourceKey) => {
            const textResource = textResources?.resources?.find((resource) => resource.id === column.textResourceBindings[textResourceKey]);
            if (!textResource) {
                validationMessages.error.push(
                    `Missing text resource binding with id: "${column.textResourceBindings[textResourceKey]}" for "${textResourceKey}" at table column [${columnIndex}]`
                );
            } else if (textResource.value === "") {
                validationMessages.info.push(
                    `Empty text resource binding with id: "${column.textResourceBindings[textResourceKey]}" for "${textResourceKey}" at table column [${columnIndex}]`
                );
            }
        });
    });
    return validationMessages;
}
