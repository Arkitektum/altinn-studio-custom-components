// Classes
import CustomComponent from "../CustomComponent.js";

// Global functions
import { hasValue } from "../../../functions/helpers.js";

/**
 * CustomDescriptionList is a custom component class that manages a description list,
 * determining if it is empty based on provided properties and resource values.
 *
 * @extends CustomComponent
 *
 * @param {Object} props - The properties object for the component.
 * @param {boolean} [props.isEmpty] - Optional flag to explicitly set if the list is empty.
 * @param {Object} [props.resourceValues] - Optional object containing resource values.
 * @param {*} [props.resourceValues.data] - The data to be checked for content.
 */
export default class CustomDescriptionList extends CustomComponent {
    constructor(props) {
        super(props);
        this.isEmpty = props?.isEmpty !== undefined ? props.isEmpty : !this.hasContent(props);
        this.resourceValues = props?.resourceValues || {};
    }

    /**
     * Checks if the provided props object contains valid content in the `resourceValues.data` property.
     *
     * @param {Object} props - The properties object to check.
     * @param {Object} [props.resourceValues] - An optional object containing resource values.
     * @param {*} [props.resourceValues.data] - The data to validate for content.
     * @returns {boolean} Returns true if `resourceValues.data` has a value, otherwise false.
     */
    hasContent(props) {
        return hasValue(props?.resourceValues?.data);
    }
}
