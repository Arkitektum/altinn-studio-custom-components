// Classes
import ValidationMessages from "../../src/classes/system-classes/ValidationMessages.js";

// Local functions
import { getLayoutCode, getTextResources } from "./localStorage.js";

// Global functions
import { instantiateComponent } from "../../src/functions/componentHelpers.js";
import { getDataForComponent, getDefaultValueForResource } from "./getters.js";
import { getDefaultTextResources } from "../../src/functions/helpers.js";

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
        // Exclude Altinn specific resources
        if (!allResourceBindings.has(resId) && !resId.startsWith("altinn.")) {
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
 * @param {{ resources: { id: string }[] }} textResources - An object containing an array of text resources with their IDs.
 * @param {{ resources: { id: string }[] }} defaultTextResources - An object containing an array of default text resources with their IDs.
 * @returns {string[]} An array of resource binding IDs that are not found in either the provided or default text resources.
 */
function getMissingResourceBindings(allResourceBindings, textResources, defaultTextResources) {
    const missingResourceBindings = [];
    const textResourceIds = textResources?.resources?.map((res) => res.id) || [];
    const defaultTextResourceIds = defaultTextResources?.resources?.map((res) => res.id) || [];
    // Combine text resource IDs from both provided and default text resources
    Array.prototype.push.apply(textResourceIds, defaultTextResourceIds);
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
 * Validates resource bindings and text resources used in the application.
 *
 * This function collects all resource bindings from both Altinn and custom components,
 * compares them with the available text resources and default text resources,
 * and returns validation results including unused, missing, duplicate, and empty text resources.
 *
 * @returns {Object} validationResults - An object containing the following properties:
 *   @property {Array<string>} unusedResourceBindings - Resource bindings that are not used in text resources.
 *   @property {Array<string>} missingResourceBindings - Resource bindings that are missing from text resources and default text resources.
 *   @property {Array<string>} duplicateTextResources - Text resource keys that are duplicated.
 *   @property {Array<string>} emptyTextResources - Text resource keys that have empty values.
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
    const defaultTextResources = getDefaultTextResources();
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
    const missingResourceBindings = getMissingResourceBindings(allResourceBindings, textResources, defaultTextResources);
    const duplicateTextResources = getDuplicateTextResources(textResources);
    const emptyTextResources = getTextResourcesWithEmptyValue(textResources);
    const validationResults = {
        unusedResourceBindings,
        missingResourceBindings,
        duplicateTextResources,
        emptyTextResources
    };
    return validationResults;
}

/**
 * Renders validation messages based on the provided validation results.
 *
 * @param {Object} validationResults - The results of the validation process.
 * @param {string[]} validationResults.missingResourceBindings - List of resource IDs that are missing.
 * @param {string[]} validationResults.duplicateTextResources - List of resource IDs that are duplicated.
 * @param {string[]} validationResults.unusedResourceBindings - List of resource IDs that are unused.
 * @param {string[]} validationResults.emptyTextResources - List of resource IDs that are empty.
 * @returns {ValidationMessages} An instance of ValidationMessages containing error, warning, and info messages.
 */
export function renderValidationMessages(validationResults) {
    const validationMessages = new ValidationMessages({
        error: validationResults.missingResourceBindings
            .map((resId) => {
                const defaultValue = getDefaultValueForResource(resId);
                if (defaultValue !== null) {
                    return `Missing resource: ${resId}\nDefault value: "${defaultValue}"`;
                }
                return `Missing resource: ${resId}`;
            })
            .concat(validationResults.duplicateTextResources.map((resId) => `Duplicate resource: ${resId}`)),
        warning: validationResults.unusedResourceBindings.map((resId) => `Unused resource: ${resId}`),
        info: validationResults.emptyTextResources.map((resId) => `Empty resource: ${resId}`)
    });
    return validationMessages;
}
