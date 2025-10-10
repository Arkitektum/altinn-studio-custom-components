// Classes
import CustomElementHtmlAttributes from "../../../classes/system-classes/CustomElementHtmlAttributes.js";

// Global functions
import { createCustomElement } from "../../../functions/helpers.js";

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
 * @param {string} [component.resourceBindings.omraadeRisiko.title] - Title for the table.
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
        size: component?.size,
        hideIfEmpty: true,
        isChildComponent: true,
        resourceValues: component?.resourceValues,
        resourceBindings: {
            title: component?.resourceBindings?.omraadeRisiko?.title
        },
        tableColumns
    });
    const tableElement = createCustomElement("custom-table-data", htmlAttributes);
    return tableElement;
}
