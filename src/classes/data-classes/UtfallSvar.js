import Kode from "./Kode.js";
import UtfallType from "./UtfallType.js";
import Vedleggsliste from "./Vedleggsliste.js";
/**
 * Class representing UtfallSvar.
 * @class
 */
export default class UtfallSvar {
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
    constructor(props) {
        this.beskrivelse = props?.beskrivelse;
        this.erUtfallBesvaresSenere = props?.erUtfallBesvaresSenere;
        this.erUtfallBesvart = props?.erUtfallBesvart;
        this.kommentar = props?.kommentar;
        this.tema = props?.tema && new Kode(props.tema);
        this.tittel = props?.tittel;
        this.utfallType = props?.utfallType && new UtfallType(props.utfallType);
        this.vedleggsliste = props?.vedleggsliste && new Vedleggsliste(props.vedleggsliste);
    }
}
