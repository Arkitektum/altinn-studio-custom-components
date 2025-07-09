// Classes
import CustomElementHtmlAttributes from "../../../classes/system-classes/CustomElementHtmlAttributes.js";

// Global functions
import { addStyle, createCustomElement } from "../../../functions/helpers.js";

/**
 * Renders a feedback list element with the given title, feedback messages, feedback type, and optional style override.
 *
 * @param {string} title - The title of the feedback list.
 * @param {Array<string>} feedbackMessages - An array of feedback messages to be displayed.
 * @param {string} feedbackType - The type of feedback (e.g., "error", "warning", "info").
 * @param {Object} [styleOverride] - Optional style overrides to be applied to the feedback list element.
 * @returns {string} The outer HTML of the rendered feedback list element.
 */
export function renderFeedbackListElement(title, feedbackMessages, feedbackType, styleOverride) {
    const feedbackDetailsElement = document.createElement("details");
    feedbackDetailsElement.classList.add("feedback-details");
    feedbackDetailsElement.classList.add(feedbackType);
    feedbackDetailsElement.setAttribute("open", true);
    addStyle(styleOverride);

    const summaryElement = document.createElement("summary");
    summaryElement.classList.add("feedback-summary");
    summaryElement.innerHTML = title;
    feedbackDetailsElement.appendChild(summaryElement);

    const feedbackListElement = document.createElement("div");
    feedbackListElement.classList.add("feedback-list");

    feedbackMessages.forEach((message) => {
        const feedbackListItemElement = document.createElement("div");
        feedbackListItemElement.classList.add("feedback-list-item");
        const htmlAttributes = new CustomElementHtmlAttributes({
            isChildComponent: true,
            feedbackType: "default",
            resourceValues: {
                data: message
            }
        });
        feedbackListItemElement.appendChild(createCustomElement("custom-feedback-data", htmlAttributes));
        feedbackListElement.appendChild(feedbackListItemElement);
    });

    feedbackDetailsElement.appendChild(feedbackListElement);
    return feedbackDetailsElement.outerHTML;
}
