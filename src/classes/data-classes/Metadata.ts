/** What the form data holds for a Metadata, before it is read into the class. */
export interface MetadataProps {
    ftbId?: string;
    prosjektnavn?: string;
    prosjektnr?: string;
}

/**
 * Class representing Metadata.
 * @class
 */
export default class Metadata {
    declare ftbId?: string;
    declare prosjektnavn?: string;
    declare prosjektnr?: string;

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
