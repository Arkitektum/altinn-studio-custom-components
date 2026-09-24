import type { KodeProps } from "../../data-classes/Kode.ts";

/** What the form data holds for the road types and the permissions granted for them. */
export interface VegtypeTillatelseProps {
    vegtype?: { kode?: KodeProps[] | null } | null;
    erTillatelseGittKommunalVeg?: boolean | null;
    erTillatelseGittPrivatVeg?: boolean | null;
    erTillatelseGittRiksFylkesveg?: boolean | null;
}

/** One road type paired with whether permission was granted for it. */
export interface VegtypeTillatelse {
    kode: KodeProps;
    /** Null when the road type is not one the form asks about, and undefined when it asked and got no answer. */
    erTillatelseGitt?: boolean | null;
}

/**
 * Class representing a list of vegtype tillatelse (road type permissions).
 * This class processes the provided properties to generate a list of road types
 * along with their corresponding permission status.
 */
export default class VegtypeTillatelseList {
    declare resourceValues: { data: VegtypeTillatelse[] };

    constructor(props?: VegtypeTillatelseProps | null) {
        this.resourceValues = {
            data: this.getVegtypeTillatelseList(props)
        };
    }

    /**
     * Returns the boolean value indicating whether permission ("tillatelse") has been granted ("gitt")
     * for the specified road type ("vegtypeKodeverdi").
     *
     * @param {Object} props - The properties object containing permission flags.
     * @param {boolean} [props.erTillatelseGittKommunalVeg] - Permission granted for municipal road.
     * @param {boolean} [props.erTillatelseGittPrivatVeg] - Permission granted for private road.
     * @param {boolean} [props.erTillatelseGittRiksFylkesveg] - Permission granted for national/county road.
     * @param {string} vegtypeKodeverdi - The code value for the road type.
     *        Accepted values: "KommunalVeg", "PrivatVeg", "RiksFylkesveg".
     * @returns {boolean|null} The boolean value for the specified road type, or null if not found.
     */
    getBooleanValueForErTillatelseGitt(props?: VegtypeTillatelseProps | null, vegtypeKodeverdi?: string | null): boolean | null | undefined {
        switch (vegtypeKodeverdi) {
            case "KommunalVeg":
                return props?.erTillatelseGittKommunalVeg;
            case "PrivatVeg":
                return props?.erTillatelseGittPrivatVeg;
            case "RiksFylkesveg":
                return props?.erTillatelseGittRiksFylkesveg;
            default:
                return null;
        }
    }

    /**
     * Generates a list of vegtype tillatelse objects based on the provided props.
     *
     * @param {Object} props - The properties object containing vegtype information.
     * @param {Object} props.vegtype - The vegtype object.
     * @param {Array} props.vegtype.kode - An array of kode objects.
     * @returns {Array<Object>} An array of objects, each containing:
     *   - {any} kode: The kode object from the vegtype.kode array.
     *   - {boolean} erTillatelseGitt: Whether tillatelse is given for the kode.
     */
    getVegtypeTillatelseList(props?: VegtypeTillatelseProps | null): VegtypeTillatelse[] {
        return Array.isArray(props?.vegtype?.kode) && props?.vegtype?.kode?.length > 0
            ? props.vegtype.kode.map((kode) => {
                  return {
                      kode,
                      erTillatelseGitt: this.getBooleanValueForErTillatelseGitt(props, kode?.kodeverdi)
                  };
              })
            : [];
    }
}
