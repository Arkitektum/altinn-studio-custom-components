import type { AdresseProps } from "./Adresse.ts";
import type { EiendomsidentifikasjonProps } from "./Eiendomsidentifikasjon.ts";
// Classes
import Adresse from "./Adresse.ts";
import Eiendomsidentifikasjon from "./Eiendomsidentifikasjon.ts";

/** What the form data holds for a Eiendom, before it is read into the class. */
export interface EiendomProps {
    adresse?: AdresseProps | undefined;
    eiendomsidentifikasjon?: EiendomsidentifikasjonProps | undefined;
    bolignummer?: string;
    bygningsnummer?: string;
    kommunenavn?: unknown;
}

/**
 * Class representing an Eiendom.
 * @class
 */
export default class Eiendom {
    declare adresse: Adresse | undefined;
    declare eiendomsidentifikasjon: Eiendomsidentifikasjon | undefined;
    declare bolignummer?: string;
    declare bygningsnummer?: string;
    declare kommunenavn: unknown | null;

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
    constructor(props?: EiendomProps) {
        this.adresse = props?.adresse ? new Adresse(props.adresse) : new Adresse(props);
        this.eiendomsidentifikasjon = props?.eiendomsidentifikasjon && new Eiendomsidentifikasjon(props.eiendomsidentifikasjon);
        this.bolignummer = props?.bolignummer;
        this.bygningsnummer = props?.bygningsnummer;
        this.kommunenavn = props?.kommunenavn || null;
    }
}
