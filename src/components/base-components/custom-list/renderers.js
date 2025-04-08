/**
 * Creates a label element with the specified field title as its inner text.
 *
 * @param {string} fieldTitle - The title to be set as the inner text of the label element.
 * @returns {HTMLLabelElement} The created label element with the specified field title.
 */
function renderFieldTitleElement(fieldTitle) {
    const fieldTitleLabelElement = document.createElement("label");
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
 * Renders a list field element with an optional title.
 *
 * @param {string} fieldTitle - The title of the field.
 * @param {Array} listItems - The items to be included in the list.
 * @param {string} listType - The type of the list (e.g., 'ul' for unordered list, 'ol' for ordered list).
 * @returns {string} The outer HTML of the rendered field element.
 */
export function renderListFieldElement(fieldTitle, listItems, listType) {
    const fieldElement = document.createElement("div");
    fieldElement.classList.add("field");
    if (fieldTitle?.length) {
        fieldElement.appendChild(renderFieldTitleElement(fieldTitle));
    }
    const listElement = renderListElement(listItems, listType, false);
    if (fieldTitle?.length) {
        listElement.classList.add("has-title");
    }
    fieldElement.appendChild(listElement);
    return fieldElement.outerHTML;
}
