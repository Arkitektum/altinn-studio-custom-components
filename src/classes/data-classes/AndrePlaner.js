// Classes
import Plan from "./Plan.js";

/**
 * Class representing additional plans (AndrePlaner).
 * @class
 */
export default class AndrePlaner {
    /**
     * Creates an instance of AndrePlaner.
     * @param {Object} props - The properties object.
     * @param {Array} props.plan - The array of plan items.
     */
    constructor(props) {
        this.plan = props?.plan
            ? props.plan.map((planItem) => {
                  return new Plan(planItem);
              })
            : undefined;
    }
}
