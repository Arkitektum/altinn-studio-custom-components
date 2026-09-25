/** What the form data holds for a UtfallType, before it is read into the class. */
export interface UtfallTypeProps {
    kodeverdi?: string | null;
    /** The form data carries whatever the model held, which is more than this class reads. */
    [key: string]: unknown;
}

/**
 * Class representing an UtfallType.
 * @class
 */
export default class UtfallType {
    declare kodeverdi?: string | null;

    /**
     * Creates an instance of UtfallType.
     * @param {Object} props - The properties object.
     * @param {string} props.kodeverdi - The code value.
     */
    constructor(props?: UtfallTypeProps) {
        this.kodeverdi = props?.kodeverdi;
    }
}
