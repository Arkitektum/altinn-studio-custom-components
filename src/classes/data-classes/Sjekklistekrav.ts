import type { KodeProps } from "./Kode.ts";
// Classes
import Kode from "./Kode.ts";

/** What the form data holds for a Sjekklistekrav, before it is read into the class. */
export interface SjekklistekravProps {
    sjekklistepunktsvar?: boolean | null;
    sjekklistepunkt?: KodeProps | undefined | null;
    dokumentasjon?: string | null;
    /** The form data carries whatever the model held, which is more than this class reads. */
    [key: string]: unknown;
}

/**
 * Class representing a sjekklistekrav.
 * @class
 */
export default class Sjekklistekrav {
    declare sjekklistepunktsvar?: boolean | null;
    declare sjekklistepunkt: Kode | undefined | null;
    declare dokumentasjon?: string | null;

    /**
     * Constructs a new instance of Sjekklistekrav.
     * @param {Object} props - The properties to initialize the instance.
     * @param {boolean} [props.sjekklistepunktsvar] - The answer for the checklist item.
     * @param {Object} [props.sjekklistepunkt] - The checklist item, used to create a new Kode instance.
     * @param {string} [props.dokumentasjon] - Optional documentation related to the checklist item.
     */
    constructor(props?: SjekklistekravProps) {
        this.sjekklistepunktsvar = props?.sjekklistepunktsvar;
        this.sjekklistepunkt = props?.sjekklistepunkt && new Kode(props.sjekklistepunkt);
        if (props?.dokumentasjon) {
            this.dokumentasjon = props.dokumentasjon;
        }
    }
}
