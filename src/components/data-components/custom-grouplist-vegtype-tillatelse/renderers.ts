import type { InstantiatedComponent } from "../../../types.ts";
// Dependencies
import { CustomElementHtmlAttributes, createCustomElement } from "@arkitektum/altinn-studio-custom-components-utils";

/**
 * Renders a custom group element for "vegtype tillatelse" using the provided component and data.
 *
 * @param {Object} component - The component configuration object, potentially containing resource bindings.
 * @param {Object} vegtypeTillatelse - The data object representing the "vegtype tillatelse" to be rendered.
 * @returns {HTMLElement} The rendered custom group element.
 */
export function renderVegtypeTillatelseElement(component: InstantiatedComponent | null | undefined, vegtypeTillatelse: unknown) {
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
    return createCustomElement("custom-group-vegtype-tillatelse", htmlAttributes);
}

// Shared with the other group components, see shared/childElements.ts.
export { renderEmptyFieldText } from "../shared/childElements.ts";
