// Dependencies
import { getTextResourceFromResourceBinding, hasValue } from "@arkitektum/altinn-studio-custom-components-utils";

// Classes
import CustomComponent from "../CustomComponent.js";

// Global functions
import { hasMissingTextResources, hasValidationMessages } from "../../../functions/validations.js";
import { getComponentDataValue } from "../../../functions/helpers.js";

/**
 * CustomTablePartGjennomfoeringsplan is a specialized component class for rendering a part table
 * within the "Gjennomføringsplan" context. It displays the responsible applicant's name and
 * organization number alongside the responsibility class (tiltaksklasse).
 *
 * It provides methods for extracting and validating part data, generating text resource bindings,
 * and determining the presence of content and validation messages.
 *
 * @extends CustomComponent
 *
 * @class
 * @param {Object} props - The properties for the component.
 * @param {Object} [props.resourceBindings] - Optional custom resource bindings for fields.
 * @param {Object} [props.formData] - The form data object.
 */
export default class CustomTablePartGjennomfoeringsplan extends CustomComponent {
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
            data: isEmpty ? getTextResourceFromResourceBinding(props?.resourceBindings?.emptyFieldText) : data
        };
    }

    /**
     * Retrieves the part data from the provided props if valid content exists.
     *
     * @param {Object} props - The properties object, expected to contain the data to display.
     * @returns {(Object|undefined)} Returns the data object if it has displayable content, otherwise undefined.
     */
    getValueFromFormData(props) {
        const data = getComponentDataValue(props);
        if (!hasValue(data)) {
            return undefined;
        }
        return this.hasPartValue(data) ? data : undefined;
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
     * Checks if the provided form data contains any content.
     *
     * @param {Object} formDataValue - The form data object to check.
     * @returns {boolean} Returns true if the form data contains a value, otherwise false.
     */
    hasContent(formDataValue) {
        return hasValue(formDataValue);
    }

    /**
     * Checks if the given part object has a non-empty 'navn' property.
     *
     * @param {Object} part - The object to check for properties.
     * @param {string} [part.navn] - The name property of the part.
     * @returns {boolean} Returns true if 'navn' has a value, otherwise false.
     */
    hasNavn(part) {
        return hasValue(part?.navn);
    }

    /**
     * Checks if the given part object has a non-empty 'organisasjonsnummer' property.
     *
     * @param {Object} part - The object to check for properties.
     * @param {string} [part.organisasjonsnummer] - The organization number property of the part.
     * @returns {boolean} Returns true if 'organisasjonsnummer' has a value, otherwise false.
     */
    hasOrganisasjonsnummer(part) {
        return hasValue(part?.organisasjonsnummer);
    }

    /**
     * Checks if the given part object has a non-empty 'tiltaksklasse' property.
     *
     * @param {Object} part - The object to check for properties.
     * @param {string} [part.tiltaksklasse] - The responsibility class property of the part.
     * @returns {boolean} Returns true if 'tiltaksklasse' has a value, otherwise false.
     */
    hasTiltaksklasse(part) {
        return hasValue(part?.tiltaksklasse);
    }

    /**
     * Checks if the given part has a value by verifying if it has a name,
     * an organization number, or a responsibility class (tiltaksklasse).
     *
     * @param {Object} part - The part object to check for values.
     * @returns {boolean} True if the part has any of the specified values, otherwise false.
     */
    hasPartValue(part) {
        return this.hasNavn(part) || this.hasOrganisasjonsnummer(part) || this.hasTiltaksklasse(part);
    }

    /**
     * Generates text resource bindings for a custom table part component.
     *
     * @param {Object} props - The properties for the component.
     * @param {Object} [props.resourceBindings] - Optional custom resource bindings for fields.
     * @param {Object} [props.resourceBindings.navn] - Resource bindings for the "navn" field.
     * @param {string} [props.resourceBindings.navn.title] - Custom title for the "navn" field.
     * @param {Object} [props.resourceBindings.organisasjonsnummer] - Resource bindings for the "organisasjonsnummer" field.
     * @param {string} [props.resourceBindings.organisasjonsnummer.title] - Custom title for the "organisasjonsnummer" field.
     * @param {Object} [props.resourceBindings.tiltaksklasse] - Resource bindings for the "tiltaksklasse" field.
     * @param {string} [props.resourceBindings.tiltaksklasse.title] - Custom title for the "tiltaksklasse" field.
     * @param {string} [props.resourceBindings.title] - Custom title for the part header.
     * @param {string} [props.resourceBindings.emptyFieldText] - Custom text for empty fields.
     * @param {boolean|string} [props.hideTitle] - If true, hides the part title.
     * @param {boolean|string} [props.hideIfEmpty] - If true, hides the empty field text.
     * @returns {Object} Resource bindings object for use in the component.
     */
    getResourceBindings(props) {
        const resourceBindings = {
            navn: {
                title: props?.resourceBindings?.navn?.title || `resource.navn.title`,
                emptyFieldText: props?.resourceBindings?.navn?.emptyFieldText || "resource.emptyFieldText.default"
            },
            organisasjonsnummer: {
                title: props?.resourceBindings?.organisasjonsnummer?.title || `resource.organisasjonsnummer.title`,
                emptyFieldText: props?.resourceBindings?.organisasjonsnummer?.emptyFieldText || "resource.emptyFieldText.default"
            },
            tiltaksklasse: {
                title: props?.resourceBindings?.tiltaksklasse?.title || `resource.tiltaksklasse.title`,
                emptyFieldText: props?.resourceBindings?.tiltaksklasse?.emptyFieldText || "resource.emptyFieldText.default"
            }
        };
        if (props?.hideTitle !== true && props?.hideTitle !== "true") {
            resourceBindings.part = {
                title: props?.resourceBindings?.title || `resource.soeker.title`
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

    /**
     * Retrieves the component usage, which is an array of custom component names that this class utilizes.
     *
     * @returns {Array<string>} An array of custom component names used by this class.
     */
    getComponentUsage() {
        return ["custom-feedbacklist-validation-messages", "custom-field-data", "custom-table-data"];
    }
}
