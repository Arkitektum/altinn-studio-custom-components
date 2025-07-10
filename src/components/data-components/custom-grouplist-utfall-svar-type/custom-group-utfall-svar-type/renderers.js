// Classes
import CustomElementHtmlAttributes from "../../../../classes/system-classes/CustomElementHtmlAttributes.js";

// Global functions
import { createCustomElement } from "../../../../functions/helpers.js";

/**
 * Renders a custom header element for a given component.
 *
 * @param {Object} component - The component object containing resource values.
 * @param {string} [size="h2"] - The header size (e.g., "h1", "h2", etc.).
 * @returns {HTMLElement} The created custom header element.
 */
export function renderHeader(component, size = "h2") {
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        size,
        resourceValues: {
            title: component?.resourceValues?.title
        }
    });
    return createCustomElement("custom-header-text", htmlAttributes);
}

/**
 * Renders a custom group list component for "Utfall Svar" type.
 *
 * @param {Object} component - The component configuration object.
 * @param {Object} [component.resourceValues] - Optional resource values for the component.
 * @param {any} [component.resourceValues.data] - Data to be passed as a resource value.
 * @returns {HTMLElement} The custom group list element for "Utfall Svar".
 */
export function renderUtfallSvarGroupList(component) {
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        resourceValues: {
            data: component?.resourceValues?.data
        }
    });
    return createCustomElement("custom-grouplist-utfall-svar", htmlAttributes);
}
