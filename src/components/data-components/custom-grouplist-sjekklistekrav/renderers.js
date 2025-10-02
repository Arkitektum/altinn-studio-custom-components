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
 * Renders a custom group element for "sjekklistekrav" (checklist requirements).
 *
 * @param {Object} sjekklistekrav - The checklist requirements data to be rendered.
 * @param {Object} component - The component configuration object.
 * @param {boolean} [component.enableLinks] - Whether to enable links in the rendered element.
 * @param {Object} [component.resourceBindings] - Resource bindings for text values.
 * @param {string} [component.resourceBindings.trueText] - Text to display for true values.
 * @param {string} [component.resourceBindings.falseText] - Text to display for false values.
 * @param {string} [component.resourceBindings.defaultText] - Default text to display.
 * @returns {HTMLElement} The custom group element for the checklist requirements.
 */
export function renderSjekklistekravGroup(sjekklistekrav, component) {
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        enableLinks: component?.enableLinks,
        resourceBindings: {
            trueText: component?.resourceBindings?.trueText,
            falseText: component?.resourceBindings?.falseText,
            defaultText: component?.resourceBindings?.defaultText
        },
        resourceValues: {
            data: sjekklistekrav
        }
    });
    return createCustomElement("custom-group-sjekklistekrav", htmlAttributes);
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
