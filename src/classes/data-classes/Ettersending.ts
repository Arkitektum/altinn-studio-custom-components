import type { KodeProps } from "./Kode.ts";
import type { VedleggslisteProps } from "./Vedleggsliste.ts";
// Classes
import Kode from "./Kode.ts";
import Vedleggsliste from "./Vedleggsliste.ts";

/** What the form data holds for a Ettersending, before it is read into the class. */
export interface EttersendingProps {
    kommentar?: string | null;
    tema?: KodeProps | undefined | null;
    tittel?: string | null;
    vedleggsliste?: VedleggslisteProps | undefined | null;
    /** The form data carries whatever the model held, which is more than this class reads. */
    [key: string]: unknown;
}

/**
 * Class representing Ettersending.
 * @class
 */
export default class Ettersending {
    declare kommentar?: string | null;
    declare tema: Kode | undefined | null;
    declare tittel?: string | null;
    declare vedleggsliste: Vedleggsliste | undefined | null;

    /**
     * Constructs an instance of Ettersending.
     * @param {Object} props - The properties for initializing the instance.
     * @param {string} [props.kommentar] - Optional comment.
     * @param {Object|string} [props.tema] - Optional theme, used to create a Kode instance.
     * @param {string} [props.tittel] - Optional title.
     * @param {Object|Array} [props.vedleggsliste] - Optional attachment list, used to create a Vedleggsliste instance.
     */
    constructor(props?: EttersendingProps) {
        this.kommentar = props?.kommentar;
        this.tema = props?.tema ? new Kode(props.tema) : undefined;
        this.tittel = props?.tittel;
        this.vedleggsliste = props?.vedleggsliste ? new Vedleggsliste(props.vedleggsliste) : undefined;
    }
}
