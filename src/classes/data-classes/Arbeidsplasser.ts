/** What the form data holds for a Arbeidsplasser, before it is read into the class. */
export interface ArbeidsplasserProps {
    antallAnsatte?: number;
    antallVirksomheter?: number;
    beskrivelse?: string;
    eksisterende?: boolean;
    faste?: boolean;
    framtidige?: boolean;
    midlertidige?: boolean;
    utleieBygg?: boolean;
    veiledning?: boolean;
}

/**
 * Class representing a arbeidsplasser.
 * @class
 */
export default class Arbeidsplasser {
    declare antallAnsatte?: number;
    declare antallVirksomheter?: number;
    declare beskrivelse?: string;
    declare eksisterende?: boolean;
    declare faste?: boolean;
    declare framtidige?: boolean;
    declare midlertidige?: boolean;
    declare utleieBygg?: boolean;
    declare veiledning?: boolean;

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
    constructor(props?: ArbeidsplasserProps) {
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
