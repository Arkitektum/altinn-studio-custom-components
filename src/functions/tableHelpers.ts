// Dependencies
import type { CellComponentProps, TableColumn, TableHeader } from "../types.ts";
import { getTextResourceFromResourceBinding, getValueFromDataKey, hasValue } from "@arkitektum/altinn-studio-custom-components-utils";

/**
 * Generates an array of table header objects based on the provided table columns and text resources.
 *
 * @param tableColumns - The columns configuration for the table.
 * @returns An array of header objects, each containing the resolved text and associated style overrides.
 */
export function getTableHeaders(tableColumns: TableColumn[]): TableHeader[] {
    return tableColumns.map((column) => {
        const headerTitleTextResourceBinding = column?.resourceBindings?.title;
        const headerTitleText = getTextResourceFromResourceBinding(headerTitleTextResourceBinding);
        return {
            text: headerTitleText,
            styleOverride: column.styleOverride
        };
    });
}

/**
 * Generates table row data for rendering, based on provided columns and data.
 *
 * @param tableColumns - Array of column definitions, each containing dataKey, resourceBindings, tagName, etc.
 * @param data - The data to populate the table rows. Can be a single object or an array of objects.
 * @returns An array of rows, where each row is the props for each column's cell.
 */
export function getTableRows(tableColumns: TableColumn[], data: unknown): CellComponentProps[][] {
    const rows = Array.isArray(data) ? data : [data];
    return rows.map((row) => {
        const tr: CellComponentProps[] = [];
        for (const column of tableColumns) {
            const cellData = getValueFromDataKey(row, column.dataKey);
            const emptyFieldTextResourceBinding = column?.resourceBindings?.emptyFieldText;
            const emptyFieldText = getTextResourceFromResourceBinding(emptyFieldTextResourceBinding);
            const componentProps: CellComponentProps = {
                resourceBindings: column.resourceBindings,
                resourceValues: { data: cellData },
                format: column.format,
                hideTitle: true,
                tagName: column.tagName,
                isChildComponent: true,
                itemTermKey: column.itemTermKey,
                itemDescriptionKey: column.itemDescriptionKey,
                styleOverride: column?.styleOverride
            };
            if (hasValue(emptyFieldText)) {
                componentProps.resourceValues.emptyFieldText = emptyFieldText;
            }
            tr.push(componentProps);
        }
        return tr;
    });
}
