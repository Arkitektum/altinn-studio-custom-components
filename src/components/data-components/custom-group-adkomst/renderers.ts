import type Adkomst from "../../../classes/data-classes/Adkomst.ts";
import type { InstantiatedComponent } from "../../../types.ts";
// Dependencies
import { CustomElementHtmlAttributes, addContainerElement, createCustomElement } from "@arkitektum/altinn-studio-custom-components-utils";

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
 * Renders a custom boolean text field element for "Er Ny Eller Endret Adkomst".
 *
 * @param {Object} component - The component object containing resource bindings and values.
 * @param {Object} component?.resourceValues - The resource values for the component.
 * @param {Object} component?.resourceBindings - The resource bindings for the component.
 * @returns {HTMLElement} The rendered custom field boolean text element wrapped in a container.
 */
export function renderErNyEllerEndretAdkomstElement(component?: InstantiatedComponent | null) {
    // Drawn only on the non-empty branch, where the data is the model rather than the empty-field text.
    const data = component?.resourceValues?.data as Adkomst | undefined;

    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        resourceBindings: {
            title: component?.resourceBindings?.erNyEllerEndretAdkomst?.title,
            trueText: component?.resourceBindings?.erNyEllerEndretAdkomst?.trueText,
            falseText: component?.resourceBindings?.erNyEllerEndretAdkomst?.falseText,
            defaultText: ""
        },
        resourceValues: {
            data: data?.erNyEllerEndretAdkomst
        }
    });
    return addContainerElement(createCustomElement("custom-field-boolean-text", htmlAttributes));
}

/**
 * Renders a custom element for displaying vegtype and tillatelse information.
 *
 * @param {Object} component - The component object containing resource bindings and values.
 * @param {Object} [component?.resourceValues] - The resource values associated with the component.
 * @param {Object} [component?.resourceBindings] - The resource bindings for the component.
 * @param {Object} [component?.resourceBindings.vegtype] - The resource bindings for vegtype.
 * @param {Object} [component?.resourceBindings.erTillatelseGitt] - The resource bindings for tillatelse.
 * @returns {HTMLElement} The rendered custom element.
 */
export function renderVegtypeTillatelseElement(component?: InstantiatedComponent | null) {
    // Drawn only on the non-empty branch, where the data is the model rather than the empty-field text.
    const data = component?.resourceValues?.data as Adkomst | undefined;
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        resourceBindings: {
            vegtype: component?.resourceBindings?.vegtype,
            erTillatelseGitt: component?.resourceBindings?.erTillatelseGitt
        },
        resourceValues: {
            data: data
        }
    });
    return createCustomElement("custom-grouplist-vegtype-tillatelse", htmlAttributes);
}

// Shared with the other group components, see shared/childElements.ts.
export { renderEmptyFieldText } from "../shared/childElements.ts";
