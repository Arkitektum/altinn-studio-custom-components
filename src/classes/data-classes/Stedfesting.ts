import type { KodeProps } from "./Kode.ts";
import type { PosisjonProps } from "./Posisjon.ts";
// Classes
import Kode from "./Kode.ts";
import Posisjon from "./Posisjon.ts";

/** What the form data holds for a Stedfesting, before it is read into the class. */
export interface StedfestingProps {
    posisjon?: PosisjonProps | undefined | null;
    vertikalnivaa?: KodeProps | undefined | null;
    /** The form data carries whatever the model held, which is more than this class reads. */
    [key: string]: unknown;
}

/**
 * Class representing a Stedfesting.
 * @class
 */
export default class Stedfesting {
    declare posisjon: Posisjon | undefined | null;
    declare vertikalnivaa: Kode | undefined | null;

    /**
     * Constructs a new instance of the class.
     * Initializes the `posisjon` property with a new `Posisjon` instance if `props.posisjon` is provided.
     *
     * @param {Object} props - The properties to initialize the class with.
     * @param {Object} [props.posisjon] - The position data to create a `Posisjon` instance.
     * @param {Object} [props.vertikalnivaa] - The vertical level, wrapped in a Kode instance if provided.
     */
    constructor(props?: StedfestingProps) {
        this.posisjon = props?.posisjon && new Posisjon(props.posisjon);
        this.vertikalnivaa = props?.vertikalnivaa && new Kode(props.vertikalnivaa);
    }
}
