// Classes
import CustomElementHtmlAttributes from "../../../classes/system-classes/CustomElementHtmlAttributes.js";

// Global functions
import { createCustomElement } from "../../../functions/helpers.js";

/**
 * Renders a custom table for "Ansvarsomraade" with specified columns and attributes.
 *
 * @param {Object} component - The component configuration object.
 * @param {Object} [component.resourceBindings] - Resource bindings for table columns and title.
 * @param {Object} [component.resourceValues] - Resource values for the table.
 * @param {string} [component.size] - The size of the table.
 * @returns {HTMLElement} The rendered custom table element.
 */
export function renderAnsvarsomraadeTable(component) {
    const tableColumns = [
        {
            dataKey: "tiltaksklasse.kodebeskrivelse",
            tagName: "custom-field-data",
            resourceBindings: {
                title: component?.resourceBindings?.tiltaksklasse?.title,
                emptyFieldText: component?.resourceBindings?.tiltaksklasse?.emptyFieldText
            }
        },
        {
            dataKey: "ansvarsomraade",
            tagName: "custom-field-data",
            resourceBindings: {
                title: component?.resourceBindings?.ansvarsomraade?.title,
                emptyFieldText: component?.resourceBindings?.ansvarsomraade?.emptyFieldText
            }
        },
        {
            dataKey: "foretak",
            tagName: "custom-field-part-navn",
            resourceBindings: {
                title: component?.resourceBindings?.foretak?.title,
                emptyFieldText: component?.resourceBindings?.foretak?.emptyFieldText
            }
        },
        {
            dataKey: "planlagteSamsvarKontrollErklaeringerList.resourceValues.data",
            tagName: "custom-description-list-data",
            itemTermKey: "title",
            itemDescriptionKey: "signingDate",
            resourceBindings: {
                title: component?.resourceBindings?.planlagteSamsvarKontrollErklaeringer?.title,
                emptyFieldText: component?.resourceBindings?.planlagteSamsvarKontrollErklaeringer?.emptyFieldText
            },
            styleOverride: {
                width: "284px"
            }
        },
        {
            dataKey: "ansvarsomraadeStatus.kodebeskrivelse",
            tagName: "custom-field-data",
            resourceBindings: {
                title: component?.resourceBindings?.ansvarsomraadeStatus?.title,
                emptyFieldText: component?.resourceBindings?.ansvarsomraadeStatus?.emptyFieldText
            }
        }
    ];
    const htmlAttributes = new CustomElementHtmlAttributes({
        size: component?.size,
        hideIfEmpty: true,
        hideTitle: false,
        isChildComponent: true,
        resourceValues: component?.resourceValues,
        resourceBindings: {
            title: component?.resourceBindings?.ansvarsfordeling?.title,
            emptyFieldText: component?.resourceBindings?.ansvarsfordeling?.emptyFieldText
        },
        tableColumns
    });
    const tableElement = createCustomElement("custom-table-data", htmlAttributes);
    return tableElement;
}
