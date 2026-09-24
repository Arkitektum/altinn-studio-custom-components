/** What the form data holds for a KommunensSaksnummer, before it is read into the class. */
export interface KommunensSaksnummerProps {
    saksaar?: number;
    sakssekvensnummer?: number;
}

/**
 * Class representing a KommunensSaksnummer.
 * @class
 */
export default class KommunensSaksnummer {
    declare saksaar?: number;
    declare sakssekvensnummer?: number;

    /**
     * Creates an instance of KommunensSaksnummer.
     * @param {Object} props - The properties object.
     * @param {number} props.saksaar - The year of the case.
     * @param {number} props.sakssekvensnummer - The sequence number of the case.
     */
    constructor(props?: KommunensSaksnummerProps) {
        this.saksaar = props?.saksaar;
        this.sakssekvensnummer = props?.sakssekvensnummer;
    }
}
