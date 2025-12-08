// Classes
import Kode from "./Kode.js";

/**
 * Represents an Adkomst (access) object.
 *
 * @class
 * @param {Object} props - Properties to initialize the Adkomst instance.
 * @param {boolean} [props.erNyEllerEndretAdkomst] - Indicates if the access is new or changed.
 * @param {Object} [props.vegtype] - The type of road, passed to the Kode constructor.
 */
export default class Adkomst {
    constructor(props) {
        this.erNyEllerEndretAdkomst = props?.erNyEllerEndretAdkomst;
        this.vegtype = props?.vegtype ? new Kode(props.vegtype) : undefined;
    }
}
