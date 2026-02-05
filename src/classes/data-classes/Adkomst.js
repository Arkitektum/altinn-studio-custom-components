// Classes
import Vegtype from "./Vegtype.js";

/**
 * Represents an Adkomst (access) object.
 *
 * @class
 * @param {Object} props - Properties to initialize the Adkomst instance.
 * @param {boolean} [props.erNyEllerEndretAdkomst] - Indicates if the access is new or changed.
 * @param {Array<Object>} [props.vegtype] - Array of vegtype items to be mapped to Vegtype instances.
 */
export default class Adkomst {
    constructor(props) {
        this.erNyEllerEndretAdkomst = props?.erNyEllerEndretAdkomst;
        this.vegtype = props?.vegtype && new Vegtype(props.vegtype);
    }
}
