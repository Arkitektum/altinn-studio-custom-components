// Classes
import CustomElementHtmlAttributes from "../classes/system-classes/CustomElementHtmlAttributes.js";

// Global functions
import { createCustomElement, getTextResourcesFromResourceBindings, getValueFromDataKey, hasValue } from "./helpers.js";
import { instantiateComponent } from "./componentHelpers.js";

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
 * @param {Array<Object>} tableColumns - An array of column definitions for the table. Each column should include a `dataKey` and optional `emptyFieldTextResourceKey` and `props`.
 * @param {Object} texts - An object containing text resources, where keys are resource keys and values are the corresponding text.
 * @param {Array<Object>|Object} data - The data to populate the table rows. Can be a single object or an array of objects.
 * @returns {Array<Array<Object>>} An array of table rows, where each row is an array of component properties for the columns.
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
            const formDataProperty = typeof cellData === "string" || typeof cellData === "number" ? "simpleBinding" : "data";
            const formData = { [formDataProperty]: cellData };
            const emptyFieldText = texts[column.emptyFieldTextResourceKey];
            const componentProps = { ...column.props, formData, hideTitle: true, tagName: column.tagName };
            if (hasValue(emptyFieldText)) {
                componentProps.texts = { emptyFieldText };
            }
            const component = instantiateComponent(componentProps);
            tr.push(component);
        });
        return tr;
    });
}

/**
 * Generates a custom table element for a given part using specified text resources and bindings.
 *
 * @param {Object} part - The data object representing the part to be displayed in the table.
 * @param {Object[]} textResources - An array of text resource objects used for localization.
 * @param {Object} textResourceBindingsForPart - An object containing text resource bindings specific to the part.
 * @param {string} [size="h3"] - The size of the table header (default is "h3").
 * @returns {HTMLElement} A custom table element populated with the provided data and configurations.
 */
export function getPartTableElement(part, textResources, textResourceBindingsForPart, size = "h3") {
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
        formData: { data: part },
        texts: getTextResourcesFromResourceBindings(textResources, textResourceBindingsForPart),
        size,
        hideIfEmpty: true,
        tableColumns
    });
    const tableElement = createCustomElement("custom-table-data", htmlAttributes);
    return tableElement;
}
