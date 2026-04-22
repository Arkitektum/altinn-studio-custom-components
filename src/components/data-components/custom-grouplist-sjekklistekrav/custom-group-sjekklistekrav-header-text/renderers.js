// Dependencies
import { CustomElementHtmlAttributes, addContainerElement, createCustomElement } from "@arkitektum/altinn-studio-custom-components-utils";

// Global functions
import { renderLayoutContainerElement } from "../../../../functions/helpers.js";

/**
 * Renders the text header component for a checklist item.
 * Creates a custom field element with the checklist item title spanning 11 columns.
 *
 * @param {Object} component - The component object containing resource values and configuration
 * @param {Object} [component.resourceValues] - Resource values for the component
 * @param {Object} [component.resourceValues.data] - Data containing checklist item values
 * @param {string} [component.resourceValues.data.sjekklistepunkt] - The checklist item text
 * @param {boolean} [component.enableLinks] - Whether to enable links in the component
 * @returns {HTMLElement} A container element with the custom field for the checklist item text
 */
export function renderSjekklistepunkTextHeader(component) {
    const data = component?.resourceValues?.data;
    const grid = { xs: 11 };
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: false,
        hideTitle: false,
        enableLinks: component?.enableLinks,
        grid,
        resourceValues: {
            title: data?.sjekklistepunkt
        }
    });
    return addContainerElement(createCustomElement("custom-field", htmlAttributes), grid);
}

/**
 * Renders the value header component for a checklist item.
 * Creates a custom field element with the checklist item answer title spanning 1 column.
 *
 * @param {Object} component - The component object containing resource values and configuration
 * @param {Object} [component.resourceValues] - Resource values for the component
 * @param {Object} [component.resourceValues.data] - Data containing checklist item values
 * @param {string} [component.resourceValues.data.sjekklistepunktsvar] - The checklist item answer text
 * @returns {HTMLElement} A container element with the custom field for the checklist item value
 */
export function renderSjekklistepunkValueHeader(component) {
    const data = component?.resourceValues?.data;
    const grid = { xs: 1 };
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: false,
        hideTitle: false,
        grid,
        resourceValues: {
            title: data?.sjekklistepunktsvar
        }
    });
    return addContainerElement(createCustomElement("custom-field", htmlAttributes), grid);
}

/**
 * Renders the complete header for a checklist item.
 * Combines both the text header and value header components in a layout container.
 *
 * @param {Object} component - The component object containing resource values and configuration
 * @param {Object} [component.resourceValues] - Resource values for the component
 * @param {Object} [component.resourceValues.data] - Data containing checklist item values
 * @param {string} [component.resourceValues.data.sjekklistepunkt] - The checklist item text
 * @param {string} [component.resourceValues.data.sjekklistepunktsvar] - The checklist item answer text
 * @param {boolean} [component.enableLinks] - Whether to enable links in the component
 * @returns {HTMLElement} A layout container element containing both header components
 */
export function renderSjekklistepunkHeader(component) {
    const containerElement = renderLayoutContainerElement();
    containerElement.appendChild(renderSjekklistepunkTextHeader(component));
    containerElement.appendChild(renderSjekklistepunkValueHeader(component));
    return containerElement;
}
