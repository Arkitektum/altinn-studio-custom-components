// Classes
import CustomComponent from "../CustomComponent.js";
import Sjekklistekrav from "../../data-classes/Sjekklistekrav.js";

// Global functions
import { getComponentDataValue, getTextResourceFromResourceBinding, hasValue } from "../../../functions/helpers.js";
import { hasMissingTextResources, hasValidationMessages } from "../../../functions/validations.js";

/**
 * CustomGroupSjekklistekrav is a specialized component class for handling "Sjekklistekrav" group logic.
 * It extends CustomComponent and manages resource bindings, validation messages, and content state.
 *
 * @extends CustomComponent
 *
 * @param {Object} props - The properties for initializing the component.
 * @param {Object} [props.resourceBindings] - Resource binding values for text resources.
 * @param {string} [props.resourceBindings.trueText] - Text to display for a true value.
 * @param {string} [props.resourceBindings.falseText] - Text to display for a false value.
 * @param {string} [props.resourceBindings.defaultText] - Default text to display.
 * @param {string} [props.resourceBindings.emptyFieldText] - Text to display when the field is empty.
 * @param {boolean|string} [props.hideIfEmpty] - Determines if the empty field text should be hidden.
 *
 * @property {boolean} isEmpty - Indicates if the component data is empty.
 * @property {Array|string|boolean} validationMessages - Validation messages for missing text resources.
 * @property {boolean} hasValidationMessages - Indicates if there are validation messages.
 * @property {Object} resourceBindings - Resource bindings for sjekklistekrav.
 * @property {Object} resourceValues - Contains either the empty field text or the component data.
 */
export default class CustomGroupSjekklistekrav extends CustomComponent {
    constructor(props) {
        super(props);
        const data = this.getValueFromFormData(props);
        const resourceBindings = this.getResourceBindings(props);

        const isEmpty = !this.hasContent(data);
        const validationMessages = this.getValidationMessages(resourceBindings);

        this.isEmpty = isEmpty;
        this.validationMessages = validationMessages;
        this.hasValidationMessages = hasValidationMessages(validationMessages);
        this.resourceBindings = resourceBindings?.sjekklistekrav || {};
        this.resourceValues = {
            data: isEmpty ? getTextResourceFromResourceBinding(resourceBindings?.sjekklistekrav?.emptyFieldText) : data
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
     * Retrieves validation messages based on provided resource bindings.
     *
     * @param {Object} resourceBindings - The resource bindings to check for missing text resources.
     * @returns {Array|string|boolean} - The result of checking for missing text resources, which may be an array of messages, a string, or a boolean depending on implementation.
     */
    getValidationMessages(resourceBindings) {
        return hasMissingTextResources(resourceBindings);
    }

    /**
     * Retrieves the value from form data and returns a Sjekklistekrav instance.
     *
     * @param {Object} props - The properties containing form data for the component.
     * @returns {Sjekklistekrav} An instance of Sjekklistekrav initialized with the component data.
     */
    getValueFromFormData(props) {
        const data = getComponentDataValue(props);
        const sjekklistekrav = new Sjekklistekrav(data);
        return sjekklistekrav;
    }

    /**
     * Generates resource bindings for a component based on provided props.
     *
     * @param {Object} props - The properties object containing resource bindings and options.
     * @param {Object} [props.resourceBindings] - Resource binding values.
     * @param {string} [props.resourceBindings.trueText] - Text to display for a true value.
     * @param {string} [props.resourceBindings.falseText] - Text to display for a false value.
     * @param {string} [props.resourceBindings.defaultText] - Default text to display.
     * @param {string} [props.resourceBindings.emptyFieldText] - Text to display when the field is empty.
     * @param {boolean|string} [props.hideIfEmpty] - Determines if the empty field text should be hidden.
     * @returns {Object} An object containing the resource bindings for 'sjekklistekrav'.
     */
    getResourceBindings(props) {
        const resourceBindings = {
            trueText: props?.resourceBindings?.trueText || "resource.trueText.default",
            falseText: props?.resourceBindings?.falseText || "resource.falseText.default",
            defaultText: props?.resourceBindings?.defaultText || "resource.defaultText.default"
        };
        if (props?.hideIfEmpty !== true && props?.hideIfEmpty !== "true") {
            resourceBindings.emptyFieldText = props?.resourceBindings?.emptyFieldText || "resource.emptyFieldText.default";
        }
        return {
            sjekklistekrav: resourceBindings
        };
    }
}
