/** What the form data holds for a Arbeidsplasser, before it is read into the class. */
export interface ArbeidsplasserProps {
    antallAnsatte?: number | null;
    antallVirksomheter?: number | null;
    beskrivelse?: string | null;
    eksisterende?: boolean | null;
    faste?: boolean | null;
    framtidige?: boolean | null;
    midlertidige?: boolean | null;
    utleieBygg?: boolean | null;
    veiledning?: boolean | null;
    /** The form data carries whatever the model held, which is more than this class reads. */
    [key: string]: unknown;
}

/**
 * Class representing a arbeidsplasser.
 * @class
 */
export default class Arbeidsplasser {
    declare antallAnsatte?: number | null;
    declare antallVirksomheter?: number | null;
    declare beskrivelse?: string | null;
    declare eksisterende?: boolean | null;
    declare faste?: boolean | null;
    declare framtidige?: boolean | null;
    declare midlertidige?: boolean | null;
    declare utleieBygg?: boolean | null;
    declare veiledning?: boolean | null;

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
