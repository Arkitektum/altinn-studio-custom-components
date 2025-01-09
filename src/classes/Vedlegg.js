import Vedleggstype from "./Vedleggstype";

/**
 * Represents a Vedlegg (attachment).
 *
 * @class Vedlegg
 * @param {Object} props - The properties to initialize the Vedlegg instance.
 * @param {string} props.filnavn - The filename of the attachment.
 * @param {Object} props.vedleggstype - The type of the attachment.
 */
export default class Vedlegg {
    constructor(props) {
        this.filnavn = props?.filnavn;
        this.vedleggstype = props?.vedleggstype && new Vedleggstype(props.vedleggstype);
    }
}
