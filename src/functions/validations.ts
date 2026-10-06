// Dependencies
import type { ResourceBindingGroup, TableColumn } from "../types.ts";
import { getDefaultTextResources, getTextResources } from "@arkitektum/altinn-studio-custom-components-utils";
import type { TextResourceCollection } from "@arkitektum/altinn-studio-custom-components-utils";

// Classes
import ValidationMessages from "../classes/system-classes/ValidationMessages.ts";

/**
 * Checks if there are any validation messages present.
 *
 * @param validationMessages - An object containing validation messages, keyed by severity.
 * @returns Whether any of them holds a message.
 */
export function hasValidationMessages(validationMessages?: ValidationMessages | Record<string, unknown[]> | null): boolean {
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
    textResourceBindings?: Record<string, ResourceBindingGroup | undefined>,
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
 * Checks each column's `resourceBindings`, the same bindings the headers and the empty-field text are drawn from, against available text resources and default text resources.
 * Adds error messages for missing bindings and info messages for empty bindings to the provided `ValidationMessages` object. A binding left out is not checked, since a column need not carry every one.
 *
 * @param tableColumns - Array of table column objects, each possibly containing `resourceBindings`.
 * @param validationMessages - An optional ValidationMessages instance to collect errors and infos.
 * @returns The updated ValidationMessages object containing any errors or info messages found.
 */
export function validateTableHeadersTextResourceBindings(tableColumns?: TableColumn[], validationMessages = new ValidationMessages()) {
    const textResources = getTextResources() as TextResourceCollection | undefined;
    const defaultTextResources = getDefaultTextResources() as TextResourceCollection | undefined;
    (tableColumns ?? []).forEach((column, columnIndex) => {
        for (const [textResourceKey, id] of Object.entries(column?.resourceBindings ?? {})) {
            if (id === undefined) {
                continue;
            }
            const textResource =
                textResources?.resources?.find((resource) => resource.id === id) ??
                defaultTextResources?.resources?.find((resource) => resource.id === id);
            if (!textResource) {
                validationMessages.error.push(
                    `Missing text resource binding with id: "${id}" for "${textResourceKey}" at table column [${columnIndex}]`
                );
            } else if (textResource.value === "") {
                validationMessages.info.push(
                    `Empty text resource binding with id: "${id}" for "${textResourceKey}" at table column [${columnIndex}]`
                );
            }
        }
    });
    return validationMessages;
}
