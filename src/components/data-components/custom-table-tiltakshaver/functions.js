// Classes
import Part from "../../../classes/data-classes/Part.js";

// Global functions
import { hasValue } from "../../../functions/helpers.js";

/**
 * Retrieves a Part instance from the given component if it contains valid form data.
 *
 * @param {Object} component - The component object containing form data.
 * @param {Object} [component.formData] - The form data object within the component.
 * @param {any} [component.formData.data] - The data to be used for creating a Part instance.
 * @returns {Part|boolean} - A new Part instance if the data is valid, otherwise `false`.
 */
export function getPart(component) {
    return hasValue(component?.formData?.data) && new Part(component.formData.data);
}
