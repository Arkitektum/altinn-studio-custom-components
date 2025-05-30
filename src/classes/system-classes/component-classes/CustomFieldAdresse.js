// Classes
import CustomComponent from "../CustomComponent.js";

/**
 * CustomFieldAdresse is a custom component class for handling address fields.
 *
 * Extends the CustomComponent class and provides logic to determine if the address fields
 * (adresselinje1, adresselinje2, adresselinje3, postnr, poststed) in the form data are empty.
 *
 * @class
 * @extends CustomComponent
 *
 * @param {HTMLElement | object} element - The element or object to initialize the component with.
 * @property {boolean} isEmpty - Indicates whether the address fields are empty.
 */
export default class CustomFieldAdresse extends CustomComponent {
    constructor(element) {
        super(element);
        const props = element instanceof HTMLElement ? super.getPropsFromElementAttributes(element) : element;
        const isEmpty = props?.isEmpty !== undefined ? props.isEmpty : !this.hasContent(props?.formData);

        this.isEmpty = isEmpty;
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
        const address = formData?.data;
        const hasAdresselinje = [!!address?.adresselinje1?.length, !!address?.adresselinje2?.length, !!address?.adresselinje3?.length].some(Boolean);
        const hasZipCity = !!(address?.postnr?.length || address?.poststed?.length);
        return hasAdresselinje || hasZipCity;
    }
}
