/** What the form data holds for a Fordeler, before it is read into the class. */
export interface FordelerProps {
    effekt?: string;
}

/**
 * Class representing Fordeler.
 * @class
 */
export default class Fordeler {
    declare effekt?: string;

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
