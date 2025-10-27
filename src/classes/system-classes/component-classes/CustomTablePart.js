// Classes
import CustomComponent from "../CustomComponent.js";
import Part from "../../data-classes/Part.js";

// Global functions
import { getComponentDataValue, getTextResourceFromResourceBinding, getTextResources, hasValue } from "../../../functions/helpers.js";
import { hasMissingTextResources, hasValidationMessages } from "../../../functions/validations.js";

/**
 * CustomTablePart is a specialized component class for handling custom table parts in a form.
 * It provides methods for extracting and validating part data, generating text resource bindings,
 * and determining the presence of content and validation messages.
 *
 * @extends CustomComponent
 *
 * @class
 * @param {Object} props - The properties for the component.
 * @param {string} [props.partType] - The type of part, used for resource key generation.
 * @param {Object} [props.resourceBindings] - Optional custom resource bindings for fields.
 * @param {Object} [props.formData] - The form data object.
 */
export default class CustomTablePart extends CustomComponent {
    constructor(props) {
        super(props);
        const data = this.getValueFromFormData(props);
        const resourceBindings = this.getResourceBindings(props);

        const isEmpty = !this.hasContent(data);
        const validationMessages = this.getValidationMessages(resourceBindings);

        this.isEmpty = isEmpty;
        this.partType = props?.partType;
        this.validationMessages = validationMessages;
        this.hasValidationMessages = hasValidationMessages(validationMessages);
        this.resourceBindings = resourceBindings;
        this.resourceValues = {
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
        const textResources = getTextResources();
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
     * Generates text resource bindings for a custom table part component.
     *
     * @param {Object} props - The properties for the component.
     * @param {string} [props.partType="tiltakshaver"] - The type of part, used for resource key generation.
     * @param {Object} [props.resourceBindings] - Optional custom resource bindings for fields.
     * @param {Object} [props.resourceBindings.navn] - Resource bindings for the "navn" field.
     * @param {string} [props.resourceBindings.navn.title] - Custom title for the "navn" field.
     * @param {Object} [props.resourceBindings.telefonnummer] - Resource bindings for the "telefonnummer" field.
     * @param {string} [props.resourceBindings.telefonnummer.title] - Custom title for the "telefonnummer" field.
     * @param {Object} [props.resourceBindings.epost] - Resource bindings for the "epost" field.
     * @param {string} [props.resourceBindings.epost.title] - Custom title for the "epost" field.
     * @param {string} [props.resourceBindings.title] - Custom title for the part header.
     * @param {string} [props.resourceBindings.emptyFieldText] - Custom text for empty fields.
     * @param {boolean|string} [props.hideTitle] - If true, hides the part title.
     * @param {boolean|string} [props.hideIfEmpty] - If true, hides the empty field text.
     * @returns {Object} Resource bindings object for use in the component.
     */
    getResourceBindings(props) {
        const partType = props?.partType || "tiltakshaver";
        const resourceBindings = {
            navn: {
                title: props?.resourceBindings?.navn?.title || `resource.${partType}.navn.title`,
                emptyFieldText: props?.resourceBindings?.navn?.emptyFieldText || "resource.emptyFieldText.default"
            },
            telefonnummer: {
                title: props?.resourceBindings?.telefonnummer?.title || `resource.${partType}.telefonnummer.title`,
                emptyFieldText: props?.resourceBindings?.telefonnummer?.emptyFieldText || "resource.emptyFieldText.default"
            },
            epost: {
                title: props?.resourceBindings?.epost?.title || `resource.${partType}.epost.title`,
                emptyFieldText: props?.resourceBindings?.epost?.emptyFieldText || "resource.emptyFieldText.default"
            }
        };
        if (props?.hideTitle !== true && props?.hideTitle !== "true") {
            resourceBindings.part = {
                title: props?.resourceBindings?.title || `resource.${partType}.header`
            };
        }
        if (props?.hideIfEmpty !== true && props?.hideIfEmpty !== "true") {
            resourceBindings.part = {
                ...resourceBindings.part,
                emptyFieldText: props?.resourceBindings?.emptyFieldText || "resource.emptyFieldText.default"
            };
        }
        return resourceBindings;
    }
}
