// Classes
import CustomElementHtmlAttributes from "../../../classes/system-classes/CustomElementHtmlAttributes.js";

// Global functions
import { createCustomElement, getAdjustedHeaderSize } from "../../../functions/helpers.js";

/**
 * Renders a custom header element with the specified title and size.
 *
 * @param {string} title - The text to display in the header.
 * @param {string} [size="h2"] - The size of the header (e.g., "h1", "h2", etc.).
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
 * Renders a custom table for "Omraaderisiko" with specified columns and attributes.
 *
 * @param {Object} component - The component configuration object.
 * @param {Object} [component.resourceBindings] - Resource bindings for table columns and title.
 * @param {Object} [component.resourceBindings.risikotype] - Resource bindings for "risikotype" column.
 * @param {string} [component.resourceBindings.risikotype.title] - Title for "risikotype" column.
 * @param {string} [component.resourceBindings.risikotype.emptyFieldText] - Text to display if "risikotype" field is empty.
 * @param {Object} [component.resourceBindings.sikkerhetsklasse] - Resource bindings for "sikkerhetsklasse" column.
 * @param {string} [component.resourceBindings.sikkerhetsklasse.title] - Title for "sikkerhetsklasse" column.
 * @param {string} [component.resourceBindings.sikkerhetsklasse.emptyFieldText] - Text to display if "sikkerhetsklasse" field is empty.
 * @param {Object} [component.resourceBindings.omraadeRisiko] - Resource bindings for table title.
 * @param {string} [component.resourceBindings.omraadeRisiko.description] - Description for the table.
 * @param {string} [component.size] - Size attribute for the table.
 * @param {Object} [component.resourceValues] - Resource values for the table.
 * @returns {HTMLElement} The rendered custom table element.
 */
export function renderOmraaderisikoTable(component) {
    const tableColumns = [
        {
            dataKey: "risikotype.kodebeskrivelse",
            tagName: "custom-field-data",
            resourceBindings: {
                title: component?.resourceBindings?.risikotype?.title,
                emptyFieldText: component?.resourceBindings?.risikotype?.emptyFieldText
            }
        },
        {
            dataKey: "sikkerhetsklasse.kodebeskrivelse",
            tagName: "custom-field-data",
            resourceBindings: {
                title: component?.resourceBindings?.sikkerhetsklasse?.title,
                emptyFieldText: component?.resourceBindings?.sikkerhetsklasse?.emptyFieldText
            }
        }
    ];
    const htmlAttributes = new CustomElementHtmlAttributes({
        size: getAdjustedHeaderSize(component?.size, 1),
        hideIfEmpty: true,
        isChildComponent: true,
        resourceValues: {
            data: component?.resourceValues?.data
        },
        resourceBindings: {
            title: component?.resourceBindings?.omraaderisiko?.description
        },
        tableColumns
    });
    const tableElement = createCustomElement("custom-table-data", htmlAttributes);
    return tableElement;
}
