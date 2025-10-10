// Classes
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
     * @param {Object} [props.adresse] - The address information, used to create an Adresse instance.
     * @param {Object} [props.eiendomsidentifikasjon] - The property identification, used to create an Eiendomsidentifikasjon instance.
     * @param {string} [props.bolignummer] - The housing number.
     * @param {string} [props.bygningsnummer] - The building number.
     * @param {string|null} [props.kommunenavn] - The name of the municipality.
     */
    constructor(props) {
        this.adresse = props?.adresse ? new Adresse(props.adresse) : new Adresse(props);
        this.eiendomsidentifikasjon = props?.eiendomsidentifikasjon && new Eiendomsidentifikasjon(props.eiendomsidentifikasjon);
        this.bolignummer = props?.bolignummer;
        this.bygningsnummer = props?.bygningsnummer;
        this.kommunenavn = props?.kommunenavn || null;
    }
}
