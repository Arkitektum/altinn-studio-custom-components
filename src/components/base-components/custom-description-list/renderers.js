// Global functions
import { generateUniqueId } from "../../../functions/helpers.js";

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
 * Renders a description list (<dl>) element from an array of items.
 *
 * @param {Array<{term: string, description: string}>} listItems - Array of objects representing the terms and descriptions.
 * @param {string} listType - Type of the list (currently unused).
 * @param {boolean} [returnHtml=true] - If true, returns the HTML string; otherwise, returns the DOM element.
 * @returns {string|HTMLElement} The rendered description list as an HTML string or DOM element.
 */
export function renderListElement(listItems, listType, returnHtml = true) {
    const listElement = document.createElement("dl");
    listItems.forEach((listItem) => {
        const listItemTermElement = document.createElement("dt");
        listItemTermElement.innerHTML = listItem?.term;
        listElement.appendChild(listItemTermElement);

        const listItemDescriptionElement = document.createElement("dd");
        listItemDescriptionElement.innerHTML = listItem?.description;
        listElement.appendChild(listItemDescriptionElement);
    });
    return returnHtml ? listElement.outerHTML : listElement;
}

/**
 * Renders a list field element with an optional title and list items.
 *
 * @param {string} fieldTitle - The title of the field to display above the list. If empty or undefined, no title is rendered.
 * @param {Array} listItems - The items to display in the list.
 * @param {string} listType - The type of list to render (e.g., "ul" for unordered, "ol" for ordered).
 * @returns {string} The HTML string representing the rendered field element containing the title and list.
 */
export function renderListFieldElement(fieldTitle, listItems, listType) {
    const fieldElement = document.createElement("div");
    fieldElement.classList.add("field");
    const fieldTitleId = fieldTitle?.length ? generateUniqueId("custom-field-") : null;
    if (fieldTitle?.length) {
        fieldElement.appendChild(renderFieldTitleElement(fieldTitle, fieldTitleId));
    }
    const listElement = renderListElement(listItems, listType, false);
    if (fieldTitle?.length) {
        listElement.classList.add("has-title");
        listElement.setAttribute("aria-labelledby", fieldTitleId);
    }
    fieldElement.appendChild(listElement);
    return fieldElement.outerHTML;
}
