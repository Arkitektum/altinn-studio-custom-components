import type { VegtypeProps } from "./Vegtype.ts";
// Classes
import Vegtype from "./Vegtype.ts";

/** What the form data holds for a Adkomst, before it is read into the class. */
export interface AdkomstProps {
    erNyEllerEndretAdkomst?: boolean | null;
    vegtype?: VegtypeProps | undefined | null;
    erTillatelseGittKommunalVeg?: boolean | null;
    erTillatelseGittPrivatVeg?: boolean | null;
    erTillatelseGittRiksFylkesveg?: boolean | null;
    /** The form data carries whatever the model held, which is more than this class reads. */
    [key: string]: unknown;
}

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
    declare erNyEllerEndretAdkomst?: boolean | null;
    declare vegtype: Vegtype | undefined | null;
    declare erTillatelseGittKommunalVeg?: boolean | null;
    declare erTillatelseGittPrivatVeg?: boolean | null;
    declare erTillatelseGittRiksFylkesveg?: boolean | null;

    constructor(props?: AdkomstProps) {
        this.erNyEllerEndretAdkomst = props?.erNyEllerEndretAdkomst;
        this.vegtype = props?.vegtype && new Vegtype(props.vegtype);
        this.erTillatelseGittKommunalVeg = props?.erTillatelseGittKommunalVeg;
        this.erTillatelseGittPrivatVeg = props?.erTillatelseGittPrivatVeg;
        this.erTillatelseGittRiksFylkesveg = props?.erTillatelseGittRiksFylkesveg;
    }
}
