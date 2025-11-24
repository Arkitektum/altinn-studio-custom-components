// Classes
import Eiendom from "./Eiendom.js";

/**
 * Class representing an GjenboerEiendom.
 * @class
 */
export default class GjenboerEiendom {
    /**
     * Constructs a new GjenboerEiendom instance.
     *
     * @param {Object} props - The properties to initialize the instance with.
     * @param {Object} [props.matrikkelinformasjon] - Information about the property, used to create an Eiendom instance.
     * @param {string} [props.sluttbrukersystemReferanse] - Reference to the end-user system.
     */
    constructor(props) {
        this.matrikkelinformasjon = props?.matrikkelinformasjon && new Eiendom(props.matrikkelinformasjon);
        this.sluttbrukersystemReferanse = props?.sluttbrukersystemReferanse;
    }
}
