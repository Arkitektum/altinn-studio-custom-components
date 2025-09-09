//Classes
import CustomElementHtmlAttributes from "../../../classes/system-classes/CustomElementHtmlAttributes.js";

// Global functions
import { createCustomElement, generateUniqueId, hasValue } from "../../../functions/helpers.js";

/**
 * Renders a custom header element with the specified title and size.
 *
 * @param {string} title - The title to display in the header.
 * @param {string|number} size - The size attribute for the header element.
 * @returns {HTMLElement|undefined} The created custom header element, or undefined if no title is provided.
 */
export function renderHeaderElement(title, size) {
    const htmlAttributes = new CustomElementHtmlAttributes({
        size,
        resourceValues: {
            title
        }
    });
    if (title) {
        return createCustomElement("custom-header", htmlAttributes);
    }
}

/**
 * Creates a <span> element representing a summation item operator.
 *
 * @param {string} summationItemOperator - The operator to display (e.g., "+", "-", etc.).
 * @returns {HTMLSpanElement} The span element with the operator and appropriate class.
 */
function renderSummationItemOperatorElement(summationItemOperator) {
    const fieldOperatorElement = document.createElement("span");
    fieldOperatorElement.classList.add("summation-item-operator");
    fieldOperatorElement.innerText = summationItemOperator;
    return fieldOperatorElement;
}

/**
 * Creates a <span> element representing the title of a summation item.
 *
 * @param {string} summationItemTitle - The text content for the summation item title.
 * @param {string} [summationItemTitleId] - Optional ID to assign to the span element.
 * @returns {HTMLSpanElement} The created span element with the specified title and optional ID.
 */
function renderSummationItemTitleElement(summationItemTitle, summationItemTitleId) {
    const fieldTitleLabelElement = document.createElement("span");
    if (summationItemTitleId) {
        fieldTitleLabelElement.id = summationItemTitleId;
    }
    fieldTitleLabelElement.classList.add("summation-item-title");
    fieldTitleLabelElement.innerText = summationItemTitle;
    return fieldTitleLabelElement;
}

/**
 * Creates a <span> element displaying the summation item data with an optional unit.
 *
 * @param {*} summationItemData - The data to display inside the span. If falsy, an empty span is returned.
 * @param {string} [summationItemUnit] - Optional unit to append to the data, separated by a space.
 * @returns {HTMLSpanElement} The created span element containing the formatted data and unit.
 */
function renderSummationItemDataElement(summationItemData, summationItemUnit) {
    const fieldDataElement = document.createElement("span");
    if (!hasValue(summationItemData)) {
        return fieldDataElement;
    }
    fieldDataElement.classList.add("summation-item-data");
    fieldDataElement.innerText = summationItemData + (summationItemUnit?.length ? ` ${summationItemUnit}` : "");
    return fieldDataElement;
}

/**
 * Renders a summation item element as an HTML string.
 *
 * @param {Object} summationItem - The summation item to render.
 * @param {Object} [summationItem.resourceValues] - The resource values for the summation item.
 * @param {string} [summationItem.resourceValues.operator] - The operator to display.
 * @param {string} [summationItem.resourceValues.title] - The title of the summation item.
 * @param {string} [summationItem.resourceValues.data] - The data value of the summation item.
 * @param {string} [summationItem.resourceValues.unit] - The unit to append to the data value.
 * @returns {string} The HTML string representing the summation item element.
 */
export function renderSummationItemElement(summationItem) {
    const summationItemElement = document.createElement("div");
    summationItemElement.classList.add("summation-item");

    const summationItemOperator = summationItem?.resourceValues?.operator || "";
    const summationItemTitle = summationItem?.resourceValues?.title || "";
    const summationItemTitleId = summationItemTitle?.length ? generateUniqueId("custom-field-") : null;
    const summationItemData = hasValue(summationItem?.resourceValues?.data) ? summationItem?.resourceValues?.data : "0";
    const summationItemUnit = summationItem?.resourceValues?.unit || "";

    summationItemElement.appendChild(renderSummationItemOperatorElement(summationItemOperator));
    summationItemElement.appendChild(renderSummationItemTitleElement(summationItemTitle, summationItemTitleId));

    const summationItemDataElement = renderSummationItemDataElement(summationItemData, summationItemUnit);
    if (summationItemTitle?.length) {
        summationItemDataElement.classList.add("has-title");
        summationItemDataElement.setAttribute("aria-labelledby", summationItemTitleId);
    }
    summationItemElement.appendChild(summationItemDataElement);
    return summationItemElement.outerHTML;
}

/**
 * Renders a summation element containing a list of summation items.
 *
 * @param {Array} data - An array of summation item data objects to be rendered.
 * @returns {HTMLDivElement} The DOM element representing the summation container with its items.
 */
export function renderSummationElement(data) {
    const summationElement = document.createElement("div");
    summationElement.classList.add("custom-summation");
    if (data && Array.isArray(data) && data.length) {
        data.forEach((summationItem) => {
            const summationItemElement = renderSummationItemElement(summationItem);
            summationElement.innerHTML += summationItemElement;
        });
    }
    return summationElement;
}
