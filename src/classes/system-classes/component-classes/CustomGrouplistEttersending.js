// Classes
import CustomComponent from "../CustomComponent.js";

// Global functions
import { getComponentDataValue, getComponentResourceValue, getTextResources, hasValue } from "../../../functions/helpers.js";
import { hasMissingTextResources } from "../../../functions/validations.js";

/**
 * CustomGrouplistEttersending is a custom component class for handling group list data in an "Ettersending" context.
 * It extends the CustomComponent base class and provides methods for data extraction, validation, and resource management.
 *
 * @extends CustomComponent
 *
 * @param {Object} props - The properties passed to the component, including form data and resource bindings.
 *
 * @property {boolean} isEmpty - Indicates whether the component's data is empty.
 * @property {Object} resourceValues - Contains resource values for the component, such as display text for empty fields.
 */

export default class CustomGrouplistEttersending extends CustomComponent {
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
     * Determines if the provided data contains any content.
     *
     * @param {*} data - The data to check for content.
     * @returns {boolean} True if the data has content, otherwise false.
     */
    hasContent(data) {
        return hasValue(data);
    }

    /**
     * Retrieves validation messages based on provided resource bindings.
     *
     * @param {Object} resourceBindings - The resource bindings to check for missing text resources.
     * @returns {Array|string} - The validation messages indicating missing text resources.
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
