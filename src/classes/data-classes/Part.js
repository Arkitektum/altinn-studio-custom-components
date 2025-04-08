// Classes
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
        this.navn = props?.navn;
        this.organisasjonsnummer = props?.organisasjonsnummer;
        this.adresse = props?.adresse && new Adresse(props.adresse);
        this.telefonnumre = props?.telefonnummer || props?.mobilnummer ? new Telefonnumre(props) : null;
        this.epost = props?.epost;
    }
}
