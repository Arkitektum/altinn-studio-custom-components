// Classes
import CustomComponent from "../CustomComponent.js";

// Global functions
import { hasValue } from "../../../functions/helpers.js";

/**
 * Represents a custom field data component that extends the CustomComponent class.
 * Handles initialization and checks for content presence in the form data.
 *
 * @class
 * @extends CustomComponent
 *
 * @param {HTMLElement | object} element - The element or object to initialize the component with.
 * @property {boolean} isEmpty - Indicates whether the form data is empty.
 */
export default class CustomFieldData extends CustomComponent {
    constructor(element) {
        super(element);
        this.isEmpty = this.element?.isEmpty !== undefined ? this.element.isEmpty : !this.hasContent();
    }

    /**
     * Checks if the form data has content by verifying the presence of a simple binding value.
     *
     * @returns {boolean} Returns true if the simpleBinding property in formData has a value; otherwise, false.
     */
    hasContent() {
        return hasValue(this.formData?.simpleBinding);
    }
}
