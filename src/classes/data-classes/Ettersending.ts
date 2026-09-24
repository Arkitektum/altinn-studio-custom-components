import type { KodeProps } from "./Kode.ts";
import type { VedleggslisteProps } from "./Vedleggsliste.ts";
// Classes
import Kode from "./Kode.ts";
import Vedleggsliste from "./Vedleggsliste.ts";

/** What the form data holds for a Ettersending, before it is read into the class. */
export interface EttersendingProps {
    kommentar?: string;
    tema?: KodeProps | undefined;
    tittel?: string;
    vedleggsliste?: VedleggslisteProps | undefined;
}

/**
 * Class representing Ettersending.
 * @class
 */
export default class Ettersending {
    declare kommentar?: string;
    declare tema: Kode | undefined;
    declare tittel?: string;
    declare vedleggsliste: Vedleggsliste | undefined;

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
