/**
 * Class representing a Planbestemmelse.
 * @class
 */
export default class Planbestemmelse {
    /**
     * Creates an instance of the Planbestemmelse class.
     *
     * @param {Object} props - The properties to initialize the instance with.
     * @param {string} [props.nummerering] - The numbering associated with the plan determination.
     */
    constructor(props) {
        this.nummerering = props?.nummerering;
    }
}
