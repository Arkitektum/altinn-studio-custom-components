// Global functions
import { getTextResourceFromResourceBinding, getValueFromDataKey, hasValue } from "./helpers.js";

/**
 * Generates an array of table header objects based on the provided table columns and text resources.
 *
 * @param {Array<Object>} tableColumns - The columns configuration for the table. Each column may contain `textResourceBindings` and `props`.
 * @param {Array<Object>} textResources - The available text resources used to resolve header titles.
 * @returns {Array<{ text: string, props: Object }>} An array of header objects, each containing the resolved text and associated props.
 */
export function getTableHeaders(tableColumns, textResources) {
    return tableColumns.map((column) => {
        const headerTitleTextResourceBinding = column?.textResourceBindings?.title;
        const headerTitleText = getTextResourceFromResourceBinding(textResources, headerTitleTextResourceBinding);
        return {
            text: headerTitleText,
            props: column.props
        };
    });
}

/**
 * Generates table row data for rendering, based on provided columns, text resources, and data.
 *
 * @param {Array<Object>} tableColumns - Array of column definitions for the table. Each column should specify a `dataKey`, `props`, `tagName`, and optionally `textResourceBindings`.
 * @param {Array<Object>} textResources - Array of text resource objects used for resolving text bindings.
 * @param {Object|Array<Object>} data - The data to be displayed in the table. Can be a single object or an array of objects.
 * @returns {Array<Array<Object>>} An array of table rows, where each row is an array of component property objects for rendering each cell.
 */
export function getTableRows(tableColumns, textResources, data) {
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
            const emptyFieldTextResourceBinding = column?.textResourceBindings?.emptyFieldText;
            const emptyFieldText = getTextResourceFromResourceBinding(textResources, emptyFieldTextResourceBinding);
            const componentProps = { ...column.props, formData, hideTitle: true, tagName: column.tagName };
            if (hasValue(emptyFieldText)) {
                componentProps.texts = { emptyFieldText };
            }
            tr.push(componentProps);
        });
        return tr;
    });
}
