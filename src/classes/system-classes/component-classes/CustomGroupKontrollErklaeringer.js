// Classes
import CustomComponent from "../CustomComponent.js";
import KontrollAnsvarsomraade from "../../data-classes/KontrollAnsvarsomraade.js";

// Global functions
import { getComponentDataValue, getTextResourceFromResourceBinding, hasValue } from "../../../functions/helpers.js";
import { hasMissingTextResources, hasValidationMessages } from "../../../functions/validations.js";

/**
 * Initializes a new instance of the CustomGroupKontrollErklaeringer class.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {Object} props.resourceValues - Resource values for the component, including title.
 *
 * @property {boolean} isEmpty - Indicates if the data is empty.
 * @property {Array} validationMessages - Validation messages for the component.
 * @property {boolean} hasValidationMessages - Indicates if there are any validation messages.
 * @property {Object} resourceBindings - Resource bindings used in the component.
 * @property {Object} resourceValues - Contains title and data for the component.
 */
export default class CustomGroupKontrollErklaeringer extends CustomComponent {
    constructor(props) {
        super(props);
        const resourceBindings = this.getResourceBindings(props);
        const data = this.getValueFromFormData(props, resourceBindings);

        const isEmpty = !this.hasContent(data);
        const validationMessages = this.getValidationMessages(resourceBindings);

        this.isEmpty = isEmpty;
        this.validationMessages = validationMessages;
        this.hasValidationMessages = hasValidationMessages(validationMessages);
        this.resourceBindings = resourceBindings;
        this.resourceValues = {
            title: props?.resourceValues?.title,
            data: isEmpty ? getTextResourceFromResourceBinding(resourceBindings?.erklaeringer?.emptyFieldText) : data
        };
    }

    /**
     * Retrieves and constructs a KontrollAnsvarsomraade instance from form data and resource bindings.
     *
     * @param {Object} props - The properties containing form data.
     * @param {Object} resourceBindings - The resource bindings used for initialization.
     * @returns {KontrollAnsvarsomraade} An instance of KontrollAnsvarsomraade initialized with the extracted data and resource bindings.
     */
    getValueFromFormData(props, resourceBindings) {
        const data = getComponentDataValue(props);
        const kontrollAnsvarsomraade = new KontrollAnsvarsomraade(data, resourceBindings);
        return kontrollAnsvarsomraade;
    }

    /**
     * Retrieves validation messages based on the provided text resource bindings.
     *
     * @param {Object} textResourceBindings - An object containing text resource bindings to be validated.
     * @returns {Array|string|boolean} The result of the validation, as returned by hasMissingTextResources.
     */
    getValidationMessages(textResourceBindings) {
        return hasMissingTextResources(textResourceBindings);
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
     * Generates an object containing resource bindings for various text fields,
     * providing default values if not specified in the props.
     *
     * @param {Object} props - The properties object.
     * @param {Object} [props.resourceBindings] - Resource binding overrides for text fields.
     * @param {Object} [props.resourceBindings.kontrollErklaeringTekst] - Overrides for 'kontrollErklaeringTekst'.
     * @param {Object} [props.resourceBindings.kontrollKONTROLLTekst] - Overrides for 'kontrollKONTROLLTekst'.
     * @param {string} [props.resourceBindings.title] - Title override for 'erklaeringer'.
     * @param {string} [props.resourceBindings.emptyFieldText] - Empty field text override for 'erklaeringer'.
     * @param {Object} [props.resourceValues] - Resource values, used to check for title presence.
     * @param {boolean|string} [props.hideTitle] - If true, hides the title for 'erklaeringer'.
     * @param {boolean|string} [props.hideIfEmpty] - If true, hides the empty field text for 'erklaeringer'.
     * @returns {Object} Resource bindings object with localized text and titles for each field.
     */
    getResourceBindings(props) {
        const resourceBindings = {
            kontrollErklaeringTekst: {
                title: props?.resourceBindings?.kontrollErklaeringTekst?.title || "resource.kontrollErklaeringTekst.title",
                emptyFieldText: props?.resourceBindings?.kontrollErklaeringTekst?.emptyFieldText || "resource.emptyFieldText.default"
            },
            kontrollKONTROLLTekst: {
                title: props?.resourceBindings?.kontrollKONTROLLTekst?.title || "resource.kontrollKONTROLLTekst.title",
                emptyFieldText: props?.resourceBindings?.kontrollKONTROLLTekst?.emptyFieldText || "resource.emptyFieldText.default"
            }
        };
        if (props?.hideTitle !== true && props?.hideTitle !== "true" && !hasValue(props?.resourceValues?.title)) {
            resourceBindings.erklaeringer = {
                title: props?.resourceBindings?.title || "resource.erklaeringer.title"
            };
        }
        if (props?.hideIfEmpty !== true && props?.hideIfEmpty !== "true") {
            resourceBindings.erklaeringer = {
                ...resourceBindings.erklaeringer,
                emptyFieldText: props?.resourceBindings?.emptyFieldText || "resource.emptyFieldText.default"
            };
        }
        return resourceBindings;
    }
}
