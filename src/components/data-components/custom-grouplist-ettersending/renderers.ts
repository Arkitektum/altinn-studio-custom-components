import type { InstantiatedComponent } from "../../../types.ts";
// Dependencies
import { CustomElementHtmlAttributes, createCustomElement } from "@arkitektum/altinn-studio-custom-components-utils";

// Shared renderers
import { renderChildHeaderElement } from "../shared/childElements.ts";

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
 * Renders a custom group element for "ettersending" data.
 *
 * @param {Object} ettersending - The data to be rendered in the group.
 * @param {Object} component - The component configuration object.
 * @param {boolean} [component.enableLinks] - Whether to enable links in the rendered group.
 * @returns {HTMLElement} The custom group element for "ettersending".
 */
export function renderEttersendingGroup(ettersending: unknown, component: InstantiatedComponent | null | undefined) {
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        enableLinks: component?.enableLinks,
        resourceBindings: component?.resourceBindings,
        resourceValues: {
            data: ettersending
        }
    });
    return createCustomElement("custom-group-ettersending", htmlAttributes);
}

// Shared with the other group components, see shared/childElements.ts.
export { renderEmptyFieldText } from "../shared/childElements.ts";
