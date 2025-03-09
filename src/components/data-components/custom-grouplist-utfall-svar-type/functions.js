import UtfallSvar from "../../../classes/data-classes/UtfallSvar.js";

/**
 * Groups an array of items by the `utfallType.kodverdi` property.
 *
 * @param {Array} array - The array of items to be grouped.
 * @returns {Object} An object where each key is a unique `utfallType.kodverdi` and the value is an array of `UtfallSvar` instances.
 */
export function groupArrayItemsByUtfallType(array) {
    return array.reduce((acc, obj) => {
        const key = obj?.utfallType?.kodeverdi;
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(new UtfallSvar(obj));
        return acc;
    }, {});
}
