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
 */
export default class CustomFieldAdresse extends CustomComponent {
    constructor(element) {
        super(element);
        this.isEmpty = this.element?.isEmpty !== undefined ? this.element.isEmpty : !this.hasContent();
    }

    /**
     * Determines whether the address fields in the form data are empty.
     *
     * Checks if any of the address lines (adresselinje1, adresselinje2, adresselinje3),
     * postal code (postnr), or city (poststed) fields have content.
     *
     * @returns {boolean} Returns true if all address fields are empty, otherwise false.
     */
    hasContent() {
        const address = this.formData?.data;
        const hasAdresselinje = [!!address?.adresselinje1?.length, !!address?.adresselinje2?.length, !!address?.adresselinje3?.length].some(Boolean);
        const hasZipCity = !!(address?.postnr?.length || address?.poststed?.length);
        return hasAdresselinje || hasZipCity;
    }
}
