// Global functions
import { addStyle, generateUniqueId } from "../../../functions/helpers.js";

/**
 * Creates a span element representing a field title with a specific class and optional ID.
 *
 * @param {string} fieldTitle - The text content for the field title.
 * @param {string} [fieldTitleId] - Optional ID to assign to the span element.
 * @returns {HTMLSpanElement} The created span element with the field title.
 */
function renderFieldTitleElement(fieldTitle, fieldTitleId) {
    const fieldTitleLabelElement = document.createElement("span");
    if (fieldTitleId) {
        fieldTitleLabelElement.id = fieldTitleId;
    }
    fieldTitleLabelElement.classList.add("field-title");
    fieldTitleLabelElement.innerText = fieldTitle;
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
export function renderListElement(listItems, styleOverride, returnHtml = true) {
    const listElement = document.createElement("dl");
    for (const listItem of listItems) {
        const listItemTermElement = document.createElement("dt");
        listItemTermElement.innerHTML = listItem?.term;
        listElement.appendChild(listItemTermElement);

        const listItemDescriptionElement = document.createElement("dd");
        listItemDescriptionElement.innerHTML = listItem?.description;
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
export function renderListFieldElement(fieldTitle, listItems, styleOverride = {}) {
    const fieldElement = document.createElement("div");
    fieldElement.classList.add("field");
    const fieldTitleId = fieldTitle?.length ? generateUniqueId("custom-field-") : null;
    if (fieldTitle?.length) {
        fieldElement.appendChild(renderFieldTitleElement(fieldTitle, fieldTitleId));
    }
    const listElement = renderListElement(listItems, styleOverride, false);
    if (fieldTitle?.length) {
        listElement.classList.add("has-title");
        listElement.setAttribute("aria-labelledby", fieldTitleId);
    }
    fieldElement.appendChild(listElement);
    return fieldElement.outerHTML;
}
