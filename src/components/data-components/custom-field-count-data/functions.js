/**
 * Calculates the count of items in the `data` array within the `formData` property of a component.
 *
 * @param {Object} component - The component object containing form data.
 * @param {Object} [component.formData] - The form data object of the component.
 * @param {Array} [component.formData.data] - The data array within the form data.
 * @returns {number} The count of items in the `data` array, or 0 if it is not an array or does not exist.
 */
export function getFormDataCount(component) {
    return component?.formData?.data && Array.isArray(component?.formData?.data) ? component.formData.data.length : 0;
}
