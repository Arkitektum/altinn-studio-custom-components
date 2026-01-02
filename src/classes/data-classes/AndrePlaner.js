// Classes
import { hasValue } from "../../functions/helpers.js";
import Plan from "./Plan.js";

/**
 * Class representing additional plans (AndrePlaner).
 * @class
 */
export default class AndrePlaner {
    /**
     * Constructs an instance of AndrePlaner.
     * Initializes the `plan` property by mapping over the provided `props.plan` array,
     * creating a new `Plan` instance for each item, and filtering out any invalid plans.
     *
     * @param {Object} props - The properties object.
     * @param {Array<Object>} [props.plan] - An optional array of plan items to initialize.
     */
    constructor(props) {
        this.plan = props?.plan
            ? props.plan
                  .map((planItem) => {
                      const plan = new Plan(planItem);
                      return hasValue(plan) ? plan : null;
                  })
                  .filter((planItem) => planItem !== null)
            : undefined;
    }
}
