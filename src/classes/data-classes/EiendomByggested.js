// Classes
import Eiendom from "./Eiendom.js";

/**
 * Class representing an EiendomByggested.
 * @class
 */
export default class EiendomByggested {
    /**
     * Constructs an instance of the EiendomByggested class.
     * Initializes the `eiendom` property by mapping over the provided `eiendom` array
     * and creating new instances of the `Eiendom` class for each item.
     *
     * @param {Object} props - The properties to initialize the class with.
     * @param {Array} [props.eiendom] - An optional array of eiendom items to be mapped to `Eiendom` instances.
     */
    constructor(props) {
        this.eiendom =
            props?.eiendom &&
            props.eiendom.map((eiendomItem) => {
                return new Eiendom(eiendomItem);
            });
    }
}
