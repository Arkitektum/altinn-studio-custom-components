/** What the form data holds for a Eiendomsidentifikasjon, before it is read into the class. */
export interface EiendomsidentifikasjonProps {
    gaardsnummer?: number;
    bruksnummer?: number;
    seksjonsnummer?: number;
    festenummer?: number;
}

/**
 * Class representing an Eiendomsidentifikasjon.
 * @class
 */
export default class Eiendomsidentifikasjon {
    declare gaardsnummer?: number;
    declare bruksnummer?: number;
    declare seksjonsnummer?: number;
    declare festenummer?: number;

    /**
     * Constructs an instance of Eiendomsidentifikasjon.
     *
     * @param {Object} props - The properties to initialize the instance with.
     * @param {number} [props.gaardsnummer] - The gaardsnummer.
     * @param {number} [props.bruksnummer] - The bruksnummer.
     * @param {number} [props.seksjonsnummer] - The seksjonsnummer.
     * @param {number} [props.festenummer] - The festenummer.
     */
    constructor(props?: EiendomsidentifikasjonProps) {
        this.gaardsnummer = props?.gaardsnummer;
        this.bruksnummer = props?.bruksnummer;
        this.seksjonsnummer = props?.seksjonsnummer;
        this.festenummer = props?.festenummer;
    }
}
