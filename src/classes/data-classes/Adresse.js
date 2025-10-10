/**
 * Class representing an address.
 * @class
 */
export default class Adresse {
    /**
     * Constructs an Adresse instance.
     * @param {Object} props - The properties for the address.
     * @param {string} [props.adresselinje1] - The first address line.
     * @param {string} [props.adresselinje2] - The second address line.
     * @param {string} [props.adresselinje3] - The third address line.
     * @param {string} [props.postnr] - The postal code.
     * @param {string} [props.poststed] - The city or locality.
     * @param {string|null} [props.kommunenavn=null] - The municipality name.
     */

    constructor(props) {
        this.adresselinje1 = props?.adresselinje1;
        this.adresselinje2 = props?.adresselinje2;
        this.adresselinje3 = props?.adresselinje3;
        this.postnr = props?.postnr;
        this.poststed = props?.poststed;
        this.kommunenavn = props?.kommunenavn || null;
    }
}
