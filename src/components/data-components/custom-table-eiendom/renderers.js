// Classes
import CustomElementHtmlAttributes from "../../../classes/system-classes/CustomElementHtmlAttributes.js";

// Global functions
import { createCustomElement, getTextResourcesFromResourceBindings } from "../../../functions/helpers.js";

/**
 * Renders a custom table for displaying property (eiendom) data.
 *
 * @param {Array<Object>} eiendomList - The list of property data to be displayed in the table.
 * @param {Array<Object>} textResources - The text resources used for localization and display text.
 * @param {Object} textResourceBindings - The bindings for text resources, including keys for specific text elements.
 * @returns {HTMLElement} - A custom HTML element representing the rendered table.
 */
export function renderEiendomTable(component) {
    const tableColumns = [
        {
            titleResourceKey: "col-1",
            emptyFieldTextResourceKey: "emptyFieldText-col-1",
            dataKey: "adresse",
            tagName: "custom-field-adresse",
            props: {
                styleOverride: {
                    width: "116px"
                }
            }
        },
        {
            titleResourceKey: "col-2",
            emptyFieldTextResourceKey: "emptyFieldText-default",
            dataKey: "eiendomsidentifikasjon.gaardsnummer",
            tagName: "custom-field-data"
        },
        {
            titleResourceKey: "col-3",
            emptyFieldTextResourceKey: "emptyFieldText-default",
            dataKey: "eiendomsidentifikasjon.bruksnummer",
            tagName: "custom-field-data"
        },
        {
            titleResourceKey: "col-4",
            emptyFieldTextResourceKey: "emptyFieldText-default",
            dataKey: "eiendomsidentifikasjon.seksjonsnummer",
            tagName: "custom-field-data"
        },
        {
            titleResourceKey: "col-5",
            emptyFieldTextResourceKey: "emptyFieldText-default",
            dataKey: "eiendomsidentifikasjon.festenummer",
            tagName: "custom-field-data"
        },
        {
            titleResourceKey: "col-6",
            emptyFieldTextResourceKey: "emptyFieldText-default",
            dataKey: "bolignummer",
            tagName: "custom-field-data"
        },
        {
            titleResourceKey: "col-7",
            emptyFieldTextResourceKey: "emptyFieldText-default",
            dataKey: "bygningsnummer",
            tagName: "custom-field-data"
        }
    ];
    const htmlAttributes = new CustomElementHtmlAttributes({
        formData: component?.formData,
        texts: component?.texts,
        size: "h3",
        hideIfEmpty: true,
        tableColumns
    });
    const tableElement = createCustomElement("custom-table-data", htmlAttributes);
    return tableElement;
}
