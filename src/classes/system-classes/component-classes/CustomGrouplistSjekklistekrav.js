// Classes
import CustomComponent from "../CustomComponent.js";
import Sjekklistekrav from "../../data-classes/Sjekklistekrav.js";

// Global functions
import { getComponentDataValue, getTextResourceFromResourceBinding, hasValue } from "../../../functions/helpers.js";
import { hasMissingTextResources, hasValidationMessages } from "../../../functions/validations.js";

/**
 * CustomGrouplistSjekklistekrav is a custom component class for handling grouped checklist requirements.
 * It extends the CustomComponent base class and provides logic for resource bindings, validation messages,
 * and content handling for checklist requirements.
 *
 * @extends CustomComponent
 *
 * @param {Object} props - The properties for the component, including form data and resource bindings.
 *
 * @property {boolean} isEmpty - Indicates if the component's data is empty.
 * @property {Array|string} validationMessages - Validation messages for missing text resources.
 * @property {boolean} hasValidationMessages - Indicates if there are any validation messages.
 * @property {Object} resourceBindings - Resource bindings for the sjekklistekrav component.
 * @property {Object} resourceValues - Contains title and data text resources for the component.
 *
 * @method hasContent Determines if the provided data contains any content.
 * @method getValidationMessages Retrieves validation messages based on provided resource bindings.
 * @method getValueFromFormData Retrieves the value for this component from the provided form data.
 * @method getResourceBindings Generates resource bindings for a component based on provided props.
 */

export default class CustomGrouplistSjekklistekrav extends CustomComponent {
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
            title: getTextResourceFromResourceBinding(resourceBindings?.sjekklistekrav?.title),
            data: isEmpty ? getTextResourceFromResourceBinding(resourceBindings?.sjekklistekrav?.emptyFieldText) : data
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
        return hasMissingTextResources(resourceBindings);
    }

    /**
     * Retrieves and transforms form data into a list of Sjekklistekrav instances.
     *
     * @param {Object} props - The properties containing form data.
     * @returns {Sjekklistekrav[]} An array of Sjekklistekrav objects created from the form data.
     */
    getValueFromFormData(props) {
        const data = getComponentDataValue(props);
        const sjekklistekravList = data?.map((item) => {
            return new Sjekklistekrav(item);
        });
        return sjekklistekravList;
    }

    /**
     * Generates resource bindings for a component based on provided props.
     *
     * @param {Object} props - The properties object.
     * @param {Object} [props.resourceBindings] - Optional resource bindings overrides.
     * @param {string} [props.resourceBindings.trueText] - Text to display for true value.
     * @param {string} [props.resourceBindings.falseText] - Text to display for false value.
     * @param {string} [props.resourceBindings.defaultText] - Default text to display.
     * @param {string} [props.resourceBindings.title] - Title text for the component.
     * @param {string} [props.resourceBindings.emptyFieldText] - Text to display when field is empty.
     * @param {boolean|string} [props.hideTitle] - If true or "true", hides the title.
     * @param {boolean|string} [props.hideIfEmpty] - If true or "true", hides the empty field text.
     * @returns {Object} An object containing the resource bindings for the sjekklistekrav component.
     */
    getResourceBindings(props) {
        const resourceBindings = {
            trueText: props?.resourceBindings?.trueText || "resource.trueText.default",
            falseText: props?.resourceBindings?.falseText || "resource.falseText.default",
            defaultText: props?.resourceBindings?.defaultText || "resource.defaultText.default"
        };
        if (props?.hideTitle !== true && props?.hideTitle !== "true") {
            resourceBindings.title = props?.resourceBindings?.title || "resource.krav.sjekklistekrav.title";
        }
        if (props?.hideIfEmpty !== true && props?.hideIfEmpty !== "true") {
            resourceBindings.emptyFieldText = props?.resourceBindings?.emptyFieldText || "resource.emptyFieldText.default";
        }
        return {
            sjekklistekrav: resourceBindings
        };
    }
}
