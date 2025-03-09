import Vedleggstype from "./Vedleggstype.js";

/**
 * Represents a Vedlegg (attachment).
 * @class
 */
export default class Vedlegg {
    /**
     * Creates an instance of Vedlegg.
     * @param {Object} props - The properties to initialize the Vedlegg instance.
     * @param {string} props.filnavn - The filename of the attachment.
     * @param {Object} props.vedleggstype - The type of the attachment.
     */
    constructor(props) {
        this.filnavn = props?.filnavn;
        this.vedleggstype = props?.vedleggstype && new Vedleggstype(props.vedleggstype);
    }
}
