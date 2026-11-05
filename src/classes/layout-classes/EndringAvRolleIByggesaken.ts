import type { EiendomByggestedProps } from "../data-classes/EiendomByggested.ts";
import type { KommunensSaksnummerProps } from "../data-classes/KommunensSaksnummer.ts";
import type { PartProps } from "../data-classes/Part.ts";
import type { RolleendringerProps } from "../data-classes/Rolleendringer.ts";
import type { SoeknadGjelderProps } from "./GjenpartNabovarsel.ts";
// Classes
import EiendomByggested from "../data-classes/EiendomByggested.ts";
import KommunensSaksnummer from "../data-classes/KommunensSaksnummer.ts";
import Part from "../data-classes/Part.ts";
import Rolleendringer from "../data-classes/Rolleendringer.ts";

/** What the form data holds for an EndringAvRolleIByggesaken, before it is read into the class. */
export interface EndringAvRolleIByggesakenProps {
    eiendomByggested?: EiendomByggestedProps | null;
    endringMeldtAv?: PartProps | null;
    gjelderFraDato?: string | null;
    kommunensSaksnummer?: KommunensSaksnummerProps | null;
    rolleendringer?: RolleendringerProps | null;
    soeknadGjelder?: SoeknadGjelderProps | null;
    /** The form data carries whatever the model held, which is more than this class reads. */
    [key: string]: unknown;
}

/**
 * Class representing an EndringAvRolleIByggesaken.
 * @class
 */
export default class EndringAvRolleIByggesaken {
    declare eiendomByggested: EiendomByggested | undefined | null;
    declare endringMeldtAv: Part | undefined | null;
    declare gjelderFraDato?: string | null;
    declare kommunensSaksnummer: KommunensSaksnummer | undefined | null;
    declare rolleendringer: Rolleendringer | undefined | null;
    declare soeknadGjelder?: SoeknadGjelderProps | null;

    /**
     * Constructs a new EndringAvRolleIByggesaken instance.
     *
     * @param {Object} props - The properties to initialize the instance with.
     * @param {Object} [props.eiendomByggested] - The property/building site. Instance of EiendomByggested.
     * @param {Object} [props.endringMeldtAv] - The party who reported the change. Instance of Part.
     * @param {string} [props.gjelderFraDato] - The date the change applies from.
     * @param {Object} [props.kommunensSaksnummer] - The municipal case number. Instance of KommunensSaksnummer.
     * @param {Object} [props.rolleendringer] - The changes of role. Instance of Rolleendringer.
     * @param {*} [props.soeknadGjelder] - The subject of the application.
     */
    constructor(props?: EndringAvRolleIByggesakenProps) {
        this.eiendomByggested = props?.eiendomByggested && new EiendomByggested(props.eiendomByggested);
        this.endringMeldtAv = props?.endringMeldtAv && new Part(props.endringMeldtAv);
        this.gjelderFraDato = props?.gjelderFraDato;
        this.kommunensSaksnummer = props?.kommunensSaksnummer && new KommunensSaksnummer(props.kommunensSaksnummer);
        this.rolleendringer = props?.rolleendringer && new Rolleendringer(props.rolleendringer);
        this.soeknadGjelder = props?.soeknadGjelder;
    }
}
