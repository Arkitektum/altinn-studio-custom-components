// Classes
import CustomComponent from "../CustomComponent.js";
import Part from "../../data-classes/Part.js";

// Global functions
import { getTextResourcesFromResourceBindings, hasValue } from "../../../functions/helpers.js";
import { hasMissingTextResources, hasValidationMessages } from "../../../functions/validations.js";

export default class CustomTablePart extends CustomComponent {
    constructor(element) {
        super(element);
        const partType = element instanceof HTMLElement ? this.getPartTypeFromElementAttributes(element) : element.partType;
        const textResourceBindings = this.getTextResourceBindings(partType);
        const textResources = typeof window !== "undefined" && window.textResources ? window.textResources : [];
        const texts = element instanceof HTMLElement ? getTextResourcesFromResourceBindings(textResources, textResourceBindings.part) : element.texts;

        const parentProps = element instanceof HTMLElement ? super.getPropsFromElementAttributes(element) : element;
        const props = { ...parentProps, partType, texts };

        const formData = this.getFormDataFromProps(props);
        const isEmpty = !this.hasContent(formData);
        const validationMessages = this.getValidationMessages(textResourceBindings);

        this.isEmpty = isEmpty;
        this.formData = formData;
        this.texts = props?.texts ? props.texts : {};
        this.partType = props?.partType ? props.partType : "";
        this.validationMessages = validationMessages;
        this.hasValidationMessages = hasValidationMessages(validationMessages);
        this.textResourceBindings = textResourceBindings;
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
     * Extracts form data from the provided props object.
     *
     * @param {Object} props - The properties object containing component data.
     * @returns {Object} An object with a `data` property containing the part extracted from props.
     */
    getFormDataFromProps(props) {
        const part = this.getPartFromProps(props);
        return {
            data: part
        };
    }

    /**
     * Retrieves a Part instance from the provided props if valid data exists.
     *
     * @param {Object} props - The properties object, expected to contain formData with data.
     * @param {Object} [props.formData] - The form data object.
     * @param {*} [props.formData.data] - The data to be used for creating the Part instance.
     * @returns {(Part|undefined)} Returns a Part instance if data is valid and has value, otherwise undefined.
     */
    getPartFromProps(props) {
        const data = props?.formData?.data;
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
     * @param {Object} formData - The form data object to check.
     * @returns {boolean} Returns true if the form data contains a value, otherwise false.
     */
    hasContent(formData) {
        return hasValue(formData?.data);
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
                title: `resource.${partType}.header`,
                "col-1": `resource.${partType}.navn.title`,
                "col-2": `resource.${partType}.telefonnummer.title`,
                "col-3": `resource.${partType}.epost.title`,
                "emptyFieldText-default": "resource.emptyFieldText.default"
            }
        };
    }
}
