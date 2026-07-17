// Dependencies
import { hasValue, isValidHeaderSize } from "@arkitektum/altinn-studio-custom-components-utils";

/**
 * Extracts a set of properties from the given HTML element by invoking various helper functions.
 *
 * @param {HTMLElement} element - The HTML element from which to extract properties.
 * @returns {Object} An object containing the following properties:
 *   @property {*} formData - The form data extracted from the element.
 *   @property {string} tagName - The tag name of the element.
 *   @property {string} text - The text content of the element.
 *   @property {*} texts - Additional text values from the element.
 *   @property {boolean} inline - Whether the element is inline.
 *   @property {boolean} hideTitle - Whether the title should be hidden.
 *   @property {string|number} size - The size attribute of the element.
 *   @property {boolean} hideIfEmpty - Whether to hide the element if empty.
 *   @property {*} styleOverride - Style overrides for the element.
 *   @property {boolean} isChildComponent - Whether the element is a child component.
 *   @property {string} feedbackType - The feedback type of the element.
 *   @property {string} itemKey - The item key associated with the element.
 *   @property {string} itemTermKey - The item term key associated with the element.
 *   @property {string} itemDescriptionKey - The item description key associated with the element.
 *   @property {string} dataItemKey - The data item key associated with the element.
 *   @property {string} dataTitleItemKey - The data title item key associated with the element.
 *   @property {boolean} hideOrgNr - Whether to hide the organization number.
 *   @property {string} format - The format attribute of the element.
 *   @property {Array} tableColumns - The table columns configuration.
 *   @property {boolean} showRowNumbers - Whether to show row numbers.
 *   @property {Object} resourceBindings - Text resource bindings for the element.
 *   @property {Object} resourceValues - Resource values for the element.
 *   @property {boolean} enableLinks - Whether to enable links in the field value.
 *   @property {string} sortKey - The sort key associated with the element.
 *   @property {string} endSymbol - The end symbol for the element.
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
        itemTermKey: getItemTermKey(element),
        itemDescriptionKey: getItemDescriptionKey(element),
        dataItemKey: getDataItemKey(element),
        dataTitleItemKey: getDataTitleItemKey(element),
        hideOrgNr: getHideOrgNr(element),
        format: getFormat(element),
        tableColumns: getTableColumns(element),
        showRowNumbers: getShowRowNumbers(element),
        resourceBindings: getResourceBindings(element),
        resourceValues: getResourceValues(element),
        enableLinks: getEnableLinks(element),
        order: getOrder(element)
    };
}

/**
 * Retrieves the boolean value of a specified attribute from an HTML element.
 * Returns true if the attribute value is "true" or an empty string, otherwise false.
 *
 * @param {Element} element - The HTML element to retrieve the attribute from.
 * @param {string} attributeName - The name of the attribute to check.
 * @returns {boolean} True if the attribute value is "true" or "", otherwise false.
 */
function getBooleanAttributeValueFromElement(element, attributeName) {
    const attribute = element?.getAttribute(attributeName);
    return attribute === "true" || attribute === "";
}

/**
 * Safely reads and parses a JSON attribute from an element.
 *
 * Unlike a bare `JSON.parse`, a missing attribute or malformed JSON returns the fallback instead of throwing, so a
 * single bad attribute can't abort the whole component render (which propagates up through
 * `getPropsFromElementAttributes` → `instantiateComponent` → `connectedCallback`).
 *
 * @param {HTMLElement} element - The element to read the attribute from.
 * @param {string} attributeName - The attribute name to read (HTML attribute lookup is case-insensitive).
 * @param {*} [fallback=null] - The value returned when the attribute is absent or invalid.
 * @returns {*} The parsed value, or the fallback.
 */
function parseJsonAttribute(element, attributeName, fallback = null) {
    const raw = element?.getAttribute(attributeName);
    if (!raw) {
        return fallback;
    }
    try {
        return JSON.parse(raw);
    } catch {
        console.error(`Invalid JSON in "${attributeName}" attribute; ignoring it.`);
        return fallback;
    }
}

/**
 * Extracts and parses the form data from a given HTML element's "formdata" attribute.
 *
 * @param {HTMLElement} element - The HTML element containing the "formdata" attribute.
 * @returns {Object|null} The parsed form data object if it exists and is valid, otherwise null.
 */
