/**
 * Class representing Metadata.
 * @class
 */
export default class Metadata {
    /**
     * Creates an instance of the Metadata class.
     * @param {Object} props - The properties to initialize the Metadata instance.
     * @param {string} [props.ftbId] - The ID of the FTB.
     * @param {string} [props.prosjektnavn] - The name of the project.
     * @param {string} [props.prosjektnr] - The number of the project.
     */
    constructor(props) {
        this.ftbId = props?.ftbId;
        this.prosjektnavn = props?.prosjektnavn;
        this.prosjektnr = props?.prosjektnr;
    }
}
