import type { PlanProps } from "./Plan.ts";
// Dependencies
import { hasValue } from "@arkitektum/altinn-studio-custom-components-utils";

// Classes
import Plan from "./Plan.ts";

/** What the form data holds for a AndrePlaner, before it is read into the class. */
export interface AndrePlanerProps {
    plan?: PlanProps[] | undefined | null;
    /** The form data carries whatever the model held, which is more than this class reads. */
    [key: string]: unknown;
}

/**
 * Class representing additional plans (AndrePlaner).
 * @class
 */
export default class AndrePlaner {
    declare plan?: Plan[];

    /**
     * Constructs an instance of AndrePlaner.
     * Initializes the `plan` property by mapping over the provided `props.plan` array,
     * creating a new `Plan` instance for each item, and filtering out any invalid plans.
     *
     * @param {Object} props - The properties object.
     * @param {Array<Object>} [props.plan] - An optional array of plan items to initialize.
     */
    constructor(props?: AndrePlanerProps) {
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
