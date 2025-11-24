// Classes
import GjenboerEiendom from "./GjenboerEiendom.js";

/**
 * Class representing an GjenboerEiendomByggested.
 * @class
 */
export default class GjenboerEiendomByggested {
    /**
     * Constructs a new instance of the class.
     * Initializes the `eiendom` property by mapping over the provided `props.eiendom` array,
     * creating a new `GjenboerEiendom` instance for each item.
     *
     * @param {Object} props - The properties object.
     * @param {Array<Object>} [props.eiendom] - An optional array of eiendom items to be mapped to `GjenboerEiendom` instances.
     */
    constructor(props) {
        this.eiendom =
            props?.eiendom &&
            props.eiendom.map((eiendomItem) => {
                return new GjenboerEiendom(eiendomItem);
            });
    }
}
