import Eiendom from "../../../classes/data-classes/Eiendom.js";
import CustomElementHtmlAttributes from "../../../classes/system-classes/CustomElementHtmlAttributes.js";
import { createCustomElement, getTextResourcesFromResourceBindings, hasValue } from "../../../functions/helpers.js";

export function getEiendomList(component) {
    return (
        hasValue(component?.formData?.data) &&
        component?.formData?.data?.length &&
        component.formData.data.map((eiendom) => new Eiendom(eiendom))
    );
}

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
