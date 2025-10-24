// Classes
import CustomElementHtmlAttributes from "../../../../../../classes/system-classes/CustomElementHtmlAttributes.js";

// Global functions
import { addContainerElement, createCustomElement } from "../../../../../../functions/helpers.js";

/**
 * Renders a custom header element if the text is provided.
 *
 * @param {string} title - The text content for the header element.
 * @param {string} [size="h3"] - The header size (e.g., "h1", "h2", "h3").
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
 * Renders a custom field data element for the "beskrivelse" property of the given component.
 *
 * @param {Object} component - The component object containing resource values and configuration.
 * @param {Object} [component.resourceValues] - Resource values associated with the component.
 * @param {Object} [component.resourceValues.data] - Data object containing the "beskrivelse" property.
 * @param {boolean} [component.enableLinks] - Flag to enable or disable links in the rendered element.
 * @returns {HTMLElement} The rendered custom field data element wrapped in a container.
 */
export function renderBeskrivelseElement(component) {
    const data = component?.resourceValues?.data;
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        enableLinks: component?.enableLinks,
        resourceValues: {
            data: data?.beskrivelse
        }
    });
    return addContainerElement(createCustomElement("custom-field-data", htmlAttributes));
}

export function renderStatusElement(component) {
    const data = component?.resourceValues?.data;
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        enableLinks: component?.enableLinks,
        resourceBindings: {
            title: component?.resourceBindings?.utfallSvarStatus?.title,
            erUtfallBesvaresSenere: component?.resourceBindings?.utfallSvarStatus?.erUtfallBesvaresSenere,
            erUtfallBesvart: component?.resourceBindings?.utfallSvarStatus?.erUtfallBesvart,
            status: component?.resourceBindings?.utfallSvarStatus?.status
        },
        resourceValues: {
            data
        }
    });
    return addContainerElement(createCustomElement("custom-field-utfall-svar-status", htmlAttributes));
}

/**
 * Renders a custom field data element for the "tema" (topic) code description.
 *
 * @param {Object} component - The component object containing resource values and bindings.
 * @param {Object} [component.resourceValues] - Resource values for the component.
 * @param {Object} [component.resourceValues.data] - Data object containing "tema".
 * @param {Object} [component.resourceBindings] - Resource bindings for the component.
 * @param {boolean} [component.enableLinks] - Flag to enable links in the rendered element.
 * @returns {HTMLElement} The rendered custom field data container element.
 */
export function renderTemaElement(component) {
    const data = component?.resourceValues?.data;
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        enableLinks: component?.enableLinks,
        resourceBindings: {
            title: component?.resourceBindings?.tema?.title
        },
        resourceValues: {
            data: data?.tema?.kodebeskrivelse
        }
    });
    return addContainerElement(createCustomElement("custom-field-data", htmlAttributes));
}

/**
 * Renders a custom comment element for a component.
 *
 * @param {Object} component - The component object containing resource values and bindings.
 * @param {Object} [component.resourceValues] - The resource values for the component.
 * @param {Object} [component.resourceBindings] - The resource bindings for the component.
 * @param {boolean} [component.enableLinks] - Flag to enable links in the element.
 * @returns {HTMLElement} The rendered custom comment element wrapped in a container.
 */
export function renderKommentarElement(component) {
    const data = component?.resourceValues?.data;
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: false,
        enableLinks: component?.enableLinks,
        resourceBindings: {
            title: component?.resourceBindings?.kommentar?.title
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
 * @param {Object} [component.resourceValues] - The resource values associated with the component.
 * @param {Object} [component.resourceValues.data] - The data object containing vedleggsliste.
 * @param {Object} [component.resourceBindings] - The resource bindings for the component.
 * @returns {HTMLElement} The rendered custom list element wrapped in a container.
 */
export function renderVedleggslisteElement(component) {
    const data = component?.resourceValues?.data;
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        resourceBindings: {
            title: component?.resourceBindings?.vedleggsliste?.title
        },
        resourceValues: {
            data: data?.vedleggsliste?.vedlegg
        }
    });
    return addContainerElement(createCustomElement("custom-list-vedlegg", htmlAttributes));
}
