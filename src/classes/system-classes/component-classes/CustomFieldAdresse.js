// Classes
import Adresse from "../../data-classes/Adresse.js";
import CustomComponent from "../CustomComponent.js";

// Global functions
import { hasValue } from "../../../functions/helpers.js";

/**
 * CustomFieldAdresse is a custom component class for handling and formatting address data.
 *
 * Extends the CustomComponent class and provides methods to:
 * - Format address lines into a single string.
 * - Format zip code and city into a single string.
 * - Format a complete address object into a displayable string.
 * - Extract and format form data from component properties.
 * - Determine if the address form data contains any content.
 *
 * @class
 * @extends CustomComponent
 */
export default class CustomFieldAdresse extends CustomComponent {
    constructor(element) {
        super(element);
        const props = element instanceof HTMLElement ? super.getPropsFromElementAttributes(element) : element;

        const formData = this.getFormDataFromProps(props);
        const isEmpty = !this.hasContent(formData);

        this.isEmpty = isEmpty;
        this.formData = formData;

        this.isEmpty = isEmpty;
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
        const adresseLinjer = [adresse.adresselinje1, adresse.adresselinje2, adresse.adresselinje3];
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
        const zipCity = [adresse.postnr, adresse.poststed];
        return zipCity.filter((zipCity) => zipCity?.length).join(" ");
    }

    /**
     * Formats an address object into a into a single string.
     *
     * @param {Adresse} adresse - The address object to format.
     * @returns {string} The formatted address string.
     */
    formatAdresse(adresse) {
        const adresseLinje = this.formatAdresselinje(adresse);
        const zipCity = this.formatZipCity(adresse);
        return adresseLinje?.length ? `${adresseLinje}\n${zipCity}` : zipCity;
    }

    getFormDataFromProps(element) {
        const data = element?.formData?.data;
        const address = new Adresse(data);
        const adresseString = this.formatAdresse(address);
        return {
            simpleBinding: adresseString
        };
    }

    /**
     * Determines if the provided form data contains any address information.
     *
     * Checks if any of the address lines (adresselinje1, adresselinje2, adresselinje3)
     * or either the postal code (postnr) or city (poststed) fields have content.
     *
     * @param {Object} formData - The form data object containing address information.
     * @param {Object} formData.data - The address data object.
     * @param {string} [formData.data.adresselinje1] - First address line.
     * @param {string} [formData.data.adresselinje2] - Second address line.
     * @param {string} [formData.data.adresselinje3] - Third address line.
     * @param {string} [formData.data.postnr] - Postal code.
     * @param {string} [formData.data.poststed] - City.
     * @returns {boolean} True if any address line, postal code, or city has content; otherwise, false.
     */
    hasContent(formData) {
        return hasValue(formData?.simpleBinding);
    }
}
