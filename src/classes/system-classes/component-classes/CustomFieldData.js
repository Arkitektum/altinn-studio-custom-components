// Classes
import CustomComponent from "../CustomComponent.js";

// Global functions
import { getComponentDataValue, getTextResourceFromResourceBinding, hasValue } from "../../../functions/helpers.js";

/**
 * CustomFieldData is a custom component class that manages field data and resource values
 * for a form component. It determines if the field is empty and sets resource values
 * for title and text based on the field's state.
 *
 * @extends CustomComponent
 *
 * @param {Object} props - The properties passed to the component.
 * @param {Object} [props.formData] - The form data object.
 * @param {*} [props.formData.simpleBinding] - The value to retrieve from form data.
 * @param {Object} [props.resourceBindings] - Resource bindings for the component.
 * @param {string} [props.resourceBindings.title] - Resource key for the title.
 * @param {string} [props.resourceBindings.emptyFieldText] - Resource key for the empty field text.
 * @param {boolean} [props.isEmpty] - Optional flag to explicitly set if the field is empty.
 *
 * @property {boolean} isEmpty - Indicates whether the field is empty.
 * @property {Object} resourceValues - Contains the resolved title and text resources for the component.
 * @property {string} resourceValues.title - The resolved title resource.
 * @property {*} resourceValues.data - The resolved text resource or form data value.
 */
export default class CustomFieldData extends CustomComponent {
    constructor(props) {
        super(props);
        const data = this.getValueFromFormData(props);
        const isEmpty = !this.hasContent(data);

        this.isEmpty = isEmpty;
        this.resourceValues = {
            title: getTextResourceFromResourceBinding(props?.resourceBindings?.title),
            data: isEmpty ? getTextResourceFromResourceBinding(props?.resourceBindings?.emptyFieldText) : data
        };
    }

    /**
     * Checks if the provided form data value contains content.
     *
     * @param {*} formDataValue - The value from the form data to check.
     * @returns {boolean} Returns true if the value has content, otherwise false.
     */
    hasContent(formDataValue) {
        return hasValue(formDataValue);
    }

    /**
     * Retrieves the value of the component from the provided form data properties.
     *
     * @param {Object} props - The properties containing form data for the component.
     * @returns {*} The value extracted from the form data for the component.
     */
    getValueFromFormData(props) {
        return getComponentDataValue(props);
    }
}
