// Classes
import CustomComponent from "../CustomComponent.js";

// Global functions
import { hasValue } from "../../../functions/helpers.js";

/**
 * CustomField class extends CustomComponent to represent a customizable field component.
 *
 * @class
 * @extends CustomComponent
 *
 * @param {Object} props - The properties object for the component.
 * @param {boolean} [props.isEmpty] - Optional flag to indicate if the field is empty.
 * @param {Object} [props.resourceValues] - Optional object containing resource values.
 * @param {*} [props.resourceValues.text] - Optional text value for the field.
 *
 * @property {boolean} isEmpty - Indicates whether the field is empty.
 * @property {Object} resourceValues - Stores resource values for the field.
 *
 * @method hasContent
 * @description Determines if the provided props contain content in the `resourceValues.text` property.
 * @param {Object} props - The properties object to check.
 * @param {Object} [props.resourceValues] - An object containing resource values.
 * @param {*} [props.resourceValues.text] - The text value to check for content.
 * @returns {boolean} Returns `true` if `resourceValues.text` has a value, otherwise `false`.
 */
export default class CustomField extends CustomComponent {
    constructor(props) {
        super(props);
        this.isEmpty = props?.isEmpty !== undefined ? props.isEmpty : !this.hasContent(props);
        this.resourceValues = props?.resourceValues || {};
    }

    /**
     * Determines if the provided props contain content in the `resourceValues.text` property.
     *
     * @param {Object} props - The properties object to check.
     * @param {Object} [props.resourceValues] - An object containing resource values.
     * @param {*} [props.resourceValues.text] - The text value to check for content.
     * @returns {boolean} Returns `true` if `resourceValues.text` has a value, otherwise `false`.
     */
    hasContent(props) {
        return hasValue(props?.resourceValues?.text);
    }
}
