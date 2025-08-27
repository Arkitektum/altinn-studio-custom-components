// Classes
import Kode from "./Kode.js";
import Vedleggsliste from "./Vedleggsliste.js";

/**
 * Class representing Ettersending.
 * @class
 */
export default class Ettersending {
    /**
     * Constructs an instance of Ettersending.
     * @param {Object} props - The properties for initializing the instance.
     * @param {string} [props.kommentar] - Optional comment.
     * @param {Object|string} [props.tema] - Optional theme, used to create a Kode instance.
     * @param {string} [props.tittel] - Optional title.
     * @param {Object|Array} [props.vedleggsliste] - Optional attachment list, used to create a Vedleggsliste instance.
     */
    constructor(props) {
        this.kommentar = props?.kommentar;
        this.tema = props?.tema ? new Kode(props.tema) : undefined;
        this.tittel = props?.tittel;
        this.vedleggsliste = props?.vedleggsliste ? new Vedleggsliste(props.vedleggsliste) : undefined;
    }
}
