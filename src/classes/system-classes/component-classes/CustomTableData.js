// Classes
import CustomComponent from "../CustomComponent.js";

// Global functions
import { getComponentDataValue, getRowNumberTitle, getTextResourceFromResourceBinding, hasValue } from "../../../functions/helpers.js";
import { getTableHeaders, getTableRows } from "../../../functions/tableHelpers.js";
import { instantiateComponent } from "../../../functions/componentHelpers.js";
import { hasValidationMessages, validateTableHeadersTextResourceBindings } from "../../../functions/validations.js";

/**
 * CustomTableData is a custom component class for rendering and managing table data.
 * It handles extraction of table headers and rows from form data, manages validation messages,
 * and provides resource values for rendering.
 *
 * @class
 * @extends CustomComponent
 *
 * @param {Object} props - The properties object containing configuration, data, and resource bindings.
 * @property {boolean} isEmpty - Indicates if the table data is empty.
 * @property {Array} validationMessages - Validation messages for the table headers.
 * @property {boolean} hasValidationMessages - Indicates if there are any validation messages.
 * @property {Object} resourceValues - Contains resource values for title and data to be displayed.
 *
 * @method getValueFromFormData Extracts and returns table headers and rows from the provided form data props.
 * @method getTableHeadersFromProps Generates table header definitions based on the provided props and optional text resources.
 * @method getTableRowsFromProps Generates table rows from the provided props and data.
 * @method getValidationMessagesFromProps Retrieves validation messages for table headers based on the provided properties and text resources.
 * @method removeEmptyTableRows Removes empty rows from a table. A row is considered empty if all its cells are empty.
 * @method hasContent Checks if the provided formData object contains table row data.
 */
export default class CustomTableData extends CustomComponent {
    constructor(props) {
        super(props);
        const data = this.getValueFromFormData(props);

        const isEmpty = !this.hasContent(data);
        const validationMessages = this.getValidationMessagesFromProps(props);

        this.isEmpty = isEmpty;
        this.validationMessages = validationMessages;
        this.hasValidationMessages = hasValidationMessages(validationMessages);

        this.resourceValues = {
            title: hasValue(props?.resourceValues?.title)
                ? props?.resourceValues?.title
                : getTextResourceFromResourceBinding(props?.resourceBindings?.title),
            data: isEmpty ? getTextResourceFromResourceBinding(props?.resourceBindings?.emptyFieldText) : data
        };
    }

    /**
     * Extracts and returns table headers and rows from the provided form data props.
     *
     * @param {Object} props - The properties containing form data and configuration for the table.
     * @returns {{ tableHeaders: Array, tableRows: Array }} An object containing the extracted table headers and rows.
     */
    getValueFromFormData(props) {
        const data = getComponentDataValue(props);
        if (!hasValue(data)) {
            return null;
        }
        const tableHeaders = this.getTableHeadersFromProps(props);
        const tableRows = this.getTableRowsFromProps(props, data);
        return {
            tableHeaders,
            tableRows
        };
    }

    /**
     * Generates table header definitions based on the provided props and optional text resources.
     *
     * @param {Object} props - The properties object containing table configuration.
     * @returns {Array<Object>} An array of table header objects, including a row number header if specified.
     */
    getTableHeadersFromProps(props) {
        const tableColumns = props?.tableColumns || [];
        if (tableColumns.length === 0) {
            return [];
        }
        const tableHeaders = getTableHeaders(tableColumns);
        if (props.showRowNumbers) {
            tableHeaders.unshift({
                text: getRowNumberTitle(props),
                styleOverride: { textAlign: "right" }
            });
        }
        return tableHeaders;
    }

    /**
     * Generates table rows from the provided props and data.
     *
     * @param {Object} props - The properties object, which may include tableColumns and showRowNumbers.
     * @param {Array} data - The data to be displayed in the table rows.
     * @returns {Array} An array of table rows, optionally including row numbers as the first column.
     */
    getTableRowsFromProps(props, data) {
        const tableColumns = props?.tableColumns || [];
        const tableRows = getTableRows(tableColumns, data);
        const notEmptyTableRows = this.removeEmptyTableRows(tableRows);
        if (props.showRowNumbers) {
            // Add a row number for each table row
            return notEmptyTableRows.map((tableRow, index) => {
                const rowNumberElement = {
                    tagName: "custom-field-data",
                    hideTitle: true,
                    isChildComponent: true,
                    resourceValues: {
                        data: index + 1
                    },
                    styleOverride: { textAlign: "right" }
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
     * @returns {Array} An array of validation messages for the table headers.
     */
    getValidationMessagesFromProps(props) {
        return validateTableHeadersTextResourceBindings(props?.tableColumns);
    }

    /**
     * Removes empty table rows from the provided array of table rows.
     * A table row is considered empty if all its cells are empty, as determined by the `instantiateComponent(tableCell)?.isEmpty` check.
     *
     * @param {Array<Array<any>>} tableRows - An array of table rows, where each row is an array of table cell objects.
     * @returns {Array<Array<any>>} A new array containing only the non-empty table rows.
     */
    removeEmptyTableRows(tableRows) {
        return Array.isArray(tableRows)
            ? tableRows
                  .map((tableRow) => {
                      const notEmptyTableCells = tableRow.filter((tableCell) => {
                          return !instantiateComponent(tableCell)?.isEmpty;
                      });
                      return notEmptyTableCells.length > 0 ? tableRow : null;
                  })
                  .filter((tableRow) => tableRow !== null)
            : []; // Return empty array if tableRows is not an array
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
        return hasValue(formData);
    }
}
