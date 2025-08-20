// Classes
import CustomElementHtmlAttributes from "../../../../classes/system-classes/CustomElementHtmlAttributes.js";

// Global functions
import { createCustomElement } from "../../../../functions/helpers.js";

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
        resourceBindings: {
            title: component?.resourceBindings?.title
        },
        resourceValues: {
            data: component?.resourceValues?.data,
            title: component?.resourceValues?.title
        }
    });
    return createCustomElement("custom-grouplist-utfall-svar", htmlAttributes);
}
