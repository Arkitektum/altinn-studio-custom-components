/** What the form data holds for a Telefonnumre, before it is read into the class. */
export interface TelefonnumreProps {
    telefonnummer?: string;
    mobilnummer?: string;
    telefon?: string;
}

/**
 * Class representing phone numbers.
 * @class
 */
export default class Telefonnumre {
    declare telefonnummer?: string;
    declare mobilnummer?: string;
    declare telefon?: string;

    /**
     * Create a Telefonnumre instance.
     * @param {Object} props - The properties object.
     * @param {string} props.telefonnummer - The landline phone number.
     * @param {string} props.mobilnummer - The mobile phone number.
     * @param {string} props.telefon - An additional phone number.
     */
    constructor(props?: TelefonnumreProps) {
        this.telefonnummer = props?.telefonnummer;
        this.mobilnummer = props?.mobilnummer;
        this.telefon = props?.telefon;
    }
}
