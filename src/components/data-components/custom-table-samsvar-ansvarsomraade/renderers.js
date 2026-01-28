// Classes
import CustomElementHtmlAttributes from "../../../classes/system-classes/CustomElementHtmlAttributes.js";

// Global functions
import { createCustomElement } from "../../../functions/helpers.js";

/**
 * Renders a custom table for "Ansvarsrett Ansvarsomraade" with specified columns and attributes.
 *
 * @param {Object} component - The component configuration object.
 * @param {Object} [component.resourceBindings] - Resource bindings for table columns and title.
 * @param {Object} [component.resourceValues] - Resource values for the table.
 * @param {string} [component.size] - The size of the table.
 * @returns {HTMLElement} The rendered custom table element.
 */
export function renderSamsvarAnsvarsomraadeTable(component) {
    const tableColumns = [
        {
            dataKey: "funksjon.kodeverdi",
            tagName: "custom-field-data",
            resourceBindings: {
                title: component?.resourceBindings?.funksjon?.title,
                emptyFieldText: component?.resourceBindings?.funksjon?.emptyFieldText
            },
            styleOverride: {
                textAlign: "right"
            }
        },
        {
            dataKey: "beskrivelseAvAnsvarsomraadet",
            tagName: "custom-field-data",
            resourceBindings: {
                title: component?.resourceBindings?.beskrivelseAvAnsvarsomraadet?.title,
                emptyFieldText: component?.resourceBindings?.beskrivelseAvAnsvarsomraadet?.emptyFieldText
            }
        },
        {
            dataKey: "datoAnsvarsrettErklaert",
            tagName: "custom-field-data",
            format: "date",
            resourceBindings: {
                title: component?.resourceBindings?.datoAnsvarsrettErklaert?.title,
                emptyFieldText: component?.resourceBindings?.datoAnsvarsrettErklaert?.emptyFieldText
            }
        },
        {
            dataKey: "erAnsvarsomraadetAvsluttet",
            tagName: "custom-field-boolean-text",
            hideTitle: true,
            resourceBindings: {
                title: component?.resourceBindings?.erAnsvarsomraadetAvsluttet?.title,
                trueText: component?.resourceBindings?.erAnsvarsomraadetAvsluttet?.trueText,
                falseText: component?.resourceBindings?.erAnsvarsomraadetAvsluttet?.falseText,
                defaultText: component?.resourceBindings?.erAnsvarsomraadetAvsluttet?.defaultText
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
            title: component?.resourceBindings?.ansvarsomraader?.title,
            emptyFieldText: component?.resourceBindings?.ansvarsomraader?.emptyFieldText
        },
        tableColumns
    });
    const tableElement = createCustomElement("custom-table-data", htmlAttributes);
    return tableElement;
}

export function renderAvdekketTable(component) {
    const tableColumns = [
        {
            dataKey: "prosjekterendeList.resourceValues.data",
            tagName: "custom-list-data",
            hideTitle: true,
            resourceBindings: {
                title: component?.resourceBindings?.prosjekterende?.title,
                emptyFieldText: component?.resourceBindings?.prosjekterende?.emptyFieldText
            },
            styleOverride: {
                listStyle: "none"
            }
        }
    ];
    const htmlAttributes = new CustomElementHtmlAttributes({
        size: component?.size,
        hideIfEmpty: true,
        hideTitle: true,
        isChildComponent: true,
        resourceValues: component?.resourceValues,
        resourceBindings: {
            title: component?.resourceBindings?.prosjekterende?.title,
            emptyFieldText: component?.resourceBindings?.prosjekterende?.emptyFieldText
        },
        tableColumns
    });
    const tableElement = createCustomElement("custom-table-data", htmlAttributes);
    return tableElement;
}
