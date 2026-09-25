import type { KodeProps } from "./Kode.ts";
import type { UtfallTypeProps } from "./UtfallType.ts";
import type { VedleggslisteProps } from "./Vedleggsliste.ts";
// Classes
import Kode from "./Kode.ts";
import UtfallType from "./UtfallType.ts";
import Vedleggsliste from "./Vedleggsliste.ts";

/** What the form data holds for a UtfallSvar, before it is read into the class. */
export interface UtfallSvarProps {
    beskrivelse?: string | null;
    erUtfallBesvaresSenere?: boolean | null;
    erUtfallBesvart?: boolean | null;
    kommentar?: string | null;
    tema?: KodeProps | undefined | null;
    tittel?: string | null;
    utfallType?: UtfallTypeProps | undefined | null;
    vedleggsliste?: VedleggslisteProps | undefined | null;
    /** The form data carries whatever the model held, which is more than this class reads. */
    [key: string]: unknown;
}

/**
 * Class representing UtfallSvar.
 * @class
 */
export default class UtfallSvar {
    declare beskrivelse?: string | null;
    declare erUtfallBesvaresSenere?: boolean | null;
    declare erUtfallBesvart?: boolean | null;
    declare kommentar?: string | null;
    declare tema: Kode | undefined | null;
    declare tittel?: string | null;
    declare utfallType: UtfallType | undefined | null;
    declare vedleggsliste: Vedleggsliste | undefined | null;

    /**
     * Constructs an instance of the UtfallSvar class.
     *
     * @param {Object} props - The properties to initialize the instance with.
     * @param {string} [props.beskrivelse] - A description of the outcome.
     * @param {boolean} [props.erUtfallBesvaresSenere] - Indicates if the outcome will be answered later.
     * @param {boolean} [props.erUtfallBesvart] - Indicates if the outcome has been answered.
     * @param {string} [props.kommentar] - A comment related to the outcome.
     * @param {Object} [props.tema] - The theme of the outcome, used to initialize a `Kode` instance.
     * @param {string} [props.tittel] - The title of the outcome.
     * @param {Object} [props.utfallType] - The type of the outcome, used to initialize a `UtfallType` instance.
     * @param {Object} [props.vedleggsliste] - A list of attachments, used to initialize a `Vedleggsliste` instance.
     */
    constructor(props?: UtfallSvarProps) {
        this.beskrivelse = props?.beskrivelse;
        this.erUtfallBesvaresSenere = props?.erUtfallBesvaresSenere;
        this.erUtfallBesvart = props?.erUtfallBesvart;
        this.kommentar = props?.kommentar;
        this.tema = props?.tema ? new Kode(props.tema) : undefined;
        this.tittel = props?.tittel;
        this.utfallType = props?.utfallType ? new UtfallType(props.utfallType) : undefined;
        this.vedleggsliste = props?.vedleggsliste ? new Vedleggsliste(props.vedleggsliste) : undefined;
    }
}
