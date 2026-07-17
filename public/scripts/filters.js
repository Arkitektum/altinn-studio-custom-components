/**
 * Filters an array of resource objects based on the specified filter value.
 *
 * @param {Array<Object>} resources - The array of resource objects to filter.
 * @param {string} filterValue - The filter criteria. Can be one of:
 *   - "unused": Returns resources with no usage.
 *   - "used-once": Returns resources used exactly once.
 *   - "with-duplicates": Returns resources that have duplicate values.
 *   - "missing": Returns resources with undefined usage.
 *   - "missing-with-local-value": Returns resources that are missing but have a local value.
 *   - "missing-nb-translations": Returns resources missing Norwegian Bokmål translations.
 *   - "missing-nn-translations": Returns resources missing Norwegian Nynorsk translations.
 *   - "missing-en-translations": Returns resources missing English translations.
 *   - "deprecated": Returns resources that are deprecated.
 *   - "all": Returns all resources (default).
 * @returns {Array<Object>} The filtered array of resources.
 */
export function filterResources(resources, filterValue) {
    switch (filterValue) {
        case "unused":
            return resources.filter((res) => res?.usage?.length === 0 && res?.missingFromDefaultTextResources !== true);
        case "used-once":
            return resources.filter((res) => res?.usage?.length === 1 && res?.missingFromDefaultTextResources !== true);
        case "with-duplicates":
            return resources.filter((res) => getResourcesWithSameValue(resources, res).length > 0 && res?.missingFromDefaultTextResources !== true);
        case "deprecated":
            return resources.filter((res) => res?.resource?.replacedWithId?.length > 0);
        case "missing":
            return resources.filter((res) => res?.presence === "missing");
        case "missing-with-local-value":
            return resources.filter((res) => res?.presence === "localValue");
        case "missing-nb-translations":
            return resources.filter((res) => !res?.resource?.values?.nb);
        case "missing-nn-translations":
            return resources.filter((res) => !res?.resource?.values?.nn);
        case "missing-en-translations":
            return resources.filter((res) => !res?.resource?.values?.en);
        case "all":
            return resources.filter((res) => res?.missingFromDefaultTextResources !== true);
        default:
            return resources;
    }
}

/**
 * Filters a list of resources to include only those used by a specific application.
 *
 * An application is identified by the combination of its owner and name, since the same app name can exist under
 * different owners. When both are falsy the list is returned unchanged; when only one is provided, only that field
 * is matched.
 *
 * @param {Array<Object>} resources - The array of resource objects to filter.
 * @param {string} appOwner - The owner of the application to filter resources by.
 * @param {string} appName - The name of the application to filter resources by.
 * @returns {Array<Object>} The filtered array of resources used by the specified application.
 */
export function filterResourcesByApplication(resources, appOwner, appName) {
    if (!appOwner && !appName) {
        return resources;
    }
    return resources.filter((res) => {
        return res?.usage?.some((usage) => (!appOwner || usage.appOwner === appOwner) && (!appName || usage.appName === appName));
    });
}

/**
 * Filters an array of text resource objects based on a text input and a matching criterion.
 *
 * @param {Array<Object>} resources - The array of resource objects to filter.
 * @param {string} textFilter - The text input to filter resources by.
 * @param {'id'|'value'} matchBy - The property to match the filter against ('id' or 'value').
 * @returns {Array<Object>} The filtered array of resource objects.
 */
export function filterTextResourcesByTextInput(resources, textFilter, matchBy) {
    if (!textFilter?.length) {
        return resources;
    }
    const lowerCaseTextFilter = textFilter.toLowerCase();
    return resources.filter((res) => {
        if (matchBy === "id") {
            return res?.resource?.id?.toString().toLowerCase().includes(lowerCaseTextFilter);
        } else if (matchBy === "value") {
            return Object.values(res?.resource?.values || {}).some((value) => value?.toString().toLowerCase().includes(lowerCaseTextFilter));
        }
        return false;
    });
}

/**
 * Returns an array of resources from the given list that have the same `resource.values.nb`
 * as the specified resource, but a different `resource.id`, and are not marked as missing
 * from default text resources.
 *
 * @param {Array<Object>} resources - The array of resource objects to search through.
 * @param {Object} resource - The resource object to compare against.
 * @returns {Array<Object>} An array of resources matching the criteria, or an empty array if none found.
 */
