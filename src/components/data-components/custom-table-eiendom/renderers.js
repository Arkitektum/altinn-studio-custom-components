// Classes
import CustomElementHtmlAttributes from "../../../classes/system-classes/CustomElementHtmlAttributes.js";

// Global functions
import { createCustomElement } from "../../../functions/helpers.js";

/**
 * Renders a custom table element for displaying property (eiendom) data.
 *
 * @param {Object} component - The component configuration object.
 * @param {Object} [component.formData] - The form data to populate the table.
 * @param {Object} [component.texts] - The text resources for localization.
 * @returns {HTMLElement} The custom table element representing the property data.
 */
export function renderEiendomTable(component) {
    const tableColumns = [
        {
            dataKey: "adresse",
            tagName: "custom-field-adresse",
            resourceBindings: {
                title: "resource.eiendomByggested.eiendom.adresse.title",
                emptyFieldText: "resource.eiendomByggested.eiendom.adresse.emptyFieldText"
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
                title: "resource.eiendomByggested.eiendom.eiendomsidentifikasjon.gaardsnummer.title",
                emptyFieldText: "resource.emptyFieldText.default"
            }
        },
        {
            dataKey: "eiendomsidentifikasjon.bruksnummer",
            tagName: "custom-field-data",
            resourceBindings: {
                title: "resource.eiendomByggested.eiendom.eiendomsidentifikasjon.bruksnummer.title",
                emptyFieldText: "resource.emptyFieldText.default"
            }
        },
        {
            dataKey: "eiendomsidentifikasjon.seksjonsnummer",
            tagName: "custom-field-data",
            resourceBindings: {
                title: "resource.eiendomByggested.eiendom.eiendomsidentifikasjon.seksjonsnummer.title",
                emptyFieldText: "resource.emptyFieldText.default"
            }
        },
        {
            dataKey: "eiendomsidentifikasjon.festenummer",
            tagName: "custom-field-data",
            resourceBindings: {
                title: "resource.eiendomByggested.eiendom.eiendomsidentifikasjon.festenummer.title",
                emptyFieldText: "resource.emptyFieldText.default"
            }
        },
        {
            titleResourceKey: "col-6",
            dataKey: "bolignummer",
            tagName: "custom-field-data",
            resourceBindings: {
                title: "resource.eiendomByggested.eiendom.bolignummer.title",
                emptyFieldText: "resource.emptyFieldText.default"
            }
        },
        {
            titleResourceKey: "col-7",
            dataKey: "bygningsnummer",
            tagName: "custom-field-data",
            resourceBindings: {
                title: "resource.eiendomByggested.eiendom.bygningsnummer.title",
                emptyFieldText: "resource.emptyFieldText.default"
            }
        }
    ];
    const htmlAttributes = new CustomElementHtmlAttributes({
        size: "h3",
        hideIfEmpty: true,
        isChildComponent: true,
        resourceValues: component?.resourceValues,
        tableColumns
    });
    const tableElement = createCustomElement("custom-table-data", htmlAttributes);
    return tableElement;
}
