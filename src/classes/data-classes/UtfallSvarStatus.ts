/** What the form data holds for a UtfallSvarStatus, before it is read into the class. */
export interface UtfallSvarStatusProps {
    erUtfallBesvaresSenere?: boolean | null;
    erUtfallBesvart?: boolean | null;
    /** The form data carries whatever the model held, which is more than this class reads. */
    [key: string]: unknown;
}

/**
 * Class representing an UtfallSvarStatus.
 * @class
 */
export default class UtfallSvarStatus {
    declare erUtfallBesvaresSenere?: boolean | null;
    declare erUtfallBesvart?: boolean | null;

    /**
     * Create an UtfallSvarStatus.
     * @param {Object} props - The properties object.
     * @param {boolean} props.erUtfallBesvaresSenere - Indicates if the outcome will be answered later.
     * @param {boolean} props.erUtfallBesvart - Indicates if the outcome has been answered.
     */
    constructor(props?: UtfallSvarStatusProps) {
        this.erUtfallBesvaresSenere = props?.erUtfallBesvaresSenere;
        this.erUtfallBesvart = props?.erUtfallBesvart;
    }
}
