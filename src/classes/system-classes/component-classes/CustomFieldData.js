// Classes
import CustomComponent from "../CustomComponent.js";

// Global functions
import { hasValue } from "../../../functions/helpers.js";
import { getTextResourcesFromResourceBindings } from "../../../functions/helpers.js";

/**
 * Represents a custom field data component, extending the CustomComponent class.
 * Handles initialization of text resources, properties, and content state for a custom field.
 *
 * @extends CustomComponent
 */
export default class CustomFieldData extends CustomComponent {
    constructor(element) {
        super(element);
        const textResources = typeof window !== "undefined" && window.textResources ? window.textResources : [];

        const props = element instanceof HTMLElement ? super.getPropsFromElementAttributes(element) : element;
        const texts =
            element instanceof HTMLElement ? getTextResourcesFromResourceBindings(textResources, props?.textResourceBindings) : element.texts;

        const isEmpty = props?.isEmpty !== undefined ? props.isEmpty : !this.hasContent(props?.formData);

        this.isEmpty = isEmpty;
        this.texts = texts;
        this.text = texts?.title;
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
