// Dependencies
import { CustomElementHtmlAttributes, addContainerElement, createCustomElement } from "@arkitektum/altinn-studio-custom-components-utils";

// Global functions
import { getAdjustedHeaderSize } from "../../../functions/helpers.js";

/**
 * Renders a custom header element with the specified title and size.
 *
 * @param {string} title - The title to display in the header element.
 * @param {string} [size="h2"] - The size of the header element (e.g., "h1", "h2", "h3").
 * @returns {HTMLElement} The created custom header element.
 */
export function renderHeaderElement(title, size = "h2") {
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        size,
        resourceValues: {
            title
        }
    });
    return createCustomElement("custom-header-text", htmlAttributes);
}

/**
 * Renders a custom boolean field element for the "Har Miljøforhold" component.
 *
 * @param {Object} component - The component object containing resource values and bindings.
 * @returns {HTMLElement} The created custom boolean field element.
 */
export function renderHarMiljoeforholdElement(component) {
    const data = component?.resourceValues?.data;
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        resourceBindings: {
            title: component?.resourceBindings?.harMiljoeforhold?.title,
            trueText: component?.resourceBindings?.harMiljoeforhold?.trueText,
            falseText: component?.resourceBindings?.harMiljoeforhold?.falseText
        },
        resourceValues: {
            data: data?.harMiljoeforhold
        }
    });
    return addContainerElement(createCustomElement("custom-field-boolean-text", htmlAttributes));
}

/**
 * Renders a custom table element for the "Områderisiko" component.
 *
 * @param {Object} component - The component object containing resource values and bindings.
 * @returns {HTMLElement} The created custom table element.
 */
export function renderOmraaderisiko(component) {
    const data = component?.resourceValues?.data?.muligeOmraadeRisikoer?.omraadeRisiko;
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        hideTitle: false,
        size: getAdjustedHeaderSize(component?.size || "h2", 1),
        resourceBindings: {
            title: component?.resourceBindings?.omraaderisiko?.title,
            description: component?.resourceBindings?.omraaderisiko?.description
        },
        resourceValues: {
            data
        }
    });
    return createCustomElement("custom-table-omraaderisiko", htmlAttributes);
}

/**
 * Renders a custom paragraph element displaying the empty field text for a given component.
 *
 * @param {Object} component - The component object containing resource values.
 * @param {Object} [component.resourceValues] - Resource values for the component.
 * @param {string} [component.resourceValues.data] - The text to display as the empty field.
 * @returns {HTMLElement} The custom paragraph element with the specified attributes.
 */
export function renderEmptyFieldText(component) {
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        resourceValues: {
            title: component?.resourceValues?.data
        }
    });
    return addContainerElement(createCustomElement("custom-paragraph", htmlAttributes));
}
