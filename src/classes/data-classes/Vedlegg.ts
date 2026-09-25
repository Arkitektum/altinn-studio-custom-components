import type { KodeProps } from "./Kode.ts";
// Classes
import Kode from "./Kode.ts";

/** What the form data holds for a Vedlegg, before it is read into the class. */
export interface VedleggProps {
    filnavn?: string | null;
    vedleggstype?: KodeProps | undefined | null;
    /** The form data carries whatever the model held, which is more than this class reads. */
    [key: string]: unknown;
}

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
    declare filnavn?: string | null;
    declare vedleggstype: Kode | undefined | null;

    /**
     * Constructs a new instance of Vedlegg.
     *
     * @param {Object} props - The properties to initialize the Vedlegg instance.
     * @param {string} [props.filnavn] - The name of the attachment.
     * @param {Object} [props.vedleggstype] - The type of the attachment, which will be converted to a Kode instance.
     */
    constructor(props?: VedleggProps) {
        this.filnavn = props?.filnavn;
        this.vedleggstype = props?.vedleggstype && new Kode(props.vedleggstype);
    }
}
