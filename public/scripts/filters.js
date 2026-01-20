/**
 * Filters an array of resource objects based on the specified filter value.
 *
 * @param {Array<Object>} resources - The array of resource objects to filter.
 * @param {string} filterValue - The filter criteria. Can be one of:
 *   - "unused": Returns resources with no usage.
 *   - "used-once": Returns resources used exactly once.
 *   - "missing": Returns resources with undefined usage.
 *   - "all": Returns all resources (default).
 * @returns {Array<Object>} The filtered array of resources.
 */
export function filterResources(resources, filterValue) {
    switch (filterValue) {
        case "unused":
            return resources.filter((res) => res?.usage?.length === 0);
        case "used-once":
            return resources.filter((res) => res?.usage?.length === 1);
        case "missing":
            return resources.filter((res) => res?.usage === undefined);
        case "all":
        default:
            return resources;
    }
}

/**
 * Returns an array of resources from the given list that have the same `value` property
 * as the specified resource, but a different `id`.
 *
 * @param {Array<Object>} resources - The array of resource objects to search through.
 * @param {Object} resource - The resource object to compare against.
 * @returns {Array<Object>} An array of resources with the same value but different id.
 */
export function getResourcesWithSameValue(resources, resource) {
    return resources.filter((res) => {
        return res?.resource?.value === resource?.resource?.value && res?.resource?.id !== resource?.resource?.id;
    });
}
