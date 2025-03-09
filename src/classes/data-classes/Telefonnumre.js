/**
 * Class representing phone numbers.
 * @class
 */
export default class Telefonnumre {
    /**
     * Create a Telefonnumre instance.
     * @param {Object} props - The properties object.
     * @param {string} props.telefonnummer - The landline phone number.
     * @param {string} props.mobilnummer - The mobile phone number.
     */
    constructor(props) {
        this.telefonnummer = props?.telefonnummer;
        this.mobilnummer = props?.mobilnummer;
    }
}
