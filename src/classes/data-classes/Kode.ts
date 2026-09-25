/** What the form data holds for a Kode, before it is read into the class. */
export interface KodeProps {
    kodeverdi?: string | null;
    kodebeskrivelse?: string | null;
    /** The form data carries whatever the model held, which is more than this class reads. */
    [key: string]: unknown;
}

/**
 * Class representing a Kode.
 * @class
 */
export default class Kode {
    declare kodeverdi?: string | null;
    declare kodebeskrivelse?: string | null;

    /**
     * Create a Kode.
     * @param {Object} props - The properties object.
     * @param {string} props.kodeverdi - The value code.
     * @param {string} props.kodebeskrivelse - The description code.
     */
    constructor(props?: KodeProps) {
        this.kodeverdi = props?.kodeverdi;
        this.kodebeskrivelse = props?.kodebeskrivelse;
    }
}
