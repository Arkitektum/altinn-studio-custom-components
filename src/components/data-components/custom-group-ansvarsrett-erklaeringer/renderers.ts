import type { InstantiatedComponent } from "../../../types.ts";
// Dependencies
import { CustomElementHtmlAttributes, addContainerElement, createCustomElement } from "@arkitektum/altinn-studio-custom-components-utils";

// Shared renderers
import { renderChildHeaderElementFromResource } from "../shared/childElements.ts";

/**
 * Renders this component's heading, at h3 unless another level is asked for. See shared/childElements.ts.
 *
 * @param {string} titleResourceKey - The text resource key of the heading's text.
 * @param {string} [size="h3"] - The heading level.
 * @returns {HTMLElement} The created custom header element.
 */
export function renderHeaderElement(titleResourceKey: string, size = "h3") {
    return renderChildHeaderElementFromResource(titleResourceKey, size);
}

/**
 * Renders a custom paragraph text element for "ErklaeringTekst" within a group component.
 *
 * @param {Object} component - The component object containing resource bindings.
 * @returns {HTMLElement} The rendered custom paragraph text element wrapped in a container.
 */
export function renderErklaeringTekstElement(component?: InstantiatedComponent | null) {
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
export function renderSOEKTekstElement(component?: InstantiatedComponent | null) {
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
export function renderPROTekstElement(component?: InstantiatedComponent | null) {
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
export function renderUTFTekstElement(component?: InstantiatedComponent | null) {
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
export function renderKONTROLLTekstElement(component?: InstantiatedComponent | null) {
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        resourceBindings: {
            title: component?.resourceBindings?.ansvarsrettKONTROLLTekst?.title
        }
    });
    return addContainerElement(createCustomElement("custom-paragraph-text", htmlAttributes));
}

// Shared with the other group components, see shared/childElements.ts.
export { renderEmptyFieldText } from "../shared/childElements.ts";
