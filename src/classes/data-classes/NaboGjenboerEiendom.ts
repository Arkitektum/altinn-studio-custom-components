import type { GjenboerEiendomByggestedProps } from "./GjenboerEiendomByggested.ts";
import type { PartProps } from "./Part.ts";
import type { ResponsProps } from "./Respons.ts";
// Classes
import GjenboerEiendomByggested from "./GjenboerEiendomByggested.ts";
import Part from "./Part.ts";
import Respons from "./Respons.ts";

/** What the form data holds for a NaboGjenboerEiendom, before it is read into the class. */
export interface NaboGjenboerEiendomProps {
    eiendommer?: GjenboerEiendomByggestedProps | undefined | null;
    eier?: PartProps | undefined | null;
    respons?: ResponsProps | undefined | null;
    /** The form data carries whatever the model held, which is more than this class reads. */
    [key: string]: unknown;
}

/**
 * Class representing a NaboGjenboerEiendom.
 * @class
 */
export default class NaboGjenboerEiendom {
    declare eiendommer: GjenboerEiendomByggested | undefined | null;
    declare eier: Part | undefined | null;
    declare respons: Respons | undefined | null;

    /**
     * Constructs a new instance of the class with the provided properties.
     *
     * @param {Object} props - The properties to initialize the instance with.
     * @param {Object} [props.eiendommer] - Data for initializing the `eiendommer` property, used to create a `GjenboerEiendomByggested` instance.
     * @param {Object} [props.eier] - Data for initializing the `eier` property, used to create a `Part` instance.
     * @param {Object} [props.respons] - Data for initializing the `respons` property, used to create a `Respons` instance.
     */
    constructor(props?: NaboGjenboerEiendomProps) {
        this.eiendommer = props?.eiendommer && new GjenboerEiendomByggested(props?.eiendommer);
        this.eier = props?.eier && new Part(props.eier);
        this.respons = props?.respons && new Respons(props.respons);
    }
}
