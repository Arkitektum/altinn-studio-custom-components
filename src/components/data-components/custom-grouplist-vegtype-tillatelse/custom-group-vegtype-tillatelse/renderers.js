// Classes
import CustomElementHtmlAttributes from "../../../../classes/system-classes/CustomElementHtmlAttributes.js";

// Global functions
import { addContainerElement, createCustomElement } from "../../../../functions/helpers.js";

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
        itemKey: "kodebeskrivelse",
        resourceBindings: {
            title: component?.resourceBindings?.vegtype?.title
        },
        resourceValues: {
            data: data?.kode?.kodebeskrivelse
        }
    });
    return addContainerElement(createCustomElement("custom-field-data", htmlAttributes));
}

/**
 * Renders a custom boolean text field element for "erTillatelseGitt" using provided component data and resource bindings.
 *
 * @param {Object} component - The component object containing resource values and bindings.
 * @param {Object} [component.resourceValues] - The resource values associated with the component.
 * @param {Object} [component.resourceValues.data] - The data object containing the "erTillatelseGitt" value.
 * @param {Object} [component.resourceBindings] - The resource bindings for the component.
 * @param {Object} [component.resourceBindings.erTillatelseGitt] - The resource bindings specific to "erTillatelseGitt".
 * @param {string} [component.resourceBindings.erTillatelseGitt.title] - The title for the boolean field.
 * @param {string} [component.resourceBindings.erTillatelseGitt.trueText] - The text to display when the value is true.
 * @param {string} [component.resourceBindings.erTillatelseGitt.falseText] - The text to display when the value is false.
 * @param {string} [component.resourceBindings.erTillatelseGitt.defaultText] - The default text to display.
 * @returns {HTMLElement} The rendered custom boolean text field element wrapped in a container.
 */
export function renderErTillatelseGittElement(component) {
    const data = component?.resourceValues?.data;
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: false,
        resourceBindings: {
            title: component?.resourceBindings?.erTillatelseGitt?.title,
            trueText: component?.resourceBindings?.erTillatelseGitt?.trueText,
            falseText: component?.resourceBindings?.erTillatelseGitt?.falseText,
            defaultText: component?.resourceBindings?.erTillatelseGitt?.defaultText
        },
        resourceValues: {
            data: data?.erTillatelseGitt
        }
    });
    return addContainerElement(createCustomElement("custom-field-boolean-text", htmlAttributes));
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
