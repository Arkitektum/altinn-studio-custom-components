import type ArealdisponeringSummation from "../../../classes/system-classes/data-classes/ArealdisponeringSummation.ts";
import type { InstantiatedComponent } from "../../../types.ts";
// Dependencies
import { CustomElementHtmlAttributes, addContainerElement, createCustomElement } from "@arkitektum/altinn-studio-custom-components-utils";

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
 * Renders a custom summation data element using the provided data.
 *
 * @param {Object} data - The data object containing properties for rendering.
 * @param {Object} [data.resourceValues] - Optional resource values for the element.
 * @param {Object} [data.resourceBindings] - Optional resource bindings for the element.
 * @returns {HTMLElement} The created custom summation data element.
 */
function renderSummationDataElement(data?: { resourceValues?: unknown; resourceBindings?: unknown }) {
    const htmlAttributes = new CustomElementHtmlAttributes({
        size: "h3",
        hideIfEmpty: true,
        isChildComponent: true,
        resourceValues: data?.resourceValues,
        resourceBindings: data?.resourceBindings
    });
    return addContainerElement(createCustomElement("custom-summation-data", htmlAttributes));
}

/**
 * Renders a container element displaying summation data for "bebyggelsen" and "tomtearealet" if available.
 *
 * @param {Object} component - The component object containing resource values and data.
 * @param {Object} [component?.resourceValues] - The resource values of the component.
 * @param {Object} [component?.resourceValues.data] - The data object containing "bebyggelsen" and "tomtearealet".
 * @param {Object} [component?.resourceValues.data.tomtearealet] - The data for "tomtearealet".
 * @param {Object} [component?.resourceValues.data.bebyggelsen] - The data for "bebyggelsen".
 * @returns {HTMLDivElement|null} A div element containing the rendered summation data elements, or null if no data is available.
 */
export function renderSummationArealdisponering(component?: InstantiatedComponent | null) {
    // Drawn only on the non-empty branch, where the data is the summation rather than the empty-field text.
    const bebyggelsenData = (component?.resourceValues?.data as ArealdisponeringSummation | undefined)?.bebyggelsen;
    const tomtearealetData = (component?.resourceValues?.data as ArealdisponeringSummation | undefined)?.tomtearealet;
    if (bebyggelsenData || tomtearealetData) {
        const container = document.createElement("div");
        if (tomtearealetData) {
            const tomtearealetElement = renderSummationDataElement({
                resourceValues: tomtearealetData?.resourceValues,
                resourceBindings: tomtearealetData?.resourceBindings
            });
            container.appendChild(tomtearealetElement);
        }
        if (bebyggelsenData) {
            const bebyggelsenElement = renderSummationDataElement({
                resourceValues: bebyggelsenData?.resourceValues,
                resourceBindings: bebyggelsenData?.resourceBindings
            });
            container.appendChild(bebyggelsenElement);
        }
        return container;
    }
    return null;
}

// Shared with the other group components, see shared/childElements.ts.
export { renderEmptyFieldText } from "../shared/childElements.ts";
