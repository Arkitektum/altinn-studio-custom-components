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
        const textResources = typeof window !== "undefined" && window.textResources ? window.textResources : [];

        const parentProps = element instanceof HTMLElement ? super.getPropsFromElementAttributes(element) : element;
        const localProps = element instanceof HTMLElement ? this.getLocalPropsFromElementAttributes(element) : element;
        const props = { ...parentProps, ...localProps };

        const formData = this.getFormDataFromProps(props, textResources);
        const isEmpty = !this.hasContent(formData);
        const validationMessages = this.getValidationMessagesFromProps(props, textResources);

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
     * @returns {{ showRowNumbers: boolean, tableColumns: Array }} An object containing the showRowNumbers flag and tableColumns array.
     */
    getLocalPropsFromElementAttributes(element) {
        const showRowNumbers = this.getShowRowNumbersFromElementAttributes(element);
        const tableColumns = this.getTableColumnsFromElementAttributes(element);
        return {
            showRowNumbers,
            tableColumns
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
     * Retrieves and parses the "tableColumns" attribute from a given DOM element.
     *
     * @param {Element} element - The DOM element from which to extract the "tableColumns" attribute.
     * @returns {Array} An array representing the parsed table columns, or an empty array if the attribute is missing or invalid.
     */
    getTableColumnsFromElementAttributes(element) {
        const tableColumns = element?.getAttribute("tableColumns");
        if (tableColumns) {
            try {
                return JSON.parse(tableColumns);
            } catch (error) {
                console.error("Failed to parse tableColumns attribute:", error);
            }
        }
        return [];
    }

    /**
     * Extracts and formats table data from the provided props and text resources.
     *
     * @param {Object} props - The properties object containing data for the table.
     * @param {Array} [textResources=[]] - Optional array of text resources for localization or display purposes.
     * @returns {Object} An object containing `data` with `tableHeaders` and `tableRows` arrays.
     */
    getFormDataFromProps(props, textResources = []) {
        const tableHeaders = this.getTableHeadersFromProps(props, textResources);
        const tableRows = this.getTableRowsFromProps(props, textResources);
        return {
            data: {
                tableHeaders,
                tableRows
            }
        };
    }

    /**
     * Generates table header definitions based on the provided props and optional text resources.
     *
     * @param {Object} props - The properties object containing table configuration.
     * @param {Array<Object>} [textResources=[]] - Optional array of text resource objects for localization.
     * @returns {Array<Object>} An array of table header objects, including a row number header if specified.
     */
    getTableHeadersFromProps(props, textResources = []) {
        const tableColumns = props?.tableColumns || [];
        if (tableColumns.length === 0) {
            return [];
        }
        const tableHeaders = getTableHeaders(tableColumns, textResources);
        if (props.showRowNumbers) {
            tableHeaders.unshift({
                text: getRowNumberTitle(props)
            });
        }
        return tableHeaders;
    }

    /**
     * Generates table rows from the provided props and optional text resources.
     *
     * @param {Object} props - The properties object containing form data and table configuration.
     * @param {Object[]} [textResources=[]] - Optional array of text resource objects for localization or display.
     * @returns {Array[]} An array of table rows, where each row is an array of cell objects. If `showRowNumbers` is true in props, each row will be prepended with a row number element.
     */
    getTableRowsFromProps(props, textResources = []) {
        const data = props?.formData?.data;
        const tableColumns = props?.tableColumns || [];
        const tableRows = getTableRows(tableColumns, textResources, data);
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
     * Retrieves validation messages for table headers based on the provided properties and text resources.
     *
     * @param {Object} props - The properties object, expected to contain `tableColumns`.
     * @param {Array} [textResources=[]] - An optional array of text resources used for validation.
     * @returns {Array} An array of validation messages for the table headers.
     */
    getValidationMessagesFromProps(props, textResources = []) {
        return validateTableHeadersTextResourceBindings(props?.tableColumns, textResources);
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
