// Classes
import Eiendom from "../../../classes/data-classes/Eiendom.js";

// Global functions
import { hasValue } from "../../../functions/helpers.js";

/**
 * Retrieves a list of Eiendom objects from the component's form data.
 *
 * @param {Object} component - The component object containing form data.
 * @param {Object} [component.formData] - The form data object within the component.
 * @param {Array} [component.formData.data] - The array of data representing eiendom entries.
 * @returns {Array<Eiendom>|boolean} An array of Eiendom objects if the data exists and is valid,
 *                                   otherwise returns false.
 */
export function getEiendomList(component) {
    return hasValue(component?.formData?.data) ? component.formData.data.map((eiendom) => new Eiendom(eiendom)) : undefined;
}
