// Classes
import CustomComponent from "../CustomComponent.js";

// Global functions
import { getTextResourcesFromResourceBindings, hasValue, validateFormData } from "../../../functions/helpers.js";

/**
 * CustomFieldBooleanData is a custom component class for handling boolean-based form data.
 * It extends the CustomComponent class and provides logic for extracting, validating,
 * and representing boolean data with associated text resources.
 *
 * @class
 * @extends CustomComponent
 *
 * @param {HTMLElement|Object} element - The DOM element or props object used to initialize the component.
 *
 * @property {boolean} isEmpty - Indicates whether the form data is considered empty.
 * @property {Object} formData - The extracted form data for the component.
 * @property {Object} texts - The text resources associated with the component.
 * @property {string} text - The title text from the text resources.
 */
export default class CustomFieldBooleanData extends CustomComponent {
    constructor(element) {
        super(element);
        const textResources = typeof window !== "undefined" && window.textResources ? window.textResources : [];

        const props = element instanceof HTMLElement ? super.getPropsFromElementAttributes(element) : element;
        const texts =
            element instanceof HTMLElement ? getTextResourcesFromResourceBindings(textResources, props?.textResourceBindings) : element.texts;

        const formData = this.getFormDataFromProps(props);
        const isEmpty = props?.isEmpty !== undefined ? props.isEmpty : !this.hasContent(formData);

        this.isEmpty = isEmpty;
        this.formData = formData;
        this.texts = texts;
        this.text = texts?.title;
    }

    /**
     * Checks if the provided form data contains a value in the `simpleBinding` property.
     *
     * @param {Object} formData - The form data object to check.
     * @param {*} formData.simpleBinding - The value to check for content.
     * @returns {boolean} Returns true if `simpleBinding` has a value, otherwise false.
     */
    hasContent(formData) {
        return hasValue(formData?.simpleBinding);
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
    getBooleanData(component) {
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
