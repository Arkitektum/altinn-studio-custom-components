/** What the form data holds for a NasjonalArealplanId, before it is read into the class. */
export interface NasjonalArealplanIdProps {
    planidentifikasjon?: string;
}

/**
 * Class representing a NasjonalArealplanId.
 * @class
 */
export default class NasjonalArealplanId {
    declare planidentifikasjon?: string;

    /**
     * Creates an instance of the NasjonalArealplanId class.
     *
     * @param {Object} props - The properties to initialize the instance with.
     * @param {string} [props.planidentifikasjon] - The identification of the plan.
     */
    constructor(props?: NasjonalArealplanIdProps) {
        this.planidentifikasjon = props?.planidentifikasjon;
    }
}
