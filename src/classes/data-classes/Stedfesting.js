import Posisjon from "./Posisjon.js";
/**
 * Class representing a Stedfesting.
 * @class
 */
export default class Stedfesting {
    /**
     * Constructs a new instance of the class.
     * Initializes the `posisjon` property with a new `Posisjon` instance if `props.posisjon` is provided.
     *
     * @param {Object} props - The properties to initialize the class with.
     * @param {Object} [props.posisjon] - The position data to create a `Posisjon` instance.
     */
    constructor(props) {
        this.posisjon = props?.posisjon && new Posisjon(props.posisjon);
    }
}
