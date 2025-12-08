// Classes
import CustomElementHtmlAttributes from "../../../classes/system-classes/CustomElementHtmlAttributes.js";

// Global functions
import { addContainerElement, createCustomElement } from "../../../functions/helpers.js";

/**
 * Renders a custom header element with the specified title and size.
 *
 * @param {string} title - The title to display in the header element.
 * @param {string} [size="h3"] - The size of the header element (e.g., "h1", "h2", "h3").
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
 * Renders a custom boolean text field element for "Er Ny Eller Endret Adkomst".
 *
 * @param {Object} component - The component object containing resource bindings and values.
 * @param {Object} component.resourceValues - The resource values for the component.
 * @param {Object} component.resourceBindings - The resource bindings for the component.
 * @returns {HTMLElement} The rendered custom field boolean text element wrapped in a container.
 */
export function renderErNyEllerEndretAdkomstElement(component) {
    const data = component?.resourceValues?.data;

    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        resourceBindings: {
            title: component?.resourceBindings?.erNyEllerEndretAdkomst?.title,
            trueText: component?.resourceBindings?.erNyEllerEndretAdkomst?.trueText,
            falseText: component?.resourceBindings?.erNyEllerEndretAdkomst?.falseText,
            defaultText: ""
        },
        resourceValues: {
            data: data?.erNyEllerEndretAdkomst
        }
    });
    return addContainerElement(createCustomElement("custom-field-boolean-text", htmlAttributes));
}

/**
 * Renders a custom field data element for "vegtype" using provided component data.
 *
 * @param {Object} component - The component object containing resource values and bindings.
 * @param {Object} [component.resourceValues] - The resource values associated with the component.
 * @param {Object} [component.resourceValues.data] - The data object containing vegtype information.
 * @param {Object} [component.resourceBindings] - The resource bindings for the component.
 * @param {Object} [component.resourceBindings.vegtype] - The vegtype resource binding.
 * @param {string} [component.resourceBindings.vegtype.title] - The title for the vegtype field.
 * @returns {HTMLElement} The rendered custom field data element wrapped in a container.
 */
export function renderVegtypeElement(component) {
    const data = component?.resourceValues?.data;
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        resourceBindings: {
            title: component?.resourceBindings?.vegtype?.title
        },
        resourceValues: {
            data: data?.vegtype?.kodebeskrivelse
        }
    });
    return addContainerElement(createCustomElement("custom-field-data", htmlAttributes));
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
