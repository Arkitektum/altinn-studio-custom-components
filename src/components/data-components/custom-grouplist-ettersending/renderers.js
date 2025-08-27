// Classes
import CustomElementHtmlAttributes from "../../../classes/system-classes/CustomElementHtmlAttributes.js";

// Global functions
import { createCustomElement } from "../../../functions/helpers.js";

/**
 * Renders a custom header element for a given component.
 *
 * @param {Object} component - The component object containing resource values.
 * @param {string} [size="h2"] - The size of the header element (e.g., "h1", "h2", etc.).
 * @returns {HTMLElement} The created custom header element.
 */
export function renderHeaderElement(component, size = "h2") {
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
 * Renders a custom group element for "ettersending" data.
 *
 * @param {Object} ettersending - The data to be rendered in the group.
 * @param {Object} component - The component configuration object.
 * @param {boolean} [component.enableLinks] - Whether to enable links in the rendered group.
 * @returns {HTMLElement} The custom group element for "ettersending".
 */
export function renderEttersendingGroup(ettersending, component) {
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        enableLinks: component?.enableLinks,
        resourceValues: {
            data: ettersending
        }
    });
    return createCustomElement("custom-group-ettersending", htmlAttributes);
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
