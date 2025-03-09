import Vedlegg from "./Vedlegg.js";

/**
 * Represents a list of attachments (Vedlegg).
 * @class
 */
export default class Vedleggsliste {
    /**
     * Creates an instance of Vedleggsliste.
     * @param {Object} props - The properties object.
     * @param {Array} props.vedlegg - The array of vedlegg items.
     */
    constructor(props) {
        this.vedlegg =
            props?.vedlegg &&
            props.vedlegg.map((vedleggItem) => {
                return new Vedlegg(vedleggItem);
            });
    }
}
