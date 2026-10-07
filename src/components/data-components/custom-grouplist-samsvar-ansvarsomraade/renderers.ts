import type { InstantiatedComponent } from "../../../types.ts";
// Dependencies
import { CustomElementHtmlAttributes, createCustomElement } from "@arkitektum/altinn-studio-custom-components-utils";

/**
 * Renders a custom group element for "samsvar-ansvarsomraade" data.
 *
 * @param {Object} samsvarAnsvarsomraade - The data to be rendered in the group.
 * @param {Object} component - The component configuration object.
 * @returns {HTMLElement} The custom group element for "samsvar-ansvarsomraade".
 */
export function renderSamsvarAnsvarsomraadeGroup(samsvarAnsvarsomraade: unknown, component: InstantiatedComponent | null | undefined) {
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        resourceBindings: component?.resourceBindings,
        resourceValues: {
            data: samsvarAnsvarsomraade
        }
    });
    return createCustomElement("custom-group-samsvar-ansvarsomraade", htmlAttributes);
}

// Shared with the other group components, see shared/childElements.ts.
export { renderEmptyFieldText } from "../shared/childElements.ts";
