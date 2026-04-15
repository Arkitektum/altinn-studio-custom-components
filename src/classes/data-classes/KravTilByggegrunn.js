// Classes
import MuligeOmraadeRisikoer from "./MuligeOmraadeRisikoer.js";

/**
 * Represents the requirements for building ground, including possible area risks and environmental conditions.
 *
 * @class KravTilByggegrunn
 * @param {Object} props - The properties to initialize the KravTilByggegrunn instance.
 * @param {Object} [props.muligeOmraadeRisikoer] - The data for possible area risks, used to create a MuligeOmraadeRisikoer instance.
 * @param {string} [props.miljoeforhold] - Environmental conditions related to the building ground.
 */
export default class KravTilByggegrunn {
    constructor(props) {
        this.muligeOmraadeRisikoer = props?.muligeOmraadeRisikoer && new MuligeOmraadeRisikoer(props.muligeOmraadeRisikoer);
        this.miljoeforhold = props?.miljoeforhold;
    }
}
