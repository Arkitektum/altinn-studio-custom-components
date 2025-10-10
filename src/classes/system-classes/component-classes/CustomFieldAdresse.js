// Classes
import Adresse from "../../data-classes/Adresse.js";
import CustomComponent from "../CustomComponent.js";

// Global functions
import { getComponentDataValue, getComponentResourceValue, getTextResourceFromResourceBinding, hasValue } from "../../../functions/helpers.js";
import { hasMissingTextResources, hasValidationMessages } from "../../../functions/validations.js";

/**
 * CustomFieldAdresse is a custom component class for handling and formatting address data.
 * It provides methods to format address lines, zip code and city, municipality name, and to retrieve
 * validation messages and text resource bindings. It also determines if the address data is empty
 * and prepares resource values for display.
 *
 * @class
 * @extends CustomComponent
 *
 * @param {Object} props - The properties for the component.
 * @param {Object} [props.resourceBindings] - Resource bindings for the component.
 * @param {string} [props.resourceBindings.title] - Custom title resource key.
 * @param {string} [props.resourceBindings.emptyFieldText] - Custom empty field text resource key.
 * @param {boolean|string} [props.hideTitle] - If true or "true", the title will be hidden.
 * @param {boolean|string} [props.hideIfEmpty] - If true or "true", the empty field text will be hidden.
 *
 * @property {Object} validationMessages - Validation messages for the component.
 * @property {boolean} hasValidationMessages - Indicates if there are validation messages.
 * @property {boolean} isEmpty - Indicates if the address data is empty.
 * @property {Object} resourceValues - Contains formatted title and address data for display.
 */
export default class CustomFieldAdresse extends CustomComponent {
    constructor(props) {
        super(props);
        const resourceBindings = this.getTextResourceBindings(props);
        const data = this.getValueFromFormData(props, resourceBindings?.adresse);
        const validationMessages = this.getValidationMessages(resourceBindings);
        this.validationMessages = validationMessages;
        this.hasValidationMessages = hasValidationMessages(validationMessages);

        const isEmpty = !this.hasContent(data);

        this.isEmpty = isEmpty;
        this.resourceValues = {
            title: getComponentResourceValue(props, "title"),
            data: isEmpty ? getTextResourceFromResourceBinding(resourceBindings?.adresse?.emptyFieldText) : data
        };
    }

    /**
     * Formats an address object into a single string with non-empty address lines separated by newlines.
     *
     * @param {Object} adresse - The address object containing address lines.
     * @param {string} [adresse.adresselinje1] - The first line of the address.
     * @param {string} [adresse.adresselinje2] - The second line of the address.
     * @param {string} [adresse.adresselinje3] - The third line of the address.
     * @returns {string} A formatted string with non-empty address lines separated by newline characters.
     */
    formatAdresselinje(adresse) {
        const adresseLinjer = [adresse?.adresselinje1, adresse?.adresselinje2, adresse?.adresselinje3];
        return adresseLinjer.filter((adresselinje) => adresselinje?.length).join("\n");
    }

    /**
     * Formats the zip code and city from an address object into a single string.
     *
     * @param {Object} adresse - The address object containing postal information.
     * @param {string} adresse.postnr - The postal code.
     * @param {string} adresse.poststed - The city name.
     * @returns {string} A formatted string combining the postal code and city, separated by a space.
     *                   If either the postal code or city is missing, it will be omitted from the result.
     */
    formatZipCity(adresse) {
        const zipCity = [adresse?.postnr, adresse?.poststed];
        return zipCity.filter((zipCity) => zipCity?.length).join(" ");
    }

    /**
     * Returns the 'kommunenavn' property from the given address object if it exists, otherwise returns an empty string.
     *
     * @param {Object} adresse - The address object containing the 'kommunenavn' property.
     * @param {string} [adresse.kommunenavn] - The name of the municipality.
     * @returns {string} The municipality name if present, otherwise an empty string.
     */
    formatKommunenavn(adresse) {
        return adresse?.kommunenavn ? `${adresse?.kommunenavn}` : "";
    }

