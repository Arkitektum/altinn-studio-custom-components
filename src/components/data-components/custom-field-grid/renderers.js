// Dependencies
import { CustomElementHtmlAttributes, createCustomElement, hasValue } from "@arkitektum/altinn-studio-custom-components-utils";

/**
 * Renders a vertical key/value grid from the component's resolved row descriptors.
 * Empty rows are skipped.
 *
 * @param {Object} component - The instantiated CustomFieldGrid component.
 * @returns {HTMLElement} A container element holding an optional caption and the key/value grid.
 */
export function renderFieldGridElement(component) {
    const containerElement = document.createElement("div");
    containerElement.classList.add("custom-field-grid");

    const title = component?.resourceValues?.title;
    if (hasValue(title)) {
        const titleElement = document.createElement("div");
        titleElement.classList.add("custom-field-grid-title");
        titleElement.innerText = title;
        containerElement.appendChild(titleElement);
    }

    const bodyElement = document.createElement("div");
    bodyElement.classList.add("custom-field-grid-body");

    const termHeader = component?.resourceValues?.termHeader;
    const valueHeader = component?.resourceValues?.valueHeader;
    if (hasValue(termHeader) || hasValue(valueHeader)) {
        const termHeaderElement = document.createElement("div");
        termHeaderElement.classList.add("custom-field-grid-term", "custom-field-grid-header");
        termHeaderElement.innerText = hasValue(termHeader) ? termHeader : "";
        bodyElement.appendChild(termHeaderElement);

        const valueHeaderElement = document.createElement("div");
        valueHeaderElement.classList.add("custom-field-grid-value", "custom-field-grid-header");
        valueHeaderElement.innerText = hasValue(valueHeader) ? valueHeader : "";
        bodyElement.appendChild(valueHeaderElement);
    }

    const rows = Array.isArray(component?.resourceValues?.data) ? component.resourceValues.data : [];
    for (const row of rows) {
        if (row?.isEmpty) {
            continue;
        }
        const termElement = document.createElement("div");
        termElement.classList.add("custom-field-grid-term");
        termElement.innerText = hasValue(row?.term) ? row.term : "";
        bodyElement.appendChild(termElement);

        const valueElement = document.createElement("div");
        valueElement.classList.add("custom-field-grid-value");
        const htmlAttributes = new CustomElementHtmlAttributes(row?.valueComponent);
        valueElement.appendChild(createCustomElement(row?.valueComponent?.tagName || "custom-field-data", htmlAttributes));
        bodyElement.appendChild(valueElement);
    }
    containerElement.appendChild(bodyElement);

    return containerElement;
}
