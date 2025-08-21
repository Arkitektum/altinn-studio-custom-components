// Classes
import CustomElementHtmlAttributes from "../../../classes/system-classes/CustomElementHtmlAttributes.js";

// Global functions
import { createCustomElement } from "../../../functions/helpers.js";

/**
 * Renders a custom group element for a specific utfall svar type.
 *
 * @param {Object} component - The component object containing resource values and configuration.
 * @param {string} utfallTypeKey - The key representing the utfall svar type to render.
 * @returns {HTMLElement} The custom group element for the specified utfall svar type.
 */
export function renderUtfallSvarType(component, utfallTypeKey) {
    const data = component?.resourceValues?.data[utfallTypeKey];
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        enableLinks: component?.enableLinks,
        resourceValues: {
            data,
            utfallType: utfallTypeKey
        }
    });
    return createCustomElement("custom-group-utfall-svar-type", htmlAttributes);
}