    /**
     * Retrieves validation messages based on provided text resource bindings.
     *
     * @param {Object} textResourceBindings - An object containing keys for text resources to validate.
     * @returns {Array|string|boolean} The result of the validation, as returned by hasMissingTextResources.
     */
    getValidationMessages(textResourceBindings) {
        const textResources = typeof window !== "undefined" && window.textResources ? window.textResources : [];
        return hasMissingTextResources(textResources, textResourceBindings);
    }

    /**
     * Formats an address object into a displayable string, prioritizing address line and zip/city.
     *
     * @param {Object} adresse - The address object to format.
     * @param {Object} resourceBindings - Resource bindings for text resources.
     * @returns {string} The formatted address string, or an empty string if no relevant fields are present.
     */
    formatAdresse(adresse, resourceBindings) {
        const adresseLinje = this.formatAdresselinje(adresse);
        const zipCity = this.formatZipCity(adresse);
        const kommunenavn = this.formatKommunenavn(adresse);
        const emptyFieldText = getTextResourceFromResourceBinding(resourceBindings?.emptyFieldText) || "";
        if (adresseLinje?.length && zipCity?.length) {
            return `${adresseLinje}\n${zipCity}`;
        } else if (adresseLinje?.length) {
            return adresseLinje;
        } else if (zipCity?.length) {
            return zipCity;
        } else if (kommunenavn?.length) {
            return `${emptyFieldText}\n${kommunenavn}`;
        } else {
            return "";
        }
    }

    /**
     * Retrieves and formats the address value from the form data.
     *
     * @param {object} props - The properties containing form data.
     * @param {object} resourceBindings - The resource bindings used for formatting.
     * @returns {string} The formatted address string.
     */
    getValueFromFormData(props, resourceBindings) {
        const data = getComponentDataValue(props);
        const address = new Adresse(data);
        const adresseString = this.formatAdresse(address, resourceBindings);
        return adresseString;
    }

    /**
     * Determines if the provided data contains any address information.
     *
     * Checks if any of the address lines (adresselinje1, adresselinje2, adresselinje3)
     * or either the postal code (postnr) or city (poststed) fields have content.
     *
     * @param {Object} data - The data object containing address information.
     * @param {string} [data.adresselinje1] - First address line.
     * @param {string} [data.adresselinje2] - Second address line.
     * @param {string} [data.adresselinje3] - Third address line.
     * @param {string} [data.postnr] - Postal code.
     * @param {string} [data.poststed] - City.
     * @returns {boolean} True if any address line, postal code, or city has content; otherwise, false.
     */
    hasContent(data) {
        return hasValue(data);
    }

    /**
     * Generates text resource bindings for the address component based on the provided props.
     *
     * @param {Object} props - The properties object.
     * @param {Object} [props.resourceBindings] - Resource bindings for the component.
     * @param {string} [props.resourceBindings.title] - Custom title resource key.
     * @param {string} [props.resourceBindings.emptyFieldText] - Custom empty field text resource key.
     * @param {boolean|string} [props.hideTitle] - If true or "true", the title will be hidden.
     * @param {boolean|string} [props.hideIfEmpty] - If true or "true", the empty field text will be hidden.
     * @returns {Object} An object containing the resource bindings for the address component.
     */
    getTextResourceBindings(props) {
        const resourceBindings = {
            adresse: {}
        };
        if (!props?.hideTitle === true || !props?.hideTitle === "true") {
            resourceBindings.adresse = {
                title: props?.resourceBindings?.title || "resource.adresse.title"
            };
        }
        if (!props?.hideIfEmpty === true || !props?.hideIfEmpty === "true") {
            resourceBindings.adresse = {
                ...props.resourceBindings.adresse,
                emptyFieldText: props?.resourceBindings?.emptyFieldText || "resource.adresse.emptyFieldText.default"
            };
        }
        return resourceBindings;
    }
}
