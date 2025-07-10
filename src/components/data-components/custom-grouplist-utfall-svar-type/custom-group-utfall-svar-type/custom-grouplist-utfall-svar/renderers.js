// Classes
import CustomElementHtmlAttributes from "../../../../../classes/system-classes/CustomElementHtmlAttributes.js";

// Global functions
import { createCustomElement } from "../../../../../functions/helpers.js";

/**
 * Renders a custom group element for "utfallSvar" data.
 *
 * @param {Object} utfallSvar - The data to be rendered within the custom group component.
 * @returns {HTMLElement} The custom group element for "utfallSvar".
 */
export function renderUtfallSvarGroup(utfallSvar) {
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        resourceValues: {
            data: utfallSvar
        }
    });
    return createCustomElement("custom-group-utfall-svar", htmlAttributes);
}
