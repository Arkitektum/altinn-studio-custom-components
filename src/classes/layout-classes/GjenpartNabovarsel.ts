import type { DispensasjonOversiktProps } from "../data-classes/DispensasjonOversikt.ts";
import type { EiendomByggestedProps } from "../data-classes/EiendomByggested.ts";
import type { MetadataProps } from "../data-classes/Metadata.ts";
import type { NaboGjenboerEiendommerProps } from "../data-classes/NaboGjenboerEiendommer.ts";
import type { PartProps } from "../data-classes/Part.ts";
import type { PlanerProps } from "../data-classes/Planer.ts";
// Classes
import DispensasjonOversikt from "../data-classes/DispensasjonOversikt.ts";
import EiendomByggested from "../data-classes/EiendomByggested.ts";
import Metadata from "../data-classes/Metadata.ts";
import NaboGjenboerEiendommer from "../data-classes/NaboGjenboerEiendommer.ts";
import Part from "../data-classes/Part.ts";
import Planer from "../data-classes/Planer.ts";

/**
 * The paths a renderer walks into soeknadGjelder. The leaves stay open: each is handed straight to another
 * component, so what it holds is that component's business rather than this one's.
 */
export interface SoeknadGjelderProps {
    type?: { kode?: unknown } | null;
    bruk?: { tiltaksformaal?: { kode?: unknown } | null; beskrivPlanlagtFormaal?: unknown } | null;
    foelgebrev?: unknown;
    [key: string]: unknown;
}

/** What the form data holds for a GjenpartNabovarsel, before it is read into the class. */
export interface GjenpartNabovarselProps {
    ansvarligSoeker?: PartProps | null;
    eiendomByggested?: EiendomByggestedProps | null;
    kontaktpersonForNabovarselet?: PartProps | null;
    metadata?: MetadataProps | null;
    naboGjenboerEiendommer?: NaboGjenboerEiendommerProps | null;
    planer?: PlanerProps | null;
    soeknadGjelder?: SoeknadGjelderProps | null;
    tiltakshaver?: PartProps | null;
    dispensasjonOversikt?: DispensasjonOversiktProps | null;
    /** The form data carries whatever the model held, which is more than this class reads. */
    [key: string]: unknown;
}

/**
 * Class representing a GjenpartNabovarsel.
 * @class
 */
export default class GjenpartNabovarsel {
    declare ansvarligSoeker: Part | undefined | null;
    declare eiendomByggested: EiendomByggested | undefined | null;
    declare kontaktpersonForNabovarselet: Part | undefined | null;
    declare metadata: Metadata | undefined | null;
    declare naboGjenboerEiendommer: NaboGjenboerEiendommer | undefined | null;
    declare planer: Planer | undefined | null;
    declare soeknadGjelder?: SoeknadGjelderProps | null;
    declare tiltakshaver: Part | undefined | null;
    declare dispensasjonOversikt: DispensasjonOversikt | undefined | null;

    /**
     * Constructs a new GjenpartNabovarsel instance.
     *
     * @param {Object} props - The properties to initialize the instance with.
     * @param {Object} [props.ansvarligSoeker] - The responsible applicant. Instance of Part.
     * @param {Object} [props.eiendomByggested] - The property/building site. Instance of EiendomByggested.
     * @param {Object} [props.kontaktpersonForNabovarselet] - The contact person for the neighbor notification. Instance of Part.
     * @param {Object} [props.metadata] - The metadata. Instance of Metadata.
     * @param {Object} [props.naboGjenboerEiendommer] - The neighboring/opposite properties. Instance of NaboGjenboerEiendommer.
     * @param {Object} [props.planer] - The plans. Instance of Planer.
     * @param {*} [props.soeknadGjelder] - The subject of the application.
     * @param {Object} [props.tiltakshaver] - The developer. Instance of Part.
     * @param {Object} [props.dispensasjonOversikt] - The dispensation overview. Instance of DispensasjonOversikt.
     */
    constructor(props?: GjenpartNabovarselProps) {
        this.ansvarligSoeker = props?.ansvarligSoeker && new Part(props.ansvarligSoeker);
        this.eiendomByggested = props?.eiendomByggested && new EiendomByggested(props.eiendomByggested);
        this.kontaktpersonForNabovarselet = props?.kontaktpersonForNabovarselet && new Part(props.kontaktpersonForNabovarselet);
        this.metadata = props?.metadata && new Metadata(props.metadata);
        this.naboGjenboerEiendommer = props?.naboGjenboerEiendommer && new NaboGjenboerEiendommer(props.naboGjenboerEiendommer);
        this.planer = props?.planer && new Planer(props.planer);
        this.soeknadGjelder = props?.soeknadGjelder;
        this.tiltakshaver = props?.tiltakshaver && new Part(props.tiltakshaver);
        this.dispensasjonOversikt = props?.dispensasjonOversikt && new DispensasjonOversikt(props.dispensasjonOversikt);
    }
}
