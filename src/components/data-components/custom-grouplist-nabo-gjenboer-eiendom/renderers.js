// Classes
import CustomElementHtmlAttributes from "../../../classes/system-classes/CustomElementHtmlAttributes.js";

// Global functions
import { createCustomElement } from "../../../functions/helpers.js";

/**
 * Renders a custom header element if the text is provided.
 *
 * @param {string} title - The text content for the header element.
 * @param {string} [size="h2"] - The size of the header element (e.g., "h1", "h2", etc.).
 * @returns {HTMLElement} The created custom header element.
 */
export function renderHeaderElement(title, size = "h3") {
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
 * Renders a custom group component for "Nabo Gjenboer Eiendom".
 *
 * @param {Object} naboGjenboerEiendom - The data object representing the "Nabo Gjenboer Eiendom".
 * @param {Object} component - The component configuration object, possibly containing resource bindings.
 * @returns {HTMLElement} The custom group element for "Nabo Gjenboer Eiendom".
 */
export function renderNaboGjenboerEiendomGroup(naboGjenboerEiendom, component) {
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        hideTitle: false,
        size: "h4",
        resourceBindings: component?.resourceBindings,
        resourceValues: {
            data: naboGjenboerEiendom
        }
    });
    return createCustomElement("custom-group-nabo-gjenboer-eiendom", htmlAttributes);
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

/**
 * Renders a custom divider element with overridden margin style.
 *
 * @returns {HTMLElement} The custom divider element.
 */
export function renderDivider() {
    const htmlAttributes = new CustomElementHtmlAttributes({
        styleOverride: { margin: 0 }
    });
    return createCustomElement("custom-divider", htmlAttributes);
}
