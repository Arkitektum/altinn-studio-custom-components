// Classes
import CustomComponent from "../CustomComponent.js";
import Omraaderisiko from "../../data-classes/Omraaderisiko.js";

// Global functions
import { getComponentDataValue, getTextResourceFromResourceBinding, hasValue } from "../../../functions/helpers.js";
import { hasMissingTextResources, hasValidationMessages } from "../../../functions/validations.js";

/**
 * CustomTableOmraaderisiko is a custom component class for handling "omraaderisiko" table data and resource bindings.
 *
 * @extends CustomComponent
 *
 * @class
 * @param {Object} props - The properties for the component, including form data and resource bindings.
 *
 * @property {boolean} isEmpty - Indicates if the component data is empty.
 * @property {boolean} hasValidationMessages - Indicates if there are validation messages.
 * @property {Object} validationMessages - Validation messages for the component.
 * @property {Object} resourceBindings - Text resource bindings for the component.
 * @property {Object} resourceValues - Resource values for rendering, including data or empty field text.
 */
export default class CustomTableOmraaderisiko extends CustomComponent {
    constructor(props) {
        super(props);
        const data = this.getValueFromFormData(props);
        const resourceBindings = this.getResourceBindings(props);

        const isEmpty = !this.hasContent(data);
        const validationMessages = this.getValidationMessages(resourceBindings);

        this.isEmpty = isEmpty;
        this.validationMessages = validationMessages;
        this.hasValidationMessages = hasValidationMessages(validationMessages);
        this.resourceBindings = resourceBindings;
        this.resourceValues = {
            data: isEmpty ? getTextResourceFromResourceBinding(resourceBindings?.eiendomByggested?.emptyFieldText) : data
        };
    }

    /**
     * Retrieves the list of "omraaderisiko" values from the form data.
     *
     * @param {Object} props - The properties containing form data and component information.
     * @returns {Array} The extracted list of "omraaderisiko" values.
     */
    getValueFromFormData(props) {
        const data = getComponentDataValue(props);
        const omraaderisikoList = this.getOmraaderisikoListFromData(data);
        return omraaderisikoList;
    }

    /**
     * Generates a filtered list of Omraaderisiko instances from the provided data.
     *
     * @param {Array<Object>} data - The input array containing raw omraaderisiko objects.
     * @returns {Omraaderisiko[]|undefined} An array of Omraaderisiko instances with valid values, or undefined if input is invalid.
     */
    getOmraaderisikoListFromData(data) {
        if (!hasValue(data)) {
            return undefined;
        }
        return Array.isArray(data)
            ? data.map((omraaderisiko) => new Omraaderisiko(omraaderisiko)).filter((omraaderisiko) => this.hasOmraaderisikoValue(omraaderisiko))
            : [];
    }

    /**
     * Retrieves validation messages based on provided text resource bindings.
     *
     * @param {Object} textResourceBindings - An object containing keys for text resources to validate.
     * @returns {boolean} Returns true if there are missing text resources, otherwise false.
     */
    getValidationMessages(textResourceBindings) {
        const textResources = typeof window !== "undefined" && window.textResources ? window.textResources : [];
        return hasMissingTextResources(textResources, textResourceBindings);
    }

    /**
     * Checks if the provided data contains any content.
     *
     * @param {Object} data - The data object to check.
     * @returns {boolean} Returns true if the data contains a value, otherwise false.
     */
    hasContent(data) {
        return hasValue(data);
    }

    /**
     * Checks if the given `omraaderisiko` object has a valid `risikotype` with a `kodebeskrivelse` value.
     *
     * @param {Object} omraaderisiko - The object to check for a risikotype.
     * @returns {boolean} Returns `true` if `omraaderisiko.risikotype.kodebeskrivelse` has a value, otherwise `false`.
     */
    hasRisikotype(omraaderisiko) {
        return hasValue(omraaderisiko?.risikotype?.kodebeskrivelse);
    }

