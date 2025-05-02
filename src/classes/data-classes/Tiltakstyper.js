// Classes
import Kode from "./Kode.js";

// Global functions
import { hasValue } from "../../functions/helpers.js";

/**
 * Class representing Tiltakstyper.
 * This class is used to handle the "Tiltakstyper" data structure,
 * extracting and processing type information from the provided properties.
 * @class
 */
export default class Tiltakstyper {
    /**
     * Creates an instance of Tiltakstyper.
     * @param {Object} props - The properties object.
     * @param {Object} [props.type] - The type object containing type information.
     * @param {Array} [props.type.kode] - An array of type codes.
     */
    constructor(props) {
        const type = props ? this.getTypeFromProps(props) : null;
        if (type) {
            this.type = type;
        }
    }

    /**
     * Extracts the type information from the provided properties.
     * @param {Object} props - The properties object.
     * @param {Object} [props.type] - The type object containing type information.
     * @param {Array} [props.type.kode] - An array of type codes.
     * @returns {Object|null} An object containing the extracted type information, or null if not available.
     */
    getTypeFromProps(props) {
        if (props && hasValue(props?.type)) {
            return {
                kode: this.getKodeFromType(props.type)
            };
        }
        return null;
    }

    /**
     * Converts the provided type object into an array of Kode instances.
     * @param {Object} type - The type object containing type information.
     * @param {Array} [type.kode] - An array of type codes.
     * @returns {Array|null} An array of Kode instances, or null if no valid codes are found.
     */
    getKodeFromType(type) {
        if (Array.isArray(type?.kode) && type?.kode?.length) {
            return type?.kode?.map((item) => {
                return new Kode(item);
            });
        }
        return null;
    }
}
