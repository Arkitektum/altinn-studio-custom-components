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
 * Renders a list element with the given list items and list type.
 *
 * @param {Array<string>} listItems - The items to be included in the list.
 * @param {string} listType - The type of list to create (e.g., "ul" for unordered list, "ol" for ordered list).
 * @param {boolean} [returnHtml=true] - Whether to return the outer HTML of the list element or the element itself.
 * @returns {string|HTMLElement} The rendered list element as an HTML string or as an HTMLElement.
 */
export function renderListElement(listItems, listType, returnHtml = true) {
    const listElement = document.createElement(listType || "ul");
    listItems.forEach((listItem) => {
        const listItemElement = document.createElement("li");
        listItemElement.innerHTML = listItem;
        listElement.appendChild(listItemElement);
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
