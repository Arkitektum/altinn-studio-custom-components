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
export function renderAnsvarsrettAnsvarsomraadeTable(component) {
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
            dataKey: "tiltaksklasse.kodebeskrivelse",
            tagName: "custom-field-data",
            resourceBindings: {
                title: component?.resourceBindings?.tiltaksklasse?.title,
                emptyFieldText: component?.resourceBindings?.tiltaksklasse?.emptyFieldText
            },
            styleOverride: {
                textAlign: "right"
            }
        },
        {
            dataKey: "faseSamsvarKontrollList.resourceValues.data",
            tagName: "custom-list-data",
            hideTitle: true,
            resourceBindings: {
                title: component?.resourceBindings?.faseSamsvarKontroll?.title,
                emptyFieldText: component?.resourceBindings?.faseSamsvarKontroll?.emptyFieldText
            },
            styleOverride: {
                listStyle: "none",
                paddingInline: "0"
            }
        },
        {
            dataKey: "dekkesOmraadeAvSentralGodkjenning",
            tagName: "custom-field-boolean-text",
            hideTitle: true,
            resourceBindings: {
                title: component?.resourceBindings?.dekkesOmraadeAvSentralGodkjenning?.title,
                trueText: component?.resourceBindings?.dekkesOmraadeAvSentralGodkjenning?.trueText,
                falseText: component?.resourceBindings?.dekkesOmraadeAvSentralGodkjenning?.falseText,
                defaultText: component?.resourceBindings?.dekkesOmraadeAvSentralGodkjenning?.defaultText
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
            title:
                component.resourceValues.data.length == 1
                    ? component?.resourceBindings?.ansvarsomraader?.titleSingle
                    : component?.resourceBindings?.ansvarsomraader?.titlePlural,
            emptyFieldText: component?.resourceBindings?.ansvarsomraader?.emptyFieldText
        },
        tableColumns
    });
    const tableElement = createCustomElement("custom-table-data", htmlAttributes);
    return tableElement;
}
