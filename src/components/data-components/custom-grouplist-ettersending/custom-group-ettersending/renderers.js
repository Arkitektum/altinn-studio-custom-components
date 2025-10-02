// Classes
import CustomElementHtmlAttributes from "../../../../classes/system-classes/CustomElementHtmlAttributes.js";

// Global functions
import { addContainerElement, createCustomElement } from "../../../../functions/helpers.js";

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
 * Renders a custom field data element for a "tema" (topic) using provided component data.
 *
 * @param {Object} component - The component object containing resource values and bindings.
 * @param {Object} [component.resourceValues] - Resource values associated with the component.
 * @param {Object} [component.resourceValues.data] - Data object containing "tema" information.
 * @param {Object} [component.resourceBindings] - Resource bindings for the component.
 * @param {boolean} [component.enableLinks] - Flag to enable or disable links in the element.
 * @returns {HTMLElement} The rendered custom field data element wrapped in a container.
 */
export function renderTemaElement(component) {
    const data = component?.resourceValues?.data;
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        enableLinks: component?.enableLinks,
        resourceBindings: {
            title: component?.resourceBindings?.["tema.kodebeskrivelse.title"]
        },
        resourceValues: {
            data: data?.tema?.kodebeskrivelse
        }
    });
    return addContainerElement(createCustomElement("custom-field-data", htmlAttributes));
}

/**
 * Renders a custom comment element for a group list component.
 *
 * @param {Object} component - The component object containing resource values and bindings.
 * @param {Object} [component.resourceValues] - The resource values for the component.
 * @param {Object} [component.resourceBindings] - The resource bindings for the component.
 * @param {boolean} [component.enableLinks] - Flag to enable or disable links in the element.
 * @returns {HTMLElement} The rendered custom comment element wrapped in a container.
 */
export function renderKommentarElement(component) {
    const data = component?.resourceValues?.data;
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: false,
        enableLinks: component?.enableLinks,
        resourceBindings: {
            title: component?.resourceBindings?.["kommentar.title"]
        },
        resourceValues: {
            data: data?.kommentar,
            emptyFieldText: "-"
        }
    });
    return addContainerElement(createCustomElement("custom-field-data", htmlAttributes));
}

/**
 * Renders a custom list element for attachments ("vedleggsliste").
 *
 * @param {Object} component - The component object containing resource values and bindings.
 * @param {Object} component.resourceValues - The resource values for the component.
 * @param {Object} component.resourceValues.data - The data object containing attachment list information.
 * @param {Object} component.resourceBindings - The resource bindings for the component.
 * @returns {HTMLElement} The rendered custom list element wrapped in a container.
 */
export function renderVedleggslisteElement(component) {
    const data = component?.resourceValues?.data;
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        resourceBindings: {
            title: component?.resourceBindings?.["vedleggsliste.vedlegg.title"]
        },
        resourceValues: {
            data: data?.vedleggsliste?.vedlegg
        }
    });
    return addContainerElement(createCustomElement("custom-list-vedlegg", htmlAttributes));
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
