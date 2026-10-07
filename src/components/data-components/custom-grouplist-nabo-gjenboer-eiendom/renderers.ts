import type { InstantiatedComponent } from "../../../types.ts";
import type NaboGjenboerEiendom from "../../../classes/data-classes/NaboGjenboerEiendom.ts";
// Dependencies
import { CustomElementHtmlAttributes, createCustomElement } from "@arkitektum/altinn-studio-custom-components-utils";

// Shared renderers
import { renderChildHeaderElement } from "../shared/childElements.ts";

/**
 * Renders this component's heading, at h3 unless another level is asked for. See shared/childElements.ts.
 *
 * @param {string} title - The heading's text.
 * @param {string} [size="h3"] - The heading level.
 * @returns {HTMLElement} The created custom header element.
 */
export function renderHeaderElement(title: string, size = "h3") {
    return renderChildHeaderElement(title, size);
}

/**
 * Renders a custom group component for "Nabo Gjenboer Eiendom".
 *
 * @param {Object} naboGjenboerEiendom - The data object representing the "Nabo Gjenboer Eiendom".
 * @param {Object} component - The component configuration object, possibly containing resource bindings.
 * @returns {HTMLElement} The custom group element for "Nabo Gjenboer Eiendom".
 */
export function renderNaboGjenboerEiendomGroup(
    naboGjenboerEiendom: NaboGjenboerEiendom | undefined,
    component: InstantiatedComponent | null | undefined
) {
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        hideTitle: false,
        size: "h4",
        resourceBindings: component?.resourceBindings,
        resourceValues: {
            data: naboGjenboerEiendom
        }
    });
    return createCustomElement("custom-group-nabo-gjenboer-eiendom", htmlAttributes);
}

// Shared with the other group components, see shared/childElements.ts.
export { renderEmptyFieldText } from "../shared/childElements.ts";

/**
 * Renders a custom divider element with overridden margin style.
 *
 * @returns {HTMLElement} The custom divider element.
 */
export function renderDivider() {
    const htmlAttributes = new CustomElementHtmlAttributes({
        styleOverride: { margin: 0 }
    });
    return createCustomElement("custom-divider", htmlAttributes);
}
