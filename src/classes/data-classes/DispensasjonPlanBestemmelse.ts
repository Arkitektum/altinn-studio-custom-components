import type { NasjonalArealplanIdProps } from "./NasjonalArealplanId.ts";
import type { PlanbestemmelseProps } from "./Planbestemmelse.ts";
// Classes
import NasjonalArealplanId from "./NasjonalArealplanId.ts";
import Planbestemmelse from "./Planbestemmelse.ts";

/** What the form data holds for a DispensasjonPlanBestemmelse, before it is read into the class. */
export interface DispensasjonPlanBestemmelseProps {
    navn?: string;
    nasjonalArealplanId?: NasjonalArealplanIdProps | undefined;
    planbestemmelse?: PlanbestemmelseProps | undefined;
}

/**
 * Class representing a DispensasjonPlanBestemmelse.
 * @class
 */
export default class DispensasjonPlanBestemmelse {
    declare navn?: string;
    declare nasjonalArealplanId: NasjonalArealplanId | undefined;
    declare planbestemmelse: Planbestemmelse | undefined;

    /**
     * Constructs an instance of DispensasjonPlanBestemmelse.
     *
     * @param {Object} props - The properties to initialize the instance with.
     * @param {string} [props.navn] - The name of the dispensasjon plan bestemmelse.
     * @param {Object} [props.nasjonalArealplanId] - The national area plan ID, used to create a NasjonalArealplanId instance.
     * @param {Object} [props.planbestemmelse] - The plan determination, used to create a Planbestemmelse instance.
     */
    constructor(props?: DispensasjonPlanBestemmelseProps) {
        this.navn = props?.navn;
        this.nasjonalArealplanId = props?.nasjonalArealplanId && new NasjonalArealplanId(props.nasjonalArealplanId);
        this.planbestemmelse = props?.planbestemmelse && new Planbestemmelse(props.planbestemmelse);
    }
}
