// Classes
import CustomComponent from "../CustomComponent.js";

// Global functions
import { getComponentDataValue, getComponentResourceValue, getTextResources, hasValue } from "../../../functions/helpers.js";
import { hasMissingTextResources } from "../../../functions/validations.js";

/**
 * CustomGrouplistUtfallSvar is a custom component class that handles the display and validation
 * of grouped list answers in a form. It determines if the component's data is empty, manages
 * resource values for display, and provides validation message retrieval.
 *
 * @extends CustomComponent
 *
 * @class
 * @param {Object} props - The properties containing form data and component information.
 *
 * @property {boolean} isEmpty - Indicates whether the component's data is empty.
 * @property {Object} resourceValues - Contains resource values for display, such as empty field text or data.
 */
export default class CustomGrouplistUtfallSvar extends CustomComponent {
    constructor(props) {
        super(props);
        const data = this.getValueFromFormData(props);

        const isEmpty = !this.hasContent(data);

        this.isEmpty = isEmpty;
        this.resourceValues = {
            data: isEmpty ? getComponentResourceValue(props, "emptyFieldText") : data
        };
    }

    /**
     * Checks if the provided data has a value.
     *
     * @param {*} data - The data to check for content.
     * @returns {boolean} Returns true if the data has a value, otherwise false.
     */
    hasContent(data) {
        return hasValue(data);
    }

    /**
     * Retrieves validation messages based on the provided resource bindings.
     *
     * @param {Object} resourceBindings - An object containing resource binding keys for validation.
     * @returns {Array|string|boolean} The result of the validation, typically an array of missing text resources,
     *                                 a string message, or a boolean indicating validation status.
     */
    getValidationMessages(resourceBindings) {
        const textResources = getTextResources();
        return hasMissingTextResources(textResources, resourceBindings);
    }

    /**
     * Retrieves the value for this component from the provided form data.
     *
     * @param {Object} props - The properties containing form data and component information.
     * @returns {*} The value extracted from the form data for this component.
     */
    getValueFromFormData(props) {
        return getComponentDataValue(props);
    }
}
