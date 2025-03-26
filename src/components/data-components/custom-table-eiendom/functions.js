import Eiendom from "../../../classes/data-classes/Eiendom.js";
import CustomElementHtmlAttributes from "../../../classes/system-classes/CustomElementHtmlAttributes.js";
import { createCustomElement, getTextResourcesFromResourceBindings, hasValue } from "../../../functions/helpers.js";

/**
 * Retrieves a list of Eiendom objects from the component's form data.
 *
 * @param {Object} component - The component object containing form data.
 * @param {Object} [component.formData] - The form data object within the component.
 * @param {Array} [component.formData.data] - The array of data representing eiendom entries.
 * @returns {Array<Eiendom>|boolean} An array of Eiendom objects if the data exists and is valid,
 *                                   otherwise returns false.
 */
export function getEiendomList(component) {
    return (
        hasValue(component?.formData?.data) &&
        component?.formData?.data?.length &&
        component.formData.data.map((eiendom) => new Eiendom(eiendom))
    );
}

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
