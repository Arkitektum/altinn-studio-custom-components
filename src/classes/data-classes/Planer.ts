import type { AndrePlanerProps } from "./AndrePlaner.ts";
import type { PlanProps } from "./Plan.ts";
// Classes
import AndrePlaner from "./AndrePlaner.ts";
import Plan from "./Plan.ts";

/** What the form data holds for a Planer, before it is read into the class. */
export interface PlanerProps {
    andrePlaner?: AndrePlanerProps | undefined;
    gjeldendePlan?: PlanProps | undefined;
}

/**
 * Class representing a Planer.
 * @class
 */
export default class Planer {
    declare andrePlaner: AndrePlaner | undefined;
    declare gjeldendePlan: Plan | undefined;

    /**
     * Constructs a new instance of the class.
     * Initializes the `andrePlaner` and `gjeldendePlan` properties using the provided props.
     *
     * @param {Object} props - The properties to initialize the instance with.
     * @param {Object} [props.andrePlaner] - Data for initializing the `AndrePlaner` instance.
     * @param {Object} [props.gjeldendePlan] - Data for initializing the `Plan` instance.
     */
    constructor(props?: PlanerProps) {
        this.andrePlaner = props?.andrePlaner && new AndrePlaner(props.andrePlaner);
        this.gjeldendePlan = props?.gjeldendePlan && new Plan(props.gjeldendePlan);
    }
}
