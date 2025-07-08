// Classes
import CustomComponent from "../CustomComponent.js";

// Global functions
import { hasValue } from "../../../functions/helpers.js";

/**
 * CustomTable is a custom component class that represents a table with resource-based content.
 * It extends the CustomComponent class and provides functionality to determine if the table has content.
 *
 * @class
 * @extends CustomComponent
 *
 * @param {Object} props - The properties object for the component.
 * @param {Object} [props.resourceValues] - An object containing resource values for the table.
 * @param {*} [props.resourceValues.data] - The data value to check for content in the table.
 *
 * @property {boolean} isEmpty - Indicates whether the table has content.
 * @property {Object} resourceValues - Stores the resource values provided in props.
 */
export default class CustomTable extends CustomComponent {
    constructor(props) {
        super(props);
        this.isEmpty = !this.hasContent(props);
        this.resourceValues = props?.resourceValues || {};
    }

    /**
     * Determines if the provided props contain content in the `resourceValues.data` property.
     *
     * @param {Object} props - The properties object to check.
     * @param {Object} [props.resourceValues] - An object containing resource values.
     * @param {*} [props.resourceValues.data] - The text value to check for content.
     * @returns {boolean} Returns `true` if `resourceValues.data` has a value, otherwise `false`.
     */
    hasContent(props) {
        return hasValue(props?.resourceValues?.data);
    }
}
