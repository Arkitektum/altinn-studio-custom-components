/** What the form data holds for a Varighet, before it is read into the class. */
export interface VarighetProps {
    oenskesVarigDispensasjon?: boolean | null;
    oensketVarighetTil?: string | null;
    /** The form data carries whatever the model held, which is more than this class reads. */
    [key: string]: unknown;
}

/**
 * Class representing an Varighet.
 * @class
 */
export default class Varighet {
    declare oenskesVarigDispensasjon?: boolean | null;
    declare oensketVarighetTil?: string | null;

    /**
     * Constructs an instance of the Varighet class.
     *
     * @param {Object} props - The properties to initialize the instance with.
     * @param {boolean} [props.oenskesVarigDispensasjon] - Indicates whether a permanent exemption is desired.
     * @param {string} [props.oensketVarighetTil] - Specifies the desired duration until a certain date.
     */
    constructor(props?: VarighetProps) {
        this.oenskesVarigDispensasjon = props?.oenskesVarigDispensasjon;
        this.oensketVarighetTil = props?.oensketVarighetTil;
    }
}
