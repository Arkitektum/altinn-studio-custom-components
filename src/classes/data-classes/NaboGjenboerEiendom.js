// Classes
import GjenboerEiendomByggested from "./GjenboerEiendomByggested.js";
import Part from "./Part.js";
import Respons from "./Respons.js";

/**
 * Class representing a NaboGjenboerEiendom.
 * @class
 */
export default class NaboGjenboerEiendom {
    /**
     * Constructs a new instance of the class with the provided properties.
     *
     * @param {Object} props - The properties to initialize the instance with.
     * @param {Object} [props.eiendommer] - Data for initializing the `eiendommer` property, used to create a `GjenboerEiendomByggested` instance.
     * @param {Object} [props.eier] - Data for initializing the `eier` property, used to create a `Part` instance.
     * @param {Object} [props.respons] - Data for initializing the `respons` property, used to create a `Respons` instance.
     */
    constructor(props) {
        this.eiendommer = props?.eiendommer && new GjenboerEiendomByggested(props?.eiendommer);
        this.eier = props?.eier && new Part(props.eier);
        this.respons = props?.respons && new Respons(props.respons);
    }
}
