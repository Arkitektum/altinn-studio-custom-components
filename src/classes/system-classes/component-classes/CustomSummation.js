// Classes
import CustomComponent from "../CustomComponent.js";

// Global functions
import { hasValue } from "../../../functions/helpers.js";

/**
 * CustomSummation is a custom component class that extends CustomComponent.
 * It determines if the component is empty based on the presence of content in the provided props,
 * specifically checking if `resourceValues.data` has a value.
 *
 * @class
 * @extends CustomComponent
 *
 * @param {Object} props - The properties object for the component.
 * @param {boolean} [props.isEmpty] - Optional flag to explicitly set if the component is empty.
 * @param {Object} [props.resourceValues] - Optional object containing resource values.
 * @param {*} [props.resourceValues.data] - The data to check for content.
 */
export default class CustomSummation extends CustomComponent {
    constructor(props) {
        super(props);
        this.isEmpty = props?.isEmpty !== undefined ? props.isEmpty : !this.hasContent(props);
        this.resourceValues = props?.resourceValues || {};
    }

    /**
     * Determines if the provided props object contains content by checking if `resourceValues.data` has a value.
     *
     * @param {Object} props - The properties object to check.
     * @param {Object} [props.resourceValues] - An optional object containing resource values.
     * @param {*} [props.resourceValues.data] - The data to check for value.
     * @returns {boolean} Returns true if `resourceValues.data` has a value, otherwise false.
     */
    hasContent(props) {
        return hasValue(props?.resourceValues?.data);
    }
}
