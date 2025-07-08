// Classes
import CustomComponent from "../CustomComponent.js";

// Global functions
import { hasValue } from "../../../functions/helpers.js";

/**
 * CustomHeader is a custom component class that represents a header element.
 * It checks if the header has content based on the provided resource values.
 *
 * @extends CustomComponent
 *
 * @param {Object} props - The properties object for the component.
 * @param {Object} [props.resourceValues] - Optional object containing resource values such as title.
 * @param {*} [props.resourceValues.title] - The title value for the header.
 * @param {string} [props.size] - Optional size property for the header.
 *
 * @property {boolean} isEmpty - Indicates if the header has no content.
 * @property {Object} resourceValues - The resource values provided in props.
 * @property {string} size - The size of the header.
 */
export default class CustomHeader extends CustomComponent {
    constructor(props) {
        super(props);
        this.isEmpty = !this.hasContent(props);
        this.resourceValues = props?.resourceValues;
        this.size = props?.size;
    }

    /**
     * Determines if the provided props object contains a valid title in its resourceValues.
     *
     * @param {Object} props - The properties object to check.
     * @param {Object} [props.resourceValues] - An optional object containing resource values.
     * @param {*} [props.resourceValues.title] - The title value to check for content.
     * @returns {boolean} Returns true if the title exists and has a value, otherwise false.
     */
    hasContent(props) {
        return hasValue(props?.resourceValues?.title);
    }
}
