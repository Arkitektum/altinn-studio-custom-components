// Classes
import CustomElementHtmlAttributes from "../../../classes/system-classes/CustomElementHtmlAttributes.js";

// Global functions
import { addContainerElement, createCustomElement } from "../../../functions/helpers.js";

/**
 * Renders a custom header element with the specified title and size.
 *
 * @param {string} title - The title to display in the header element.
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
 * Renders a custom element for displaying the "tilknytningstype" field of a component.
 *
 * @param {Object} component - The component object containing resource values and bindings.
 * @param {Object} [component.resourceValues] - The resource values associated with the component.
 * @param {Object} [component.resourceValues.data] - The data object containing "tilknytningstype".
 * @param {Object} [component.resourceValues.data.tilknytningstype] - The tilknytningstype object.
 * @param {string} [component.resourceValues.data.tilknytningstype.kodebeskrivelse] - The description code for tilknytningstype.
 * @param {Object} [component.resourceBindings] - The resource bindings for the component.
 * @param {Object} [component.resourceBindings.tilknytningstype] - The tilknytningstype resource binding.
 * @param {string} [component.resourceBindings.tilknytningstype.title] - The title for the tilknytningstype field.
 * @returns {HTMLElement} The rendered custom element wrapped in a container.
 */
export function renderTilknytningstypeElement(component) {
    const data = component?.resourceValues?.data;
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        resourceBindings: {
            title: component?.resourceBindings?.tilknytningstype?.title
        },
        resourceValues: {
            data: data?.tilknytningstype?.kodebeskrivelse
        }
    });
    return addContainerElement(createCustomElement("custom-field-data", htmlAttributes));
}

/**
 * Renders a custom description element for a component.
 *
 * This function creates a custom HTML element ("custom-field-data") with specific attributes
 * based on the provided component's resource values and bindings. It wraps the element in a container.
 *
 * @param {Object} component - The component object containing resource values and bindings.
 * @param {Object} [component.resourceValues] - The resource values associated with the component.
 * @param {Object} [component.resourceValues.data] - The data object containing the description.
 * @param {Object} [component.resourceBindings] - The resource bindings for the component.
 * @param {Object} [component.resourceBindings.beskrivelse] - The bindings for the description.
 * @param {string} [component.resourceBindings.beskrivelse.title] - The title for the description.
 * @returns {HTMLElement} The rendered custom description element wrapped in a container.
 */
export function renderBeskrivelseElement(component) {
    const data = component?.resourceValues?.data;

    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        resourceBindings: {
            title: component?.resourceBindings?.beskrivelse?.title
        },
        resourceValues: {
            data: data?.beskrivelse
        }
    });
    return addContainerElement(createCustomElement("custom-field-data", htmlAttributes));
}

/**
 * Renders a custom boolean text field for the "Krysser Avløp Annens Grunn" element.
 *
 * This function creates a custom field component that displays a boolean value with localized text,
 * using resource bindings and values from the provided component object.
 *
 * @param {Object} component - The component object containing resource bindings and values.
 * @param {Object} [component.resourceValues] - The resource values for the component.
 * @param {Object} [component.resourceBindings] - The resource bindings for the component.
 * @returns {HTMLElement} The rendered custom field boolean text element wrapped in a container.
 */
export function renderKrysserAvloepAnnensGrunnElement(component) {
    const data = component?.resourceValues?.data;

    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        resourceBindings: {
            title: component?.resourceBindings?.krysserAvloepAnnensGrunn?.title,
            trueText: component?.resourceBindings?.krysserAvloepAnnensGrunn?.trueText,
            falseText: component?.resourceBindings?.krysserAvloepAnnensGrunn?.falseText,
            defaultText: ""
        },
        resourceValues: {
            data: data?.krysserAvloepAnnensGrunn
        }
    });
    return addContainerElement(createCustomElement("custom-field-boolean-text", htmlAttributes));
}

/**
 * Renders a custom boolean text field element for "Har Tinglyst Erklæring".
 *
 * This function creates a custom element with specific HTML attributes and resource bindings,
 * based on the provided component's data and resource bindings. It is intended to be used
 * as a renderer for a boolean field indicating whether a registered declaration exists.
 *
 * @param {Object} component - The component object containing resource values and bindings.
 * @param {Object} component.resourceValues - The resource values for the component.
 * @param {Object} component.resourceValues.data - The data object containing field values.
 * @param {Object} component.resourceBindings - The resource bindings for the component.
 * @param {Object} component.resourceBindings.harTinglystErklaering - Resource bindings for the specific field.
 * @param {string} component.resourceBindings.harTinglystErklaering.title - The title for the field.
 * @param {string} component.resourceBindings.harTinglystErklaering.trueText - Text to display when value is true.
 * @param {string} component.resourceBindings.harTinglystErklaering.falseText - Text to display when value is false.
 * @returns {HTMLElement} The rendered custom boolean text field element wrapped in a container.
 */
export function renderHarTinglystErklaeringElement(component) {
    const data = component?.resourceValues?.data;

    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        resourceBindings: {
            title: component?.resourceBindings?.harTinglystErklaering?.title,
            trueText: component?.resourceBindings?.harTinglystErklaering?.trueText,
            falseText: component?.resourceBindings?.harTinglystErklaering?.falseText,
            defaultText: ""
        },
        resourceValues: {
            data: data?.harTinglystErklaering
        }
    });
    return addContainerElement(createCustomElement("custom-field-boolean-text", htmlAttributes));
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
    return addContainerElement(createCustomElement("custom-paragraph", htmlAttributes));
}
