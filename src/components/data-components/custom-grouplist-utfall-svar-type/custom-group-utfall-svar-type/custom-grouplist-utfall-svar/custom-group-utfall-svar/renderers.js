// Classes
import CustomElementHtmlAttributes from "../../../../../../classes/system-classes/CustomElementHtmlAttributes.js";

// Global functions
import { addContainerElement, createCustomElement } from "../../../../../../functions/helpers.js";

/**
 * Renders a custom header element for a given component.
 *
 * @param {Object} component - The component object containing resource values.
 * @param {string} [size="h3"] - The header size (e.g., "h1", "h2", "h3").
 * @returns {HTMLElement} The created custom header element.
 */
export function renderHeaderElement(component, size = "h3") {
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        size,
        resourceValues: {
            title: component?.resourceValues?.data?.tittel
        }
    });
    return createCustomElement("custom-header-text", htmlAttributes);
}

/**
 * Renders a custom description element for a component.
 *
 * This function extracts the `beskrivelse` property from the component's resource values,
 * creates custom HTML attributes for the element, and wraps the custom element in a container.
 *
 * @param {Object} component - The component object containing resource values.
 * @param {Object} [component.resourceValues] - The resource values of the component.
 * @param {Object} [component.resourceValues.data] - The data object within resource values.
 * @param {string} [component.resourceValues.data.beskrivelse] - The description to display.
 * @returns {HTMLElement} The rendered custom element wrapped in a container.
 */
export function renderBeskrivelseElement(component) {
    const data = component?.resourceValues?.data;
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        resourceValues: {
            data: data?.beskrivelse
        }
    });
    return addContainerElement(createCustomElement("custom-field-data", htmlAttributes));
}

/**
 * Renders a custom status element for the given component.
 *
 * @param {Object} component - The component object containing resource values and bindings.
 * @param {Object} [component.resourceValues] - The resource values associated with the component.
 * @param {Object} [component.resourceValues.data] - The data to be passed to the custom element.
 * @param {Object} [component.resourceBindings] - The resource bindings for the component.
 * @param {string} [component.resourceBindings["status.title"]] - The title binding for the status element.
 * @returns {HTMLElement} The container element wrapping the custom status element.
 */
export function renderStatusElement(component) {
    const data = component?.resourceValues?.data;
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        resourceBindings: {
            title: component?.resourceBindings?.["status.title"]
        },
        resourceValues: {
            data
        }
    });
    return addContainerElement(createCustomElement("custom-field-utfall-svar-status", htmlAttributes));
}

/**
 * Renders a custom field data element for the "tema" (theme) property of a component.
 *
 * This function extracts the "tema.kodebeskrivelse" value from the component's resource values
 * and creates a custom HTML element with appropriate attributes and resource bindings.
 *
 * @param {Object} component - The component object containing resource values and bindings.
 * @param {Object} [component.resourceValues] - The resource values associated with the component.
 * @param {Object} [component.resourceValues.data] - The data object containing "tema".
 * @param {Object} [component.resourceValues.data.tema] - The "tema" object.
 * @param {string} [component.resourceValues.data.tema.kodebeskrivelse] - The description of the theme.
 * @param {Object} [component.resourceBindings] - The resource bindings for the component.
 * @param {string} [component.resourceBindings["tema.kodebeskrivelse.title"]] - The title binding for the theme description.
 * @returns {HTMLElement} The rendered custom field data element wrapped in a container.
 */
export function renderTemaElement(component) {
    const data = component?.resourceValues?.data;
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
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
 * Renders a custom comment element for a component.
 *
 * This function creates a custom field data element with specific HTML attributes,
 * including resource bindings and values for displaying a comment. It wraps the
 * created element in a container element before returning it.
 *
 * @param {Object} component - The component object containing resource values and bindings.
 * @param {Object} [component.resourceValues] - The resource values associated with the component.
 * @param {Object} [component.resourceValues.data] - The data object containing the comment.
 * @param {Object} [component.resourceBindings] - The resource bindings for the component.
 * @returns {HTMLElement} The rendered custom comment element wrapped in a container.
 */
export function renderKommentarElement(component) {
    const data = component?.resourceValues?.data;
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: false,
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
            title: component?.resourceBindings?.["vedleggsliste.vedlegg.title"]
        },
        resourceValues: {
            data: data?.vedleggsliste?.vedlegg
        }
    });
    return addContainerElement(createCustomElement("custom-list-vedlegg", htmlAttributes));
}
