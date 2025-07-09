// Classes
import CustomComponent from "../CustomComponent.js";

// Global functions
import { getComponentDataValue, getComponentResourceValue, isNumberLargerThanZero } from "../../../functions/helpers.js";

/**
 * CustomFieldCountData is a custom component class that manages and displays the count of items in a field.
 * It determines if the field is empty and sets resource values for display based on the data.
 *
 * @extends CustomComponent
 *
 * @param {Object} props - The properties object containing configuration and form data.
 * @param {boolean} [props.hideTitle] - Optional flag to hide the title.
 * @param {*} props.formData - The form data containing the component's data array.
 */
export default class CustomFieldCountData extends CustomComponent {
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
     * Checks if the provided data represents a number larger than zero.
     *
     * @param {*} data - The data to check.
     * @returns {boolean} Returns true if the data is a number greater than zero, otherwise false.
     */
    hasContent(data) {
        return isNumberLargerThanZero(data);
    }

    /**
     * Retrieves the value from form data by determining the length of the component data array.
     *
     * @param {Object} props - The properties object containing form data.
     * @returns {number} The length of the data array if it exists and is an array, otherwise 0.
     */
    getValueFromFormData(props) {
        const data = getComponentDataValue(props);
        return data && Array.isArray(data) ? data.length : 0;
    }
}
