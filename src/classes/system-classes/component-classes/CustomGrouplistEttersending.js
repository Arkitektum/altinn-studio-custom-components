// Classes
import CustomComponent from "../CustomComponent.js";

// Global functions
import { getComponentDataValue, getTextResourceFromResourceBinding, getTextResources, hasValue } from "../../../functions/helpers.js";
import { hasMissingTextResources, hasValidationMessages } from "../../../functions/validations.js";

export default class CustomGrouplistEttersending extends CustomComponent {
    constructor(props) {
        super(props);
        const data = this.getValueFromFormData(props);
        const resourceBindings = this.getResourceBindings(props);

        const isEmpty = !this.hasContent(data);
        const validationMessages = this.getValidationMessages(resourceBindings);

        this.isEmpty = isEmpty;
        this.validationMessages = validationMessages;
        this.hasValidationMessages = hasValidationMessages(validationMessages);
        this.resourceValues = {
            data: isEmpty ? getTextResourceFromResourceBinding(resourceBindings?.ettersendinger?.emptyFieldText) : data
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

    /**
     * Generates resource bindings for the component based on provided props.
     *
     * @param {Object} props - The properties object.
     * @param {Object} [props.resourceBindings] - Optional resource bindings overrides.
     * @param {string} [props.resourceBindings.title] - Custom title resource binding.
     * @param {string} [props.resourceBindings.emptyFieldText] - Custom empty field text resource binding.
     * @param {boolean|string} [props.hideTitle] - If true or "true", hides the title resource binding.
     * @param {boolean|string} [props.hideIfEmpty] - If true or "true", hides the empty field text resource binding.
     * @returns {Object} An object containing the resource bindings for 'ettersendinger'.
     */
    getResourceBindings(props) {
        const resourceBindings = {};
        if (!props?.hideTitle === true || !props?.hideTitle === "true") {
            resourceBindings.title = props?.resourceBindings?.title || "resource.ettersendinger.title";
        }
        if (!props?.hideIfEmpty === true || !props?.hideIfEmpty === "true") {
            resourceBindings.emptyFieldText = props?.resourceBindings?.emptyFieldText || "resource.emptyFieldText.default";
        }
        return {
            ettersendinger: resourceBindings
        };
    }
}
