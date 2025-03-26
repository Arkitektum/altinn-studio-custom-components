/**
 * Class representing a NasjonalArealplanId.
 * @class
 */
export default class NasjonalArealplanId {
    /**
     * Creates an instance of the NasjonalArealplanId class.
     *
     * @param {Object} props - The properties to initialize the instance with.
     * @param {string} [props.planidentifikasjon] - The identification of the plan.
     */
    constructor(props) {
        this.planidentifikasjon = props?.planidentifikasjon;
    }
}
