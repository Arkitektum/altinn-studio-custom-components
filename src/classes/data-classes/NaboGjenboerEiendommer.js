// Classes
import NaboGjenboerEiendom from "./NaboGjenboerEiendom.js";

/**
 * Class representing a list of NaboGjenboerEiendommer.
 * @class
 */
export default class NaboGjenboerEiendommer {
    /**
     * Constructs an instance of the class, initializing the `naboGjenboerEiendom` property.
     * If `props.naboGjenboerEiendom` is provided, it maps each item to a new `NaboGjenboerEiendom` instance.
     *
     * @param {Object} props - The properties object.
     * @param {Array<Object>} [props.naboGjenboerEiendom] - Optional array of nabo/gjenboer eiendom objects to be mapped to instances of `NaboGjenboerEiendom`.
     */
    constructor(props) {
        this.naboGjenboerEiendom = props?.naboGjenboerEiendom
            ? props.naboGjenboerEiendom.map((naboGjenboerEiendomItem) => {
                  return new NaboGjenboerEiendom(naboGjenboerEiendomItem);
              })
            : undefined;
    }
}
