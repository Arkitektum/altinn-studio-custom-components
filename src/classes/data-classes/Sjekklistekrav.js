// Classes
import Kode from "./Kode.js";

/**
 * Class representing a sjekklistekrav.
 * @class
 */
export default class Sjekklistekrav {
    /**
     * Constructs a new instance of Sjekklistekrav.
     * @param {Object} props - The properties to initialize the instance.
     * @param {boolean} [props.sjekklistepunktsvar] - The answer for the checklist item.
     * @param {Object} [props.sjekklistepunkt] - The checklist item, used to create a new Kode instance.
     * @param {string} [props.dokumentasjon] - Optional documentation related to the checklist item.
     */
    constructor(props) {
        this.sjekklistepunktsvar = props?.sjekklistepunktsvar;
        this.sjekklistepunkt = props?.sjekklistepunkt && new Kode(props.sjekklistepunkt);
        if (props?.dokumentasjon) {
            this.dokumentasjon = props.dokumentasjon;
        }
    }
}
