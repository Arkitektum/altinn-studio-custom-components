// Classes
import CustomElementHtmlAttributes from "../../../../classes/system-classes/CustomElementHtmlAttributes.js";

// Global functions
import { addContainerElement, createCustomElement, renderLayoutContainerElement } from "../../../../functions/helpers.js";

/**
 * Renders a custom header element if the text is provided.
 *
 * @param {string} title - The text content for the header element.
 * @param {string} [size="h3"] - The size of the header element (e.g., "h1", "h2", "h3").
 * @returns {HTMLElement} The created custom header element.
 */
export function renderHeaderElement(title, size = "h3") {
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        size,
        resourceValues: {
            title
        }
    });
    return createCustomElement("custom-header-text", htmlAttributes);
}

/**
 * Renders the text for a "sjekklistepunkt" (checklist item) component.
 *
 * @param {Object} component - The component object containing resource values and configuration.
 * @param {Object} [component.resourceValues] - The resource values for the component.
 * @param {Object} [component.resourceValues.data] - The data object containing checklist item details.
 * @param {Object} [component.resourceValues.data.sjekklistepunkt] - The checklist item object.
 * @param {string} [component.resourceValues.data.sjekklistepunkt.kodebeskrivelse] - The description of the checklist item.
 * @param {any} [component.resourceValues.data.dokumentasjon] - Documentation related to the checklist item.
 * @param {boolean} [component.enableLinks] - Flag to enable or disable links in the component.
 * @returns {React.ReactElement} The rendered custom field element wrapped in a container.
 */
export function renderSjekklistepunkText(component) {
    const data = component?.resourceValues?.data;
    const grid = { xs: 11 };
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: false,
        enableLinks: component?.enableLinks,
        grid,
        resourceValues: {
            title: data?.sjekklistepunkt?.kodebeskrivelse,
            data: data?.dokumentasjon
        }
    });
    return addContainerElement(createCustomElement("custom-field", htmlAttributes), grid);
}

/**
 * Renders a custom boolean text field for a checklist item value.
 *
 * @param {Object} component - The component object containing resource values and bindings.
 * @param {Object} component.resourceValues - The resource values for the component.
 * @param {Object} component.resourceValues.data - The data object containing checklist item answers.
 * @param {Object} component.resourceBindings - The resource bindings for true, false, and default text.
 * @param {string} [component.resourceBindings.trueText] - The text to display for a true value.
 * @param {string} [component.resourceBindings.falseText] - The text to display for a false value.
 * @param {string} [component.resourceBindings.defaultText] - The text to display for a default value.
 * @returns {HTMLElement} The rendered custom boolean text field wrapped in a container element.
 */
export function renderSjekklistepunkValue(component) {
    const data = component?.resourceValues?.data;
    const grid = { xs: 1 };
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        hideTitle: true,
        grid,
        resourceBindings: {
            trueText: component?.resourceBindings?.trueText,
            falseText: component?.resourceBindings?.falseText,
            defaultText: component?.resourceBindings?.defaultText
        },
        resourceValues: {
            data: data?.sjekklistepunktsvar
        }
    });
    return addContainerElement(createCustomElement("custom-field-boolean-text", htmlAttributes), grid);
}

/**
 * Renders a checklist item component by creating a container element and appending
 * the item's text and value elements.
 *
 * @param {Object} component - The component data used to render the checklist item.
 * @returns {HTMLElement} The container element with the rendered checklist item.
 */
export function renderSjekklistepunk(component) {
    const containerElement = renderLayoutContainerElement();

    containerElement.appendChild(renderSjekklistepunkText(component));
    containerElement.appendChild(renderSjekklistepunkValue(component));

    return containerElement;
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
