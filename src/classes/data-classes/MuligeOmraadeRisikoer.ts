import type { OmraaderisikoProps } from "./Omraaderisiko.ts";
// Classes
import Omraaderisiko from "./Omraaderisiko.ts";

/** What the form data holds for a MuligeOmraadeRisikoer, before it is read into the class. */
export interface MuligeOmraadeRisikoerProps {
    omraadeRisiko?: OmraaderisikoProps[] | undefined;
}

/**
 * Represents possible area risks associated with building ground requirements.
 *
 * @class MuligeOmraadeRisikoer
 * @param {Object} props - The properties to initialize the MuligeOmraadeRisikoer instance.
 * @param {Array<Object>} [props.omraadeRisiko] - An array of area risk objects to be transformed into Omraaderisiko instances.
 */
export default class MuligeOmraadeRisikoer {
    declare omraadeRisiko: Omraaderisiko[] | null;

    constructor(props?: MuligeOmraadeRisikoerProps) {
        this.omraadeRisiko =
            props?.omraadeRisiko?.length && Array.isArray(props.omraadeRisiko) ? props.omraadeRisiko.map((item) => new Omraaderisiko(item)) : null;
    }
}
