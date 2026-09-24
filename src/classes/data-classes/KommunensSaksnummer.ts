/** What the form data holds for a KommunensSaksnummer, before it is read into the class. */
export interface KommunensSaksnummerProps {
    saksaar?: number | null;
    sakssekvensnummer?: number | null;
    /** The form data carries whatever the model held, which is more than this class reads. */
    [key: string]: unknown;
}

/**
 * Class representing a KommunensSaksnummer.
 * @class
 */
export default class KommunensSaksnummer {
    declare saksaar?: number | null;
    declare sakssekvensnummer?: number | null;

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
