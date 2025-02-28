import { createCustomElement } from "../../../functions/helpers.js";

function getTitleForFeedbackType(feedbackType, feedbackCount) {
    switch (feedbackType) {
        case "error":
            return `Errors (${feedbackCount})`;
        case "warning":
            return `Warnings (${feedbackCount})`;
        case "info":
            return `Information (${feedbackCount})`;
        default:
            return `Messages (${feedbackCount})`;
    }
}

export function renderValidationMessagesElement(validationMessages) {
    const validationMessagesContainer = document.createElement("div");
    validationMessagesContainer.classList.add("validation-messages-container");
    Object.keys(validationMessages).forEach((feedbackType) => {
        const validationMessagesWithFeedbackType = validationMessages[feedbackType];
        if (validationMessagesWithFeedbackType?.length) {
            const feedbackListElement = createCustomElement("custom-feedbacklist-data", {
                formData: { data: validationMessages[feedbackType] },
                text: getTitleForFeedbackType(feedbackType, validationMessagesWithFeedbackType.length),
                feedbackType
            });
            validationMessagesContainer.appendChild(feedbackListElement);
        }
    });
    return validationMessagesContainer.outerHTML;
}
