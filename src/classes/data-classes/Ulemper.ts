/** What the form data holds for a Ulemper, before it is read into the class. */
export interface UlemperProps {
    effekt?: string;
}

/**
 * Class representing Ulemper.
 * @class
 */
export default class Ulemper {
    declare effekt?: string;

    /**
     * Creates an instance of the Fordeler class.
     *
     * @param {Object} props - The properties to initialize the instance with.
     * @param {string} [props.effekt] - The effect property of the instance.
     */
    constructor(props?: UlemperProps) {
        this.effekt = props?.effekt;
    }
}
