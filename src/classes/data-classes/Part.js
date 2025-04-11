// Classes
import { hasValue } from "../../functions/helpers.js";
import Adresse from "./Adresse.js";
import Telefonnumre from "./Telefonnumre.js";

/**
 * Class representing a Part.
 * @class
 */
export default class Part {
    /**
     * Creates an instance of the Part class.
     *
     * @param {Object} props - The properties to initialize the Part instance.
     * @param {string} [props.navn] - The name of the part.
     * @param {string} [props.organisasjonsnummer] - The organization number of the part.
     * @param {Object} [props.adresse] - The address of the part, used to create an instance of the Adresse class.
     * @param {string} [props.telefonnummer] - The landline phone number of the part.
     * @param {string} [props.mobilnummer] - The mobile phone number of the part.
     * @param {string} [props.epost] - The email address of the part.
     */
    constructor(props) {
        const adresse = this.getAdresse(props);
        const telefonnumre = this.getTelefonnumre(props);

        this.navn = props?.navn;
        this.organisasjonsnummer = props?.organisasjonsnummer;
        this.epost = props?.epost;

        if (adresse) {
            this.adresse = adresse;
        }
        if (telefonnumre) {
            this.telefonnumre = telefonnumre;
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
            return new Adresse(props.adresse);
        }
        return undefined;
    }

    /**
     * Retrieves an instance of the Telefonnumre class if either telefonnummer or mobilnummer exists in the provided properties.
     *
     * @param {Object} props - The properties object containing potential phone number data.
     * @param {string} [props.telefonnummer] - The landline phone number, if available.
     * @param {string} [props.mobilnummer] - The mobile phone number, if available.
     * @returns {Telefonnumre|undefined} An instance of Telefonnumre if valid data is provided, otherwise undefined.
     */
    getTelefonnumre(props) {
        if (hasValue(props?.telefonnummer) || hasValue(props?.mobilnummer)) {
            return new Telefonnumre(props);
        }
        return undefined;
    }
}
