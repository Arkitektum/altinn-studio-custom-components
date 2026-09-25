/**
 * Renders a feedback element with the specified text and feedback type.
 *
 * @param {string} text - The text content to be displayed in the feedback element.
 * @param {string} feedbackType - The CSS class to be added to the feedback element for styling.
 * @returns {string} The outer HTML of the created feedback element.
 */
export function renderFeedbackElement(text: string, feedbackType?: string) {
    const feedbackElement = document.createElement("p");
    // The feedback text is a plain data value from the data model (see CustomFeedback/CustomFeedbackData): use
    // textContent so any HTML-like content is rendered as text, not interpreted (XSS-safe).
    feedbackElement.textContent = text;
    feedbackElement.classList.add(feedbackType!);
    return feedbackElement.outerHTML;
}
