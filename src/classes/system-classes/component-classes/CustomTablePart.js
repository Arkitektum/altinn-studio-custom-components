// Classes
import CustomComponent from "../CustomComponent.js";
import Part from "../../data-classes/Part.js";

// Global functions
import { getComponentDataValue, getTextResourceFromResourceBinding, hasValue } from "../../../functions/helpers.js";
import { hasMissingTextResources, hasValidationMessages } from "../../../functions/validations.js";

/**
 * CustomTablePart is a custom component class for handling table parts in a form.
 * It manages resource bindings, validation messages, and content checks for a specific part type.
 *
 * @extends CustomComponent
 *
 * @param {Object} props - The properties object for the component.
 * @param {string} [props.partType] - The type of the part.
 * @param {Object} [props.resourceBindings] - Resource bindings for the component.
 * @param {Object} [props.formData] - Form data for the component.
 *
 * @property {boolean} isEmpty - Indicates if the component has content.
 * @property {string} partType - The type of the part.
 * @property {boolean} validationMessages - Validation messages for the component.
 * @property {boolean} hasValidationMessages - Indicates if there are validation messages.
 * @property {Object} resourceValues - Contains resource values for title and data.
 *
 * @class
 */
export default class CustomTablePart extends CustomComponent {
    constructor(props) {
        super(props);
        const data = this.getValueFromFormData(props);
        const textResourceBindings = this.getTextResourceBindings(props.partType);

        const isEmpty = !this.hasContent(data);
        const validationMessages = this.getValidationMessages(textResourceBindings);

        this.isEmpty = isEmpty;
        this.partType = props?.partType;
        this.validationMessages = validationMessages;
        this.hasValidationMessages = hasValidationMessages(validationMessages);

        this.resourceValues = {
            title: getTextResourceFromResourceBinding(textResourceBindings?.part?.title),
            data: isEmpty ? getTextResourceFromResourceBinding(props?.resourceBindings?.emptyFieldText) : data
        };
    }

    /**
     * Retrieves the part type from the given element's "parttype" attribute.
     * If the attribute is not present, returns the default value "tiltakshaver".
     *
     * @param {Element} element - The DOM element from which to retrieve the "parttype" attribute.
     * @returns {string} The value of the "parttype" attribute, or "tiltakshaver" if not set.
     */
    getPartTypeFromElementAttributes(element) {
        const partType = element.getAttribute("parttype");
        return partType ? partType : "tiltakshaver";
    }

    /**
     * Retrieves a Part instance from the provided props if valid data exists.
     *
     * @param {Object} props - The properties object, expected to contain formData with data.
     * @param {Object} [props.formData] - The form data object.
     * @param {*} [props.formData.data] - The data to be used for creating the Part instance.
     * @returns {(Part|undefined)} Returns a Part instance if data is valid and has value, otherwise undefined.
     */
    getValueFromFormData(props) {
        const data = getComponentDataValue(props);
        if (!hasValue(data)) {
            return undefined;
        }
        const part = new Part(data);
        return this.hasPartValue(part) ? part : undefined;
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
     * Checks if the provided form data contains any content.
     *
     * @param {Object} formDataValue - The form data object to check.
     * @returns {boolean} Returns true if the form data contains a value, otherwise false.
     */
    hasContent(formDataValue) {
        return hasValue(formDataValue);
    }

    /**
     * Checks if the given part object has a non-empty 'navn' or 'organisasjonsnummer' property.
     *
     * @param {Object} part - The object to check for properties.
     * @param {string} [part.navn] - The name property of the part.
     * @param {string} [part.organisasjonsnummer] - The organization number property of the part.
     * @returns {boolean} Returns true if either 'navn' or 'organisasjonsnummer' has a value, otherwise false.
     */
    hasNavnOrOrganisasjonsnummer(part) {
        return hasValue(part?.navn) || hasValue(part?.organisasjonsnummer);
    }

    /**
     * Checks if the given part object contains a value for either 'telefonnummer' or 'mobilnummer'.
     *
     * @param {Object} part - The object to check for phone number properties.
     * @param {string} [part.telefonnummer] - The landline phone number property.
     * @param {string} [part.mobilnummer] - The mobile phone number property.
     * @returns {boolean} Returns true if either 'telefonnummer' or 'mobilnummer' has a value; otherwise, false.
     */
    hasTelefonnummer(part) {
        return hasValue(part?.telefonnummer) || hasValue(part?.mobilnummer);
    }

    /**
     * Checks if the given part object has a non-empty 'epost' property.
     *
     * @param {Object} part - The object to check for the 'epost' property.
     * @returns {boolean} Returns true if 'epost' exists and has a value, otherwise false.
     */
    hasEpost(part) {
        return hasValue(part?.epost);
    }

    /**
     * Checks if the given part has a value by verifying if it has either a name or organization number,
     * a phone number, or an email address.
     *
     * @param {Object} part - The part object to check for values.
     * @returns {boolean} True if the part has any of the specified values, otherwise false.
     */
    hasPartValue(part) {
        return this.hasNavnOrOrganisasjonsnummer(part) || this.hasTelefonnummer(part) || this.hasEpost(part);
    }

    /**
     * Generates text resource bindings for a given part type.
     *
     * @param {string} [partType="tiltakshaver"] - The type of part to generate resource keys for.
     * @returns {Object} An object containing resource key mappings for the specified part type.
     */
    getTextResourceBindings(partType = "tiltakshaver") {
        return {
            part: {
                title: `resource.${partType}.header`
            }
        };
    }
}
