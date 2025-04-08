// Classes
import NasjonalArealplanId from "./NasjonalArealplanId.js";
import Planbestemmelse from "./Planbestemmelse.js";

/**
 * Class representing a DispensasjonPlanBestemmelse.
 * @class
 */
export default class DispensasjonPlanBestemmelse {
    /**
     * Constructs an instance of DispensasjonPlanBestemmelse.
     *
     * @param {Object} props - The properties to initialize the instance with.
     * @param {string} [props.navn] - The name of the dispensasjon plan bestemmelse.
     * @param {Object} [props.nasjonalArealplanId] - The national area plan ID, used to create a NasjonalArealplanId instance.
     * @param {Object} [props.planbestemmelse] - The plan determination, used to create a Planbestemmelse instance.
     */
    constructor(props) {
        this.navn = props?.navn;
        this.nasjonalArealplanId = props?.nasjonalArealplanId && new NasjonalArealplanId(props.nasjonalArealplanId);
        this.planbestemmelse = props?.planbestemmelse && new Planbestemmelse(props.planbestemmelse);
    }
}
