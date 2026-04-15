// Classes
import Omraaderisiko from "./Omraaderisiko.js";

/**
 * Represents possible area risks associated with building ground requirements.
 *
 * @class MuligeOmraadeRisikoer
 * @param {Object} props - The properties to initialize the MuligeOmraadeRisikoer instance.
 * @param {Object} [props.omraadeRisiko] - The area risk data used to create an Omraaderisiko instance.
 */
export default class MuligeOmraadeRisikoer {
    constructor(props) {
        this.omraadeRisiko = props?.omraadeRisiko && new Omraaderisiko(props.omraadeRisiko);
    }
}
