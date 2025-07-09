// Classes
import CustomComponent from "../CustomComponent.js";

// Global functions
import { getComponentDataValue, getComponentResourceValue, hasValue } from "../../../functions/helpers.js";

/**
 * CustomFieldData is a class that extends CustomComponent to handle custom field data logic.
 * It initializes resource values based on the presence of content in the form data and manages
 * display properties such as title and empty field text.
 *
 * @class
 * @extends CustomComponent
 *
 * @param {Object} props - The properties for the custom field component.
 * @param {boolean} [props.hideTitle] - Determines if the title should be hidden.
 * @param {Object} [props.resourceBindings] - Resource bindings for the component.
 * @param {string} [props.resourceBindings.emptyFieldText] - Resource key for empty field text.
 *
 * @property {boolean} isEmpty - Indicates if the field data is empty.
 * @property {Object} resourceValues - Contains the title and data to be displayed.
 * @property {string|undefined} resourceValues.title - The title of the component, if not hidden.
 * @property {*} resourceValues.data - The data to display, or empty field text if no data.
 */
export default class CustomFieldData extends CustomComponent {
    constructor(props) {
        super(props);
        const data = this.getValueFromFormData(props);
        const isEmpty = !this.hasContent(data);

        this.isEmpty = isEmpty;
        this.resourceValues = {
            title: !props?.hideTitle && getComponentResourceValue(props, "title"),
            data: isEmpty ? getComponentResourceValue(props, "emptyFieldText") : data
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
