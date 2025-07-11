// Global functions
import { isValidHeaderSize } from "./dataFormatHelpers.js";
import { hasValue } from "./helpers.js";

/**
 * Extracts and returns a set of properties from the given element's attributes.
 *
 * @param {HTMLElement} element - The DOM element from which to extract properties.
 * @returns {Object} An object containing the following properties:
 *   @property {*} formData - The form data extracted from the element.
 *   @property {string} tagName - The tag name of the element.
 *   @property {string} text - The text content of the element.
 *   @property {Object} texts - Additional text values from the element.
 *   @property {boolean} inline - Whether the element is inline.
 *   @property {boolean} hideTitle - Whether the title should be hidden.
 *   @property {string|number} size - The size attribute of the element.
 *   @property {boolean} hideIfEmpty - Whether to hide the element if empty.
 *   @property {Object} styleOverride - Style overrides for the element.
 *   @property {boolean} isChildComponent - Whether the element is a child component.
 *   @property {string} feedbackType - The feedback type for the element.
 *   @property {string} itemKey - The item key for the element.
 *   @property {boolean} hideOrgNr - Whether to hide the organization number.
 *   @property {string} format - The format of the element.
 *   @property {Array} tableColumns - The table columns defined for the element.
 *   @property {boolean} showRowNumbers - Whether to show row numbers.
 *   @property {Object} resourceBindings - Text resource bindings for the element.
 *   @property {Object} resourceValues - Resource values for the element.
 *   @property {string} partType - The type of part defined for the element.
 */
export function getPropsFromElementAttributes(element) {
    return {
        formData: getFormDataFromElement(element),
        tagName: getTagNameFromElement(element),
        text: getTextFromElement(element),
        texts: getTextsFromElement(element),
        inline: getInlineFromElement(element),
        hideTitle: getHideTitle(element),
        size: getSize(element),
        hideIfEmpty: getHideIfEmpty(element),
        styleOverride: getStyleOverride(element),
        isChildComponent: getIsChildComponent(element),
        feedbackType: getFeedbackType(element),
        itemKey: getItemKey(element),
        hideOrgNr: getHideOrgNr(element),
        format: getFormat(element),
        tableColumns: getTableColumns(element),
        showRowNumbers: getShowRowNumbers(element),
        resourceBindings: getResourceBindings(element),
        resourceValues: getResourceValues(element),
        partType: getPartType(element)
    };
}

/**
 * Extracts and parses the form data from a given HTML element's "formdata" attribute.
 *
 * @param {HTMLElement} element - The HTML element containing the "formdata" attribute.
 * @returns {Object|null} The parsed form data object if it exists and is valid, otherwise null.
 */
function getFormDataFromElement(element) {
    const formData = JSON.parse(element?.getAttribute("formdata"));
    return hasValue(formData) && formData;
}

/**
 * Retrieves the tag name of a given HTML element.
 *
 * @param {HTMLElement} element - The HTML element from which to extract the tag name.
 * @returns {string|boolean} The tag name in lowercase if it exists and is valid, otherwise `false`.
 */
function getTagNameFromElement(element) {
    const tagName = element?.getAttribute("tagName") || element?.tagName?.toLowerCase();
    return hasValue(tagName) && tagName;
}

/**
 * Retrieves the text attribute value from a given element.
 *
 * @param {Element} element - The DOM element from which to retrieve the text attribute.
 * @returns {string|false} The value of the text attribute if it exists and is valid; otherwise, false.
 */
function getTextFromElement(element) {
    const text = element?.getAttribute("text");
    return hasValue(text) && text;
}

/**
 * Extracts and parses the "texts" attribute from a given DOM element.
 *
 * @param {Element} element - The DOM element from which to retrieve the "texts" attribute.
 * @returns {Object|boolean} The parsed "texts" object if it exists and is valid, otherwise `false`.
 */
function getTextsFromElement(element) {
    const texts = JSON.parse(element?.getAttribute("texts"));
    return hasValue(texts) && texts;
}

/**
 * Determines if the given element has the "inline" attribute set to "true".
 *
 * @param {HTMLElement} element - The HTML element to check.
 * @returns {boolean} True if the "inline" attribute is set to "true", otherwise false.
 */
function getInlineFromElement(element) {
    return element?.getAttribute("inline") === "true";
}

/**
 * Determines whether the title of the given element should be hidden.
 *
 * @param {Element} element - The DOM element to check for the "hideTitle" attribute.
 * @returns {boolean} Returns `true` if the "hideTitle" attribute is set to "true", otherwise `false`.
 */
function getHideTitle(element) {
    return element?.getAttribute("hideTitle") === "true";
}

/**
 * Retrieves the size attribute of a given element and validates it.
 *
 * @param {HTMLElement} element - The HTML element from which to retrieve the size attribute.
 * @returns {string|undefined} The validated size as a lowercase string, or undefined if invalid or not present.
 */
