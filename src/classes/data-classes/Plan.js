// Classes
import Kode from "./Kode.js";

/**
 * Represents a Plan with a name and type.
 * @class
 * @param {Object} props - Properties for initializing the Plan.
 * @param {string} [props.navn] - The name of the plan.
 * @param {Object} [props.plantype] - The type of the plan, passed to the Kode constructor.
 */
export default class Plan {
    constructor(props) {
        this.navn = props?.navn;
        this.plantype = props?.plantype && new Kode(props.plantype);
    }
}
