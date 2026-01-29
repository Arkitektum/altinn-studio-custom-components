// Classes
import CustomElementHtmlAttributes from "../../../classes/system-classes/CustomElementHtmlAttributes.js";

// Global functions
import { addContainerElement, createCustomElement } from "../../../functions/helpers.js";

/**
 * Renders a custom header element with the specified title and size.
 *
 * @param {string} title - The title text to display in the header.
 * @param {string} [size="h3"] - The size of the header element (e.g., "h1", "h2", "h3").
 * @returns {HTMLElement} The created custom header element.
 */
export function renderHeaderElement(title, size = "h3") {
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        size,
        resourceBindings: {
            title
        }
    });
    return createCustomElement("custom-header-text", htmlAttributes);
}

/**
 * Renders a custom paragraph text element for "ErklaeringTekst" within a group component.
 *
 * @param {Object} component - The component object containing resource bindings.
 * @returns {HTMLElement} The rendered custom paragraph text element wrapped in a container.
 */
export function renderErklaeringTekstElement(component) {
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        resourceBindings: {
            title: component?.resourceBindings?.ansvarsrettErklaeringTekst?.title
        }
    });
    return addContainerElement(createCustomElement("custom-paragraph-text", htmlAttributes));
}

/**
 * Renders a custom paragraph text element for the SOEKTekst resource binding.
 *
 * @param {Object} component - The component object containing resource bindings.
 * @returns {HTMLElement} The rendered custom paragraph text element wrapped in a container.
 */
export function renderSOEKTekstElement(component) {
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        resourceBindings: {
            title: component?.resourceBindings?.ansvarsrettSOEKTekst?.title
        }
    });
    return addContainerElement(createCustomElement("custom-paragraph-text", htmlAttributes));
}

/**
 * Renders a custom paragraph text element for PROTekst.
 *
 * @param {Object} component - The component object containing resource bindings.
 * @returns {HTMLElement} The rendered custom paragraph text element wrapped in a container.
 */
export function renderPROTekstElement(component) {
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        resourceBindings: {
            title: component?.resourceBindings?.ansvarsrettPROTekst?.title
        }
    });
    return addContainerElement(createCustomElement("custom-paragraph-text", htmlAttributes));
}

/**
 * Renders a custom paragraph text element for the "UTFTekst" component.
 *
 * @param {Object} component - The component object containing resource bindings.
 * @returns {HTMLElement} The rendered custom paragraph text element wrapped in a container.
 */
export function renderUTFTekstElement(component) {
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        resourceBindings: {
            title: component?.resourceBindings?.ansvarsrettUTFTekst?.title
        }
    });
    return addContainerElement(createCustomElement("custom-paragraph-text", htmlAttributes));
}

/**
 * Renders a custom paragraph text element for the "KONTROLLTekst" component.
 *
 * @param {Object} component - The component object containing resource bindings.
 * @returns {HTMLElement} The rendered custom paragraph text element wrapped in a container.
 */
export function renderKONTROLLTekstElement(component) {
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        resourceBindings: {
            title: component?.resourceBindings?.ansvarsrettKONTROLLTekst?.title
        }
    });
    return addContainerElement(createCustomElement("custom-paragraph-text", htmlAttributes));
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
