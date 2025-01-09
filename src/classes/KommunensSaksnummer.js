/**
 * Represents a KommunensSaksnummer.
 * @class
 */
export default class KommunensSaksnummer {
    /**
     * Creates an instance of KommunensSaksnummer.
     * @param {Object} props - The properties object.
     * @param {number} props.saksaar - The year of the case.
     * @param {number} props.sakssekvensnummer - The sequence number of the case.
     */
    constructor(props) {
        this.saksaar = props?.saksaar;
        this.sakssekvensnummer = props?.sakssekvensnummer;
    }
}
