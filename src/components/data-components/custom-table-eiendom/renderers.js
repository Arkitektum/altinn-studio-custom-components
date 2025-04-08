// Classes
import CustomElementHtmlAttributes from "../../../classes/system-classes/CustomElementHtmlAttributes.js";

// Global functions
import { createCustomElement, getTextResourcesFromResourceBindings } from "../../../functions/helpers.js";

/**
 * Renders a custom table for displaying property (eiendom) data.
 *
 * @param {Array<Object>} eiendomList - The list of property data to be displayed in the table.
 * @param {Array<Object>} textResources - The text resources used for localization and display.
 * @param {Object} textResourceBindings - The bindings for text resources, including keys for localization.
 * @returns {HTMLElement} A custom table element populated with the provided property data.
 */
export function renderEiendomTable(eiendomList, textResources, textResourceBindings) {
    const tableColumns = [
        {
            titleResourceKey: "col-1",
            dataKey: "adresse",
            tagName: "custom-field-adresse",
            props: {
                emptyFieldText: "(adresse mangler)",
                styleOverride: {
                    width: "116px"
                }
            }
        },
        {
            titleResourceKey: "col-2",
            dataKey: "eiendomsidentifikasjon.gaardsnummer",
            tagName: "custom-field-data",
            props: {
                emptyFieldText: "-"
            }
        },
        {
            titleResourceKey: "col-3",
            dataKey: "eiendomsidentifikasjon.bruksnummer",
            tagName: "custom-field-data",
            props: {
                emptyFieldText: "-"
            }
        },
        {
            titleResourceKey: "col-4",
            dataKey: "eiendomsidentifikasjon.seksjonsnummer",
            tagName: "custom-field-data",
            props: {
                emptyFieldText: "-"
            }
        },
        {
            titleResourceKey: "col-5",
            dataKey: "eiendomsidentifikasjon.festenummer",
            tagName: "custom-field-data",
            props: {
                emptyFieldText: "-"
            }
        },
        {
            titleResourceKey: "col-6",
            dataKey: "bolignummer",
            tagName: "custom-field-data",
            props: {
                emptyFieldText: "-"
            }
        },
        {
            titleResourceKey: "col-7",
            dataKey: "bygningsnummer",
            tagName: "custom-field-data",
            props: {
                emptyFieldText: "-"
            }
        }
    ];
    const htmlAttributes = new CustomElementHtmlAttributes({
        formData: { data: eiendomList },
        texts: getTextResourcesFromResourceBindings(textResources, textResourceBindings.eiendomByggested),
        size: "h3",
        hideIfEmpty: true,
        tableColumns
    });
    const tableElement = createCustomElement("custom-table-data", htmlAttributes);
    return tableElement;
}
