// Global functions
import { formatString } from "../../../functions/dataFormatHelpers.js";
import { hasValue } from "../../../functions/helpers.js";

/**
 * Retrieves the form data value from the given component.
 *
 * @param {Object} component - The component object containing form data and format information.
 * @param {Object} component.formData - The form data object.
 * @param {string} component.formData.simpleBinding - The simple binding value of the form data.
 * @param {string} [component.format] - The optional format string to format the simple binding value.
 * @param {string} [component.emptyFieldText] - The text to return if the form data value is not present.
 * @returns {string} - The formatted form data value, the simple binding value, or the empty field text.
 */
export function getFormDataValue(component) {
    if (hasValue(component?.formData?.simpleBinding)) {
        if (component?.format) {
            return formatString(component?.formData?.simpleBinding, component?.format);
        }
        return component?.formData?.simpleBinding;
    }
    return component?.emptyFieldText;
}
