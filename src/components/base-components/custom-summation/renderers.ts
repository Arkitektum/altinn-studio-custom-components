import type { InstantiatedComponent } from "../../../types.ts";
// Dependencies
import { CustomElementHtmlAttributes, createCustomElement, hasValue } from "@arkitektum/altinn-studio-custom-components-utils";

// Global functions
import { formatNumber } from "../../../functions/dataFormatHelpers.ts";

/**
 * Renders a custom header element with the specified title and size.
 *
 * @param {string} title - The title to display in the header.
 * @param {string|number} size - The size attribute for the header element.
 * @returns {HTMLElement|undefined} The created custom header element, or undefined if no title is provided.
 */
export function renderHeaderElement(title: string, size?: string) {
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
function renderSummationItemOperatorElement(summationItemOperator: string) {
    const fieldOperatorElement = document.createElement("span");
    fieldOperatorElement.classList.add("summation-item-operator");
    fieldOperatorElement.textContent = summationItemOperator;
    return fieldOperatorElement;
}

/**
 * Creates a <span> element representing the title of a summation item.
 *
 * @param {string} summationItemTitle - The text content for the summation item title.
 * @returns {HTMLSpanElement} The created span element with the specified title.
 */
function renderSummationItemTitleElement(summationItemTitle: string) {
    const fieldTitleLabelElement = document.createElement("span");
    fieldTitleLabelElement.classList.add("summation-item-title");
    fieldTitleLabelElement.textContent = summationItemTitle;
    return fieldTitleLabelElement;
}

/**
 * Creates a <span> element displaying the summation item data with an optional unit, a number written the Norwegian way.
 *
 * @param {*} summationItemData - The data to display inside the span. If falsy, an empty span is returned.
 * @param {string} [summationItemUnit] - Optional unit to append to the data, separated by a space.
 * @returns {HTMLSpanElement} The created span element containing the formatted data and unit.
 */
function renderSummationItemDataElement(summationItemData: unknown, summationItemUnit?: string) {
    const fieldDataElement = document.createElement("span");
    if (!hasValue(summationItemData)) {
        return fieldDataElement;
    }
    fieldDataElement.classList.add("summation-item-data");
    fieldDataElement.textContent = formatNumber(summationItemData) + (summationItemUnit?.length ? ` ${summationItemUnit}` : "");
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
 * @param {boolean} [returnHtml=true] - Whether to return an HTML string or the DOM element.
 * @returns {string|HTMLElement} The rendered summation item as an HTML string or DOM element based on returnHtml.
 */
export function renderSummationItemElement(summationItem: InstantiatedComponent, returnHtml?: true): string;
export function renderSummationItemElement(summationItem: InstantiatedComponent, returnHtml: false): HTMLDivElement;
export function renderSummationItemElement(summationItem: InstantiatedComponent, returnHtml = true) {
    const summationItemElement = document.createElement("div");
    summationItemElement.classList.add("summation-item");

    const summationItemOperator = summationItem?.resourceValues?.operator || "";
    const summationItemTitle = summationItem?.resourceValues?.title || "";
    const summationItemData = hasValue(summationItem?.resourceValues?.data) ? summationItem?.resourceValues?.data : "0";
    const summationItemUnit = summationItem?.resourceValues?.unit || "";
    const summationItemIsTotal = summationItem?.resourceValues?.isTotal === true || summationItem?.resourceValues?.isTotal === "true";

    if (summationItemIsTotal) {
        summationItemElement.classList.add("total");
    }

    summationItemElement.appendChild(renderSummationItemOperatorElement(summationItemOperator));
    // The title comes right before the data, which is how a screen reader reads the pair. No aria-labelledby: a plain
    // span with no role cannot be named, so it was ignored.
    summationItemElement.appendChild(renderSummationItemTitleElement(summationItemTitle));

    const summationItemDataElement = renderSummationItemDataElement(summationItemData, summationItemUnit);
    if (summationItemTitle?.length) {
        summationItemDataElement.classList.add("has-title");
    }
    summationItemElement.appendChild(summationItemDataElement);
    return returnHtml ? summationItemElement.outerHTML : summationItemElement;
}

/**
 * Renders a summation element containing a list of summation items.
 *
 * @param {Array} data - An array of summation item data objects to be rendered.
 * @returns {HTMLDivElement} The DOM element representing the summation container with its items.
 */
export function renderSummationElement(data: unknown) {
    const summationElement = document.createElement("div");
    summationElement.classList.add("custom-summation");
    if (Array.isArray(data)) {
        data.forEach((summationItem: InstantiatedComponent) => {
            // Append the element rather than concatenating its serialized HTML: `innerHTML +=` re-parses everything
            // already in the container on every item, discarding and rebuilding the nodes it had just created.
            summationElement.appendChild(renderSummationItemElement(summationItem, false));
        });
    }
    return summationElement;
}
