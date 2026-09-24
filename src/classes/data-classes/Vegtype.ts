import Kode from "./Kode.ts";
import type { KodeProps } from "./Kode.ts";

/** What the form data holds for a Vegtype, before it is read into the class. */
export interface VegtypeProps {
    kode?: KodeProps[] | undefined | null;
    /** The form data carries whatever the model held, which is more than this class reads. */
    [key: string]: unknown;
}

/**
 * Represents a Vegtype with a list of Kode instances.
 * @class
 * @param {Object} props - The properties to initialize the Vegtype.
 * @param {Array<Object>} [props.kode] - An array of kode items to be mapped to Kode instances.
 */
export default class Vegtype {
    declare kode?: unknown[] | null;

    constructor(props?: VegtypeProps) {
        this.kode =
            props?.kode &&
            props.kode?.map((kodeItem) => {
                return new Kode(kodeItem);
            });
    }
}
