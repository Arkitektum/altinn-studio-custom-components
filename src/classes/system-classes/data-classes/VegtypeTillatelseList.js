/**
 * Class representing a list of vegtype tillatelse (road type permissions).
 * This class processes the provided properties to generate a list of road types
 * along with their corresponding permission status.
 */
export default class VegtypeTillatelseList {
    constructor(props) {
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
    getBooleanValueForErTillatelseGitt(props, vegtypeKodeverdi) {
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
    getVegtypeTillatelseList(props) {
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
