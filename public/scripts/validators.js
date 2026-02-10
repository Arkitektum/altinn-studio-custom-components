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
 * Checks if a given resource ID exists in the provided app resource values.
 *
 * @param {string} resourceId - The ID of the resource to check for.
 * @param {Array<{id: string}>} appResourceValues - An array of app resource objects, each expected to have an `id` property.
 * @returns {boolean} Returns true if the resource ID is found in the app resource values, otherwise false.
 */
function hasAppResourceValue(resourceId, appResourceValues) {
    return appResourceValues?.some((res) => res.id === resourceId);
}

/**
 * Identifies missing resource bindings and literal values from a list of resource binding IDs.
 *
 * @param {string[]} allResourceBindings - Array of all resource binding IDs to check.
 * @param {Object} textResources - Object containing text resources, expected to have a `resources` array with `id` properties.
 * @param {Object} defaultTextResources - Object containing default text resources, expected to have a `resources` array with `id` properties.
 * @returns {{ missingResourceBindings: string[], literalValues: string[] }}
 *   An object containing:
 *     - missingResourceBindings: IDs not found in either textResources or defaultTextResources and not literal values.
 *     - literalValues: IDs containing spaces, considered as literal values.
 */
export function getMissingResourceBindings(allResourceBindings, textResources, defaultTextResources) {
    const missingResourceBindings = [];
    const literalValues = [];
    const textResourceIds = textResources?.resources?.map((res) => res.id) || [];
    const defaultTextResourceIds = defaultTextResources?.resources?.map((res) => res.id) || [];
    // Combine text resource IDs from both provided and default text resources
    Array.prototype.push.apply(textResourceIds, defaultTextResourceIds);
    for (const resId of allResourceBindings) {
        if (resId.length && !textResourceIds.includes(resId)) {
            if (resId.includes(" ")) {
                literalValues.push(resId);
                continue;
            }
            missingResourceBindings.push(resId);
        }
    }
    return { missingResourceBindings, literalValues };
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
 * Extracts and adds resource bindings from a component to the provided resourceBindingsSet.
 *
 * Depending on the component type (custom or Altinn), it delegates to the appropriate handler
 * to add resource bindings. It also updates the component's formData property.
 *
 * @param {Set} resourceBindingsSet - The set to which resource bindings will be added.
 * @param {Object} componentProps - The properties of the component, including tagName, type, and others.
 * @param {string} [componentType="all"] - The type of component to process ("custom", "altinn", or "all").
 */
export function getResourceBindingsFromComponent(resourceBindingsSet, componentProps, componentType = "all") {
    const isCustomComponent = componentProps?.tagName?.length && componentProps?.type === "Custom";
    componentProps.formData = getDataForComponent(componentProps);

    if (isCustomComponent && (componentType === "custom" || componentType === "all")) {
        addResourceBindingsFromCustomComponent(componentProps, resourceBindingsSet);
    } else if (!isCustomComponent && (componentType === "altinn" || componentType === "all")) {
        addResourceBindingsFromAltinnComponent(componentProps, resourceBindingsSet);
    }
}

/**
 * Extracts resource bindings from an array of component properties and adds them to the provided Set.
 *
 * @param {Set} resourceBindingsSet - A Set to collect unique resource bindings.
 * @param {Array<Object>} componentsArray - An array of component property objects to process.
 * @param {string} [componentType="all"] - Optional. The type of components to filter by; defaults to "all".
 * @returns {Set} The updated Set containing all found resource bindings.
 */
export function getResourceBindingsFromComponents(resourceBindingsSet, componentsArray, componentType = "all") {
    for (const componentProps of componentsArray) {
        getResourceBindingsFromComponent(resourceBindingsSet, componentProps, componentType);
    }
    return resourceBindingsSet;
}

/**
 * Extracts resource bindings from a layout and adds them to the provided resourceBindingsSet.
 *
 * @param {Set} resourceBindingsSet - A set to collect resource bindings.
 * @param {Object} layout - The layout object containing component data.
 * @param {string} [componentType="all"] - The type of components to filter by, or "all" for no filtering.
 * @returns {Set} The updated set of resource bindings.
 */
export function getResourceBindingsFromLayout(resourceBindingsSet, layout, componentType = "all") {
    const componentsArray = Array.isArray(layout?.layout?.data?.layout) && layout.layout.data.layout;
    if (componentsArray) {
        getResourceBindingsFromComponents(resourceBindingsSet, componentsArray, componentType);
    }
    return resourceBindingsSet;
}

/**
 * Retrieves a set of resource bindings used in the provided applications, optionally filtered by component type.
 *
 * @param {Array<Object>} applications - An array of application objects to extract resource bindings from.
 * @param {string} [componentType="all"] - The type of component to filter resource bindings by. Defaults to "all".
 * @returns {Set<any>} A set containing the resource bindings found in the applications.
 */
export function getResourceBindingsWithUsageFromApplications(applications, componentType = "all") {
    const resourceBindingsSet = new Set();
    for (const application of applications) {
        getResourceBindingsFromLayout(resourceBindingsSet, application, componentType);
    }
    return resourceBindingsSet;
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
    const componentCode = getLayoutCode();
    const textResources = getTextResources();
    const defaultTextResources = getDefaultTextResources();
    let components = [];
    if (Array.isArray(componentCode)) {
        components = componentCode;
    } else {
        components = [componentCode];
    }

    const altinnResourceBindings = [
        "signing.summary.title.override",
        "signing.summary.title",
        "pdfPreviewText",
        "appOwner",
        "appName",
        "resource.attachmentList.title"
    ];
    const resourceBindingsSet = new Set(altinnResourceBindings);
    const allResourceBindings = getResourceBindingsFromComponents(resourceBindingsSet, components, "all");

    const unusedResourceBindings = getUnusedResourceBindings(allResourceBindings, textResources);
    const { missingResourceBindings, literalValues } = getMissingResourceBindings(allResourceBindings, textResources, defaultTextResources);
    const duplicateTextResources = getDuplicateTextResources(textResources);
    const emptyTextResources = getTextResourcesWithEmptyValue(textResources);
    const validationResults = {
        unusedResourceBindings,
        missingResourceBindings,
        literalValues,
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
 * @param {string[]} validationResults.literalValues - List of resource IDs that are literal values.
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
        warning: validationResults.unusedResourceBindings
            .map((resId) => `Unused resource: ${resId}`)
            .concat(validationResults.literalValues.map((resId) => `Literal value: ${resId}`)),
        info: validationResults.emptyTextResources.map((resId) => `Empty resource: ${resId}`)
    });
    return validationMessages;
}

