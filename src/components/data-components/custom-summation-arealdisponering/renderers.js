// Classes
import CustomElementHtmlAttributes from "../../../classes/system-classes/CustomElementHtmlAttributes.js";

// Global functions
import { addContainerElement, createCustomElement } from "../../../functions/helpers.js";

/**
 * Renders a custom header element for a given component.
 *
 * @param {Object} component - The component object containing resource values.
 * @param {string} [size="h2"] - The size of the header element (e.g., "h1", "h2", etc.).
 * @returns {HTMLElement} The created custom header element.
 */
export function renderHeaderElement(component, size = "h2") {
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        size,
        resourceValues: {
            title: component?.resourceValues?.title
        }
    });
    return createCustomElement("custom-header-text", htmlAttributes);
}

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
    const summationDataElement = addContainerElement(createCustomElement("custom-summation-data", htmlAttributes));
    return summationDataElement;
}

/**
 * Renders a container element displaying summation data for "bebyggelsen" and "tomtearealet" if available.
 *
 * @param {Object} component - The component object containing resource values and data.
 * @param {Object} [component.resourceValues] - The resource values of the component.
 * @param {Object} [component.resourceValues.data] - The data object containing "bebyggelsen" and "tomtearealet".
 * @param {Object} [component.resourceValues.data.tomtearealet] - The data for "tomtearealet".
 * @param {Object} [component.resourceValues.data.bebyggelsen] - The data for "bebyggelsen".
 * @returns {HTMLDivElement|null} A div element containing the rendered summation data elements, or null if no data is available.
 */
export function renderSummationArealdisponering(component) {
    const bebyggelsenData = component?.resourceValues?.data?.bebyggelsen;
    const tomtearealetData = component?.resourceValues?.data?.tomtearealet;
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

/**
 * Renders a custom paragraph element displaying the empty field text for a given component.
 *
 * @param {Object} component - The component object containing resource values.
 * @param {Object} [component.resourceValues] - Resource values for the component.
 * @param {string} [component.resourceValues.data] - The text to display as the empty field.
 * @returns {HTMLElement} The custom paragraph element with the specified attributes.
 */
export function renderEmptyFieldText(component) {
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        resourceValues: {
            title: component?.resourceValues?.data
        }
    });
    return createCustomElement("custom-paragraph", htmlAttributes);
}
