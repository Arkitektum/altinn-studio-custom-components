import { getValueFromDataKey } from "./helpers.js";

export function getTableHeaders(tableColumns, texts) {
    return tableColumns.map((column) => {
        return {
            text: texts[column.titleResourceKey],
            props: column.props
        };
    });
}

export function getTableRows(tableColumns, data) {
    return data.map((row) => {
        const tr = [];
        tableColumns.forEach((column) => {
            const cellData = getValueFromDataKey(row, column.dataKey);
            tr.push({ ...column.props, data: cellData, hideTitle: true, tagName: column.tagName });
        });
        return tr;
    });
}
