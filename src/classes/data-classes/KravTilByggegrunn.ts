import type { MuligeOmraadeRisikoerProps } from "./MuligeOmraadeRisikoer.ts";
// Classes
import MuligeOmraadeRisikoer from "./MuligeOmraadeRisikoer.ts";

/** What the form data holds for a KravTilByggegrunn, before it is read into the class. */
export interface KravTilByggegrunnProps {
    muligeOmraadeRisikoer?: MuligeOmraadeRisikoerProps | undefined | null;
    harMiljoeforhold?: boolean | null;
    /** The form data carries whatever the model held, which is more than this class reads. */
    [key: string]: unknown;
}

/**
 * Represents the requirements for building ground, including possible area risks and environmental conditions.
 *
 * @class KravTilByggegrunn
 * @param {Object} props - The properties to initialize the KravTilByggegrunn instance.
 * @param {Object} [props.muligeOmraadeRisikoer] - The data for possible area risks, used to create a MuligeOmraadeRisikoer instance.
 * @param {boolean} [props.harMiljoeforhold] - Indicates if there are environmental conditions related to the building ground.
 */
export default class KravTilByggegrunn {
    declare muligeOmraadeRisikoer: MuligeOmraadeRisikoer | undefined | null;
    declare harMiljoeforhold?: boolean | null;

    constructor(props?: KravTilByggegrunnProps) {
        this.muligeOmraadeRisikoer = props?.muligeOmraadeRisikoer && new MuligeOmraadeRisikoer(props.muligeOmraadeRisikoer);
        this.harMiljoeforhold = props?.harMiljoeforhold;
    }
}
