import type { ComponentProps } from "../../../types.ts";
// Dependencies
import {
    getTextResourceFromResourceBinding,
    getTextResourcesFromResourceBindings,
    hasValue
} from "@arkitektum/altinn-studio-custom-components-utils";

// Classes
import CustomComponent from "../CustomComponent.ts";

// Global functions
import { getComponentDataValue } from "../../../functions/helpers.ts";

/**
 * CustomSummationData is a custom component class that processes form data,
 * enriches it with resource values, and provides utility methods for handling
 * resource-bound data items.
 *
 * @extends CustomComponent
 */
export default class CustomSummationData extends CustomComponent {
    declare resourceValues: { title?: unknown; data?: unknown };

    constructor(props: ComponentProps) {
        super(props);
        const data = this.getValueFromFormData(props);

        const isEmpty = !this.hasContent(data);

        this.isEmpty = isEmpty;

        this.resourceValues = {
            title: getTextResourceFromResourceBinding(props?.resourceBindings?.title),
            data: isEmpty ? getTextResourceFromResourceBinding(props?.resourceBindings?.emptyFieldText) : data
        };
    }

    /**
     * Processes an array of data items and returns a new array where each item contains
     * merged resource values from the original item and additional text resources derived
     * from its resource bindings.
     *
     * @param {Array<Object>} items - The array of data items to process. Each item should have
     *   a `resourceValues` object and optionally a `resourceBindings` property.
     * @returns {Array<Object>} An array of objects, each with a `resourceValues` property containing
     *   the merged resource values.
     */
    getResourcesForDataItems(items: unknown): { resourceValues: Record<string, unknown> }[] {
        if (!Array.isArray(items)) {
            return [];
        }
        return items.map((item) => {
            return {
                // Both reads are optional: `items` comes straight from the data model, so a row can be null and a row
                // can omit `resourceBindings` (spreading a nullish value yields no keys).
                resourceValues: { ...item?.resourceValues, ...getTextResourcesFromResourceBindings(item?.resourceBindings) }
            };
        });
    }

    /**
     * Retrieves the value from form data, enriches it with resources, and returns the result.
     *
     * @param {Object} props - The properties containing form data and context.
     * @returns {Array} The data items with associated resources, or an empty array if no value is found.
     */
    getValueFromFormData(props: ComponentProps): unknown {
        const data = getComponentDataValue(props);
        const dataWithResources = this.getResourcesForDataItems(data);
        return hasValue(dataWithResources) ? dataWithResources : [];
    }

    /**
     * Checks if the provided form data contains any content.
     *
     * @param {Object} formDataValue - The form data object to check.
     * @returns {boolean} Returns true if the form data contains a value, otherwise false.
     */
    hasContent(formDataValue: unknown): boolean {
        return hasValue(formDataValue);
    }

    /**
     * Retrieves the component usage, which is an array of custom component names that this class utilizes.
     *
     * @returns {Array<string>} An array of custom component names used by this class.
     */
    getComponentUsage(): string[] {
        return ["custom-feedbacklist-validation-messages", "custom-summation"];
    }
}
