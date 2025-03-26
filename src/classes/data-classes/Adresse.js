/**
 * Class representing an address.
 * @class
 */
export default class Adresse {
    /**
     * Creates an instance of Adresse.
     * @param {Object} props - The properties of the address.
     * @param {string} [props.adresselinje1] - The first line of the address.
     * @param {string} [props.adresselinje2] - The second line of the address.
     * @param {string} [props.adresselinje3] - The third line of the address.
     * @param {string} [props.postnr] - The postal code of the address.
     * @param {string} [props.poststed] - The city or place of the address.
     */
    constructor(props) {
        this.adresselinje1 = props?.adresselinje1;
        this.adresselinje2 = props?.adresselinje2;
        this.adresselinje3 = props?.adresselinje3;
        this.postnr = props?.postnr;
        this.poststed = props?.poststed;
    }
}
