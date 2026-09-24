import type { KodeProps } from "./Kode.ts";
// Dependencies
import { hasValue } from "@arkitektum/altinn-studio-custom-components-utils";

// Classes
import Kode from "./Kode.ts";

/** What the form data holds for a Tiltakstyper, before it is read into the class. */
export interface TiltakstyperProps {
    type?: { kode?: KodeProps[] | null } | null;
    /** The form data carries whatever the model held, which is more than this class reads. */
    [key: string]: unknown;
}

/** The tiltakstyper once read, which is the codes and nothing else. */
export interface TiltakstyperType {
    /** Null when the form data named the type but listed no codes under it. */
    kode: Kode[] | null;
}

/**
 * Class representing Tiltakstyper.
 * This class is used to handle the "Tiltakstyper" data structure,
 * extracting and processing type information from the provided properties.
 * @class
 */
export default class Tiltakstyper {
    /** Only set when the form data named a type, which is what leaves an absent one absent. */
    declare type?: TiltakstyperType;

    /**
     * Creates an instance of Tiltakstyper.
     * @param {Object} props - The properties object.
     * @param {Object} [props.type] - The type object containing type information.
     * @param {Array} [props.type.kode] - An array of type codes.
     */
    constructor(props?: TiltakstyperProps) {
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
    getTypeFromProps(props?: TiltakstyperProps) {
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
    getKodeFromType(type?: { kode?: KodeProps[] | null } | null) {
        if (Array.isArray(type?.kode) && type?.kode?.length) {
            return type?.kode?.map((item: KodeProps) => {
                return new Kode(item);
            });
        }
        return null;
    }
}
