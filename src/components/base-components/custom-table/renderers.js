// Classes
import CustomElementHtmlAttributes from "../../../classes/system-classes/CustomElementHtmlAttributes.js";
import { instantiateComponent } from "../../../functions/componentHelpers.js";

// Global functions
import { addStyle, createCustomElement, getEmptyFieldText, getRowNumberTitle } from "../../../functions/helpers.js";

/**
 * Creates a table header (th) element with the specified text and style.
 *
 * @param {Object} tableHeader - The table header configuration object.
 * @param {string} tableHeader.text - The text content for the table header.
 * @param {Object} [tableHeader.props] - Additional properties for the table header.
 * @param {Object} [tableHeader.props.styleOverride] - CSS styles to apply to the table header.
 * @returns {HTMLElement} The created table header (th) element.
 */
function renderTableHeaderElement(tableHeader) {
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
function renderTableRowElement(tableRow) {
    const tr = document.createElement("tr");
    tableRow.forEach((tableCell) => {
        tr.appendChild(renderTableCellElement(tableCell));
    });
    return tr;
}

/**
 * Renders a table cell element (<td>) containing a custom field data element.
 *
 * @param {Object} tableCell - The data or configuration for the table cell.
 * @returns {HTMLTableCellElement} The rendered <td> element with the custom field data inside.
 */
function renderTableCellElement(tableCell) {
    const td = document.createElement("td");
    const htmlAttributes = new CustomElementHtmlAttributes(tableCell);
    td.innerHTML = createCustomElement("custom-field-data", htmlAttributes).outerHTML;
    return td;
}

/**
 * Renders a custom header element if the text is provided.
 *
 * @param {string} title - The text content for the header element.
 * @param {string} size - The size of the header element.
 * @returns {HTMLElement|undefined} The created custom header element or undefined if no text is provided.
 */
export function renderHeaderElement(title, size) {
    const htmlAttributes = new CustomElementHtmlAttributes({
        size,
        resourceValues: {
            title
        }
    });
    if (title) {
        return createCustomElement("custom-header", htmlAttributes);
    }
}

/**
 * Renders a table element based on the provided component's data and style overrides.
 *
 * @param {Object} component - The component object containing data and style information.
 * @param {Object} [component.formData] - The form data associated with the component.
 * @param {Object} [component.formData.data] - The data used to populate the table.
 * @param {Array<string>} [component.formData.data.tableHeaders] - An array of table header strings.
 * @param {Array<Array<string>>} [component.formData.data.tableRows] - An array of table row data, where each row is an array of strings.
 * @param {string} [component.styleOverride] - Optional CSS style overrides for the table.
 *
 * @returns {HTMLTableElement} The rendered table element.
 */
export function renderTableElement(component) {
    const data = component?.resourceValues?.data;
    const styleOverride = component?.styleOverride;

    const table = document.createElement("table");
    const thead = document.createElement("thead");
    const tr = document.createElement("tr");

    if (data?.tableHeaders?.length && data?.tableRows?.length) {
        // Render table header elements
        data.tableHeaders.forEach((tableHeader) => {
            tr.appendChild(renderTableHeaderElement(tableHeader));
        });
        thead.appendChild(tr);
        table.appendChild(thead);
        const tbody = document.createElement("tbody");
        // Render table rows
        data.tableRows.forEach((tableRow) => {
            tbody.appendChild(renderTableRowElement(tableRow));
        });
        table.appendChild(tbody);
    } else {
        const emptyFieldText = getEmptyFieldText(component);
        if (emptyFieldText?.length) {
            const tr = document.createElement("tr");
            const td = document.createElement("td");
            td.textContent = emptyFieldText;
            tr.appendChild(td);
            table.appendChild(tr);
        }
    }

    addStyle(table, styleOverride);

    return table;
}
