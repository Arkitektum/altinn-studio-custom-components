/**
 * Renders a feedback element with the specified text and feedback type.
 *
 * @param {string} text - The text content to be displayed in the feedback element.
 * @param {string} feedbackType - The CSS class to be added to the feedback element for styling.
 * @returns {string} The outer HTML of the created feedback element.
 */
export function renderFeedbackElement(text, feedbackType) {
    const feedbackElement = document.createElement("p");
    feedbackElement.innerHTML = text;
    feedbackElement.classList.add(feedbackType);
    return feedbackElement.outerHTML;
}