function getSize(element) {
    const size = element?.getAttribute("size");
    return isValidHeaderSize(size) ? size?.toString().toLowerCase() : undefined;
}

/**
 * Determines if the "hideIfEmpty" attribute of the given element is set to "true".
 *
 * @param {Element} element - The DOM element to check for the "hideIfEmpty" attribute.
 * @returns {boolean} - Returns `true` if the "hideIfEmpty" attribute is set to "true", otherwise `false`.
 */
function getHideIfEmpty(element) {
    return element?.getAttribute("hideIfEmpty") === "true";
}

/**
 * Retrieves the style override configuration from a given element's attribute.
 *
 * @param {HTMLElement} element - The HTML element from which to extract the style override.
 * @returns {Object|false} The parsed style override object if it exists and is valid, otherwise `false`.
 */
function getStyleOverride(element) {
    const styleOverride = JSON.parse(element?.getAttribute("styleOverride") || "{}");
    return hasValue(styleOverride) && styleOverride;
}

/**
 * Determines if the given element is a child component.
 *
 * @param {HTMLElement} element - The DOM element to check.
 * @returns {boolean} True if the element has the attribute "isChildComponent" set to "true", otherwise false.
 */
function getIsChildComponent(element) {
    return element?.getAttribute("isChildComponent") === "true";
}

/**
 * Retrieves the feedback type attribute from the given element.
 *
 * @param {HTMLElement} element - The DOM element from which to retrieve the feedback type.
 * @returns {string|boolean} The feedback type if it exists and has a value, otherwise `false`.
 */
function getFeedbackType(element) {
    const feedbackType = element?.getAttribute("feedbackType");
    return hasValue(feedbackType) && feedbackType;
}

/**
 * Retrieves the value of the "itemKey" attribute from the given element.
 *
 * @param {HTMLElement} element - The DOM element from which to retrieve the "itemKey" attribute.
 * @returns {string|boolean} The value of the "itemKey" attribute if it exists and is valid; otherwise, returns false.
 */
function getItemKey(element) {
    const itemKey = element?.getAttribute("itemKey");
    return hasValue(itemKey) && itemKey;
}

/**
 * Determines whether the "hideOrgNr" attribute of a given element is set to "true".
 *
 * @param {HTMLElement} element - The HTML element to check for the "hideOrgNr" attribute.
 * @returns {boolean} - Returns `true` if the "hideOrgNr" attribute is set to "true", otherwise `false`.
 */
function getHideOrgNr(element) {
    return element?.getAttribute("hideOrgNr") === "true";
}

/**
 * Retrieves the "format" attribute value from a given DOM element.
 *
 * @param {Element} element - The DOM element from which to retrieve the "format" attribute.
 * @returns {string|boolean} The value of the "format" attribute if it exists and is valid,
 *                           otherwise returns `false`.
 */
function getFormat(element) {
    const format = element?.getAttribute("format");
    return hasValue(format) && format;
}

function getTableColumns(element) {
    const tableColumns = JSON.parse(element?.getAttribute("tableColumns"));
    return hasValue(tableColumns) && tableColumns;
}

/**
 * Determines whether the "showRowNumbers" attribute is set to "true" on the element.
 *
 * @returns {boolean} True if the "showRowNumbers" attribute is "true", otherwise false.
 */
function getShowRowNumbers(element) {
    return element?.getAttribute("showRowNumbers") === "true";
}

/**
 * Retrieves and parses the "resourceBindings" attribute from the given element.
 * Returns the parsed object if it has a value, otherwise returns false.
 *
 * @param {Element} element - The DOM element from which to retrieve the attribute.
 * @returns {Object|false} The parsed resource bindings object if present and valid, otherwise false.
 */
function getResourceBindings(element) {
    const textResourceBindings = JSON.parse(element?.getAttribute("resourceBindings"));
    return hasValue(textResourceBindings) && textResourceBindings;
}

/**
 * Retrieves and parses the "resourceValues" attribute from a given HTML element.
 * Returns the parsed object if it exists and has a value, otherwise returns false.
 *
 * @param {Element} element - The HTML element from which to retrieve the "resourceValues" attribute.
 * @returns {Object|false} The parsed resource values object if present and valid, otherwise false.
 */
function getResourceValues(element) {
    const resourceValues = JSON.parse(element?.getAttribute("resourceValues"));
    return hasValue(resourceValues) && resourceValues;
}

/**
 * Retrieves the 'partType' attribute from the given HTML element.
 * If the attribute is not present or has no value, returns the default value "tiltakshaver".
 *
 * @param {Element} element - The HTML element from which to retrieve the 'partType' attribute.
 * @returns {string} The value of the 'partType' attribute, or "tiltakshaver" if not set.
 */
function getPartType(element) {
    const partType = element?.getAttribute("partType");
    return hasValue(partType) ? partType : "tiltakshaver";
}
