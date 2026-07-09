// Dependencies
import { CustomElementHtmlAttributes, addStyle, createCustomElement, hasValue } from "@arkitektum/altinn-studio-custom-components-utils";

// Global functions
import { getEmptyFieldText } from "../../../functions/helpers.js";

/**
 * Creates a table header (th) element with the specified text and style.
 *
 * @param {Object} matrixHeader - The table header configuration object.
 * @param {string} matrixHeader.text - The text content for the table header.
 * @param {Object} [matrixHeader.props] - Additional properties for the table header.
 * @returns {HTMLElement} The created table header (th) element.
 */
function renderMatrixColumnHeaderElement(matrixHeader) {
    const th = document.createElement("th");
    th.textContent = matrixHeader.text;
    return th;
}

/**
 * Renders a matrix row header element (<th>) with the specified text and style.
 *
 * @param {Object} matrixCell - The matrix row header configuration object.
 * @param {string} matrixCell.text - The text content for the matrix row header.
 * @param {Object} [matrixCell.props] - Additional properties for the matrix row header.
 * @param {Object} [matrixCell.props.styleOverride] - CSS styles to apply to the matrix row header.
 * @returns {HTMLElement} The created matrix row header (<th>) element.
 */
function renderMatrixRowHeaderElement(matrixCell) {
    const th = document.createElement("th");
    matrixCell.styleOverride = { ...matrixCell?.styleOverride, fontWeight: "var(--font-weight-bold)" };
    const htmlAttributes = new CustomElementHtmlAttributes(matrixCell);
    th.appendChild(createCustomElement(matrixCell?.tagName || "custom-field-data", htmlAttributes));
    return th;
}

/**
 * Renders a table cell element (<td>) containing a custom field data element.
 *
 * @param {Object} matrixCell - The data or configuration for the table cell.
 * @returns {HTMLTableCellElement} The rendered <td> element with the custom field data inside.
 */
function renderMatrixCellElement(matrixCell) {
    const td = document.createElement("td");
    const htmlAttributes = new CustomElementHtmlAttributes(matrixCell);
    td.appendChild(createCustomElement(matrixCell?.tagName || "custom-field-data", htmlAttributes));
    return td;
}

/**
 * Renders a matrix row element (<tr>) with the specified cells.
 *
 * @param {Array} matrixRow - An array of matrix cell data.
 * @returns {HTMLElement} The created matrix row (<tr>) element.
 */
function renderMatrixRowElement(matrixRow) {
    const tr = document.createElement("tr");
    if (matrixRow?.length) {
        matrixRow.forEach((matrixCell, index) => {
            if (index === 0) {
                tr.appendChild(renderMatrixRowHeaderElement(matrixCell));
            } else {
                tr.appendChild(renderMatrixCellElement(matrixCell));
            }
        });
    }

    return tr;
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
 * Renders a matrix element based on the provided component configuration.
 *
 * @param {Object} component - The component configuration object.
 * @param {Object} [component.resourceValues] - Resource values for the matrix.
 * @param {Object} [component.resourceValues.data] - Data for matrix headers and rows.
 * @param {string[]} [component.resourceValues.data.matrixHeaders] - Array of matrix header strings.
 * @param {Array} [component.resourceValues.data.matrixRows] - Array of matrix row data.
 * @param {string} [component.resourceValues.title] - Title for the matrix caption.
 * @param {boolean} [component.hideTitle] - If true, hides the matrix title.
 * @param {string} [component.size] - Size of the matrix header element.
 * @param {Object} [component.styleOverride] - Style overrides for the matrix element.
 * @returns {HTMLTableElement} The rendered matrix element.
 */
export function renderMatrixElement(component) {
    const data = component?.resourceValues?.data;
    const styleOverride = component?.styleOverride;

    const matrix = document.createElement("table");

    if (hasValue(component?.resourceValues?.title) && component?.hideTitle !== true) {
        const matrixCaption = document.createElement("caption");
        matrixCaption.appendChild(renderHeaderElement(component?.resourceValues?.title, component?.size));
        matrix.appendChild(matrixCaption);
        matrix.classList.add("has-caption");
    }

    const thead = document.createElement("thead");
    const tr = document.createElement("tr");

    if (data?.matrixHeaders?.length && data?.matrixRows?.length) {
        // Render matrix column header elements
        data.matrixHeaders.forEach((matrixHeader) => {
            tr.appendChild(renderMatrixColumnHeaderElement(matrixHeader));
        });
        thead.appendChild(tr);
        matrix.appendChild(thead);
        const tbody = document.createElement("tbody");
        // Render matrix rows
        data.matrixRows.forEach((matrixRow) => {
            tbody.appendChild(renderMatrixRowElement(matrixRow));
        });
        matrix.appendChild(tbody);
    } else {
        const emptyFieldText = getEmptyFieldText(component);
        if (emptyFieldText?.length) {
            const tr = document.createElement("tr");
            const td = document.createElement("td");
            td.textContent = emptyFieldText;
            tr.appendChild(td);
            matrix.appendChild(tr);
        }
    }

    addStyle(matrix, styleOverride);

    return matrix;
}
