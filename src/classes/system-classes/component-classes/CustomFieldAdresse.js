// Classes
import Adresse from "../../data-classes/Adresse.js";
import CustomComponent from "../CustomComponent.js";

// Global functions
import { getComponentDataValue, getTextResourceFromResourceBinding, hasValue } from "../../../functions/helpers.js";

export default class CustomFieldAdresse extends CustomComponent {
    constructor(props) {
        super(props);
        const data = this.getValueFromFormData(props);

        const isEmpty = !this.hasContent(data);

        this.isEmpty = isEmpty;

        this.resourceValues = {
            title: getTextResourceFromResourceBinding(props?.resourceBindings?.title),
            data: isEmpty ? getTextResourceFromResourceBinding(props?.resourceBindings?.emptyFieldText) : data
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

    /**
     * Retrieves and formats the address value from the provided form data props.
     *
     * @param {Object} props - The properties containing form data for the component.
     * @returns {string} The formatted address string.
     */
    getValueFromFormData(props) {
        const data = getComponentDataValue(props);
        const address = new Adresse(data);
        const adresseString = this.formatAdresse(address);
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
}
