// Dependencies
import { CustomElementHtmlAttributes, createCustomElement } from "@arkitektum/altinn-studio-custom-components-utils";

/**
 * Renders a custom feedback list element containing validation messages.
 *
 * @param {Array|Object} validationMessages - The validation messages to display in the feedback list.
 * @returns {HTMLElement} The custom feedback list element with the provided validation messages.
 */
export function renderFeedbackListElement(validationMessages) {
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        resourceValues: {
            data: validationMessages
        }
    });
    const feedbackListElement = createCustomElement("custom-feedbacklist-validation-messages", htmlAttributes);
    return feedbackListElement;
}
