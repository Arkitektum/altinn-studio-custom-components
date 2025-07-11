// Classes
import CustomComponent from "../CustomComponent.js";

// Global functions
import {
    getComponentBooleanDataValues,
    getComponentDataValue,
    getComponentResourceValue,
    hasValue,
    isNumberLargerThanZero,
    validateFormData
} from "../../../functions/helpers.js";

/**
 * CustomFieldBooleanData is a custom component class for handling boolean-based field data.
 * It extends the CustomComponent class and provides logic to determine and retrieve
 * the appropriate data value based on a boolean condition from the form data.
 *
 * @class
 * @extends CustomComponent
 *
 * @param {Object} props - The properties passed to the component.
 * @param {Object} props.id - The unique identifier for the component.
 * @param {Object} props.formData - The form data associated with the component.
 * @param {Object} props.config - The configuration object for the component.
 *
 * @property {boolean} isEmpty - Indicates whether the data value is considered empty.
 * @property {Object} resourceValues - Contains the resource values for the component, including title and data.
 *
 * @example
 * const customField = new CustomFieldBooleanData(props);
 */
export default class CustomFieldBooleanData extends CustomComponent {
    constructor(props) {
        super(props);
        const data = this.getValueFromFormData(props);
        const isEmpty = !this.hasContent(data);

        this.isEmpty = isEmpty;
        this.resourceValues = {
            title: getComponentResourceValue(props, "title"),
            data: isEmpty ? getComponentResourceValue(props, "emptyFieldText") : data
        };
    }

    /**
     * Determines if the provided data value contains content.
     *
     * @param {*} data - The value from the data to check.
     * @returns {boolean} True if the data value has content; otherwise, false.
     */
    hasContent(data) {
        return hasValue(data);
    }

    /**
     * Retrieves the appropriate value from the form data based on the boolean condition of the component.
     *
     * @param {Object} component - The component object containing form data and configuration.
     * @returns {*} The value corresponding to the boolean condition:
     *   - Returns `trueData` if the condition is true,
     *   - Returns `falseData` if the condition is false,
     *   - Returns `defaultData` otherwise.
     *   Returns an empty string if the corresponding value is undefined or null.
     */
    getValueFromFormData(component) {
        const componentName = component?.id?.length && typeof component?.id === "string" ? component.id : "custom-field-boolean-data";
        const condition = getComponentDataValue(component);
        const conditionIsNumberLargerThanZero = isNumberLargerThanZero(condition);
        const booleanDataValues = getComponentBooleanDataValues(component);
        const dataKeys = ["trueData", "falseData", "defaultData"];
        validateFormData(booleanDataValues, dataKeys, componentName);
        if (condition === true || condition === "true" || conditionIsNumberLargerThanZero) {
            return booleanDataValues?.trueData !== undefined && booleanDataValues.trueData !== null ? booleanDataValues.trueData : "";
        } else if (condition === false || condition === "false") {
            return booleanDataValues?.falseData !== undefined && booleanDataValues.falseData !== null ? booleanDataValues.falseData : "";
        } else {
            return booleanDataValues?.defaultData ? booleanDataValues.defaultData : "";
        }
    }
}
