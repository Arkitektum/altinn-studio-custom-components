import DispensasjonPlanBestemmelse from "./DispensasjonPlanBestemmelse.js";
import Kode from "./Kode.js";
/**
 * Class representing a DispensasjonFra.
 * @class
 */
export default class DispensasjonFra {
    /**
     * Constructs a new instance of the class with the provided properties.
     *
     * @param {Object} props - The properties to initialize the instance with.
     * @param {Object} [props.bestemmelserType] - The type of "bestemmelser", used to create a new `Kode` instance.
     * @param {Object} [props.dispensasjonPlanBestemmelse] - The "dispensasjon plan bestemmelse", used to create a new `DispensasjonPlanBestemmelse` instance.
     * @param {string} [props.lovbestemmelse] - The legal provision associated with the instance.
     */
    constructor(props) {
        this.bestemmelserType = props?.bestemmelserType && new Kode(props.bestemmelserType);
        this.dispensasjonPlanBestemmelse = props?.dispensasjonPlanBestemmelse && new DispensasjonPlanBestemmelse(props.dispensasjonPlanBestemmelse);
        this.lovbestemmelse = props?.lovbestemmelse;
    }
}
