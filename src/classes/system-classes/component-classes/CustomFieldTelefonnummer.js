// Classes
import CustomComponent from "../CustomComponent.js";
import Telefonnumre from "../../data-classes/Telefonnumre.js";

// Global functions
import { hasValue } from "../../../functions/helpers.js";

/**
 * CustomFieldTelefonnummer is a custom component class for handling and formatting phone number fields.
 * It extends the CustomComponent base class and provides methods to extract, format, and validate phone number data.
 *
 * @class
 * @extends CustomComponent
 *
 * @param {HTMLElement|Object} element - The element or props to initialize the component with.
 *
 * @property {boolean} isEmpty - Indicates whether the form data is empty.
 * @property {Object} formData - The extracted and formatted form data.
 */
export default class CustomFieldTelefonnummer extends CustomComponent {
    constructor(element) {
        super(element);

        const props = element instanceof HTMLElement ? super.getPropsFromElementAttributes(element) : element;

        const formData = this.getFormDataFromProps(props);
        const isEmpty = !this.hasContent(formData);

        this.isEmpty = isEmpty;
        this.formData = formData;
    }

    /**
     * Formats phone numbers by combining the provided phone number and mobile number into a single string.
     * Each number is placed on a new line.
     *
     * @param {Object} telefonnumre - An object containing phone numbers.
     * @param {string} telefonnumre.telefonnummer - The phone number.
     * @param {string} telefonnumre.mobilnummer - The mobile number.
     * @returns {string} A formatted string with each phone number on a new line.
     */
    formatPhoneNumbers(telefonnumre) {
        const phoneNumbers = [telefonnumre.telefonnummer, telefonnumre.mobilnummer];
        return phoneNumbers.filter((nummerLinje) => nummerLinje?.length).join("\n");
    }

    /**
     * Extracts and formats phone number data from the provided props object.
     *
     * @param {Object} props - The properties object containing form data.
     * @param {Object} [props.formData] - The form data object.
     * @param {Object} [props.formData.data] - The raw data containing phone numbers.
     * @returns {Object} An object with a `simpleBinding` property containing the formatted phone numbers as a string.
     */
    getFormDataFromProps(props) {
        const data = props?.formData?.data;
        const telefonnumre = new Telefonnumre(data);
        const telefonnumreString = this.formatPhoneNumbers(telefonnumre);

        return {
            simpleBinding: telefonnumreString
        };
    }

    /**
     * Checks if the provided form data contains a value for the 'simpleBinding' property.
     *
     * @param {Object} formData - The form data object to check.
     * @returns {boolean} Returns true if 'simpleBinding' has a value, otherwise false.
     */
    hasContent(formData) {
        return hasValue(formData?.simpleBinding);
    }
}
