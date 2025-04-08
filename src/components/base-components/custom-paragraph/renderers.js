/**
 * Renders a paragraph element with the specified text and optional style overrides.
 *
 * @param {string} text - The text content to be displayed in the paragraph element.
 * @returns {string} The outer HTML of the created paragraph element.
 */
export function renderParagraphElement(text) {
    const paragraphElement = document.createElement("p");
    paragraphElement.innerHTML = text;
    return paragraphElement.outerHTML;
}
