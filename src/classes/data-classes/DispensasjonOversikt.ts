import Dispensasjon from "./Dispensasjon.ts";
import type { DispensasjonProps } from "./Dispensasjon.ts";

/** What the form data holds for a DispensasjonOversikt, before it is read into the class. */
export interface DispensasjonOversiktProps {
    dispensasjon?: DispensasjonProps[] | undefined | null;
    /** The form data carries whatever the model held, which is more than this class reads. */
    [key: string]: unknown;
}

/**
 * @typedef {Object} DispensasjonOversiktProps
 * @property {Array} [dispensasjon] - An array of Dispensasjon instances.
 */
export default class DispensasjonOversikt {
    declare dispensasjon?: Dispensasjon[] | null;

    constructor(props?: DispensasjonOversiktProps) {
        this.dispensasjon =
            props?.dispensasjon &&
            props.dispensasjon.map((dispensasjonItem) => {
                return new Dispensasjon(dispensasjonItem);
            });
    }
}
