/**
 * Extracts values from a list of objects based on a specified key.
 *
 * @param {Array<Object>} items - The list of objects to extract values from.
 * @param {string} itemKey - The key whose values need to be extracted.
 * @returns {Array<*>} An array of values corresponding to the specified key from each object in the list.
 */
export function getListItemsFromKey(items, itemKey) {
    return items.map((item) => item?.[itemKey]);
}
