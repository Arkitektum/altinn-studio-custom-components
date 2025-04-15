// Global functions
import { validateFormData } from "../../../functions/helpers.js";

/**
 * Retrieves boolean data based on the component's form data and condition.
 *
 * @param {Object} component - The component object containing form data and metadata.
 * @param {string} [component.id] - The ID of the component, used for validation.
 * @param {Object} [component.formData] - The form data associated with the component.
 * @param {boolean|string} [component.formData.simpleBinding] - The condition to determine which data to return.
 * @param {string|number|boolean} [component.formData.trueData] - The data to return if the condition is true.
 * @param {string|number|boolean} [component.formData.falseData] - The data to return if the condition is false.
 * @param {string|number|boolean} [component.formData.defaultData] - The default data to return if the condition is neither true nor false.
 *
 * @returns {string} The appropriate data (trueData, falseData, or defaultData) as a string based on the condition.
 *
 * @throws {Error} If the form data validation fails.
 */
export function getBooleanData(component) {
    const componentName = component?.id?.length && typeof component?.id === "string" ? component.id : "custom-field-boolean-text";
    const condition = component?.formData?.simpleBinding;
    const data = {
        trueData: component?.formData?.trueData.toString(),
        falseData: component?.formData?.falseData.toString(),
        defaultData: component?.formData?.defaultData.toString()
    };
    const dataKeys = ["trueData", "falseData", "defaultData"];
    validateFormData(data, dataKeys, componentName);
    if (condition === true || condition === "true") {
        return data?.trueData !== undefined && data.trueData !== null ? data.trueData : "";
    } else if (condition === false || condition === "false") {
        return data?.falseData !== undefined && data.falseData !== null ? data.falseData : "";
    } else {
        return data?.defaultData ? data.defaultData : "";
    }
}
