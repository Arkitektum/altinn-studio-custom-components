import type { AdresseProps } from "./Adresse.ts";
import type { EiendomsidentifikasjonProps } from "./Eiendomsidentifikasjon.ts";
// Classes
import Adresse from "./Adresse.ts";
import Eiendomsidentifikasjon from "./Eiendomsidentifikasjon.ts";

/** What the form data holds for a Eiendom, before it is read into the class. */
export interface EiendomProps {
    adresse?: AdresseProps | undefined | null;
    eiendomsidentifikasjon?: EiendomsidentifikasjonProps | undefined | null;
    bolignummer?: string | null;
    bygningsnummer?: string | null;
    kommunenavn?: string | null;
    /** The form data carries whatever the model held, which is more than this class reads. */
    [key: string]: unknown;
}

/**
 * Class representing an Eiendom.
 * @class
 */
export default class Eiendom {
    declare adresse: Adresse | undefined | null;
    declare eiendomsidentifikasjon: Eiendomsidentifikasjon | undefined | null;
    declare bolignummer?: string | null;
    declare bygningsnummer?: string | null;
    declare kommunenavn?: string | null;

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
