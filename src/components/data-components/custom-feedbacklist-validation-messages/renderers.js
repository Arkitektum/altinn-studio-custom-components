// Classes
import CustomElementHtmlAttributes from "../../../classes/system-classes/CustomElementHtmlAttributes.js";

// Global functions
import { createCustomElement } from "../../../functions/helpers.js";

// Local functions
import { getTitleForFeedbackType } from "./functions.js";

/**
 * Renders a container element with validation messages.
 *
 * @param {Object} validationMessages - An object containing validation messages categorized by feedback type.
 * @param {Array} validationMessages.feedbackType - An array of validation messages for a specific feedback type.
 * @returns {string} The outer HTML of the validation messages container element.
 */
export function renderValidationMessagesElement(validationMessages) {
    const validationMessagesContainer = document.createElement("div");
    validationMessagesContainer.classList.add("validation-messages-container");
    Object.keys(validationMessages).forEach((feedbackType) => {
        const validationMessagesWithFeedbackType = validationMessages[feedbackType];
        if (validationMessagesWithFeedbackType?.length) {
            const htmlAttributes = new CustomElementHtmlAttributes({
                isChildComponent: true,
                feedbackType,
                resourceValues: {
                    title: getTitleForFeedbackType(feedbackType, validationMessagesWithFeedbackType.length),
                    data: validationMessagesWithFeedbackType
                }
            });
            const feedbackListElement = createCustomElement("custom-feedbacklist-data", htmlAttributes);
            validationMessagesContainer.appendChild(feedbackListElement);
        }
    });
    return validationMessagesContainer.outerHTML;
}
