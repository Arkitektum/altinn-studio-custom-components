// Classes
import CustomElementHtmlAttributes from "../../../classes/system-classes/CustomElementHtmlAttributes.js";

// Global functions
import { createCustomElement } from "../../../functions/helpers.js";

export function renderPartTable(component) {
    const tableColumns = [
        {
            titleResourceKey: "col-1",
            emptyFieldTextResourceKey: "emptyFieldText-default",
            tagName: "custom-field-part-navn"
        },
        {
            titleResourceKey: "col-2",
            emptyFieldTextResourceKey: "emptyFieldText-default",
            tagName: "custom-field-telefonnummer"
        },
        {
            titleResourceKey: "col-3",
            emptyFieldTextResourceKey: "emptyFieldText-default",
            tagName: "custom-field-data",
            dataKey: "epost"
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
