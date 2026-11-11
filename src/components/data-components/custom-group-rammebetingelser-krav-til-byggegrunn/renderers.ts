import type { InstantiatedComponent } from "../../../types.ts";
import type KravTilByggegrunn from "../../../classes/data-classes/KravTilByggegrunn.ts";
// Dependencies
import { CustomElementHtmlAttributes, addContainerElement, createCustomElement } from "@arkitektum/altinn-studio-custom-components-utils";

// Shared renderers
import { renderChildHeaderElement } from "../shared/childElements.ts";

// Global functions
import { getAdjustedHeaderSize } from "../../../functions/helpers.ts";

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
 * Renders a custom boolean field element for the "Har Miljøforhold" component.
 *
 * @param {Object} component - The component object containing resource values and bindings.
 * @returns {HTMLElement} The created custom boolean field element.
 */
export function renderHarMiljoeforholdElement(component?: InstantiatedComponent | null) {
    // Drawn only on the non-empty branch, where the data is the model rather than the empty-field text.
    const data = component?.resourceValues?.data as KravTilByggegrunn | undefined;
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        resourceBindings: {
            title: component?.resourceBindings?.harMiljoeforhold?.title,
            trueText: component?.resourceBindings?.harMiljoeforhold?.trueText,
            falseText: component?.resourceBindings?.harMiljoeforhold?.falseText
        },
        resourceValues: {
            data: data?.harMiljoeforhold
        }
    });
    return addContainerElement(createCustomElement("custom-field-boolean-text", htmlAttributes));
}

/**
 * Renders a custom table element for the "Områderisiko" component.
 *
 * @param {Object} component - The component object containing resource values and bindings.
 * @returns {HTMLElement} The created custom table element.
 */
export function renderOmraaderisiko(component?: InstantiatedComponent | null) {
    // Drawn only on the non-empty branch, where the data is the model rather than the empty-field text.
    const data = (component?.resourceValues?.data as KravTilByggegrunn | undefined)?.muligeOmraadeRisikoer?.omraadeRisiko;
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        hideTitle: false,
        size: getAdjustedHeaderSize(component?.size || "h2", 1),
        resourceBindings: {
            title: component?.resourceBindings?.omraaderisiko?.title,
            description: component?.resourceBindings?.omraaderisiko?.description
        },
        resourceValues: {
            data
        }
    });
    return createCustomElement("custom-table-omraaderisiko", htmlAttributes);
}

// Shared with the other group components, see shared/childElements.ts.
export { renderEmptyFieldText } from "../shared/childElements.ts";
