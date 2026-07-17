// Dependencies
import { getTextResourceFromResourceBinding, hasValue } from "@arkitektum/altinn-studio-custom-components-utils";

// Classes
import CustomComponent from "../CustomComponent.js";
import Omraaderisiko from "../../data-classes/Omraaderisiko.js";

// Global functions
import { hasMissingTextResources, hasValidationMessages } from "../../../functions/validations.js";
import { getComponentDataValue } from "../../../functions/helpers.js";

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
            title: getTextResourceFromResourceBinding(resourceBindings?.omraaderisiko?.title),
            data: isEmpty ? getTextResourceFromResourceBinding(resourceBindings?.omraaderisiko?.emptyFieldText) : data
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
        return hasMissingTextResources(textResourceBindings);
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
     * Generates an object containing resource binding configurations for the component, providing default resource keys if specific bindings are not supplied via props.
     *
     * @param {Object} props - The properties object containing optional resource bindings and flags.
     * @param {Object} [props.resourceBindings] - Optional resource binding overrides for each component.
     * @param {boolean|string} [props.hideTitle] - If true or "true", omits the title for the omraaderisiko table.
     * @param {boolean|string} [props.hideIfEmpty] - If true or "true", omits the emptyFieldText for the omraaderisiko table.
     * @returns {Object} An object mapping component keys to their resource binding configurations.
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
        if (props?.hideTitle !== true && props?.hideTitle !== "true") {
            resourceBindings.omraaderisiko = {
                ...resourceBindings.omraaderisiko,
                title: props?.resourceBindings?.title || "resource.kravTilByggegrunn.muligeOmraadeRisikoer.omraadeRisiko.title"
            };
        }
        if (props?.hideIfEmpty !== true && props?.hideIfEmpty !== "true") {
            resourceBindings.omraaderisiko = {
                ...resourceBindings.omraaderisiko,
                emptyFieldText: props?.resourceBindings?.emptyFieldText || "resource.emptyFieldText.default"
            };
        }
        return resourceBindings;
    }

    /**
     * Retrieves the component usage, which is an array of custom component names that this class utilizes.
     *
     * @returns {Array<string>} An array of custom component names used by this class.
     */
    getComponentUsage() {
        return ["custom-feedbacklist-validation-messages", "custom-table-data"];
    }
}
