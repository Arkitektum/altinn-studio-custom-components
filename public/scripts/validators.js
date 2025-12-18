// Classes
import ValidationMessages from "../../src/classes/system-classes/ValidationMessages.js";

// Local functions
import { getLayoutCode, getTextResources } from "./localStorage.js";

// Global functions
import { instantiateComponent } from "../../src/functions/componentHelpers.js";
import { getDataForComponent } from "./getters.js";

/**
 * Adds resource bindings from a custom component's properties to a set of all resource bindings.
 *
 * This function collects resource bindings defined directly in the component's properties,
 * from table columns (if applicable), and from the component's `getResourceBindings` method.
 *
 * @param {Object} componentProps - The properties of the custom component.
 * @param {Set<string>} allResourceBindings - A set containing all collected resource bindings.
 * @returns {void}
 */
function addResourceBindingsFromCustomComponent(componentProps, allResourceBindings) {
    const component = instantiateComponent(componentProps);
    const resourceBindings = component?.getResourceBindings?.(componentProps);
    // Add resource bindings added directly to the component
    for (const bindingValue of Object.values(componentProps?.resourceBindings || {})) {
        allResourceBindings.add(bindingValue);
    }

    // Add resource bindings from table columns if applicable
    if (componentProps?.tableColumns) {
        allResourceBindings = addTableColumnsResourceBindingsFromCustomComponent(componentProps, allResourceBindings);
    }

    // Add resource bindings from the getResourceBindings function
    for (const bindingCategory of Object.values(resourceBindings || {})) {
        for (const bindingValue of Object.values(bindingCategory || {})) {
            allResourceBindings.add(bindingValue);
        }
    }
}

/**
 * Adds resource binding values from the table columns of a custom component to a provided Set.
 *
 * Iterates over the `tableColumns` property in `componentProps`, and for each column,
 * adds all values from its `resourceBindings` object to the `allResourceBindings` Set.
 *
 * @param {Object} componentProps - The properties of the custom component, potentially containing table columns.
 * @param {Set<string>} allResourceBindings - A Set to which all discovered resource binding values will be added.
 */
function addTableColumnsResourceBindingsFromCustomComponent(componentProps, allResourceBindings) {
    if (componentProps?.tableColumns) {
        for (const tableColumn of Object.values(componentProps.tableColumns)) {
            for (const bindingValue of Object.values(tableColumn?.resourceBindings || {})) {
                allResourceBindings.add(bindingValue);
            }
        }
    }
    return allResourceBindings;
}

/**
 * Adds text resource binding values from a component's properties to a set of all resource bindings.
 *
 * Iterates over the `textResourceBindings` property of the given component's props, and adds each string value
 * to the provided `allResourceBindings` set. This is useful for collecting all unique resource binding keys
 * used by a component.
 *
 * @param {Object} componentProps - The properties of the component, potentially containing text resource bindings.
 * @param {Set<string>} allResourceBindings - A set to which all found resource binding strings will be added.
 */
function addResourceBindingsFromAltinnComponent(componentProps, allResourceBindings) {
    if (componentProps?.textResourceBindings) {
        for (const bindingValue of Object.values(componentProps.textResourceBindings)) {
            if (typeof bindingValue === "string") {
                allResourceBindings.add(bindingValue);
            }
        }
    }
    if (componentProps?.options?.length) {
        for (const option of componentProps.options) {
            if (option?.label?.length) {
                allResourceBindings.add(option.label);
            }
        }
    }
}

/**
 * Returns an array of text resource IDs that are present in the provided text resources
 * but not used in the given set of resource bindings.
 *
 * @param {Set<string>} allResourceBindings - A set containing all used resource binding IDs.
 * @param {Object} textResources - An object containing text resources, expected to have a `resources` array.
 * @param {Array<{id: string}>} [textResources.resources] - Array of text resource objects, each with an `id` property.
 * @returns {string[]} An array of unused text resource IDs.
 */
function getUnusedResourceBindings(allResourceBindings, textResources) {
    const unusedResourceBindings = [];
    const textResourceIds = textResources?.resources?.map((res) => res.id) || [];
    for (const resId of textResourceIds) {
        if (!allResourceBindings.has(resId)) {
            unusedResourceBindings.push(resId);
        }
    }
    return unusedResourceBindings;
}

/**
 * Returns an array of duplicate text resource IDs from the provided text resources object.
 *
 * @param {Object} textResources - The object containing text resources.
 * @param {Array<{id: string}>} textResources.resources - The array of text resource objects, each with an `id` property.
 * @returns {string[]} An array of resource IDs that appear more than once.
 */
