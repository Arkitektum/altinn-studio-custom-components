import CustomElementHtmlAttributes from "../../../classes/system-classes/CustomElementHtmlAttributes.js";
import { addStyle, createCustomElement } from "../../../functions/helpers.js";

/**
 * Creates a table header (th) element with the specified text and style.
 *
 * @param {Object} tableHeader - The table header configuration object.
 * @param {string} tableHeader.text - The text content for the table header.
 * @param {Object} [tableHeader.props] - Additional properties for the table header.
 * @param {Object} [tableHeader.props.styleOverride] - CSS styles to apply to the table header.
 * @returns {HTMLElement} The created table header (th) element.
 */
function getTableHeaderElement(tableHeader) {
    const th = document.createElement("th");
    th.textContent = tableHeader.text;
    addStyle(th, tableHeader?.props?.styleOverride);
    return th;
}

/**
 * Creates a table row (`<tr>`) element and appends table cell (`<td>`) elements to it.
 *
 * @param {Array} tableRow - An array of table cell data to be converted into `<td>` elements.
 * @returns {HTMLTableRowElement} The created table row element with appended table cell elements.
 */
function getTableRowElement(tableRow) {
    const tr = document.createElement("tr");
    tableRow.forEach((tableCell) => {
        tr.appendChild(getTableCellElement(tableCell));
    });
    return tr;
}

/**
 * Creates a table cell (td) element and populates it with a custom element.
 *
 * @param {Object} tableCell - The table cell configuration object.
 * @param {string} tableCell.tagName - The tag name of the custom element to create.
 * @param {Object} tableCell.data - The data to be passed to the custom element.
 * @param {string} tableCell.text - The text content to be included in the custom element.
 * @param {string} tableCell.emptyFieldText - The text to display if the field is empty.
 * @param {Object} tableCell.styleOverride - The style overrides to apply to the custom element.
 * @returns {HTMLTableCellElement} The created table cell element containing the custom element.
 */
function getTableCellElement(tableCell) {
    const td = document.createElement("td");
    const htmlAttributes = new CustomElementHtmlAttributes({
        formData: tableCell.formData,
        text: tableCell.text,
        hideTitle: true,
        hideOrgNr: tableCell.hideOrgNr,
        emptyFieldText: tableCell.emptyFieldText,
        styleOverride: tableCell.styleOverride
    });
    td.innerHTML = createCustomElement(tableCell.tagName, htmlAttributes).outerHTML;
    return td;
}

/**
 * Renders a custom header element if the text is provided.
 *
 * @param {string} text - The text content for the header element.
 * @param {string} size - The size of the header element.
 * @returns {HTMLElement|undefined} The created custom header element or undefined if no text is provided.
 */
export function renderHeaderElement(text, size) {
    const htmlAttributes = new CustomElementHtmlAttributes({
        text,
        size
    });
    if (text) {
        return createCustomElement("custom-header", htmlAttributes);
    }
}

/**
 * Renders a table element based on the provided data.
 *
 * @param {Object} data - The data to be used for rendering the table.
 * @param {Array} data.tableHeaders - An array of table header objects.
 * @param {Array} data.tableRows - An array of table row objects.
 * @param {string} [emptyFieldText] - The text to display if there are no table headers or rows.
 * @returns {HTMLTableElement} The rendered table element.
 */
export function renderTableElement(data, emptyFieldText, styleOverride) {
    const table = document.createElement("table");
    const thead = document.createElement("thead");
    const tr = document.createElement("tr");

    if (data?.tableHeaders?.length && data?.tableRows?.length) {
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
    } else if (emptyFieldText) {
        const tr = document.createElement("tr");
        const td = document.createElement("td");
        td.textContent = emptyFieldText;
        tr.appendChild(td);
        table.appendChild(tr);
    }

    addStyle(table, styleOverride);

    return table;
}
