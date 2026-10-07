import type { InstantiatedComponent } from "../../../../../types.ts";
// Dependencies
import { CustomElementHtmlAttributes, createCustomElement } from "@arkitektum/altinn-studio-custom-components-utils";

// Shared renderers
import { renderChildHeaderElement } from "../../../shared/childElements.ts";

/**
 * Renders this component's heading, at h2 unless another level is asked for. See shared/childElements.ts.
 *
 * @param {string} title - The heading's text.
 * @param {string} [size="h2"] - The heading level.
 * @returns {HTMLElement} The created custom header element.
 */
export function renderHeaderElement(title: string, size = "h2") {
    return renderChildHeaderElement(title, size);
}

/**
 * Renders a custom group element for "utfallSvar" using provided component configuration.
 *
 * @param {Object} utfallSvar - The data to be rendered in the custom group element.
 * @param {Object} component - The component configuration object.
 * @param {boolean} [component.enableLinks] - Whether to enable links in the rendered element.
 * @param {Object} [component?.resourceBindings] - Resource bindings for the component.
 * @returns {HTMLElement} The created custom group element for "utfallSvar".
 */
export function renderUtfallSvarGroup(utfallSvar: unknown, component: InstantiatedComponent | null | undefined) {
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        enableLinks: component?.enableLinks,
        resourceBindings: component?.resourceBindings,
        resourceValues: {
            data: utfallSvar
        }
    });
    return createCustomElement("custom-group-utfall-svar", htmlAttributes);
}

// Shared with the other group components, see shared/childElements.ts.
export { renderEmptyFieldText } from "../../../shared/childElements.ts";
