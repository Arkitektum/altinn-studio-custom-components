// Classes
import CustomComponent from "../CustomComponent.js";
import Telefonnumre from "../../data-classes/Telefonnumre.js";

// Global functions
import { getComponentDataValue, getTextResourceFromResourceBinding, hasValue } from "../../../functions/helpers.js";

/**
 * CustomFieldTelefonnummer is a custom component class for handling and displaying phone numbers.
 * It extends the CustomComponent class and provides methods for formatting and extracting phone numbers
 * from form data, as well as checking for content presence.
 *
 * @class
 * @extends CustomComponent
 *
 * @param {Object} props - The properties passed to the component.
 * @param {Object} props.resourceBindings - Resource bindings for text resources.
 * @param {string} [props.resourceBindings.title] - Resource key for the title.
 * @param {string} [props.resourceBindings.emptyFieldText] - Resource key for the empty field text.
 *
 * @property {boolean} isEmpty - Indicates if the component has content.
 * @property {Object} resourceValues - Contains the title and data to be displayed.
 * @property {string} resourceValues.title - The title text resource.
 * @property {string} resourceValues.data - The formatted phone numbers or empty field text.
 */
export default class CustomFieldTelefonnummer extends CustomComponent {
    constructor(props) {
        super(props);
        const data = this.getValueFromFormData(props);

        const isEmpty = !this.hasContent(data);

        this.isEmpty = isEmpty;
        this.resourceValues = {
            title: !props?.hideTitle && getTextResourceFromResourceBinding(props?.resourceBindings?.title),
            data: isEmpty ? getTextResourceFromResourceBinding(props?.resourceBindings?.emptyFieldText) : data
        };
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
     * Extracts and formats phone number data from the provided form data props.
     *
     * @param {Object} props - The properties containing form data for the component.
     * @returns {Object} An object with a `simpleBinding` property containing the formatted phone numbers as a string.
     */
    getValueFromFormData(props) {
        const data = getComponentDataValue(props);
        const telefonnumre = new Telefonnumre(data);
        const telefonnumreString = this.formatPhoneNumbers(telefonnumre);

        return telefonnumreString;
    }

    /**
     * Checks if the provided form data contains a value for the 'simpleBinding' property.
     *
     * @param {Object} data - The data object to check.
     * @returns {boolean} Returns true if 'data' has a value, otherwise false.
     */
    hasContent(data) {
        return hasValue(data);
    }
}
