/**
 * Class representing an Varighet.
 * @class
 */
export default class Varighet {
    /**
     * Constructs an instance of the Varighet class.
     *
     * @param {Object} props - The properties to initialize the instance with.
     * @param {boolean} [props.oenskesVarigDispensasjon] - Indicates whether a permanent exemption is desired.
     * @param {string} [props.oensketVarighetTil] - Specifies the desired duration until a certain date.
     */
    constructor(props) {
        this.oenskesVarigDispensasjon = props?.oenskesVarigDispensasjon;
        this.oensketVarighetTil = props?.oensketVarighetTil;
    }
}
