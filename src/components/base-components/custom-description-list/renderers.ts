import type { DescriptionListItem } from "../../../classes/system-classes/component-classes/CustomDescriptionListData.ts";
// Dependencies
import { addStyle } from "@arkitektum/altinn-studio-custom-components-utils";

// Global functions
import { generateUniqueId } from "../../../functions/helpers.ts";

/**
 * Creates a span element representing a field title with a specific class and optional ID.
 *
 * @param {string} fieldTitle - The text content for the field title.
 * @param {string} [fieldTitleId] - Optional ID to assign to the span element.
 * @returns {HTMLSpanElement} The created span element with the field title.
 */
function renderFieldTitleElement(fieldTitle: string, fieldTitleId: string | null) {
    const fieldTitleLabelElement = document.createElement("span");
    if (fieldTitleId) {
        fieldTitleLabelElement.id = fieldTitleId;
    }
    fieldTitleLabelElement.classList.add("field-title");
    fieldTitleLabelElement.textContent = fieldTitle;
    return fieldTitleLabelElement;
}

/**
 * Renders a description list (<dl>) element from an array of list items.
 *
 * @param {Array<{term: string, description: string}>} listItems - The items to include in the description list, each with a 'term' and 'description'.
 * @param {Object} styleOverride - An object containing style overrides to apply to the list element.
 * @param {boolean} [returnHtml=true] - If true, returns the outerHTML string of the list element; otherwise, returns the DOM element itself.
 * @returns {string|HTMLElement} The rendered description list as an HTML string or a DOM element, depending on the value of returnHtml.
 */
export function renderListElement(listItems: DescriptionListItem[], styleOverride?: Record<string, string>, returnHtml?: true): string;
export function renderListElement(
    listItems: DescriptionListItem[],
    styleOverride: Record<string, string> | undefined,
    returnHtml: false
): HTMLDListElement;
export function renderListElement(listItems: DescriptionListItem[], styleOverride?: Record<string, string>, returnHtml = true) {
    const listElement = document.createElement("dl");
    for (const listItem of listItems) {
        // Terms and descriptions are plain data values from the data model: use textContent so any HTML-like content
        // is rendered as text, not interpreted (XSS-safe).
        const listItemTermElement = document.createElement("dt");
        listItemTermElement.textContent = listItem?.term as string;
        listElement.appendChild(listItemTermElement);

        const listItemDescriptionElement = document.createElement("dd");
        listItemDescriptionElement.textContent = listItem?.description as string;
        listElement.appendChild(listItemDescriptionElement);
    }
    addStyle(listElement, styleOverride);
    return returnHtml ? listElement.outerHTML : listElement;
}

/**
 * Renders a list field element with an optional title and custom styles.
 *
 * @param {string} fieldTitle - The title of the field to display above the list. If empty or undefined, no title is rendered.
 * @param {Array} listItems - The items to be rendered in the list.
 * @param {Object} [styleOverride={}] - Optional styles to override the default list styles.
 * @returns {string} The outer HTML string of the rendered field element containing the title (if provided) and the list.
 */
export function renderListFieldElement(fieldTitle: string, listItems: DescriptionListItem[], styleOverride: Record<string, string> = {}) {
    const fieldElement = document.createElement("div");
    fieldElement.classList.add("field");
    const fieldTitleId = fieldTitle?.length ? generateUniqueId("custom-field-") : null;
    if (fieldTitle?.length) {
        fieldElement.appendChild(renderFieldTitleElement(fieldTitle, fieldTitleId));
    }
    const listElement = renderListElement(listItems, styleOverride, false);
    if (fieldTitle?.length) {
        listElement.classList.add("has-title");
        listElement.setAttribute("aria-labelledby", fieldTitleId!);
    }
    fieldElement.appendChild(listElement);
    return fieldElement.outerHTML;
}
