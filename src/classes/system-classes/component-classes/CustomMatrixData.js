// Dependencies
import { getTextResourceFromResourceBinding, hasValue } from "@arkitektum/altinn-studio-custom-components-utils";

// Classes
import CustomComponent from "../CustomComponent.js";

// Global functions
import { getTableHeaders, getTableRows } from "../../../functions/tableHelpers.js";
import { hasValidationMessages, validateTableHeadersTextResourceBindings } from "../../../functions/validations.js";
import { getComponentDataValue } from "../../../functions/helpers.js";
import { instantiateComponent } from "../../../functions/componentHelpers.js";

/**
 * CustomMatrixData is a custom component class for rendering and managing table data.
 * It handles extraction of matrix headers and rows from form data, manages validation messages,
 * and provides resource values for rendering.
 *
 * @class
 * @extends CustomComponent
 *
 * @param {Object} props - The properties object containing configuration, data, and resource bindings.
 * @property {boolean} isEmpty - Indicates if the matrix data is empty.
 * @property {Array} validationMessages - Validation messages for the matrix headers.
 * @property {boolean} hasValidationMessages - Indicates if there are any validation messages.
 * @property {Object} resourceValues - Contains resource values for title and data to be displayed.
 *
 * @method getValueFromFormData Extracts and returns matrix headers and rows from the provided form data props.
 * @method getMatrixHeadersFromProps Generates matrix header definitions based on the provided props and optional text resources.
 * @method getMatrixRowsFromProps Generates matrix rows from the provided props and data.
 * @method getValidationMessagesFromProps Retrieves validation messages for matrix headers based on the provided properties and text resources.
 * @method removeEmptyMatrixRows Removes empty rows from a matrix. A row is considered empty if all its cells are empty.
 * @method hasContent Checks if the provided formData object contains matrix row data.
 */
export default class CustomMatrixData extends CustomComponent {
    constructor(props) {
        super(props);
        this.order = {
            key: props?.order?.key || null,
            direction: props?.order?.direction || "asc"
        };
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
     * Extracts and returns matrix headers and rows from the provided form data props.
     *
     * @param {Object} props - The properties containing form data and configuration for the matrix.
     * @returns {{ matrixHeaders: Array, matrixRows: Array }} An object containing the extracted matrix headers and rows.
     */
    getValueFromFormData(props) {
        const data = getComponentDataValue(props);
        if (!hasValue(data)) {
            return null;
        }

        const matrixHeaders = this.getMatrixHeadersFromProps(props);

        let sortedRows = data;
        if (this.order.key && Array.isArray(data)) {
            sortedRows = this.sortRowsByKey(this.order.key, this.order?.direction, data);
        }

        const matrixRows = this.getMatrixRowsFromProps(props, sortedRows);
        return {
            matrixHeaders,
            matrixRows
        };
    }

    /**
     * Sorts the provided rows based on the specified sort key and direction.
     *
     * @param {string} sortKey - The key to sort the rows by.
     * @param {string} direction - The sort direction, either "asc" or "desc".
     * @param {Array<Object>} sortedRows - The rows to be sorted.
     * @returns {Array<Object>} The sorted rows.
     */
    sortRowsByKey(sortKey, direction, sortedRows) {
        sortedRows.sort((a, b) => {
            let aValue = a[sortKey];
            let bValue = b[sortKey];

            const aNum = parseFloat(aValue);
            const bNum = parseFloat(bValue);

            const aIsNum = !isNaN(aNum);
            const bIsNum = !isNaN(bNum);

            if (aIsNum && bIsNum) {
                if (aNum < bNum) return direction === "asc" ? -1 : 1;
                if (aNum > bNum) return direction === "asc" ? 1 : -1;
                return 0;
            }

            // fallback to string comparison
            if (aValue < bValue) return direction === "asc" ? -1 : 1;
            if (aValue > bValue) return direction === "asc" ? 1 : -1;
            return 0;
        });

        return sortedRows;
    }

    /**
     * Generates matrix header definitions based on the provided props and optional text resources.
     *
     * @param {Object} props - The properties object containing matrix configuration.
     * @returns {Array<Object>} An array of matrix header objects, including a row number header if specified.
     */
    getMatrixHeadersFromProps(props) {
        const tableColumns = props?.tableColumns || [];
        if (tableColumns.length === 0) {
            return [];
        }
        const tableHeaders = getTableHeaders(tableColumns);
        return tableHeaders;
    }

    /**
     * Generates matrix rows from the provided props and data.
     *
     * @param {Object} props - The properties object, which may include tableColumns and showRowNumbers.
     * @param {Array} data - The data to be displayed in the matrix rows.
     * @returns {Array} An array of matrix rows, optionally including row numbers as the first column.
     */
    getMatrixRowsFromProps(props, data) {
        const tableColumns = props?.tableColumns || [];
        const tableRows = getTableRows(tableColumns, data);
        const notEmptyMatrixRows = this.removeEmptyMatrixRows(tableRows);
        return notEmptyMatrixRows;
    }

    /**
     * Retrieves validation messages for matrix headers based on the provided properties and text resources.
     *
     * @param {Object} props - The properties object, expected to contain `tableColumns`.
     * @returns {Array} An array of validation messages for the matrix headers.
     */
    getValidationMessagesFromProps(props) {
        return validateTableHeadersTextResourceBindings(props?.tableColumns);
    }

    /**
     * Removes empty matrix rows from the provided array of matrix rows.
     * A matrix row is considered empty if all its cells are empty, as determined by the `instantiateComponent(matrixCell)?.isEmpty` check.
     *
     * @param {Array<Array<any>>} matrixRows - An array of matrix rows, where each row is an array of matrix cell objects.
     * @returns {Array<Array<any>>} A new array containing only the non-empty matrix rows.
     */
    removeEmptyMatrixRows(matrixRows) {
        return Array.isArray(matrixRows)
            ? matrixRows
                  .map((matrixRow) => {
                      const notEmptyMatrixCells = matrixRow.filter((matrixCell) => {
                          return !instantiateComponent(matrixCell)?.isEmpty;
                      });
                      return notEmptyMatrixCells.length > 0 ? matrixRow : null;
                  })
                  .filter((matrixRow) => matrixRow !== null)
            : []; // Return empty array if matrixRows is not an array
    }

    /**
     * Checks if the provided formData object contains matrix row data.
     *
     * @param {Object} formData - The form data object to check.
     * @param {Object} [formData.data] - The data property of the form data.
     * @param {*} [formData.data.matrixRows] - The matrixRows property to check for content.
     * @returns {boolean} Returns true if matrixRows has a value, otherwise false.
     */
    hasContent(formData) {
        return hasValue(formData);
    }

    /**
     * Retrieves the component usage, which is an array of custom component names that this class utilizes.
     *
     * @returns {Array<string>} An array of custom component names used by this class.
     */
    getComponentUsage() {
        return ["custom-feedbacklist-validation-messages", "custom-matrix"];
    }
}
