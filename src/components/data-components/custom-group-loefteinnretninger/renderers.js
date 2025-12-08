// Classes
import CustomElementHtmlAttributes from "../../../classes/system-classes/CustomElementHtmlAttributes.js";

// Global functions
import { addContainerElement, createCustomElement } from "../../../functions/helpers.js";

/**
 * Renders a custom header element with the specified title and size.
 *
 * @param {string} title - The title to display in the header element.
 * @param {string} [size="h2"] - The size of the header element (e.g., "h1", "h2", "h3").
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
 * Renders a custom boolean text field for "Er løfteinnretning i bygning" within a component.
 *
 * @param {Object} component - The component object containing resource values and bindings.
 * @param {Object} component.resourceValues - The resource values for the component.
 * @param {Object} component.resourceValues.data - The data object containing boolean value.
 * @param {Object} component.resourceBindings - The resource bindings for the component.
 * @param {Object} component.resourceBindings.erLoefteinnretningIBygning - Bindings for the boolean field.
 * @param {string} component.resourceBindings.erLoefteinnretningIBygning.title - The title for the field.
 * @param {string} component.resourceBindings.erLoefteinnretningIBygning.trueText - Text to display when value is true.
 * @param {string} component.resourceBindings.erLoefteinnretningIBygning.falseText - Text to display when value is false.
 * @returns {HTMLElement} The rendered custom field boolean text element wrapped in a container.
 */
export function renderErLoefteinnretningIBygningElement(component) {
    const data = component?.resourceValues?.data;

    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        resourceBindings: {
            title: component?.resourceBindings?.erLoefteinnretningIBygning?.title,
            trueText: component?.resourceBindings?.erLoefteinnretningIBygning?.trueText,
            falseText: component?.resourceBindings?.erLoefteinnretningIBygning?.falseText,
            defaultText: ""
        },
        resourceValues: {
            data: data?.erLoefteinnretningIBygning
        }
    });
    return addContainerElement(createCustomElement("custom-field-boolean-text", htmlAttributes));
}

/**
 * Renders a custom boolean text field for the "planleggesLoefteinnretningIBygning" property of a component.
 *
 * @param {Object} component - The component object containing resource values and bindings.
 * @param {Object} component.resourceValues - The resource values for the component.
 * @param {Object} component.resourceBindings - The resource bindings for the component.
 * @returns {HTMLElement} The rendered custom field boolean text element wrapped in a container.
 */
export function renderPlanleggesLoefteinnretningIBygningElement(component) {
    const data = component?.resourceValues?.data;

    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        resourceBindings: {
            title: component?.resourceBindings?.planleggesLoefteinnretningIBygning?.title,
            trueText: component?.resourceBindings?.planleggesLoefteinnretningIBygning?.trueText,
            falseText: component?.resourceBindings?.planleggesLoefteinnretningIBygning?.falseText,
            defaultText: ""
        },
        resourceValues: {
            data: data?.planleggesLoefteinnretningIBygning
        }
    });
    return addContainerElement(createCustomElement("custom-field-boolean-text", htmlAttributes));
}

/**
 * Renders a custom element for displaying planned lifting devices.
 *
 * @param {Object} component - The component object containing resource bindings and values.
 * @param {Object} [component.resourceValues] - The resource values for the component.
 * @param {Object} [component.resourceBindings] - The resource bindings for the component.
 * @returns {HTMLElement} The rendered custom element wrapped in a container.
 */
export function renderPlanlagteLoefteinnretningerElement(component) {
    const data = component?.resourceValues?.data;

    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        resourceBindings: {
            title: component?.resourceBindings?.planlagteLoefteinnretninger?.title,
            emptyFieldText: component?.resourceBindings?.planlagteLoefteinnretninger?.emptyFieldText
        },
        resourceValues: {
            data
        }
    });
    return addContainerElement(createCustomElement("custom-list-planlagte-loefteinnretninger", htmlAttributes));
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
