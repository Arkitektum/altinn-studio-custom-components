// Classes
import Vegtype from "./Vegtype.js";

/**
 * Represents an Adkomst (access) object.
 *
 * @class
 * @param {Object} props - Properties to initialize the Adkomst instance.
 * @param {boolean} [props.erNyEllerEndretAdkomst] - Indicates if the access is new or changed.
 * @param {Object} [props.vegtype] - Object representing the vegtype to be mapped to a Vegtype instance.
 * @param {boolean} [props.erTillatelseGittKommunalVeg] - Indicates if permission is granted for municipal roads.
 * @param {boolean} [props.erTillatelseGittPrivatVeg] - Indicates if permission is granted for private roads.
 * @param {boolean} [props.erTillatelseGittRiksFylkesveg] - Indicates if permission is granted for national or county roads.
 */
export default class Adkomst {
    constructor(props) {
        this.erNyEllerEndretAdkomst = props?.erNyEllerEndretAdkomst;
        this.vegtype = props?.vegtype && new Vegtype(props.vegtype);
        this.erTillatelseGittKommunalVeg = props?.erTillatelseGittKommunalVeg;
        this.erTillatelseGittPrivatVeg = props?.erTillatelseGittPrivatVeg;
        this.erTillatelseGittRiksFylkesveg = props?.erTillatelseGittRiksFylkesveg;
    }
}
