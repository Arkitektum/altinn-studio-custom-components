// Dependencies
import { getTextResourceFromResourceBinding } from "@arkitektum/altinn-studio-custom-components-utils";

// Classes
import CustomComponent from "../CustomComponent.js";
import Sjekklistekrav from "../../data-classes/Sjekklistekrav.js";

// Global functions
import { getComponentDataValue } from "../../../functions/helpers.js";
import { hasValidationMessages } from "../../../functions/validations.js";

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
        const resourceBindingsToValidate = {
            sjekklistekrav: {
                trueText: resourceBindings?.sjekklistekrav?.trueText,
                falseText: resourceBindings?.sjekklistekrav?.falseText,
                defaultText: resourceBindings?.sjekklistekrav?.defaultText
            }
        };
        if (props?.hideTitle !== true && props?.hideTitle !== "true") {
            resourceBindingsToValidate.sjekklistekrav.title = resourceBindings?.sjekklistekrav?.title;
        }
        if (props?.hideIfEmpty !== true && props?.hideIfEmpty !== "true") {
            resourceBindingsToValidate.sjekklistekrav.emptyFieldText = resourceBindings?.sjekklistekrav?.emptyFieldText;
        }

        const validationMessages = this.getValidationMessages(resourceBindingsToValidate);

        this.isEmpty = isEmpty;
        this.validationMessages = validationMessages;
        this.hasValidationMessages = hasValidationMessages(validationMessages);
        this.resourceBindings = resourceBindings?.sjekklistekrav
            ? {
                  sjekklistepunkt: resourceBindings?.sjekklistekrav?.sjekklistepunkt,
                  sjekklistepunktsvar: resourceBindings?.sjekklistekrav?.sjekklistepunktsvar,
                  trueText: resourceBindings?.sjekklistekrav?.trueText,
                  falseText: resourceBindings?.sjekklistekrav?.falseText,
                  defaultText: resourceBindings?.sjekklistekrav?.defaultText
              }
            : {};
        this.resourceValues = {
            title: getTextResourceFromResourceBinding(resourceBindings?.sjekklistekrav?.title),
            description: getTextResourceFromResourceBinding(resourceBindings?.sjekklistekrav?.description),
            data: isEmpty ? getTextResourceFromResourceBinding(resourceBindings?.sjekklistekrav?.emptyFieldText) : data
        };
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
     * Generates resource bindings for the component based on provided props, including default values for trueText, falseText, and defaultText.
     *
     * @param {Object} props - The properties containing resource bindings.
     * @returns {Object} An object containing the resource bindings for the sjekklistekrav component.
     */
    getResourceBindings(props) {
        const resourceBindings = {
            trueText: props?.resourceBindings?.trueText || "resource.trueText.default",
            falseText: props?.resourceBindings?.falseText || "resource.falseText.default",
            defaultText: props?.resourceBindings?.defaultText || "resource.emptyFieldText.default",
            sjekklistepunkt: props?.resourceBindings?.sjekklistepunkt,
            sjekklistepunktsvar: props?.resourceBindings?.sjekklistepunktsvar
        };
        if (props?.resourceBindings?.description?.length > 0) {
            resourceBindings.description = props?.resourceBindings?.description;
        }
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

    /**
     * Retrieves the component usage, which is an array of custom component names that this class utilizes.
     *
     * @returns {Array<string>} An array of custom component names used by this class.
     */
    getComponentUsage() {
        return [
            "custom-divider",
            "custom-feedbacklist-validation-messages",
            "custom-group-sjekklistekrav",
            "custom-group-sjekklistekrav-header-text",
            "custom-header-text",
            "custom-paragraph"
        ];
    }
}
