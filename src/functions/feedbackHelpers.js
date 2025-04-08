// Classes
import CustomElementHtmlAttributes from "../classes/system-classes/CustomElementHtmlAttributes.js";

// Global functions
import { createCustomElement } from "./helpers.js";

/**
 * Renders a custom feedback list element with the provided validation messages.
 *
 * @param {Array<string>} validationMessages - An array of validation messages to display in the feedback list.
 * @returns {HTMLElement} The custom feedback list element containing the validation messages.
 */
export function renderFeedbackListElement(validationMessages) {
    const htmlAttributes = new CustomElementHtmlAttributes({
        formData: { data: validationMessages }
    });
    const feedbackListElement = createCustomElement("custom-feedbacklist-validation-messages", htmlAttributes);
    return feedbackListElement;
}
