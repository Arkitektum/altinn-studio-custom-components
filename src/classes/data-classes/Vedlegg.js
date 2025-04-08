// Classes
import Kode from "./Kode.js";

/**
 * Class representing a Vedlegg (attachment).
 * @class
 */
export default class Vedlegg {
    /**
     * Creates an instance of Vedlegg.
     * @param {Object} props - The properties to initialize the Vedlegg instance.
     * @param {string} props.filnavn - The filename of the attachment.
     * @param {Object|string} props.vedleggstype - The type of the attachment, either an object or a string.
     */
    /**
     * Constructs a new instance of Vedlegg.
     *
     * @param {Object} props - The properties to initialize the Vedlegg instance.
     * @param {string} [props.filnavn] - The name of the attachment.
     * @param {Object} [props.vedleggstype] - The type of the attachment, which will be converted to a Kode instance.
     */
    constructor(props) {
        this.filnavn = props?.filnavn;
        this.vedleggstype = props?.vedleggstype && new Kode(props.vedleggstype);
    }
}
