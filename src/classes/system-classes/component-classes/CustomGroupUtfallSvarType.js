// Classes
import CustomComponent from "../CustomComponent.js";

// Global functions
import { getComponentDataValue, getComponentResourceValue, getTextResources, hasValue } from "../../../functions/helpers.js";
import { hasMissingTextResources, hasValidationMessages } from "../../../functions/validations.js";

/**
 * CustomGroupUtfallSvarType is a custom component class that handles the logic for displaying
 * and validating a group outcome answer type within a form. It extends the CustomComponent base class
 * and manages resource bindings, validation messages, and resource values for rendering.
 *
 * @class
 * @extends CustomComponent
 *
 * @param {Object} props - The properties passed to the component, including form data and resource values.
 *
 * @property {boolean} isEmpty - Indicates whether the component's data is empty.
 * @property {Array|string|boolean} validationMessages - Validation messages for the component, if any.
 * @property {boolean} hasValidationMessages - Indicates if there are validation messages present.
 * @property {Object} resourceValues - Contains resource values for rendering, such as title and data.
 */
export default class CustomGroupUtfallSvarType extends CustomComponent {
    constructor(props) {
        super(props);
        const data = this.getValueFromFormData(props);
        const resourceBindings = this.getResourceBindings(props);

        const isEmpty = !this.hasContent(data);
        const validationMessages = this.getValidationMessages(resourceBindings);

        this.isEmpty = isEmpty;
        this.validationMessages = validationMessages;
        this.hasValidationMessages = hasValidationMessages(validationMessages);
        this.resourceBindings = {
            title: resourceBindings?.utfallSvarType?.title
        };
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
     * @param {Object} resourceBindings - An object containing resource binding keys.
     * @returns {Array|string|boolean} The result of checking for missing text resources, which could be an array of messages, a string, or a boolean depending on implementation.
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

    /**
     * Generates resource binding keys for the given component props.
     *
     * @param {Object} props - The properties object for the component.
     * @param {Object} [props.resourceValues] - An object containing resource values.
     * @param {string} [props.resourceValues.utfallType] - The type of outcome to use in the resource key.
     * @returns {Object} An object containing resource binding keys for utfallSvarType.
     */
    getResourceBindings(props) {
        const utfallType = props?.resourceValues?.utfallType;
        return {
            utfallSvarType: {
                title: `resource.utfallBesvarelse.utfallSvar.${utfallType?.toLowerCase()}.header`
            }
        };
    }
}
