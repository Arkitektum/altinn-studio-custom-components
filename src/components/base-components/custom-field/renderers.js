// Global functions
import { injectAnchorElements } from "../../../functions/dataFormatHelpers.js";
import { addStyle, generateUniqueId, hasValue } from "../../../functions/helpers.js";

/**
 * Creates and returns a span element representing a field title.
 *
 * @param {string} fieldTitle - The text to display as the field title.
 * @param {string} [fieldTitleId] - Optional ID to assign to the span element.
 * @param {boolean} inline - If true, appends a colon to the field title.
 * @returns {HTMLSpanElement} The span element containing the field title.
 */
function renderFieldTitleElement(fieldTitle, fieldTitleId, inline) {
    const fieldTitleLabelElement = document.createElement("span");
    if (fieldTitleId) {
        fieldTitleLabelElement.id = fieldTitleId;
    }
    fieldTitleLabelElement.classList.add("field-title");
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
    fieldValueElement.classList.add("field-value");
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
 * Renders a custom field element with a title and value, supporting various options.
 *
 * @param {string} fieldTitle - The title of the field to display.
 * @param {*} fieldValue - The value/content of the field to display.
 * @param {Object} [options] - Optional settings for rendering the field.
 * @param {boolean} [options.returnHtml=true] - If true, returns the field as an HTML string; otherwise, returns the DOM element.
 * @param {boolean} [options.inline=false] - If true, renders the field inline.
 * @param {Object} [options.styleOverride={}] - CSS style overrides to apply to the field element.
 * @param {boolean} [options.enableLinks] - If true, enables link rendering in the field value.
 * @returns {string|HTMLElement} The rendered field element as an HTML string or DOM element, depending on `options.returnHtml`.
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
    const fieldTitleId = fieldTitle?.length ? generateUniqueId("custom-field-") : null;
    if (fieldTitle?.length) {
        fieldElement.appendChild(renderFieldTitleElement(fieldTitle, fieldTitleId, options.inline));
    }
    if (options?.inline) {
        fieldElement.classList.add("inline");
    }
    const fieldValueElement = renderFieldValueElement(fieldValue, options.enableLinks);
    if (fieldTitle?.length) {
        fieldValueElement.classList.add("has-title");
        fieldValueElement.setAttribute("aria-labelledby", fieldTitleId);
    }
    fieldElement.appendChild(fieldValueElement);
    addStyle(fieldElement, {
        ...options.styleOverride
    });
    return options.returnHtml ? fieldElement.outerHTML : fieldElement;
}