export function getResourcesWithSameValue(resources, resource) {
    return Array.isArray(resources) && resources.length > 0
        ? resources.filter((res) => {
              return (
                  resource?.resource?.values?.nb?.length > 0 &&
                  res?.resource?.values?.nb === resource?.resource?.values?.nb &&
                  res?.resource?.id !== resource?.resource?.id &&
                  res?.missingFromDefaultTextResources !== true
              );
          })
        : [];
}

/**
 * Tag names of the base components. Source of truth: the directories under src/components/base-components.
 * Any component that is neither a base nor a layout component is treated as a data component (the catch-all),
 * so only these two smaller sets need to be listed explicitly.
 */
export const BASE_COMPONENT_TAG_NAMES = [
    "custom-description-list",
    "custom-divider",
    "custom-feedback",
    "custom-field",
    "custom-header",
    "custom-list",
    "custom-matrix",
    "custom-paragraph",
    "custom-summation",
    "custom-table"
];

/**
 * Tag names of the layout components. Source of truth: the directories under src/components/layout-components
 * (their tag names are the directory name prefixed with "custom-").
 */
export const LAYOUT_COMPONENT_TAG_NAMES = ["custom-dispensasjon", "custom-dispensasjonsvarsel", "custom-gjennomfoeringsplan", "custom-gjenpart-nabovarsel"];

/**
 * Resolves the category of a component from its tag name.
 *
 * @param {string} tagName - The component tag name (e.g. "custom-field").
 * @returns {"base"|"layout"|"data"} The component category. Anything not explicitly a base or layout component is "data".
 */
export function getComponentType(tagName) {
    if (BASE_COMPONENT_TAG_NAMES.includes(tagName)) {
        return "base";
    }
    if (LAYOUT_COMPONENT_TAG_NAMES.includes(tagName)) {
        return "layout";
    }
    return "data";
}

/**
 * Filters an array of component usage objects based on how many times each component is used.
 *
 * @param {Array<Object>} components - The array of component usage objects, each with a `usages` array.
 * @param {string} filterValue - The filter criteria. Can be one of:
 *   - "unused": Returns components with no usages.
 *   - "used-once": Returns components used exactly once.
 *   - "all": Returns all components (default).
 * @returns {Array<Object>} The filtered array of components.
 */
export function filterComponentsByUsage(components, filterValue) {
    switch (filterValue) {
        case "unused":
            return components.filter((component) => (component?.usages?.length || 0) === 0);
        case "used-once":
            return components.filter((component) => (component?.usages?.length || 0) === 1);
        default:
            return components;
    }
}

/**
 * Filters a list of components to include only those used by a specific application.
 *
 * An application is identified by the combination of its owner and name. When both are falsy the list is returned
 * unchanged; when only one is provided, only that field is matched.
 *
 * @param {Array<Object>} components - The array of component usage objects to filter.
 * @param {string} appOwner - The owner of the application to filter components by.
 * @param {string} appName - The name of the application to filter components by.
 * @returns {Array<Object>} The filtered array of components used by the specified application.
 */
export function filterComponentsByApplication(components, appOwner, appName) {
    if (!appOwner && !appName) {
        return components;
    }
    return components.filter((component) => {
        return component?.usages?.some((usage) => (!appOwner || usage.appOwner === appOwner) && (!appName || usage.appName === appName));
    });
}

/**
 * Filters a list of components by their category ("base", "data" or "layout").
 *
 * @param {Array<Object>} components - The array of component usage objects to filter.
 * @param {string} type - The component category to keep. When falsy, all components are returned.
 * @returns {Array<Object>} The filtered array of components.
 */
export function filterComponentsByType(components, type) {
    if (!type) {
        return components;
    }
    return components.filter((component) => getComponentType(component?.tagName) === type);
}

/**
 * Filters an array of components based on a text input and a matching criterion.
 *
 * @param {Array<Object>} components - The array of component usage objects to filter.
 * @param {string} textFilter - The text input to filter components by.
 * @param {'tag'|'id'} matchBy - Whether to match against the component tag name ('tag') or the ids of its usages ('id').
 * @returns {Array<Object>} The filtered array of components.
 */
export function filterComponentsByTextInput(components, textFilter, matchBy) {
    if (!textFilter?.length) {
        return components;
    }
    const lowerCaseTextFilter = textFilter.toLowerCase();
    return components.filter((component) => {
        if (matchBy === "id") {
            return component?.usages?.some((usage) => usage?.id?.toString().toLowerCase().includes(lowerCaseTextFilter));
        }
        return component?.tagName?.toString().toLowerCase().includes(lowerCaseTextFilter);
    });
}
