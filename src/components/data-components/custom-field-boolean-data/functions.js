// Global functions
import { getEmptyFieldText, hasValue } from "../../../functions/helpers.js";

/**
 * Retrieves the value from the component's form data if available,
 * otherwise returns a placeholder or empty field text.
 *
 * @param {Object} component - The component object containing form data.
 * @param {Object} component.formData - The form data object.
 * @param {*} component.formData.simpleBinding - The value bound to the form data.
 * @returns {*} The value from simpleBinding if present, otherwise the result of getEmptyFieldText.
 */
export function getFormDataValue(component) {
    if (hasValue(component?.formData?.simpleBinding)) {
        return component?.formData?.simpleBinding;
    }
    return getEmptyFieldText(component);
}
