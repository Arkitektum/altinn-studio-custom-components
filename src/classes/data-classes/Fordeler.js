/**
 * Class representing Fordeler.
 * @class
 */
export default class Fordeler {
    /**
     * Creates an instance of the Fordeler class.
     *
     * @param {Object} props - The properties to initialize the instance with.
     * @param {string} [props.effekt] - The effect property of the instance.
     */
    constructor(props) {
        this.effekt = props?.effekt;
    }
}
