/** What the form data holds for a Loefteinnretninger, before it is read into the class. */
export interface LoefteinnretningerProps {
    erLoefteinnretningIBygning?: boolean | null;
    planleggesLoefteinnretningIBygning?: boolean | null;
    planleggesHeis?: boolean | null;
    planleggesTrappeheis?: boolean | null;
    planleggesRulletrapp?: boolean | null;
    planleggesLoefteplattform?: boolean | null;
    /** The form data carries whatever the model held, which is more than this class reads. */
    [key: string]: unknown;
}

/**
 * Class representing Loefteinnretninger.
 * @class
 */
export default class Loefteinnretninger {
    declare erLoefteinnretningIBygning?: boolean | null;
    declare planleggesLoefteinnretningIBygning?: boolean | null;
    declare planleggesHeis?: boolean | null;
    declare planleggesTrappeheis?: boolean | null;
    declare planleggesRulletrapp?: boolean | null;
    declare planleggesLoefteplattform?: boolean | null;

    /**
     * Creates an instance of Loefteinnretninger.
     * @param {Object} props - The properties to initialize the instance with.
     * @param {boolean} [props.erLoefteinnretningIBygning] - Indicates if there is a lifting device in the building.
     * @param {boolean} [props.planleggesLoefteinnretningIBygning] - Indicates if a lifting device is planned in the building.
     * @param {boolean} [props.planleggesHeis] - Indicates if an elevator is planned.
     * @param {boolean} [props.planleggesTrappeheis] - Indicates if a stairlift is planned.
     * @param {boolean} [props.planleggesRulletrapp] - Indicates if an escalator is planned.
     * @param {boolean} [props.planleggesLoefteplattform] - Indicates if a lifting platform is planned.
     */
    constructor(props?: LoefteinnretningerProps) {
        this.erLoefteinnretningIBygning = props?.erLoefteinnretningIBygning;
        this.planleggesLoefteinnretningIBygning = props?.planleggesLoefteinnretningIBygning;
        this.planleggesHeis = props?.planleggesHeis;
        this.planleggesTrappeheis = props?.planleggesTrappeheis;
        this.planleggesRulletrapp = props?.planleggesRulletrapp;
        this.planleggesLoefteplattform = props?.planleggesLoefteplattform;
    }
}