/**
 * Checks if a given resource is used in a custom component.
 *
 * @param {Object} component - The component object to check.
 * @param {Object} resource - The resource object to look for, expected to have an `id` property.
 * @returns {boolean|undefined} Returns true if the resource is used in the component, false otherwise. Returns undefined if the component is not a custom component.
 */
export function resourceIsUsedInComponent(component, resource) {
    const isCustomComponent = component?.tagName?.length && component?.type === "Custom";
    if (isCustomComponent) {
        const allResourceBindings = new Set();
        addResourceBindingsFromCustomComponent(component, allResourceBindings);
        return allResourceBindings.has(resource?.id);
    }
}

/**
 * Retrieves all components from a layout that use a specified resource.
 *
 * @param {Object} layout - The layout object containing component data.
 * @param {*} resource - The resource to check for usage within components.
 * @returns {Array<Object>} An array of components that use the specified resource.
 */
export function getResourceUsageForLayout(layout, resource) {
    const componentsInLayout = Array.isArray(layout?.layout?.data?.layout) && layout.layout.data.layout;
    const componentsUsingResource = [];
    if (componentsInLayout) {
        for (const component of componentsInLayout) {
            if (resourceIsUsedInComponent(component, resource)) {
                componentsUsingResource.push(component);
            }
        }
    }
    return componentsUsingResource;
}

/**
 * Retrieves the usage of a specific resource across multiple layouts.
 *
 * @param {Array<Object>} layouts - An array of layout objects to search through.
 * @param {string} resource - The resource identifier to look for in the layouts.
 * @returns {Array<Object>} An array of objects, each containing:
 *   - {string} appOwner: The owner of the app.
 *   - {string} appName: The name of the app.
 *   - {Array} componentsUsingResource: List of components in the layout that use the specified resource.
 */
export function getResourceUsage(layouts, resource) {
    return layouts
        .map((layout) => ({
            appOwner: layout.appOwner,
            appName: layout.appName,
            componentsUsingResource: getResourceUsageForLayout(layout, resource)
        }))
        .filter((usage) => usage.componentsUsingResource.length > 0);
}

/**
 * Returns an array describing the usage of each resource within the provided layouts.
 *
 * @param {Object} layouts - The layout definitions to search for resource usage.
 * @param {Array} resources - An array of resource identifiers to check usage for.
 * @returns {Array<Object>} An array of objects, each containing a `resource` and its corresponding `usage`.
 */
export function getUsageForResources(layouts, resources) {
    return resources.map((resource) => ({
        resource,
        usage: getResourceUsage(layouts, resource)
    }));
}
