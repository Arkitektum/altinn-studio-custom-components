// Dependencies
import { getDefaultTextResources, getTextResources } from "@arkitektum/altinn-studio-custom-components-utils";
import type { TableColumn } from "../types.ts";
import type { TextResourceCollection } from "@arkitektum/altinn-studio-custom-components-utils";

// Classes
import ValidationMessages from "../classes/system-classes/ValidationMessages.js";

/**
 * Checks if there are any validation messages present.
 *
 * @param validationMessages - An object containing validation messages, keyed by severity.
 * @returns Whether any of them holds a message.
 */
export function hasValidationMessages(validationMessages?: Record<string, unknown[]> | null): boolean {
    return !!validationMessages && Object.values(validationMessages).some((validationMessage) => validationMessage.length > 0);
}

/**
 * Checks for missing or empty text resources in the provided text resource bindings.
 *
 * Iterates through each component and its associated text resource keys, verifying if the corresponding
 * text resource exists and is not empty. If a text resource is missing, an error message is added to
 * the validationMessages. If a text resource exists but its value is empty, an info message is added.
 *
 * @param textResourceBindings - An object mapping component names to their text resource keys.
 * @param validationMessages - An optional ValidationMessages instance to collect errors and info.
 * @returns The updated ValidationMessages instance containing any errors or info about missing or empty text resources.
 */
export function hasMissingTextResources(
    textResourceBindings?: Record<string, Record<string, string>>,
    validationMessages = new ValidationMessages()
) {
    const textResources = getTextResources() as TextResourceCollection | undefined;
    const defaultTextResources = getDefaultTextResources() as TextResourceCollection | undefined;
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
 * @param tableColumns - Array of table column objects, each possibly containing `textResourceBindings`.
 * @param validationMessages - An optional ValidationMessages instance to collect errors and infos.
 * @returns The updated ValidationMessages object containing any errors or info messages found.
 */
export function validateTableHeadersTextResourceBindings(tableColumns?: TableColumn[], validationMessages = new ValidationMessages()) {
    const textResources = getTextResources() as TextResourceCollection | undefined;
    const defaultTextResources = getDefaultTextResources() as TextResourceCollection | undefined;
    // `columnIndex < undefined` is false, so the loop already did nothing without any columns. Saying so is what
    // lets the comparison be between two numbers.
    for (let columnIndex = 0; columnIndex < (tableColumns?.length ?? 0); columnIndex++) {
        const column = tableColumns?.[columnIndex];
        for (const textResourceKey of Object.keys(column?.textResourceBindings || {})) {
            let textResource = textResources?.resources?.find((resource) => resource.id === column?.textResourceBindings?.[textResourceKey]);
            if (!textResource) {
                textResource = defaultTextResources?.resources?.find((resource) => resource.id === column?.textResourceBindings?.[textResourceKey]);
            }
            if (!textResource) {
                validationMessages.error.push(
                    `Missing text resource binding with id: "${column?.textResourceBindings?.[textResourceKey]}" for "${textResourceKey}" at table column [${columnIndex}]`
                );
            } else if (textResource.value === "") {
                validationMessages.info.push(
                    `Empty text resource binding with id: "${column?.textResourceBindings?.[textResourceKey]}" for "${textResourceKey}" at table column [${columnIndex}]`
                );
            }
        }
    }
    return validationMessages;
}
