// Classes
import Omraaderisiko from "./Omraaderisiko.js";

/**
 * Represents possible area risks associated with building ground requirements.
 *
 * @class MuligeOmraadeRisikoer
 * @param {Object} props - The properties to initialize the MuligeOmraadeRisikoer instance.
 * @param {Array<Object>} [props.omraadeRisiko] - An array of area risk objects to be transformed into Omraaderisiko instances.
 */
export default class MuligeOmraadeRisikoer {
    constructor(props) {
        this.omraadeRisiko =
            props?.omraadeRisiko?.length && Array.isArray(props.omraadeRisiko) ? props.omraadeRisiko.map((item) => new Omraaderisiko(item)) : null;
    }
}
