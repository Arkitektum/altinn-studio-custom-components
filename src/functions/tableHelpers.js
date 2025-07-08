// Global functions
import { getTextResourceFromResourceBinding, getValueFromDataKey, hasValue } from "./helpers.js";

/**
 * Generates an array of table header objects based on the provided table columns and text resources.
 *
 * @param {Array<Object>} tableColumns - The columns configuration for the table. Each column may contain `textResourceBindings` and `props`.
 * @returns {Array<{ text: string, props: Object }>} An array of header objects, each containing the resolved text and associated props.
 */
export function getTableHeaders(tableColumns) {
    return tableColumns.map((column) => {
        const headerTitleTextResourceBinding = column?.resourceBindings?.title;
        const headerTitleText = getTextResourceFromResourceBinding(headerTitleTextResourceBinding);
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
 * @param {Object|Array<Object>} data - The data to be displayed in the table. Can be a single object or an array of objects.
 * @returns {Array<Array<Object>>} An array of table rows, where each row is an array of component property objects for rendering each cell.
 */
export function getTableRows(tableColumns, data) {
    const isSingleItem = !Array.isArray(data);
    if (isSingleItem) {
        data = [data];
    }
    return data.map((row) => {
        const tr = [];
        tableColumns.forEach((column) => {
            const cellData = getValueFromDataKey(row, column.dataKey);
            const emptyFieldTextResourceBinding = column?.resourceBindings?.emptyFieldText;
            const emptyFieldText = getTextResourceFromResourceBinding(emptyFieldTextResourceBinding);
            const componentProps = { resourceValues: { data: cellData, }, hideTitle: true, tagName: column.tagName, isChildComponent: true };
            if (hasValue(emptyFieldText)) {
                componentProps.resourceValues.emptyFieldText = emptyFieldText;
            }
            tr.push(componentProps);
        });
        return tr;
    });
}
