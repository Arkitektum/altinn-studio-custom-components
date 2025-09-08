// Classes
import CustomElementHtmlAttributes from "../../../classes/system-classes/CustomElementHtmlAttributes.js";

// Global functions
import { createCustomElement } from "../../../functions/helpers.js";

/**
 * Renders a custom summation data element using the provided data.
 *
 * @param {Object} data - The data object containing properties for rendering.
 * @param {Object} [data.resourceValues] - Optional resource values for the element.
 * @param {Object} [data.resourceBindings] - Optional resource bindings for the element.
 * @returns {HTMLElement} The created custom summation data element.
 */
function renderSummationDataElement(data) {
    const htmlAttributes = new CustomElementHtmlAttributes({
        size: "h3",
        hideIfEmpty: true,
        isChildComponent: true,
        resourceValues: data?.resourceValues,
        resourceBindings: data?.resourceBindings
    });
    const summationDataElement = createCustomElement("custom-summation-data", htmlAttributes);
    return summationDataElement;
}

/**
 * Renders a container element displaying summation data for "bebyggelsen" and "tomtearealet" if available.
 *
 * @param {Object} component - The component object containing resource values and data.
 * @param {Object} [component.resourceValues] - The resource values of the component.
 * @param {Object} [component.resourceValues.data] - The data object containing "bebyggelsen" and "tomtearealet".
 * @param {Object} [component.resourceValues.data.bebyggelsen] - The data for "bebyggelsen".
 * @param {Object} [component.resourceValues.data.tomtearealet] - The data for "tomtearealet".
 * @returns {HTMLDivElement|null} A div element containing the rendered summation data elements, or null if no data is available.
 */
export function renderSummationArealdisponering(component) {
    const bebyggelsenData = component?.resourceValues?.data?.bebyggelsen;
    const tomtearealetData = component?.resourceValues?.data?.tomtearealet;
    if (bebyggelsenData || tomtearealetData) {
        const container = document.createElement("div");
        if (bebyggelsenData) {
            const bebyggelsenElement = renderSummationDataElement({
                resourceValues: bebyggelsenData?.resourceValues,
                resourceBindings: bebyggelsenData?.resourceBindings
            });
            container.appendChild(bebyggelsenElement);
        }
        if (tomtearealetData) {
            const tomtearealetElement = renderSummationDataElement({
                resourceValues: tomtearealetData?.resourceValues,
                resourceBindings: tomtearealetData?.resourceBindings
            });
            container.appendChild(tomtearealetElement);
        }
        return container;
    }
    return null;
}
