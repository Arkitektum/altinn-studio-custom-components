// Dependencies
import { hasValue } from "@arkitektum/altinn-studio-custom-components-utils";

// Classes
import Adresse from "./Adresse.js";

/**
 * Class representing a Part.
 * @class
 */
export default class Part {
    /**
     * Constructs a new instance of the Part class.
     *
     * @param {Object} props - The properties to initialize the Part instance.
     * @param {string} [props.navn] - The name of the part.
     * @param {string} [props.organisasjonsnummer] - The organization number.
     * @param {string} [props.epost] - The email address.
     * @param {Object} [props.adresse] - The address object.
     * @param {string} [props.telefonnummer] - The landline phone number.
     * @param {string} [props.mobilnummer] - The mobile phone number.
     * @param {Object} [props.kontaktperson] - The contact person object.
     */

    constructor(props) {
        const adresse = this.getAdresse(props);
        const kontaktperson = this.getKontaktperson(props);

        this.navn = props?.navn;
        this.organisasjonsnummer = props?.organisasjonsnummer;
        this.epost = props?.epost;
        this.telefonnummer = props?.telefonnummer;
        this.mobilnummer = props?.mobilnummer;

        if (adresse) {
            this.adresse = adresse;
        }
        if (kontaktperson) {
            this.kontaktperson = kontaktperson;
        }
    }

    /**
     * Retrieves an Adresse instance if the provided props object contains a valid 'adresse' property.
     *
     * @param {Object} props - The properties object containing the 'adresse' field.
     * @param {any} props.adresse - The address data to be used for creating an Adresse instance.
     * @returns {Adresse|undefined} An instance of Adresse if 'adresse' is valid, otherwise undefined.
     */
    getAdresse(props) {
        if (hasValue(props?.adresse)) {
            return new Adresse(props?.adresse);
        }
        return undefined;
    }

    /**
     * Retrieves a Part instance representing the contact person if the provided props object contains a valid 'kontaktperson' property.
     *
     * @param {Object} props - The properties object containing the 'kontaktperson' field.
     * @param {any} props.kontaktperson - The contact person data to be used for creating a Part instance.
     * @returns {Part|undefined} An instance of Part if 'kontaktperson' is valid, otherwise undefined.
     */
    getKontaktperson(props) {
        if (!props?.kontaktperson) {
            return undefined;
        }
        if (hasValue(props.kontaktperson)) {
            return new Part(props.kontaktperson);
        }
        return undefined;
    }
}
