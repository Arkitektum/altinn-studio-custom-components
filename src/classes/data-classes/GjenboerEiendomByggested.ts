import type { GjenboerEiendomProps } from "./GjenboerEiendom.ts";
// Classes
import GjenboerEiendom from "./GjenboerEiendom.ts";

/** What the form data holds for a GjenboerEiendomByggested, before it is read into the class. */
export interface GjenboerEiendomByggestedProps {
    eiendom?: GjenboerEiendomProps[] | undefined | null;
    /** The form data carries whatever the model held, which is more than this class reads. */
    [key: string]: unknown;
}

/**
 * Class representing an GjenboerEiendomByggested.
 * @class
 */
export default class GjenboerEiendomByggested {
    declare eiendom?: GjenboerEiendom[] | null;

    /**
     * Constructs a new instance of the class.
     * Initializes the `eiendom` property by mapping over the provided `props.eiendom` array,
     * creating a new `GjenboerEiendom` instance for each item.
     *
     * @param {Object} props - The properties object.
     * @param {Array<Object>} [props.eiendom] - An optional array of eiendom items to be mapped to `GjenboerEiendom` instances.
     */
    constructor(props?: GjenboerEiendomByggestedProps) {
        this.eiendom =
            props?.eiendom &&
            props.eiendom.map((eiendomItem) => {
                return new GjenboerEiendom(eiendomItem);
            });
    }
}
