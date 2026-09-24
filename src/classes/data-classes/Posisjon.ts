import type { KodeProps } from "./Kode.ts";
// Classes
import Kode from "./Kode.ts";

/** What the form data holds for a Posisjon, before it is read into the class. */
export interface PosisjonProps {
    koordinatsystem?: KodeProps | undefined;
    koordinater?: string;
}

/**
 * Class representing a Posisjon.
 * @class
 */
export default class Posisjon {
    declare koordinatsystem: Kode | undefined;
    declare koordinater?: string;

    /**
     * Constructs a new instance of the Posisjon class.
     *
     * @param {Object} props - The properties to initialize the Posisjon instance.
     * @param {Object} [props.koordinatsystem] - The coordinate system, wrapped in a Kode instance if provided.
     * @param {string} [props.koordinater] - The coordinates associated with the position.
     */
    constructor(props?: PosisjonProps) {
        this.koordinatsystem = props?.koordinatsystem && new Kode(props.koordinatsystem);
        this.koordinater = props?.koordinater;
    }
}
