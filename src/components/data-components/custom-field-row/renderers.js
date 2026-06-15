// Dependencies
import { CustomElementHtmlAttributes, addStyle, createCustomElement, hasValue } from "@arkitektum/altinn-studio-custom-components-utils";

/**
 * Renders a horizontal row of field cells from the component's resolved cell props.
 *
 * @param {Object} component - The instantiated CustomFieldRow component.
 * @returns {HTMLElement} A container element holding an optional caption and the cell row.
 */
export function renderFieldRowElement(component) {
    const containerElement = document.createElement("div");
    containerElement.classList.add("custom-field-row");

    const title = component?.resourceValues?.title;
    if (hasValue(title)) {
        const titleElement = document.createElement("div");
        titleElement.classList.add("custom-field-row-title");
        titleElement.innerText = title;
        containerElement.appendChild(titleElement);
    }

    const cellsElement = document.createElement("div");
    cellsElement.classList.add("custom-field-row-cells");

    const cells = Array.isArray(component?.resourceValues?.data) ? component.resourceValues.data : [];
    for (const cell of cells) {
        const cellElement = document.createElement("div");
        cellElement.classList.add("custom-field-row-cell");
        addStyle(cellElement, cell?.styleOverride);
        const htmlAttributes = new CustomElementHtmlAttributes(cell);
        cellElement.appendChild(createCustomElement(cell?.tagName || "custom-field-data", htmlAttributes));
        cellsElement.appendChild(cellElement);
    }
    containerElement.appendChild(cellsElement);

    return containerElement;
}
