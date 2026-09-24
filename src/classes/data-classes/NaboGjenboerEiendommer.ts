import type { NaboGjenboerEiendomProps } from "./NaboGjenboerEiendom.ts";
// Classes
import NaboGjenboerEiendom from "./NaboGjenboerEiendom.ts";

/** What the form data holds for a NaboGjenboerEiendommer, before it is read into the class. */
export interface NaboGjenboerEiendommerProps {
    naboGjenboerEiendom?: NaboGjenboerEiendomProps[] | undefined | null;
    /** The form data carries whatever the model held, which is more than this class reads. */
    [key: string]: unknown;
}

/**
 * Class representing a list of NaboGjenboerEiendommer.
 * @class
 */
export default class NaboGjenboerEiendommer {
    declare naboGjenboerEiendom?: unknown[] | null;

    /**
     * Constructs an instance of the class, initializing the `naboGjenboerEiendom` property.
     * If `props.naboGjenboerEiendom` is provided, it maps each item to a new `NaboGjenboerEiendom` instance.
     *
     * @param {Object} props - The properties object.
     * @param {Array<Object>} [props.naboGjenboerEiendom] - Optional array of nabo/gjenboer eiendom objects to be mapped to instances of `NaboGjenboerEiendom`.
     */
    constructor(props?: NaboGjenboerEiendommerProps) {
        this.naboGjenboerEiendom = props?.naboGjenboerEiendom
            ? props.naboGjenboerEiendom.map((naboGjenboerEiendomItem) => {
                  return new NaboGjenboerEiendom(naboGjenboerEiendomItem);
              })
            : undefined;
    }
}
