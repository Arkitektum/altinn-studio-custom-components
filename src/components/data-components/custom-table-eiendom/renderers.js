// Classes
import CustomElementHtmlAttributes from "../../../classes/system-classes/CustomElementHtmlAttributes.js";

// Global functions
import { createCustomElement } from "../../../functions/helpers.js";

/**
 * Renders a custom table element for displaying property (eiendom) data.
 *
 * The table includes columns for address, property identification numbers (gaardsnummer, bruksnummer, seksjonsnummer, festenummer),
 * housing number (bolignummer), and building number (bygningsnummer). Each column uses resource bindings for titles and empty field text,
 * and some columns allow style overrides.
 *
 * @param {Object} component - The component configuration object containing resource bindings and values.
 * @param {Object} [component.resourceBindings] - Resource bindings for column titles and empty field text.
 * @param {Object} [component.resourceValues] - Resource values for the table.
 * @returns {HTMLElement} The rendered custom table element.
 */
export function renderEiendomTable(component) {
    const tableColumns = [
        {
            dataKey: "adresse",
            tagName: "custom-field-adresse",
            resourceBindings: {
                title: component?.resourceBindings?.adresse?.title,
                emptyFieldText: component?.resourceBindings?.adresse?.emptyFieldText
            },
            props: {
                styleOverride: {
                    width: "116px"
                }
            }
        },
        {
            dataKey: "eiendomsidentifikasjon.gaardsnummer",
            tagName: "custom-field-data",
            resourceBindings: {
                title: component?.resourceBindings?.eiendomsidentifikasjonGaardsnummer?.title,
                emptyFieldText: component?.resourceBindings?.eiendomsidentifikasjonGaardsnummer?.emptyFieldText
            }
        },
        {
            dataKey: "eiendomsidentifikasjon.bruksnummer",
            tagName: "custom-field-data",
            resourceBindings: {
                title: component?.resourceBindings?.eiendomsidentifikasjonBruksnummer?.title,
                emptyFieldText: component?.resourceBindings?.eiendomsidentifikasjonBruksnummer?.emptyFieldText
            }
        },
        {
            dataKey: "eiendomsidentifikasjon.seksjonsnummer",
            tagName: "custom-field-data",
            resourceBindings: {
                title: component?.resourceBindings?.eiendomsidentifikasjonSeksjonsnummer?.title,
                emptyFieldText: component?.resourceBindings?.eiendomsidentifikasjonSeksjonsnummer?.emptyFieldText
            }
        },
        {
            dataKey: "eiendomsidentifikasjon.festenummer",
            tagName: "custom-field-data",
            resourceBindings: {
                title: component?.resourceBindings?.eiendomsidentifikasjonFestenummer?.title,
                emptyFieldText: component?.resourceBindings?.eiendomsidentifikasjonFestenummer?.emptyFieldText
            }
        },
        {
            dataKey: "bolignummer",
            tagName: "custom-field-data",
            resourceBindings: {
                title: component?.resourceBindings?.bolignummer?.title,
                emptyFieldText: component?.resourceBindings?.bolignummer?.emptyFieldText
            }
        },
        {
            dataKey: "bygningsnummer",
            tagName: "custom-field-data",
            resourceBindings: {
                title: component?.resourceBindings?.bygningsnummer?.title,
                emptyFieldText: component?.resourceBindings?.bygningsnummer?.emptyFieldText
            }
        }
    ];
    const htmlAttributes = new CustomElementHtmlAttributes({
        size: "h3",
        hideIfEmpty: true,
        isChildComponent: true,
        resourceValues: component?.resourceValues,
        resourceBindings: {
            title: component?.resourceBindings?.eiendomByggested?.title
        },
        tableColumns
    });
    const tableElement = createCustomElement("custom-table-data", htmlAttributes);
    return tableElement;
}
