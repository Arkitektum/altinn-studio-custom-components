import type { EiendomProps } from "./Eiendom.ts";
// Classes
import Eiendom from "./Eiendom.ts";

/** What the form data holds for a GjenboerEiendom, before it is read into the class. */
export interface GjenboerEiendomProps {
    matrikkelinformasjon?: EiendomProps | undefined;
    sluttbrukersystemReferanse?: string;
}

/**
 * Class representing an GjenboerEiendom.
 * @class
 */
export default class GjenboerEiendom {
    declare matrikkelinformasjon: Eiendom | undefined;
    declare sluttbrukersystemReferanse?: string;

    /**
     * Constructs a new GjenboerEiendom instance.
     *
     * @param {Object} props - The properties to initialize the instance with.
     * @param {Object} [props.matrikkelinformasjon] - Information about the property, used to create an Eiendom instance.
     * @param {string} [props.sluttbrukersystemReferanse] - Reference to the end-user system.
     */
    constructor(props?: GjenboerEiendomProps) {
        this.matrikkelinformasjon = props?.matrikkelinformasjon && new Eiendom(props.matrikkelinformasjon);
        this.sluttbrukersystemReferanse = props?.sluttbrukersystemReferanse;
    }
}