function getFormDataFromElement(element) {
    const formData = parseJsonAttribute(element, "formdata");
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
    const texts = parseJsonAttribute(element, "texts");
    return hasValue(texts) && texts;
}

/**
 * Retrieves the boolean value of the "inline" attribute from the given HTML element.
 *
 * @param {HTMLElement} element - The HTML element to check for the "inline" attribute.
 * @returns {boolean} True if the "inline" attribute is present and truthy, otherwise false.
 */
function getInlineFromElement(element) {
    return getBooleanAttributeValueFromElement(element, "inline");
}

/**
 * Determines whether the "hideTitle" attribute is set to a boolean value on the given HTML element.
 *
 * @param {HTMLElement} element - The HTML element to check for the "hideTitle" attribute.
 * @returns {boolean} True if the "hideTitle" attribute is present and evaluates to true; otherwise, false.
 */
function getHideTitle(element) {
    return getBooleanAttributeValueFromElement(element, "hideTitle");
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
 * Determines whether the "hideIfEmpty" attribute is set to a truthy value on the given HTML element.
 *
 * @param {HTMLElement} element - The HTML element to check for the "hideIfEmpty" attribute.
 * @returns {boolean} True if the "hideIfEmpty" attribute is present and truthy; otherwise, false.
 */
function getHideIfEmpty(element) {
    return getBooleanAttributeValueFromElement(element, "hideIfEmpty");
}

/**
 * Retrieves the style override configuration from a given element's attribute.
 *
 * @param {HTMLElement} element - The HTML element from which to extract the style override.
 * @returns {Object|false} The parsed style override object if it exists and is valid, otherwise `false`.
 */
function getStyleOverride(element) {
    const styleOverride = parseJsonAttribute(element, "styleOverride");
    return hasValue(styleOverride) && styleOverride;
}

/**
 * Determines if the given HTML element is marked as a child component.
 *
 * @param {HTMLElement} element - The HTML element to check.
 * @returns {boolean} True if the element has the "isChildComponent" attribute set to a truthy value, otherwise false.
 */
function getIsChildComponent(element) {
    return getBooleanAttributeValueFromElement(element, "isChildComponent");
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
 * Retrieves the value of the "sortKey" attribute from the given HTML element.
 * Returns the value only if it exists and is considered valid by the hasValue function.
 *
 * @param {HTMLElement} element - The HTML element from which to retrieve the "sortKey" attribute.
 * @returns {Object|false} The order object if valid, otherwise false.
 */
function getOrder(element) {
    const order = parseJsonAttribute(element, "order");
    return hasValue(order) && order;
}

/**
 * Retrieves the value of the "itemTermKey" attribute from the given HTML element.
 * Returns the value only if it is considered valid by the hasValue function.
 *
 * @param {Element} element - The HTML element from which to retrieve the attribute.
 * @returns {string|false} The value of the "itemTermKey" attribute if valid, otherwise false.
 */
function getItemTermKey(element) {
    const itemTermKey = element?.getAttribute("itemTermKey");
    return hasValue(itemTermKey) && itemTermKey;
}

/**
 * Retrieves the value of the "itemDescriptionKey" attribute from the given HTML element.
 * Returns the value only if it exists and passes the `hasValue` check.
 *
 * @param {Element} element - The HTML element from which to retrieve the attribute.
 * @returns {string|false} The value of the "itemDescriptionKey" attribute if present and valid, otherwise false.
 */
function getItemDescriptionKey(element) {
    const itemDescriptionKey = element?.getAttribute("itemDescriptionKey");
    return hasValue(itemDescriptionKey) && itemDescriptionKey;
}

/**
 * Retrieves the value of the "dataItemKey" attribute from the given HTML element.
 * Returns the value only if it is defined and not empty, otherwise returns false.
 *
 * @param {HTMLElement} element - The HTML element to extract the dataItemKey from.
 * @returns {(string|false)} The value of the dataItemKey attribute if present and valid, otherwise false.
 */
function getDataItemKey(element) {
    const dataItemKey = element?.getAttribute("dataItemKey");
    return hasValue(dataItemKey) && dataItemKey;
}

/**
 * Retrieves the value of the "dataTitleItemKey" attribute from the given HTML element,
 * if it exists and is considered valid by the `hasValue` function.
 *
 * @param {HTMLElement} element - The HTML element from which to retrieve the attribute.
 * @returns {string|false} The value of the "dataTitleItemKey" attribute if valid, otherwise false.
 */
function getDataTitleItemKey(element) {
    const dataTitleItemKey = element?.getAttribute("dataTitleItemKey");
    return hasValue(dataTitleItemKey) && dataTitleItemKey;
}

/**
 * Determines whether the "hideOrgNr" attribute is set to a boolean value on the given HTML element.
 *
 * @param {HTMLElement} element - The HTML element to check for the "hideOrgNr" attribute.
 * @returns {boolean} True if the "hideOrgNr" attribute is present and evaluates to true; otherwise, false.
 */
function getHideOrgNr(element) {
    return getBooleanAttributeValueFromElement(element, "hideOrgNr");
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

/**
 * Retrieves and parses the "tableColumns" attribute from a given HTML element.
 *
 * @param {HTMLElement} element - The HTML element from which to extract the "tableColumns" attribute.
 * @returns {any|null} The parsed table columns if present and valid, otherwise null.
 */
function getTableColumns(element) {
    const tableColumns = parseJsonAttribute(element, "tableColumns");
    return hasValue(tableColumns) && tableColumns;
}

/**
 * Retrieves the boolean value of the "showRowNumbers" attribute from the given HTML element.
 *
 * @param {HTMLElement} element - The HTML element to extract the attribute from.
 * @returns {boolean} True if the "showRowNumbers" attribute is present and truthy, otherwise false.
 */
function getShowRowNumbers(element) {
    return getBooleanAttributeValueFromElement(element, "showRowNumbers");
}

/**
 * Retrieves and parses the "resourceBindings" attribute from the given element.
 * Returns the parsed object if it has a value, otherwise returns false.
 *
 * @param {Element} element - The DOM element from which to retrieve the attribute.
 * @returns {Object|false} The parsed resource bindings object if present and valid, otherwise false.
 */
function getResourceBindings(element) {
    const textResourceBindings = parseJsonAttribute(element, "resourceBindings");
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
    const resourceValues = parseJsonAttribute(element, "resourceValues");
    return hasValue(resourceValues) && resourceValues;
}

/**
 * Retrieves the boolean value of the "enableLinks" attribute from the given HTML element.
 *
 * @param {HTMLElement} element - The HTML element to check for the "enableLinks" attribute.
 * @returns {boolean} True if the "enableLinks" attribute is set and evaluates to true; otherwise, false.
 */
function getEnableLinks(element) {
    return getBooleanAttributeValueFromElement(element, "enableLinks");
}

/**
 * Adds class names to the document body based on the provided organization and application identifiers.
 * The class names are formatted as "org-{org}" and "app-{app}" respectively.
 *
 * @param {string} org - The organization identifier to include in the class name.
 * @param {string} app - The application identifier to include in the class name.
 * @returns {void}
 * @example
 */
export function addBodyClassNamesForApplication(org, app) {
    if (org && app) {
        document.body.classList.add(`org-${org}`, `app-${app}`);
    }
}

/**
 * Removes all class names from the document body that start with "org-" or "app-".
 * This is typically used to clear any existing organization or application context before adding new class names.
 *
 * @returns {void}
 */
export function removeAllBodyClassNamesForApplication() {
    // Find all class names on the body that start with "org-" or "app-" and remove them
    const classNamesToRemove = Array.from(document.body.classList).filter(
        (className) => className.startsWith("org-") || className.startsWith("app-")
    );
    classNamesToRemove.forEach((className) => document.body.classList.remove(className));
}

/**
 * Updates the class names on the document body to reflect the current organization and application context.
 * This function first removes any existing class names that start with "org-" or "app-", and then adds new class names based on the provided organization and application identifiers.
 *
 * @param {string} org - The organization identifier to include in the new class name.
 * @param {string} app - The application identifier to include in the new class name.
 * @returns {void}
 * @example
 */
export function updateBodyClassNamesForApplication(org, app) {
    removeAllBodyClassNamesForApplication();
    addBodyClassNamesForApplication(org, app);
}
