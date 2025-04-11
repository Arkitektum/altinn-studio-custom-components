/**
 * Class representing an Eiendomsidentifikasjon.
 * @class
 */
export default class Eiendomsidentifikasjon {
    /**
     * Constructs an instance of Eiendomsidentifikasjon.
     *
     * @param {Object} props - The properties to initialize the instance with.
     * @param {number} [props.gaardsnummer] - The gaardsnummer.
     * @param {number} [props.bruksnummer] - The bruksnummer.
     * @param {number} [props.seksjonsnummer] - The seksjonsnummer.
     * @param {number} [props.festenummer] - The festenummer.
     */
    constructor(props) {
        this.gaardsnummer = props?.gaardsnummer;
        this.bruksnummer = props?.bruksnummer;
        this.seksjonsnummer = props?.seksjonsnummer;
        this.festenummer = props?.festenummer;
    }
}
