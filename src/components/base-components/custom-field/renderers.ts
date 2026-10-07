// Dependencies
import { addStyle, hasValue } from "@arkitektum/altinn-studio-custom-components-utils";

// Global functions
import { injectAnchorElements } from "../../../functions/dataFormatHelpers.ts";

/**
 * Creates and returns a span element representing a field title.
 *
 * @param {string} fieldTitle - The text to display as the field title.
 * @param {boolean} inline - If true, appends a colon to the field title.
 * @returns {HTMLSpanElement} The span element containing the field title.
 */
function renderFieldTitleElement(fieldTitle: string, inline: boolean | undefined) {
    const fieldTitleLabelElement = document.createElement("span");
    fieldTitleLabelElement.classList.add("field-title");
    fieldTitleLabelElement.textContent = `${fieldTitle}${inline ? ":" : ""}`;
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
function renderFieldValueElement(fieldValue: unknown, enableLinks: boolean | undefined) {
    const fieldValueElement = document.createElement("span");
    fieldValueElement.classList.add("field-value");
    if (Array.isArray(fieldValue)) {
        fieldValue = fieldValue.join(", ");
    }
    if (typeof fieldValue === "object") {
        fieldValue = JSON.stringify(fieldValue, null, 2);
    }
    if (!hasValue(fieldValue)) {
        fieldValueElement.textContent = "";
    } else if (enableLinks) {
        // injectAnchorElements returns sanitized HTML (anchors), so innerHTML is required here.
        fieldValueElement.innerHTML = injectAnchorElements(fieldValue as string);
    } else {
        // Plain data value: use textContent so any HTML-like content is rendered as text, not interpreted (XSS-safe).
        fieldValueElement.textContent = fieldValue as string;
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
export interface FieldElementOptions {
    /** Whether to hand back the serialized HTML rather than the element itself. */
    returnHtml?: boolean;
    inline?: boolean;
    styleOverride?: Record<string, string>;
    enableLinks?: boolean;
}

export function renderFieldElement(fieldTitle: string, fieldValue: unknown, options: FieldElementOptions & { returnHtml: false }): HTMLDivElement;
export function renderFieldElement(fieldTitle: string, fieldValue: unknown, options?: FieldElementOptions): string;
export function renderFieldElement(fieldTitle: string, fieldValue: unknown, options?: FieldElementOptions) {
    options = {
        returnHtml: true,
        inline: false,
        styleOverride: {},
        ...options
    };
    const fieldElement = document.createElement("div");
    fieldElement.classList.add("field");
    // The title comes right before the value, which is how a screen reader reads the pair. No aria-labelledby: a plain
    // span with no role cannot be named, so it was ignored.
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
