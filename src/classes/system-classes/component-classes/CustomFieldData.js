// Classes
import CustomComponent from "../CustomComponent.js";

// Global functions
import { hasValue } from "../../../functions/helpers.js";

/**
 * Represents custom field data for a component, extending the CustomComponent class.
 * Determines if the field is empty based on the provided element or form data.
 *
 * @extends CustomComponent
 *
 * @param {HTMLElement | object} element - The element or object to initialize the component with.
 * @property {boolean} isEmpty - Indicates whether the custom field data is empty.
 */
export default class CustomFieldData extends CustomComponent {
    constructor(element) {
        super(element);
        const props = element instanceof HTMLElement ? super.getPropsFromElementAttributes(element) : element;
        const isEmpty = props?.isEmpty !== undefined ? props.isEmpty : !this.hasContent(props?.formData);

        this.isEmpty = isEmpty;
    }

    /**
     * Checks if the provided form data contains content by verifying the presence of a value in the `simpleBinding` property.
     *
     * @param {Object} formData - The form data object to check.
     * @returns {boolean} Returns `true` if `simpleBinding` has a value, otherwise `false`.
     */
    hasContent(formData) {
        return hasValue(formData?.simpleBinding);
    }
}
