// Classes
import AndrePlaner from "./AndrePlaner.js";
import Plan from "./Plan.js";

/**
 * Class representing a Planer.
 * @class
 */
export default class Planer {
    /**
     * Constructs a new instance of the class.
     * Initializes the `andrePlaner` and `gjeldendePlan` properties using the provided props.
     *
     * @param {Object} props - The properties to initialize the instance with.
     * @param {Object} [props.andrePlaner] - Data for initializing the `AndrePlaner` instance.
     * @param {Object} [props.gjeldendePlan] - Data for initializing the `Plan` instance.
     */
    constructor(props) {
        this.andrePlaner = props?.andrePlaner && new AndrePlaner(props.andrePlaner);
        this.gjeldendePlan = props?.gjeldendePlan && new Plan(props.gjeldendePlan);
    }
}
