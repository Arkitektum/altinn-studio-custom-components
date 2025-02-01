import { addStyle } from "../../../functions/helpers.js";

const defaultHeaderSize = "h2";

/**
 * Returns the corresponding class name for a given header size.
 *
 * @param {string} size - The size of the header (e.g., "h2", "h3", "h4").
 * @returns {string} The class name associated with the given header size.
 *                     Defaults to "fds-heading--md" if the size is not found.
 */
function getHeaderSizeClass(size) {
    const headerSizeClassNames = [
        {
            size: "h2",
            className: "fds-heading--md"
        },
        {
            size: "h3",
            className: "fds-heading--sm"
        },
        {
            size: "h4",
            className: "fds-heading--xs"
        }
    ];
    const headerSize = headerSizeClassNames.find((headerSize) => headerSize.size === size);
    return headerSize?.className || "fds-heading--md";
}

/**
 * Renders a header element with the specified text, size, and optional style overrides.
 *
 * @param {string} text - The text content to be displayed in the header element.
 * @param {string} [size] - The size of the header element (e.g., 'h1', 'h2'). Defaults to a predefined size if not provided.
 * @param {Object} [styleoverride] - An optional object containing CSS styles to override the default styles.
 * @returns {string} The outer HTML of the created header element.
 */
export function renderHeaderElement(text, size, styleoverride) {
    const headerElement = document.createElement(size || defaultHeaderSize);
    headerElement.classList.add("fds-heading", getHeaderSizeClass(size));
    headerElement.innerHTML = text;
    addStyle(headerElement, styleoverride);
    return headerElement.outerHTML;
}
