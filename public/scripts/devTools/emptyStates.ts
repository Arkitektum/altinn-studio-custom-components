/**
 * What the preview says when the layout code has no component to draw, with the ways to get one there.
 *
 * @returns {HTMLElement} The message.
 */
export function renderEmptyPreviewMessage() {
    const messageElement = document.createElement("div");
    messageElement.classList.add("preview-empty");

    const headingElement = document.createElement("p");
    headingElement.classList.add("preview-empty-heading");
    headingElement.textContent = "Nothing to preview yet";

    const textElement = document.createElement("p");
    const statisticsLink = document.createElement("a");
    statisticsLink.href = "/statistics/display-layouts";
    statisticsLink.textContent = "Display layouts";
    textElement.append(
        "Paste components into Layout code in the sidebar, import a workspace, or open an app's form from ",
        statisticsLink,
        " in Statistics."
    );

    messageElement.append(headingElement, textElement);
    return messageElement;
}
