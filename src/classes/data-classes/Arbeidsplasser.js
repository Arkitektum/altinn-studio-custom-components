/**
 * Class representing a arbeidsplasser.
 * @class
 */
export default class Arbeidsplasser {
    /**
     * Constructs an instance of Arbeidsplasser.
     * @param {Object} props - The properties for initializing the instance.
     * @param {number} [props.antallAnsatte] - Number of employees.
     * @param {number} [props.antallVirksomheter] - Number of businesses.
     * @param {string} [props.beskrivelse] - Description of the workplace.
     * @param {boolean} [props.eksisterende] - Indicates if the workplace is existing.
     * @param {boolean} [props.faste] - Indicates if the workplace is permanent.
     * @param {boolean} [props.framtidige] - Indicates if the workplace is future.
     * @param {boolean} [props.midlertidige] - Indicates if the workplace is temporary.
     * @param {boolean} [props.utleieBygg] - Indicates if the building is for rent.
     * @param {boolean} [props.veiledning] - Indicates if guidance is provided.
     */
    constructor(props) {
        this.antallAnsatte = props?.antallAnsatte;
        this.antallVirksomheter = props?.antallVirksomheter;
        this.beskrivelse = props?.beskrivelse;
        this.eksisterende = props?.eksisterende;
        this.faste = props?.faste;
        this.framtidige = props?.framtidige;
        this.midlertidige = props?.midlertidige;
        this.utleieBygg = props?.utleieBygg;
        this.veiledning = props?.veiledning;
    }
}
