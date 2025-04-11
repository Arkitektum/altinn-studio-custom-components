// Classes
import CustomElementHtmlAttributes from "../classes/system-classes/CustomElementHtmlAttributes.js";

// Global functions
import { createCustomElement, getTextResourcesFromResourceBindings, getValueFromDataKey, hasValue } from "./helpers.js";

/**
 * Generates an array of table header objects based on the provided table columns and text resources.
 *
 * @param {Array<Object>} tableColumns - An array of column definitions for the table. Each column object should have:
 *   - `titleResourceKey` {string}: The key used to look up the text for the column header.
 *   - `props` {Object}: Additional properties for the column header.
 * @param {Object} texts - An object containing text resources, where keys are resource keys and values are the corresponding text strings.
 * @returns {Array<Object>} An array of table header objects, where each object contains:
 *   - `text` {string}: The localized text for the column header.
 *   - `props` {Object}: The additional properties for the column header.
 */
export function getTableHeaders(tableColumns, texts) {
    return tableColumns.map((column) => {
        return {
            text: texts[column.titleResourceKey],
            props: column.props
        };
    });
}

/**
 * Generates table rows based on the provided table columns, texts, and data.
 *
 * @param {Array} tableColumns - An array of column definitions. Each column should include `dataKey`, `props`, `tagName`, and optionally `emptyFieldTextResourceKey`.
 * @param {Object} texts - An object containing text resources, where keys are resource keys and values are the corresponding text strings.
 * @param {Array|Object} data - The data to populate the table rows. Can be an array of objects or a single object.
 * @returns {Array} An array of table rows, where each row is an array of cell objects. Each cell object contains properties such as `formData`, `hideTitle`, and `tagName`.
 */
export function getTableRows(tableColumns, texts, data) {
    const isSingleItem = !Array.isArray(data);
    if (isSingleItem) {
        data = [data];
    }
    return data.map((row) => {
        const tr = [];
        tableColumns.forEach((column) => {
            const cellData = getValueFromDataKey(row, column.dataKey);
            if (hasValue(cellData)) {
                const formDataProperty = typeof cellData === "string" || typeof cellData === "number" ? "simpleBinding" : "data";
                const formData = { [formDataProperty]: cellData };
                tr.push({ ...column.props, formData, hideTitle: true, tagName: column.tagName });
            } else if (hasValue(column?.emptyFieldTextResourceKey)) {
                const formDataProperty = "simpleBinding";
                const emptyFieldText = texts[column.emptyFieldTextResourceKey];
                const formData = { [formDataProperty]: emptyFieldText };
                tr.push({ ...column.props, formData, hideTitle: true, tagName: column.tagName });
            }
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
