// Classes
import CustomElementHtmlAttributes from "../../../../../classes/system-classes/CustomElementHtmlAttributes.js";

// Global functions
import { createCustomElement } from "../../../../../functions/helpers.js";

/**
 * Renders a custom header element if the text is provided.
 *
 * @param {string} title - The text content for the header element.
 * @param {string} [size="h2"] - The size of the header element (e.g., "h1", "h2", etc.).
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
 * Renders a custom group element for "utfallSvar" using provided component configuration.
 *
 * @param {Object} utfallSvar - The data to be rendered in the custom group element.
 * @param {Object} component - The component configuration object.
 * @param {boolean} [component.enableLinks] - Whether to enable links in the rendered element.
 * @param {Object} [component.resourceBindings] - Resource bindings for the component.
 * @returns {HTMLElement} The created custom group element for "utfallSvar".
 */
export function renderUtfallSvarGroup(utfallSvar, component) {
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        enableLinks: component?.enableLinks,
        resourceBindings: component?.resourceBindings,
        resourceValues: {
            data: utfallSvar
        }
    });
    return createCustomElement("custom-group-utfall-svar", htmlAttributes);
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
    return createCustomElement("custom-paragraph", htmlAttributes);
}
