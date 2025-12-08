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
 * Renders a custom boolean text field element for "ledesOvervannTilTerreng".
 *
 * This function creates a custom field element that displays a boolean value
 * with localized text, based on the provided component's resource bindings and values.
 *
 * @param {Object} component - The component object containing resource bindings and values.
 * @param {Object} component.resourceBindings - Resource bindings for localization.
 * @param {Object} component.resourceBindings.ledesOvervannTilTerreng - Bindings for the specific field.
 * @param {string} component.resourceBindings.ledesOvervannTilTerreng.title - The title for the field.
 * @param {string} component.resourceBindings.ledesOvervannTilTerreng.trueText - Text to display when value is true.
 * @param {string} component.resourceBindings.ledesOvervannTilTerreng.falseText - Text to display when value is false.
 * @param {Object} component.resourceValues - Resource values containing data.
 * @param {Object} component.resourceValues.data - Data object for the field.
 * @param {boolean} component.resourceValues.data.ledesOvervannTilTerreng - Boolean value to display.
 * @returns {HTMLElement} The rendered custom field element wrapped in a container.
 */
export function renderLedesOvervannTilTerrengElement(component) {
    const data = component?.resourceValues?.data;

    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        resourceBindings: {
            title: component?.resourceBindings?.ledesOvervannTilTerreng?.title,
            trueText: component?.resourceBindings?.ledesOvervannTilTerreng?.trueText,
            falseText: component?.resourceBindings?.ledesOvervannTilTerreng?.falseText,
            defaultText: ""
        },
        resourceValues: {
            data: data?.ledesOvervannTilTerreng
        }
    });
    return addContainerElement(createCustomElement("custom-field-boolean-text", htmlAttributes));
}

/**
 * Renders a custom boolean text field element for "ledesOvervannTilAvloepssystem".
 *
 * @param {Object} component - The component object containing resource values and bindings.
 * @param {Object} component.resourceValues - The resource values for the component.
 * @param {Object} component.resourceBindings - The resource bindings for the component.
 * @returns {HTMLElement} The rendered custom field boolean text element wrapped in a container.
 */
export function renderLedesOvervannTilAvloepssystemElement(component) {
    const data = component?.resourceValues?.data;

    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        resourceBindings: {
            title: component?.resourceBindings?.ledesOvervannTilAvloepssystem?.title,
            trueText: component?.resourceBindings?.ledesOvervannTilAvloepssystem?.trueText,
            falseText: component?.resourceBindings?.ledesOvervannTilAvloepssystem?.falseText,
            defaultText: ""
        },
        resourceValues: {
            data: data?.ledesOvervannTilAvloepssystem
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
