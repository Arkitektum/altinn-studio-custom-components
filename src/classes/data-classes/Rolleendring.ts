import type { KodeProps } from "./Kode.ts";
import type { PartProps } from "./Part.ts";
// Classes
import Kode from "./Kode.ts";
import Part from "./Part.ts";

/** What the form data holds for a Rolleendring, before it is read into the class. */
export interface RolleendringProps {
    aktoer?: PartProps | null;
    aktoertype?: KodeProps | null;
    aktoerendring?: KodeProps | null;
    erRolleendringErklaert?: boolean | null;
    /** The form data carries whatever the model held, which is more than this class reads. */
    [key: string]: unknown;
}

/**
 * Class representing a Rolleendring: one actor taking on or giving up a role in the building case.
 * @class
 */
export default class Rolleendring {
    declare aktoer: Part | undefined | null;
    declare aktoertype: Kode | undefined | null;
    declare aktoerendring: Kode | undefined | null;
    declare erRolleendringErklaert?: boolean | null;

    /**
     * Constructs a new Rolleendring instance.
     *
     * @param {Object} props - The properties to initialize the instance with.
     * @param {Object} [props.aktoer] - The actor whose role changes. Instance of Part.
     * @param {Object} [props.aktoertype] - The role the change concerns, e.g. ansvarlig søker. Instance of Kode.
     * @param {Object} [props.aktoerendring] - The kind of change, e.g. ny or opphør. Instance of Kode.
     * @param {boolean} [props.erRolleendringErklaert] - Whether the change of role has been declared.
     */
    constructor(props?: RolleendringProps) {
        this.aktoer = props?.aktoer && new Part(props.aktoer);
        this.aktoertype = props?.aktoertype && new Kode(props.aktoertype);
        this.aktoerendring = props?.aktoerendring && new Kode(props.aktoerendring);
        this.erRolleendringErklaert = props?.erRolleendringErklaert;
    }
}
