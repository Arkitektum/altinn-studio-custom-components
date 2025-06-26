// Global functions
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
 * Renders a field value as a span element, formatting arrays and objects for display.
 *
 * - Arrays are joined into a comma-separated string.
 * - Objects are stringified as pretty-printed JSON.
 * - If the value is falsy or empty, the span will be empty.
 *
 * @param {*} fieldValue - The value to render. Can be of any type (string, number, array, object, etc.).
 * @returns {HTMLSpanElement} A span element containing the formatted field value.
 */
function renderFieldValueElement(fieldValue) {
    const fieldValueElement = document.createElement("span");
    if (Array.isArray(fieldValue)) {
        fieldValue = fieldValue.join(", ");
    }
    if (typeof fieldValue === "object") {
        fieldValue = JSON.stringify(fieldValue, null, 2);
    }
    fieldValueElement.innerHTML = hasValue(fieldValue) ? fieldValue : "";
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
    const fieldValueElement = renderFieldValueElement(fieldValue);
    if (fieldTitle?.length) {
        fieldValueElement.classList.add("has-title");
    }
    fieldElement.appendChild(fieldValueElement);
    addStyle(fieldElement, {
        ...options.styleOverride
    });
    return options.returnHtml ? fieldElement.outerHTML : fieldElement;
}
