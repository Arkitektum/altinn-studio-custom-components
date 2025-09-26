/**
 * Class representing a varsling.
 * @class
 */
export default class Varsling {
    /**
     * Constructs a new instance of Varsling.
     * @param {Object} props - The properties to initialize the instance.
     * @param {boolean} [props.foreliggerMerknader] - Indicates if there are remarks.
     * @param {boolean} [props.fritattFraNabovarsling] - Indicates if exempt from neighbor notification.
     */
    constructor(props) {
        this.foreliggerMerknader = props?.foreliggerMerknader;
        this.fritattFraNabovarsling = props?.fritattFraNabovarsling;
    }
}
