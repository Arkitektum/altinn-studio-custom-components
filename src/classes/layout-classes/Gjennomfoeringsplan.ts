import type { EiendomByggestedProps } from "../data-classes/EiendomByggested.ts";
import type { KodeProps } from "../data-classes/Kode.ts";
import type { KommunensSaksnummerProps } from "../data-classes/KommunensSaksnummer.ts";
import type { MetadataProps } from "../data-classes/Metadata.ts";
import type { PartProps } from "../data-classes/Part.ts";
// Classes
import EiendomByggested from "../data-classes/EiendomByggested.ts";
import Kode from "../data-classes/Kode.ts";
import KommunensSaksnummer from "../data-classes/KommunensSaksnummer.ts";
import Metadata from "../data-classes/Metadata.ts";
import Part from "../data-classes/Part.ts";

/** What the form data holds for a Gjennomfoeringsplan, before it is read into the class. */
export interface GjennomfoeringsplanProps {
    ansvarligSoeker?: PartProps | null;
    ansvarligSoekerTiltaksklasse?: KodeProps | null;
    eiendomByggested?: EiendomByggestedProps | null;
    /** The plan itself, passed through untouched: the components that read it decide what it holds. */
    gjennomfoeringsplan?: unknown;
    kommunensSaksnummer?: KommunensSaksnummerProps | null;
    metadata?: MetadataProps | null;
    versjon?: unknown;
    /** The form data carries whatever the model held, which is more than this class reads. */
    [key: string]: unknown;
}

/**
 * Class representing a Gjennomfoeringsplan.
 * @class
 */
export default class Gjennomfoeringsplan {
    declare ansvarligSoeker: Part | undefined | null;
    declare ansvarligSoekerTiltaksklasse: Kode | undefined | null;
    declare eiendomByggested: EiendomByggested | undefined | null;
    declare gjennomfoeringsplan?: unknown;
    declare kommunensSaksnummer: KommunensSaksnummer | undefined | null;
    declare metadata: Metadata | undefined | null;
    declare versjon?: unknown;

    /**
     * Constructs a new Gjennomfoeringsplan instance.
     *
     * @param {Object} props - The properties to initialize the Gjennomfoeringsplan.
     * @param {Object} [props.ansvarligSoeker] - Data for the ansvarligSoeker property, used to instantiate a Part.
     * @param {Object} [props.ansvarligSoekerTiltaksklasse] - The responsibility class (tiltaksklasse) for the ansvarligSoeker, used to instantiate a Kode.
     * @param {Object} [props.eiendomByggested] - Data for the eiendomByggested property, used to instantiate an EiendomByggested.
     * @param {*} [props.gjennomfoeringsplan] - The gjennomfoeringsplan data.
     * @param {Object} [props.kommunensSaksnummer] - Data for the kommunensSaksnummer property, used to instantiate a KommunensSaksnummer.
     * @param {Object} [props.metadata] - Data for the metadata property, used to instantiate a Metadata.
     * @param {*} [props.versjon] - The version of the Gjennomfoeringsplan.
     */
    constructor(props?: GjennomfoeringsplanProps) {
        this.ansvarligSoeker = props?.ansvarligSoeker && new Part(props.ansvarligSoeker);
        this.ansvarligSoekerTiltaksklasse = props?.ansvarligSoekerTiltaksklasse && new Kode(props.ansvarligSoekerTiltaksklasse);
        this.eiendomByggested = props?.eiendomByggested && new EiendomByggested(props.eiendomByggested);
        this.gjennomfoeringsplan = props?.gjennomfoeringsplan;
        this.kommunensSaksnummer = props?.kommunensSaksnummer && new KommunensSaksnummer(props.kommunensSaksnummer);
        this.metadata = props?.metadata && new Metadata(props.metadata);
        this.versjon = props?.versjon;
    }
}
