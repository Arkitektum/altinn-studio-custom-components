import { addStyle, createCustomElement } from "../../../functions/helpers.js";

function getTableHeaderElement(tableHeader) {
    const th = document.createElement("th");
    th.textContent = tableHeader.text;
    addStyle(th, tableHeader?.props?.styleOverride);
    return th;
}

function getTableRowElement(tableRow) {
    const tr = document.createElement("tr");
    tableRow.forEach((tableCell) => {
        tr.appendChild(getTableCellElement(tableCell));
    });
    return tr;
}

function getTableCellElement(tableCell) {
    const td = document.createElement("td");
    td.innerHTML = createCustomElement(tableCell.tagName, {
        data: tableCell.data,
        text: tableCell.text,
        hideTitle: true,
        emptyFieldText: tableCell.emptyFieldText,
        styleoverride: tableCell.styleoverride
    }).outerHTML;
    return td;
}

export function renderTableElement(data) {
    const table = document.createElement("table");
    const thead = document.createElement("thead");
    const tr = document.createElement("tr");
    data.tableHeaders.forEach((tableHeader) => {
        tr.appendChild(getTableHeaderElement(tableHeader));
    });
    thead.appendChild(tr);
    table.appendChild(thead);
    const tbody = document.createElement("tbody");
    data.tableRows.forEach((tableRow) => {
        tbody.appendChild(getTableRowElement(tableRow));
    });
    table.appendChild(tbody);
    return table;
}
