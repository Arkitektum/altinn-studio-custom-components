/**
 * Sets the page orientation for printing by injecting a style element with a CSS @page rule.
 *
 * @param {string} orientation - The desired page orientation, e.g., "portrait" or "landscape".
 */
export function setPageOrientation(orientation) {
    const style = document.createElement("style");
    style.textContent = `
        @page {
            size: A4 ${orientation} !important;
        }
    `;
    globalThis.pageOrientation = orientation;
    document.head.appendChild(style);
}