    /**
     * Checks if the given `omraaderisiko` object has a valid `sikkerhetsklasse` with a `kodebeskrivelse` value.
     *
     * @param {Object} omraaderisiko - The object to check for a sikkerhetsklasse.
     * @returns {boolean} Returns true if `omraaderisiko.sikkerhetsklasse.kodebeskrivelse` has a value, otherwise false.
     */
    hasSikkerhetsklasse(omraaderisiko) {
        return hasValue(omraaderisiko?.sikkerhetsklasse?.kodebeskrivelse);
    }

    /**
     * Checks if the given `omraaderisiko` has either a risk type or a security class value.
     *
     * @param {any} omraaderisiko - The area risk value to check.
     * @returns {boolean} Returns `true` if `omraaderisiko` has a risk type or a security class; otherwise, returns `false`.
     */
    hasOmraaderisikoValue(omraaderisiko) {
        return this.hasRisikotype(omraaderisiko) || this.hasSikkerhetsklasse(omraaderisiko);
    }

    /**
     * Generates an object containing text resource bindings for various fields based on the provided props.
     *
     * @param {Object} props - The properties object.
     * @param {Object} [props.resourceBindings] - Optional resource bindings for customizing text resources.
     * @param {Object} [props.resourceBindings.risikotype] - Resource bindings for 'risikotype'.
     * @param {string} [props.resourceBindings.risikotype.title] - Custom title for 'risikotype'.
     * @param {string} [props.resourceBindings.risikotype.emptyFieldText] - Custom empty field text for 'risikotype'.
     * @param {Object} [props.resourceBindings.sikkerhetsklasse] - Resource bindings for 'sikkerhetsklasse'.
     * @param {string} [props.resourceBindings.sikkerhetsklasse.title] - Custom title for 'sikkerhetsklasse'.
     * @param {string} [props.resourceBindings.sikkerhetsklasse.emptyFieldText] - Custom empty field text for 'sikkerhetsklasse'.
     * @param {string} [props.resourceBindings.title] - Custom title for 'omraadeRisiko'.
     * @param {string} [props.resourceBindings.emptyFieldText] - Custom empty field text for 'omraadeRisiko'.
     * @param {boolean|string} [props.hideTitle] - If true or "true", omraadeRisiko title is hidden.
     * @param {boolean|string} [props.hideIfEmpty] - If true or "true", omraadeRisiko empty field text is hidden.
     * @returns {Object} An object containing text resource bindings for risikotype, sikkerhetsklasse, and optionally omraadeRisiko.
     */
    getResourceBindings(props) {
        const resourceBindings = {
            risikotype: {
                title:
                    props?.resourceBindings?.risikotype?.title || "resource.kravTilByggegrunn.muligeOmraadeRisikoer.omraadeRisiko.risikotype.title",
                emptyFieldText: props?.resourceBindings?.risikotype?.emptyFieldText || "resource.emptyFieldText.default"
            },
            sikkerhetsklasse: {
                title:
                    props?.resourceBindings?.sikkerhetsklasse?.title ||
                    "resource.kravTilByggegrunn.muligeOmraadeRisikoer.omraadeRisiko.sikkerhetsklasse.title",
                emptyFieldText: props?.resourceBindings?.sikkerhetsklasse?.emptyFieldText || "resource.emptyFieldText.default"
            }
        };
        if (!props?.hideTitle === true || !props?.hideTitle === "true") {
            resourceBindings.omraadeRisiko = {
                title: props?.resourceBindings?.title || "resource.kravTilByggegrunn.muligeOmraadeRisikoer.omraadeRisiko.title"
            };
        }
        if (!props?.hideIfEmpty === true || !props?.hideIfEmpty === "true") {
            resourceBindings.omraadeRisiko = {
                ...resourceBindings.omraadeRisiko,
                emptyFieldText: props?.resourceBindings?.emptyFieldText || "resource.emptyFieldText.default"
            };
        }
        return resourceBindings;
    }
}
