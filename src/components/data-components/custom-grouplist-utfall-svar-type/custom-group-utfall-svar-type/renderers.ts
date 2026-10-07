import type { InstantiatedComponent } from "../../../../types.ts";
// Dependencies
import { CustomElementHtmlAttributes, createCustomElement } from "@arkitektum/altinn-studio-custom-components-utils";

/**
 * Renders a custom group list component for "Utfall Svar" type.
 *
 * @param {Object} component - The component configuration object.
 * @param {boolean} [component.enableLinks] - Flag to enable or disable links in the component.
 * @param {Object} [component?.resourceBindings] - Resource bindings for the component.
 * @param {Object} [component?.resourceValues] - Resource values for the component.
 * @param {*} [component?.resourceValues.data] - Data resource value.
 * @param {*} [component?.resourceValues.title] - Title resource value.
 * @returns {HTMLElement} The rendered custom group list element.
 */
export function renderUtfallSvarGroupList(component?: InstantiatedComponent | null) {
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        enableLinks: component?.enableLinks,
        resourceBindings: component?.resourceBindings,
        resourceValues: {
            data: component?.resourceValues?.data,
            title: component?.resourceValues?.title
        }
    });
    return createCustomElement("custom-grouplist-utfall-svar", htmlAttributes);
}

// Shared with the other group components, see shared/childElements.ts.
export { renderEmptyFieldText } from "../../shared/childElements.ts";
