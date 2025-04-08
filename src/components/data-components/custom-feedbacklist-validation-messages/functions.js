/**
 * Returns a title string based on the feedback type and count.
 *
 * @param {string} feedbackType - The type of feedback (e.g., "error", "warning", "info").
 * @param {number} feedbackCount - The number of feedback messages.
 * @returns {string} The formatted title string including the feedback type and count.
 */
export function getTitleForFeedbackType(feedbackType, feedbackCount) {
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
