// Classes
import CustomComponent from "../CustomComponent.js";
import KommunensSaksnummer from "../../data-classes/KommunensSaksnummer.js";

// Global functions
import { getTextResourceFromResourceBinding, hasValue } from "../../../functions/helpers.js";

/**
 * CustomFieldKommunensSaksnummer is a custom component class for handling and displaying
 * 'kommunens saksnummer' (the municipality's case number) in a formatted way.
 *
 * @extends CustomComponent
 *
 * @class
 * @param {Object} props - The properties object for the component.
 * @param {Object} props.formData - The form data object.
 * @param {Object} props.formData.data - The data containing the 'kommunens saksnummer'.
 * @param {Object} [props.resourceBindings] - Resource bindings for text resources.
 * @param {string} [props.resourceBindings.title] - Resource binding for the title.
 * @param {string} [props.resourceBindings.emptyFieldText] - Resource binding for the empty field text.
 * @param {boolean} [props.isEmpty] - Optional flag to indicate if the field is empty.
 *
 * @property {boolean} isEmpty - Indicates if the field is empty.
 * @property {Object} resourceValues - Contains the title and text to be displayed.
 * @property {string} resourceValues.title - The title resource.
 * @property {string} resourceValues.data - The formatted 'kommunens saksnummer' or empty field text.
 */
export default class CustomFieldKommunensSaksnummer extends CustomComponent {
    constructor(props) {
        super(props);
        const formDataValue = this.getValueFromFormData(props);
        const isEmpty = props?.isEmpty !== undefined ? props.isEmpty : !this.hasContent(formDataValue);

        this.isEmpty = isEmpty;
        this.resourceValues = {
            title: getTextResourceFromResourceBinding(props?.resourceBindings?.title),
            data: isEmpty ? getTextResourceFromResourceBinding(props?.resourceBindings?.emptyFieldText) : formDataValue
        };
    }

    /**
     * Checks if the provided form data value has content.
     *
     * @param {*} formDataValue - The value from the form data to check.
     * @returns {boolean} Returns true if the form data value has content, otherwise false.
     */
    hasContent(formDataValue) {
        return hasValue(formDataValue);
    }

    /**
     * Formats the given kommunensSaksnummer object into a string.
     * The format is "saksaar/sakssekvensnummer".
     *
     * @param {Object} kommunensSaksnummer - The object containing saksaar and sakssekvensnummer.
     * @param {number} kommunensSaksnummer.saksaar - The year part of the saksnummer.
     * @param {number} kommunensSaksnummer.sakssekvensnummer - The sequence number part of the saksnummer.
     * @returns {string} The formatted kommunensSaksnummer string.
     */
    formatKommunensSaksnummer(kommunensSaksnummer) {
        const kommunensSaksnummerParts = [kommunensSaksnummer?.saksaar?.toString(), kommunensSaksnummer?.sakssekvensnummer?.toString()];
        return kommunensSaksnummerParts.filter((kommunensSaksnummerPart) => kommunensSaksnummerPart?.length).join("/");
    }

    /**
     * Retrieves and formats the 'kommunens saksnummer' value from the provided form data.
     *
     * @param {Object} props - The properties object containing form data.
     * @param {Object} props.formData - The form data object.
     * @param {Object} props.formData.data - The data containing the 'kommunens saksnummer'.
     * @returns {string} The formatted 'kommunens saksnummer'.
     */
    getValueFromFormData(props) {
        const kommunensSaksnummer = new KommunensSaksnummer(props?.formData?.data);
        return this.formatKommunensSaksnummer(kommunensSaksnummer);
    }
}
