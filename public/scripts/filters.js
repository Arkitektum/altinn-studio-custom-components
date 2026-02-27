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
        case "missing":
            return resources.filter((res) => res?.presence === "missing");
        case "missing-with-local-value":
            return resources.filter((res) => res?.presence === "localValue");
        case "all":
            return resources.filter((res) => res?.missingFromDefaultTextResources !== true);
        default:
            return resources;
    }
}

/**
 * Filters a list of resources to include only those used by a specific application.
 *
 * @param {Array<Object>} resources - The array of resource objects to filter.
 * @param {string} appName - The name of the application to filter resources by.
 * @returns {Array<Object>} The filtered array of resources used by the specified application.
 */
export function filterResourcesByApplication(resources, appName) {
    if (!appName) {
        return resources;
    }
    return resources.filter((res) => {
        return res?.usage?.some((usage) => usage.appName === appName);
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
