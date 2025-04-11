// Classes
import UtfallSvar from "../../../classes/data-classes/UtfallSvar.js";

// Global functions
import { hasValue } from "../../../functions/helpers.js";

/**
 * Groups an array of items by the `utfallType.kodverdi` property.
 *
 * @param {Array} array - The array of items to be grouped.
 * @returns {Object} An object where each key is a unique `utfallType.kodverdi` and the value is an array of `UtfallSvar` instances.
 */
export function groupArrayItemsByUtfallType(array) {
    return hasValue(array)
        ? array.reduce((acc, obj) => {
              const key = obj?.utfallType?.kodeverdi;
              if (!key?.length) {
                  return acc;
              }
              if (!acc[key]) {
                  acc[key] = [];
              }
              acc[key].push(new UtfallSvar(obj));
              return acc;
          }, {})
        : {};
}
