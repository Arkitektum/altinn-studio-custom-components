// Classes
import CustomElementHtmlAttributes from "../../../classes/system-classes/CustomElementHtmlAttributes.js";

// Global functions
import { addContainerElement, createCustomElement } from "../../../functions/helpers.js";

/**
 * Renders a custom group element for "vegtype tillatelse" using the provided component and data.
 *
 * @param {Object} component - The component configuration object, potentially containing resource bindings.
 * @param {Object} vegtypeTillatelse - The data object representing the "vegtype tillatelse" to be rendered.
 * @returns {HTMLElement} The rendered custom group element wrapped in a container.
 */
export function renderVegtypeTillatelseElement(component, vegtypeTillatelse) {
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        resourceBindings: {
            vegtype: component?.resourceBindings?.vegtype,
            erTillatelseGitt: component?.resourceBindings?.erTillatelseGitt
        },
        resourceValues: {
            data: vegtypeTillatelse
        }
    });
    return addContainerElement(createCustomElement("custom-group-vegtype-tillatelse", htmlAttributes));
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