function getDuplicateTextResources(textResources) {
    const duplicateResourceBindings = [];
    const textResourceIds = textResources?.resources?.map((res) => res.id) || [];
    const resourceIdCounts = textResourceIds.reduce((acc, id) => {
        acc[id] = (acc[id] || 0) + 1;
        return acc;
    }, {});
    for (const [resId, count] of Object.entries(resourceIdCounts)) {
        if (count > 1) {
            duplicateResourceBindings.push(resId);
        }
    }
    return duplicateResourceBindings;
}

/**
 * Returns an array of resource binding IDs that are missing from the provided text resources.
 *
 * @param {string[]} allResourceBindings - An array of all resource binding IDs to check.
 * @param {Object} textResources - An object containing text resources.
 * @param {Array<{ id: string }>} textResources.resources - An array of text resource objects, each with an `id` property.
 * @returns {string[]} An array of resource binding IDs that are not present in the text resources.
 */
function getMissingResourceBindings(allResourceBindings, textResources) {
    const missingResourceBindings = [];
    const textResourceIds = textResources?.resources?.map((res) => res.id) || [];
    for (const resId of allResourceBindings) {
        if (resId.length && !textResourceIds.includes(resId)) {
            missingResourceBindings.push(resId);
        }
    }
    return missingResourceBindings;
}

/**
 * Returns an array of IDs for text resources that have an empty string as their value.
 *
 * @param {Object} textResources - The object containing text resources, expected to have a `resources` array property.
 * @param {Array<{id: string, value: string}>} [textResources.resources] - The array of text resource objects.
 * @returns {string[]} An array of resource IDs where the value is an empty string.
 */
function getTextResourcesWithEmptyValue(textResources) {
    const resourcesWithEmptyValue = [];
    const textResourceEntries = textResources?.resources || [];
    for (const res of textResourceEntries) {
        if (res.value === "") {
            resourcesWithEmptyValue.push(res.id);
        }
    }
    return resourcesWithEmptyValue;
}

/**
 * Validates the usage of text resources in the application layout.
 *
 * This function checks for:
 * - Unused resource bindings that are defined but not used in the layout.
 * - Text resources that have empty values.
 * - Missing resource bindings that are used in the layout but not defined in the text resources.
 *
 * It collects all resource bindings from both Altinn and custom components,
 * compares them with the available text resources, and returns the validation results.
 *
 * @returns {Object} An object containing arrays of unused resource bindings,
 *                   missing resource bindings, and text resources with empty values.
 */
export function validateResources() {
    const altinnResourceBindings = [
        "signing.summary.title.override",
        "signing.summary.title",
        "pdfPreviewText",
        "appOwner",
        "appName",
        "resource.attachmentList.title"
    ];
    const allResourceBindings = new Set(altinnResourceBindings);
    const componentCode = getLayoutCode();
    const textResources = getTextResources();
    let components = [];
    if (Array.isArray(componentCode)) {
        components = componentCode;
    } else {
        components = [componentCode];
    }
    for (const componentProps of components) {
        const isCustomComponent = componentProps?.tagName?.length && componentProps?.type === "Custom";
        componentProps.formData = getDataForComponent(componentProps);

        if (isCustomComponent) {
            addResourceBindingsFromCustomComponent(componentProps, allResourceBindings);
        } else {
            addResourceBindingsFromAltinnComponent(componentProps, allResourceBindings);
        }
    }
    const unusedResourceBindings = getUnusedResourceBindings(allResourceBindings, textResources);
    const missingResourceBindings = getMissingResourceBindings(allResourceBindings, textResources);
    const emptyTextResources = getTextResourcesWithEmptyValue(textResources);
    const validationResults = {
        unusedResourceBindings,
        missingResourceBindings,
        emptyTextResources
    };
    return validationResults;
}

/**
 * Renders validation messages based on the provided validation results.
 *
 * @param {Object} validationResults - The results of the validation.
 * @param {string[]} validationResults.missingResourceBindings - Array of resource IDs that are missing.
 * @param {string[]} validationResults.unusedResourceBindings - Array of resource IDs that are unused.
 * @param {string[]} validationResults.emptyTextResources - Array of resource IDs with empty values.
 * @returns {ValidationMessages} An instance of ValidationMessages containing error and info messages.
 */
export function renderValidationMessages(validationResults) {
    const validationMessages = new ValidationMessages({
        error: validationResults.missingResourceBindings.map((resId) => `Missing text resource: ${resId}`),
        warning: validationResults.unusedResourceBindings.map((resId) => `Unused text resource: ${resId}`),
        info: validationResults.emptyTextResources.map((resId) => `Text resource with empty value: ${resId}`)
    });
    return validationMessages;
}
