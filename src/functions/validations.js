import ValidationMessages from "../classes/system-classes/ValidationMessages.js";

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
 * Checks for missing or empty text resources based on the provided text resource bindings.
 *
 * @param {Object} textResources - The text resources object containing available resources.
 * @param {Array} textResources.resources - An array of text resource objects.
 * @param {string} textResources.resources[].id - The unique identifier for a text resource.
 * @param {string} textResources.resources[].value - The value of the text resource.
 * @param {Object} textResourceBindings - An object mapping component names to their text resource bindings.
 * @param {Object} textResourceBindings[componentName] - An object mapping text resource keys to their IDs.
 * @param {ValidationMessages} [validationMessages=new ValidationMessages()] - An optional instance of ValidationMessages to store validation results.
 * @returns {ValidationMessages} The updated ValidationMessages instance containing error and info messages.
 */
export function hasMissingTextResources(textResources, textResourceBindings, validationMessages = new ValidationMessages()) {
    for (const componentName in textResourceBindings) {
        for (const textResourceKey in textResourceBindings[componentName]) {
            const key = textResourceBindings[componentName][textResourceKey];
            const textResource = textResources?.resources?.find((resource) => resource.id === key);
            if (!textResource) {
                validationMessages.error.push(`Missing text resource with id: "${key}"`);
            } else if (textResource.value === "") {
                validationMessages.info.push(`Empty text resource with id: "${key}"`);
            }
        }
    }
    return validationMessages;
}

/**
 * Validates the text resource bindings for table column headers.
 *
 * @param {Array<Object>} tableColumns - An array of table column objects, where each object contains a `titleResourceKey` property.
 * @param {Object} textResources - An object containing text resource bindings, where keys are resource IDs and values are the corresponding text.
 * @param {ValidationMessages} [validationMessages=new ValidationMessages()] - An optional instance of ValidationMessages to collect validation errors and info.
 * @returns {ValidationMessages} The updated ValidationMessages instance containing any validation errors or info messages.
 */
export function validateTableHeadersTextResourceBindings(tableColumns, textResources, validationMessages = new ValidationMessages()) {
    tableColumns.forEach((column) => {
        if (textResources[column.titleResourceKey] === undefined) {
            validationMessages.error.push(`Missing text resource binding with id: "${column.titleResourceKey}"`);
        } else if (textResources[column.titleResourceKey] === "") {
            validationMessages.info.push(`Empty text resource binding with id: "${column.titleResourceKey}"`);
        }
    });
    return validationMessages;
}
