// Global functions
import { injectAnchorElements } from "../../../functions/dataFormatHelpers.js";
import { addStyle, hasValue } from "../../../functions/helpers.js";

/**
 * Renders a field title element as a label.
 *
 * @param {string} fieldTitle - The title text to be displayed in the label.
 * @param {boolean} inline - A flag indicating whether the title should be displayed inline with a colon.
 * @returns {HTMLLabelElement} The created label element with the specified title.
 */
function renderFieldTitleElement(fieldTitle, inline) {
    const fieldTitleLabelElement = document.createElement("label");
    fieldTitleLabelElement.innerText = `${fieldTitle}${inline ? ":" : ""}`;
    return fieldTitleLabelElement;
}

/**
 * Renders a field value as a span element, optionally injecting anchor elements for links.
 *
 * - If the field value is an array, it joins the elements with a comma.
 * - If the field value is an object, it stringifies it with indentation.
 * - If the field value is falsy (as determined by hasValue), it renders an empty span.
 * - If enableLinks is true, it injects anchor elements into the field value.
 *
 * @param {*} fieldValue - The value to render. Can be a string, array, or object.
 * @param {boolean} enableLinks - Whether to inject anchor elements for links in the field value.
 * @returns {HTMLSpanElement} The span element containing the rendered field value.
 */
function renderFieldValueElement(fieldValue, enableLinks) {
    const fieldValueElement = document.createElement("span");
    if (Array.isArray(fieldValue)) {
        fieldValue = fieldValue.join(", ");
    }
    if (typeof fieldValue === "object") {
        fieldValue = JSON.stringify(fieldValue, null, 2);
    }
    if (!hasValue(fieldValue)) {
        fieldValueElement.innerHTML = "";
    } else {
        fieldValueElement.innerHTML = enableLinks ? injectAnchorElements(fieldValue) : fieldValue;
    }
    return fieldValueElement;
}

/**
 * Renders a field element with a title and value.
 *
 * @param {string} fieldTitle - The title of the field.
 * @param {string} fieldValue - The value of the field.
 * @param {Object} [options] - Optional settings for rendering the field element.
 * @param {boolean} [options.returnHtml=true] - Whether to return the element as HTML string.
 * @param {boolean} [options.inline=false] - Whether to render the field inline.
 * @param {Object} [options.styleOverride={}] - Custom styles to apply to the field element.
 * @param {boolean} [options.enableLinks=false] - Whether to enable links in the field value.
 * @returns {HTMLElement|string} The rendered field element or its HTML string representation.
 */
export function renderFieldElement(fieldTitle, fieldValue, options) {
    options = {
        returnHtml: true,
        inline: false,
        styleOverride: {},
        ...options
    };
    const fieldElement = document.createElement("div");
    fieldElement.classList.add("field");
    if (fieldTitle?.length) {
        fieldElement.appendChild(renderFieldTitleElement(fieldTitle, options.inline));
    }
    if (options?.inline) {
        fieldElement.classList.add("inline");
    }
    const fieldValueElement = renderFieldValueElement(fieldValue, options.enableLinks);
    if (fieldTitle?.length) {
        fieldValueElement.classList.add("has-title");
    }
    fieldElement.appendChild(fieldValueElement);
    addStyle(fieldElement, {
        ...options.styleOverride
    });
    return options.returnHtml ? fieldElement.outerHTML : fieldElement;
}
