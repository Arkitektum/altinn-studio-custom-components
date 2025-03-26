import Adresse from "./Adresse.js";
import Eiendomsidentifikasjon from "./Eiendomsidentifikasjon.js";
/**
 * Class representing an Eiendom.
 * @class
 */
export default class Eiendom {
    /**
     * Constructs an instance of the Eiendom class.
     *
     * @param {Object} props - The properties to initialize the Eiendom instance.
     * @param {Object} [props.adresse] - The address information, used to create an instance of the Adresse class.
     * @param {Object} [props.eiendomsidentifikasjon] - The property identification, used to create an instance of the Eiendomsidentifikasjon class.
     * @param {string} [props.bolignummer] - The housing unit number.
     * @param {string} [props.bygningsnummer] - The building number.
     */
    constructor(props) {
        this.adresse = props?.adresse && new Adresse(props.adresse);
        this.eiendomsidentifikasjon =
            props?.eiendomsidentifikasjon && new Eiendomsidentifikasjon(props.eiendomsidentifikasjon);
        this.bolignummer = props?.bolignummer;
        this.bygningsnummer = props?.bygningsnummer;
    }
}
