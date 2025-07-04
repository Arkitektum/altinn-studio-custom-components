// Classes
import CustomComponent from "../CustomComponent.js";

// Global functions
import { getTextResourceFromResourceBinding, hasValue, validateFormData } from "../../../functions/helpers.js";

/**
 * CustomFieldBooleanData is a custom component class for handling boolean-based form data.
 * It extends the CustomComponent class and provides logic for extracting, validating,
 * and presenting boolean data with support for resource bindings and empty state handling.
 *
 * @class
 * @extends CustomComponent
 *
 * @param {Object} props - The properties object containing data and configuration for the component.
 * @param {Object} [props.resourceBindings] - Resource bindings for text resources.
 * @param {string} [props.resourceBindings.title] - Resource key for the title.
 * @param {string} [props.resourceBindings.emptyFieldText] - Resource key for the empty field text.
 * @param {boolean} [props.isEmpty] - Optional flag to explicitly set the empty state.
 * @param {Object} [props.formData] - Form data containing boolean and related values.
 * @param {boolean|string} [props.formData.simpleBinding] - The boolean value or string representation.
 * @param {string|number|boolean} [props.formData.trueData] - Data to use if condition is true.
 * @param {string|number|boolean} [props.formData.falseData] - Data to use if condition is false.
 * @param {string|number|boolean} [props.formData.defaultData] - Data to use if condition is neither true nor false.
 *
 * @property {boolean} isEmpty - Indicates if the field is considered empty.
 * @property {Object} resourceValues - Contains resolved text resources for title and text.
 *
 * @example
 * const component = new CustomFieldBooleanData({
 *   resourceBindings: { title: 'field.title', emptyFieldText: 'field.empty' },
 *   formData: { simpleBinding: true, trueData: 'Yes', falseData: 'No', defaultData: 'N/A' }
 * });
 */
export default class CustomFieldBooleanData extends CustomComponent {
    constructor(props) {
        super(props);
        const formDataValue = this.getValueFromFormData(props);
        const isEmpty = props?.isEmpty !== undefined ? props.isEmpty : !this.hasContent(formDataValue);

        this.isEmpty = isEmpty;
        this.resourceValues = {
            title: getTextResourceFromResourceBinding(props?.resourceBindings?.title),
            text: isEmpty ? getTextResourceFromResourceBinding(props?.resourceBindings?.emptyFieldText) : formDataValue
        };
    }

    /**
     * Determines if the provided form data value contains content.
     *
     * @param {*} formDataValue - The value from the form data to check.
     * @returns {boolean} True if the form data value has content; otherwise, false.
     */
    hasContent(formDataValue) {
        return hasValue(formDataValue);
    }

    /**
     * Extracts form data from the provided props object.
     *
     * @param {Object} props - The properties object containing data for the component.
     * @returns {Object} An object with a `simpleBinding` property set to the boolean data extracted from props.
     */
    getFormDataFromProps(props) {
        return {
            simpleBinding: this.getBooleanData(props)
        };
    }

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
    getValueFromFormData(component) {
        const componentName = component?.id?.length && typeof component?.id === "string" ? component.id : "custom-field-boolean-data";
        const condition = component?.formData?.simpleBinding;
        const data = {
            trueData: component?.formData?.trueData !== undefined && component.formData.trueData.toString(),
            falseData: component?.formData?.falseData !== undefined && component.formData.falseData.toString(),
            defaultData: component?.formData?.defaultData !== undefined && component.formData.defaultData.toString()
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
}
