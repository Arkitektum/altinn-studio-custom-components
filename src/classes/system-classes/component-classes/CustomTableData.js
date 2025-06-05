// Classes
import CustomComponent from "../CustomComponent.js";

// Global functions
import { getRowNumberTitle, hasValue } from "../../../functions/helpers.js";
import { getTableHeaders, getTableRows } from "../../../functions/tableHelpers.js";
import { instantiateComponent } from "../../../functions/componentHelpers.js";
import { hasValidationMessages, validateTableHeadersTextResourceBindings } from "../../../functions/validations.js";

/**
 * CustomTableData is a class that extends CustomComponent to represent and manage
 * tabular data for custom components. It handles extraction and formatting of table
 * headers, rows, and validation messages from DOM elements or property objects.
 *
 * @class
 * @extends CustomComponent
 *
 * @param {HTMLElement|Object} element - The DOM element or property object used to initialize the table data.
 *
 * @property {boolean} isEmpty - Indicates whether the table data is empty.
 * @property {Object} formData - The formatted table data, including headers and rows.
 * @property {boolean} showRowNumbers - Whether to display row numbers in the table.
 * @property {Array} validationMessages - Validation messages for the table columns.
 * @property {boolean} hasValidationMessages - Indicates if there are any validation messages.
 */
export default class CustomTableData extends CustomComponent {
    constructor(element) {
        super(element);
        const parentProps = element instanceof HTMLElement ? super.getPropsFromElementAttributes(element) : element;
        const localProps = element instanceof HTMLElement ? this.getLocalPropsFromElementAttributes(element) : element;
        const props = { ...parentProps, ...localProps };

        const formData = this.getFormDataFromProps(props);
        const isEmpty = !this.hasContent(formData);
        const validationMessages = this.getValidationMessagesFromProps(props);

        this.isEmpty = isEmpty;
        this.formData = formData;
        this.showRowNumbers = localProps.showRowNumbers;
        this.validationMessages = validationMessages;
        this.hasValidationMessages = hasValidationMessages(validationMessages);
    }

    /**
     * Extracts local properties from the given element's attributes.
     *
     * @param {HTMLElement} element - The DOM element from which to extract attributes.
     * @returns {Object} An object containing local properties, such as `showRowNumbers`.
     */
    getLocalPropsFromElementAttributes(element) {
        const showRowNumbers = this.getShowRowNumbersFromElementAttributes(element);
        return {
            showRowNumbers
        };
    }

    /**
     * Determines whether the "showRowNumbers" attribute is set to "true" on the element.
     *
     * @returns {boolean} True if the "showRowNumbers" attribute is "true", otherwise false.
     */
    getShowRowNumbersFromElementAttributes(element) {
        return element?.getAttribute("showRowNumbers") === "true";
    }

    /**
     * Extracts and formats table data from the provided props.
     *
     * @param {Object} props - The properties object containing table data.
     * @returns {Object} An object with a `data` property containing `tableHeaders` and `tableRows`.
     */
    getFormDataFromProps(props) {
        const tableHeaders = this.getTableHeadersFromProps(props);
        const tableRows = this.getTableRowsFromProps(props);
        return {
            data: {
                tableHeaders,
                tableRows
            }
        };
    }

    /**
     * Generates table header definitions based on the provided props.
     *
     * @param {Object} props - The properties object containing table configuration.
     * @param {Array<Object>} [props.tableColumns] - Array of column definitions for the table.
     * @param {Object} [props.texts] - Object containing text resources for headers.
     * @param {boolean} [props.showRowNumbers] - Whether to include a row number column.
     * @returns {Array<Object>} Array of table header objects.
     */
    getTableHeadersFromProps(props) {
        const tableColumns = props?.tableColumns || [];
        const texts = props?.texts || {};
        if (tableColumns.length === 0) {
            return [];
        }
        const tableHeaders = getTableHeaders(tableColumns, texts);
        if (props.showRowNumbers) {
            tableHeaders.unshift({
                text: getRowNumberTitle(props)
            });
        }
        return tableHeaders;
    }

    /**
     * Generates table rows from the provided props, optionally adding row numbers.
     *
     * @param {Object} props - The properties object.
     * @param {Object} [props.formData] - The form data containing the table data.
     * @param {Object} [props.formData.data] - The actual data for the table rows.
     * @param {Array} [props.tableColumns=[]] - The columns definition for the table.
     * @param {Object} [props.texts={}] - Texts used for rendering the table.
     * @param {boolean} [props.showRowNumbers=false] - Whether to prepend row numbers to each row.
     * @returns {Array<Array<Object>>} An array of table rows, each row being an array of cell objects. If showRowNumbers is true, each row starts with a row number cell.
     */
    getTableRowsFromProps(props) {
        const data = props?.formData?.data;
        const tableColumns = props?.tableColumns || [];
        const texts = props?.texts || {};
        const tableRows = getTableRows(tableColumns, texts, data);
        const notEmptyTableRows = this.removeEmptyTableRows(tableRows);
        if (props.showRowNumbers) {
            // Add a row number for each table row
            return notEmptyTableRows.map((tableRow, index) => {
                const rowNumberElement = {
                    tagName: "custom-field-data",
                    hideTitle: true,
                    formData: {
                        simpleBinding: index + 1
                    }
                };
                return [rowNumberElement, ...tableRow];
            });
        }
        return notEmptyTableRows;
    }

    /**
     * Retrieves validation messages for table columns based on their text resource bindings.
     *
     * @param {Object} props - The properties object containing table configuration.
     * @param {Array} props.tableColumns - The columns of the table to validate.
     * @param {Object} props.texts - The text resources used for validation.
     * @returns {Array} An array of validation messages for the table columns.
     */
    getValidationMessagesFromProps(props) {
        return validateTableHeadersTextResourceBindings(props?.tableColumns, props?.texts);
    }

    /**
     * Removes empty rows from a table. A row is considered empty if all its cells are empty.
     * Each cell is instantiated as a component, and the `isEmpty` property is checked.
     *
     * @param {Array<Array<Object>>} tableRows - An array of table rows, where each row is an array of cell objects.
     * @returns {Array<Array<Object>>} A new array of table rows with empty rows removed.
     */
    removeEmptyTableRows(tableRows) {
        return tableRows
            .map((tableRow) => {
                const tableCells = tableRow.map((tableCell) => instantiateComponent(tableCell));
                const notEmptyTableCells = tableCells.filter((tableCellComponent) => !tableCellComponent?.isEmpty);
                return notEmptyTableCells.length > 0 ? tableCells : null;
            })
            .filter((tableRow) => tableRow !== null);
    }

    /**
     * Checks if the provided formData object contains table row data.
     *
     * @param {Object} formData - The form data object to check.
     * @param {Object} [formData.data] - The data property of the form data.
     * @param {*} [formData.data.tableRows] - The tableRows property to check for content.
     * @returns {boolean} Returns true if tableRows has a value, otherwise false.
     */
    hasContent(formData) {
        return hasValue(formData?.data?.tableRows);
    }
}
