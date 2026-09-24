/** What the form data holds for a Planbestemmelse, before it is read into the class. */
export interface PlanbestemmelseProps {
    nummerering?: string;
}

/**
 * Class representing a Planbestemmelse.
 * @class
 */
export default class Planbestemmelse {
    declare nummerering?: string;

    /**
     * Creates an instance of the Planbestemmelse class.
     *
     * @param {Object} props - The properties to initialize the instance with.
     * @param {string} [props.nummerering] - The numbering associated with the plan determination.
     */
    constructor(props?: PlanbestemmelseProps) {
        this.nummerering = props?.nummerering;
    }
}
