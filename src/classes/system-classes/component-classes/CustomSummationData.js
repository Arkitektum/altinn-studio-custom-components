// Classes
import CustomComponent from "../CustomComponent.js";

// Global functions
import {
    getComponentDataValue,
    getTextResourceFromResourceBinding,
    getTextResourcesFromResourceBindings,
    hasValue
} from "../../../functions/helpers.js";

/**
 * CustomSummationData is a custom component class that processes form data,
 * enriches it with resource values, and provides utility methods for handling
 * resource-bound data items.
 *
 * @extends CustomComponent
 */
export default class CustomSummationData extends CustomComponent {
    constructor(props) {
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
    getResourcesForDataItems(items) {
        if (!Array.isArray(items)) {
            return [];
        }
        return items.map((item) => {
            return {
                resourceValues: { ...item.resourceValues, ...getTextResourcesFromResourceBindings(item?.resourceBindings) }
            };
        });
    }

    /**
     * Retrieves the value from form data, enriches it with resources, and returns the result.
     *
     * @param {Object} props - The properties containing form data and context.
     * @returns {Array} The data items with associated resources, or an empty array if no value is found.
     */
    getValueFromFormData(props) {
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
    hasContent(formDataValue) {
        return hasValue(formDataValue);
    }
}
