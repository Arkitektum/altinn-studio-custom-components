import CustomElementHtmlAttributes from "../classes/system-classes/CustomElementHtmlAttributes.js";
import { createCustomElement, getTextResourcesFromResourceBindings, getValueFromDataKey } from "./helpers.js";

export function getTableHeaders(tableColumns, texts) {
    return tableColumns.map((column) => {
        return {
            text: texts[column.titleResourceKey],
            props: column.props
        };
    });
}

export function getTableRows(tableColumns, data) {
    const isSingleItem = !Array.isArray(data);
    if (isSingleItem) {
        data = [data];
    }
    return data.map((row) => {
        const tr = [];
        tableColumns.forEach((column) => {
            const cellData = getValueFromDataKey(row, column.dataKey);
            const formDataProperty =
                typeof cellData === "string" || typeof cellData === "number" ? "simpleBinding" : "data";
            const formData = { [formDataProperty]: cellData };
            tr.push({ ...column.props, formData, hideTitle: true, tagName: column.tagName });
        });
        return tr;
    });
}

/**
 * Generates a custom table element for a given part with specified text resources and bindings.
 *
 * @param {Object} part - The data object representing the part to be displayed in the table.
 * @param {Array} textResources - An array of text resources used for localization.
 * @param {Object} textResourceBindingsForPart - An object containing text resource bindings specific to the part.
 * @returns {HTMLElement} A custom table element populated with the provided data and configurations.
 */
export function getPartTableElement(part, textResources, textResourceBindingsForPart) {
    const tableColumns = [
        {
            titleResourceKey: "col-1",
            tagName: "custom-field-part-navn",
            props: {
                emptyFieldText: "-",
                styleOverride: {
                    width: "250px"
                }
            }
        },
        {
            titleResourceKey: "col-2",
            tagName: "custom-field-telefonnummer",
            props: {
                emptyFieldText: "-",
                styleOverride: {
                    width: "120px"
                }
            }
        },
        {
            titleResourceKey: "col-3",
            tagName: "custom-field-data",
            dataKey: "epost",
            props: {
                emptyFieldText: "-",
                styleOverride: {
                    width: "260px"
                }
            }
        }
    ];
    const htmlAttributes = new CustomElementHtmlAttributes({
        formData: { data: part },
        texts: getTextResourcesFromResourceBindings(textResources, textResourceBindingsForPart),
        size: "h3",
        hideIfEmpty: true,
        tableColumns
    });
    const tableElement = createCustomElement("custom-table-data", htmlAttributes);
    return tableElement;
}
