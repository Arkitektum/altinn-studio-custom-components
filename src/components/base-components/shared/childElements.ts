// Dependencies
import { CustomElementHtmlAttributes, createCustomElement } from "@arkitektum/altinn-studio-custom-components-utils";

/*
 * The pieces more than one base component draws: the heading over a table, matrix or summation, and the title span
 * of a list item. Kept here once, and re-exported by each component's renderers.ts under the same name.
 */

/**
 * Renders a custom header element if the text is provided.
 *
 * @param {string} title - The text content for the header element.
 * @param {string} [size] - The size of the header element.
 * @returns {HTMLElement|undefined} The created custom header element, or undefined if no text is provided.
 */
export function renderHeaderElement(title: string, size?: string) {
    const htmlAttributes = new CustomElementHtmlAttributes({
        size,
        resourceValues: {
            title
        }
    });
    if (title) {
        return createCustomElement("custom-header", htmlAttributes);
    }
}

/**
 * Creates a span element representing a field title with a specific class and optional ID.
 *
 * @param {string} fieldTitle - The text content for the field title.
 * @param {string|null} fieldTitleId - An ID to assign to the span element, or null for none.
 * @returns {HTMLSpanElement} The created span element with the field title.
 */
export function renderFieldTitleElement(fieldTitle: string, fieldTitleId: string | null) {
    const fieldTitleLabelElement = document.createElement("span");
    if (fieldTitleId) {
        fieldTitleLabelElement.id = fieldTitleId;
    }
    fieldTitleLabelElement.classList.add("field-title");
    fieldTitleLabelElement.textContent = fieldTitle;
    return fieldTitleLabelElement;
}
