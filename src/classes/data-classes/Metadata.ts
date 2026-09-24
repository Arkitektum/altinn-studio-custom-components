/** What the form data holds for a Metadata, before it is read into the class. */
export interface MetadataProps {
    ftbId?: string | null;
    prosjektnavn?: string | null;
    prosjektnr?: string | null;
    /** The form data carries whatever the model held, which is more than this class reads. */
    [key: string]: unknown;
}

/**
 * Class representing Metadata.
 * @class
 */
export default class Metadata {
    declare ftbId?: string | null;
    declare prosjektnavn?: string | null;
    declare prosjektnr?: string | null;

    /**
     * Creates an instance of the Metadata class.
     * @param {Object} props - The properties to initialize the Metadata instance.
     * @param {string} [props.ftbId] - The ID of the FTB.
     * @param {string} [props.prosjektnavn] - The name of the project.
     * @param {string} [props.prosjektnr] - The number of the project.
     */
    constructor(props?: MetadataProps) {
        this.ftbId = props?.ftbId;
        this.prosjektnavn = props?.prosjektnavn;
        this.prosjektnr = props?.prosjektnr;
    }
}
