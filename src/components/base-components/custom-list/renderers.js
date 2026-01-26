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
 * Renders a list element (ul or ol) with items from component data
 * @param {Object} component - The component object containing list configuration
 * @param {string} [component.listType] - Type of list element to create ('ul' or 'ol')
 * @param {Object} [component.resourceValues] - Container for list data
 * @param {Array<string>} [component.resourceValues.data] - Array of list item content
 * @param {Object} [component.styleOverride] - Style overrides to apply to the list element
 * @param {boolean} [returnHtml=true] - Whether to return HTML string or DOM element
 * @param {string} [listType="ul"] - Default list type if not specified in component
 * @returns {string|HTMLElement} The rendered list as HTML string or DOM element based on returnHtml parameter
 */
export function renderListElement(component, returnHtml = true, listType = "ul") {
    listType = component?.listType || listType;
    const listItems = component?.resourceValues?.data || [];
    const listElement = document.createElement(listType || "ul");
    listItems.forEach((listItem) => {
        const listItemElement = document.createElement("li");
        listItemElement.innerHTML = listItem;
        listElement.appendChild(listItemElement);
    });
    addStyle(listElement, component?.styleOverride);
    return returnHtml ? listElement.outerHTML : listElement;
}

/**
 * Renders a list field element with an optional title.
 * Creates a wrapper div with "field" class containing a title element (if provided)
 * and a list element. The list element is properly associated with the title via
 * aria-labelledby for accessibility.
 *
 * @param {Object} component - The component configuration object
 * @param {Object} [component.resourceValues] - Resource values containing component text
 * @param {string} [component.resourceValues.title] - The title text for the field
 * @returns {string} The outer HTML string of the rendered field element
 */
export function renderListFieldElement(component) {
    const fieldTitle = component?.resourceValues?.title;
    const fieldElement = document.createElement("div");
    fieldElement.classList.add("field");
    const fieldTitleId = fieldTitle?.length ? generateUniqueId("custom-field-") : null;
    if (fieldTitle?.length) {
        fieldElement.appendChild(renderFieldTitleElement(fieldTitle, fieldTitleId));
    }
    const listElement = renderListElement(component, false);
    if (fieldTitle?.length) {
        listElement.classList.add("has-title");
        listElement.setAttribute("aria-labelledby", fieldTitleId);
    }
    fieldElement.appendChild(listElement);
    return fieldElement.outerHTML;
}
