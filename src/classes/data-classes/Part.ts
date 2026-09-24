import type { AdresseProps } from "./Adresse.ts";
// Dependencies
import { hasValue } from "@arkitektum/altinn-studio-custom-components-utils";

// Classes
import Adresse from "./Adresse.ts";

/** What the form data holds for a Part, before it is read into the class. */
export interface PartProps {
    navn?: string;
    organisasjonsnummer?: string;
    epost?: string;
    telefonnummer?: string;
    mobilnummer?: string;
    telefon?: string;
    adresse?: AdresseProps;
    kontaktperson?: unknown;
}

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
     * @param {string} [props.telefon] - An additional phone number.
     * @param {Object} [props.kontaktperson] - The contact person object.
     */

    declare navn?: string;
    declare organisasjonsnummer?: string;
    declare epost?: string;
    declare telefonnummer?: string;
    declare mobilnummer?: string;
    declare telefon?: string;
    declare adresse?: Adresse;
    declare kontaktperson?: unknown;

    constructor(props?: PartProps) {
        const adresse = this.getAdresse(props);
        const kontaktperson = this.getKontaktperson(props);

        this.navn = props?.navn;
        this.organisasjonsnummer = props?.organisasjonsnummer;
        this.epost = props?.epost;
        this.telefonnummer = props?.telefonnummer;
        this.mobilnummer = props?.mobilnummer;
        this.telefon = props?.telefon;

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
    getAdresse(props?: PartProps) {
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
    getKontaktperson(props?: PartProps) {
        if (!props?.kontaktperson) {
            return undefined;
        }
        if (hasValue(props.kontaktperson)) {
            return new Part(props.kontaktperson);
        }
        return undefined;
    }
}
