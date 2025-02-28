import { addStyle, createCustomElement } from "../../../functions/helpers.js";

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
        feedbackListItemElement.appendChild(
            createCustomElement("custom-feedback-data", {
                formData: { simpleBinding: message },
                feedbackType: "default"
            })
        );
        feedbackListElement.appendChild(feedbackListItemElement);
    });

    feedbackDetailsElement.appendChild(feedbackListElement);
    return feedbackDetailsElement.outerHTML;
}
