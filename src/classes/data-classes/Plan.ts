import type { KodeProps } from "./Kode.ts";
// Dependencies
import { hasValue } from "@arkitektum/altinn-studio-custom-components-utils";

// Classes
import Kode from "./Kode.ts";

/** What the form data holds for a Plan, before it is read into the class. */
export interface PlanProps {
    navn?: string;
    plantype?: KodeProps | undefined;
}

/**
 * Represents a Plan with a name and type.
 * @class
 * @param {Object} props - The properties for the Plan.
 * @param {string} [props.navn] - The name of the plan.
 * @param {Object} [props.plantype] - The type of the plan, used to instantiate a Kode object.
 */
export default class Plan {
    declare navn?: string;
    declare plantype: Kode | undefined;

    constructor(props?: PlanProps) {
        if (!hasPlanItemContent(props)) {
            return;
        }
        this.navn = props?.navn;
        this.plantype = props?.plantype && new Kode(props.plantype);
    }
}

/**
 * Checks if the 'navn' property exists and has a value in the given props object.
 *
 * @param {Object} props - The object to check for the 'navn' property.
 * @returns {boolean} Returns true if 'navn' has a value, otherwise false.
 */
function hasNavn(props?: PlanProps) {
    return hasValue(props?.navn);
}

/**
 * Checks if the given props object has a valid 'plantype' with a non-empty 'kodebeskrivelse'.
 *
 * @param {Object} props - The object containing the 'plantype' property.
 * @param {Object} [props.plantype] - The plantype object.
 * @param {string} [props.plantype.kodebeskrivelse] - The description code to check for value.
 * @returns {boolean} Returns true if 'kodebeskrivelse' has a value, otherwise false.
 */
function hasPlantype(props?: PlanProps) {
    return hasValue(props?.plantype?.kodebeskrivelse);
}

/**
 * Determines if the given props object contains plan item content.
 * Returns true if either `hasNavn(props)` or `hasPlantype(props)` evaluates to true.
 *
 * @param {Object} props - The properties object to check for plan item content.
 * @returns {boolean} True if plan item content exists, otherwise false.
 */
function hasPlanItemContent(props?: PlanProps) {
    return hasNavn(props) || hasPlantype(props);
}
