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
