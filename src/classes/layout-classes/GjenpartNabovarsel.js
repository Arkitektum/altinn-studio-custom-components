// Classes
import EiendomByggested from "../data-classes/EiendomByggested.js";
import NaboGjenboerEiendommer from "../data-classes/NaboGjenboerEiendommer.js";
import Part from "../data-classes/Part.js";
import Planer from "../data-classes/Planer.js";

/**
 * Class representing a GjenpartNabovarsel.
 * @class
 */
export default class GjenpartNabovarsel {
    /**
     * Constructs a new GjenpartNabovarsel instance.
     *
     * @param {Object} props - The properties to initialize the instance with.
     * @param {Object} [props.ansvarligSoeker] - The responsible applicant. Instance of Part.
     * @param {Object} [props.eiendomByggested] - The property/building site. Instance of EiendomByggested.
     * @param {Object} [props.kontaktpersonForNabovarselet] - The contact person for the neighbor notification. Instance of Part.
     * @param {Object} [props.naboGjenboerEiendommer] - The neighboring/opposite properties. Instance of NaboGjenboerEiendommer.
     * @param {Object} [props.planer] - The plans. Instance of Planer.
     * @param {*} [props.soeknadGjelder] - The subject of the application.
     * @param {Object} [props.tiltakshaver] - The developer. Instance of Part.
     */
    constructor(props) {
        this.ansvarligSoeker = props?.ansvarligSoeker && new Part(props.ansvarligSoeker);
        this.eiendomByggested = props?.eiendomByggested && new EiendomByggested(props.eiendomByggested);
        this.kontaktpersonForNabovarselet = props?.kontaktpersonForNabovarselet && new Part(props.kontaktpersonForNabovarselet);
        this.naboGjenboerEiendommer = props?.naboGjenboerEiendommer && new NaboGjenboerEiendommer(props.naboGjenboerEiendommer);
        this.planer = props?.planer && new Planer(props.planer);
        this.soeknadGjelder = props?.soeknadGjelder;
        this.tiltakshaver = props?.tiltakshaver && new Part(props.tiltakshaver);
    }
}
