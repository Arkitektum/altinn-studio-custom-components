/** What the form data holds for a Telefonnumre, before it is read into the class. */
export interface TelefonnumreProps {
    telefonnummer?: string | null;
    mobilnummer?: string | null;
    telefon?: string | null;
    /** The form data carries whatever the model held, which is more than this class reads. */
    [key: string]: unknown;
}

/**
 * Class representing phone numbers.
 * @class
 */
export default class Telefonnumre {
    declare telefonnummer?: string | null;
    declare mobilnummer?: string | null;
    declare telefon?: string | null;

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
