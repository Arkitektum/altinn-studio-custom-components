// Dependencies
import { CustomElementHtmlAttributes, addContainerElement, createCustomElement } from "@arkitektum/altinn-studio-custom-components-utils";

/**
 * Renders a custom header element with the specified title and size.
 *
 * @param {string} title - The title to display in the header element.
 * @param {string} [size="h2"] - The size of the header element (e.g., "h1", "h2", "h3").
 * @returns {HTMLElement} The created custom header element.
 */
export function renderHeaderElement(title, size = "h2") {
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
 * Renders a custom element displaying the count of dispensasjon data for a given component.
 *
 * @param {Object} component - The component object containing resource values and bindings.
 * @param {Object} [component.resourceValues] - Resource values for the component.
 * @param {Object} [component.resourceBindings] - Resource bindings for the component.
 * @returns {HTMLElement} The custom element with the specified attributes.
 */
export function renderDispensasjonCount(component) {
    const data = component?.resourceValues?.data;
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        resourceBindings: {
            title: component?.resourceBindings?.count?.title,
            emptyFieldText: component?.resourceBindings?.count?.emptyFieldText
        },
        resourceValues: {
            data: data?.dispensasjon
        }
    });
    return addContainerElement(createCustomElement("custom-field-count-data", htmlAttributes));
}

/**
 * Renders a custom table element displaying dispensasjon data for a given component.
 *
 * @param {Object} component - The component object containing resource values and bindings.
 * @param {Object} [component.resourceValues] - Resource values for the component.
 * @param {Object} [component.resourceBindings] - Resource bindings for the component.
 * @returns {HTMLElement} The custom table element with the specified attributes.
 */
export function renderDispensasjonTable(component) {
    const tableColumns = [
        {
            dataKey: "dispensasjonKategori.kodebeskrivelse",
            tagName: "custom-field-data",
            resourceBindings: {
                title: component?.resourceBindings?.dispensasjon?.dispensasjonKategori,
                emptyFieldText: component?.resourceBindings?.dispensasjon?.emptyFieldText
            }
        },
        {
            dataKey: "dispensasjonTittel.kodebeskrivelse",
            tagName: "custom-field-data",
            resourceBindings: {
                title: component?.resourceBindings?.dispensasjon?.dispensasjonTittel,
                emptyFieldText: component?.resourceBindings?.dispensasjon?.emptyFieldText
            }
        },
        {
            dataKey: "bestemmelserType.kodebeskrivelse",
            tagName: "custom-field-data",
            resourceBindings: {
                title: component?.resourceBindings?.dispensasjon?.bestemmelserType,
                emptyFieldText: component?.resourceBindings?.dispensasjon?.emptyFieldText
            }
        }
    ];
    const data = component?.resourceValues?.data;
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        showRowNumbers: true,
        resourceBindings: {
            rowNumberTitle: component?.resourceBindings?.dispensasjon?.rowNumberTitle,
            dispensasjonKategori: component?.resourceBindings?.dispensasjon?.dispensasjonKategori,
            dispensasjonTittel: component?.resourceBindings?.dispensasjon?.dispensasjonTittel,
            bestemmelserType: component?.resourceBindings?.dispensasjon?.bestemmelserType,
            emptyFieldText: component?.resourceBindings?.dispensasjon?.emptyFieldText
        },
        resourceValues: { data: data?.dispensasjon },
        tableColumns
    });
    return createCustomElement("custom-table-data", htmlAttributes);
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
