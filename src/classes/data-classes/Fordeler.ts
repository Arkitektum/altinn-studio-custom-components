/** What the form data holds for a Fordeler, before it is read into the class. */
export interface FordelerProps {
    effekt?: string | null;
    /** The form data carries whatever the model held, which is more than this class reads. */
    [key: string]: unknown;
}

/**
 * Class representing Fordeler.
 * @class
 */
export default class Fordeler {
    declare effekt?: string | null;

    /**
     * Creates an instance of the Fordeler class.
     *
     * @param {Object} props - The properties to initialize the instance with.
     * @param {string} [props.effekt] - The effect property of the instance.
     */
    constructor(props?: FordelerProps) {
        this.effekt = props?.effekt;
    }
}
