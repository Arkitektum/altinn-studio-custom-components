// Dependencies
import { getTextResourceFromResourceBinding, getValueFromDataKey, hasValue } from "@arkitektum/altinn-studio-custom-components-utils";

// Classes
import CustomComponent from "../CustomComponent.js";

// Global functions
import { instantiateComponent } from "../../../functions/componentHelpers.js";

/**
 * CustomFieldGrid renders a vertical key/value table (label column + value column),
 * one row per column definition — mirroring the "Felt | Verdi" table of a formal letter.
 *
 * Each row reads its value from `formData[column.dataKey]` (one data model binding per row)
 * or from a static `column.value`, and is rendered by an arbitrary child component
 * (`column.tagName`, defaults to `custom-field-data`) so a row can format dates, koder,
 * kommunens saksnummer, party names, etc. Empty rows are omitted.
 *
 * @class
 * @extends CustomComponent
 *
 * @param {Object} props - The properties object.
 * @param {Object} [props.formData] - Resolved values, one entry per dataModelBindings key.
 * @param {Array<Object>} [props.tableColumns] - Row definitions: `{ dataKey | value, tagName, format, resourceBindings, styleOverride }`.
 * @param {Object} [props.resourceBindings] - Resource bindings (optional caption via `title`).
 *
 * @property {boolean} isEmpty - True when every row is empty.
 * @property {Object} resourceValues - `{ title, data }` where `data` is the array of row descriptors.
 */
export default class CustomFieldGrid extends CustomComponent {
    constructor(props) {
        super(props);
        const rows = this.getRowsFromProps(props);
        this.isEmpty = !this.hasContent(rows);
        this.resourceValues = {
            title: hasValue(props?.resourceValues?.title)
                ? props?.resourceValues?.title
                : getTextResourceFromResourceBinding(props?.resourceBindings?.title),
            termHeader: getTextResourceFromResourceBinding(props?.resourceBindings?.termHeader),
            valueHeader: getTextResourceFromResourceBinding(props?.resourceBindings?.valueHeader),
            data: rows
        };
    }

    /**
     * Builds the row descriptors from the column definitions and resolved form data.
     *
     * @param {Object} props - The properties object containing `tableColumns` and `formData`.
     * @returns {Array<Object>} An array of `{ term, valueComponent, isEmpty }` descriptors.
     */
    getRowsFromProps(props) {
        const tableColumns = Array.isArray(props?.tableColumns) ? props.tableColumns : [];
        const formData = props?.formData || {};
        return tableColumns.map((column) => {
            const cellData = this.getCellData(column, formData);
            // The grid renders the label (term) itself, so the value child must NOT render its own
            // title — otherwise components that ignore `hideTitle` (e.g. custom-field-kommunens-saksnummer)
            // would duplicate the label inside the value cell.
            const valueComponent = {
                tagName: column?.tagName || "custom-field-data",
                isChildComponent: true,
                hideTitle: true,
                format: column?.format,
                enableLinks: column?.enableLinks,
                inline: column?.inline,
                resourceBindings: column?.resourceBindings,
                resourceValues: { data: cellData },
                styleOverride: column?.styleOverride
            };
            return {
                term: getTextResourceFromResourceBinding(column?.resourceBindings?.title),
                valueComponent,
                isEmpty: !!instantiateComponent(valueComponent)?.isEmpty
            };
        });
    }

    /**
     * Resolves the value for a single grid row.
     *
     * Precedence:
     *  1. `column.value` — a static literal value.
     *  2. `column.dataKeys` — an array of binding keys whose resolved values are
     *     joined with `column.separator` (default " / "); empty parts are dropped.
     *     Used for composite fields such as Arealplan-ID (kommunenr / landkode / planId).
     *  3. `column.dataKey` — a single binding key.
     *
     * @param {Object} column - The column definition.
     * @param {Object} formData - The resolved form data (one entry per dataModelBindings key).
     * @returns {*} The cell value, or undefined when empty (so the row is hidden).
     */
    getCellData(column, formData) {
        if (hasValue(column?.value)) {
            return column.value;
        }
        if (Array.isArray(column?.dataKeys)) {
            const separator = hasValue(column?.separator) ? column.separator : " / ";
            const parts = column.dataKeys.map((dataKey) => getValueFromDataKey(formData, dataKey)).filter((part) => hasValue(part));
            return parts.length ? parts.join(separator) : undefined;
        }
        return getValueFromDataKey(formData, column?.dataKey);
    }

    /**
     * Determines whether the grid has any non-empty row.
     *
     * @param {Array<Object>} rows - The row descriptors.
     * @returns {boolean} True if at least one row is non-empty.
     */
    hasContent(rows) {
        return Array.isArray(rows) && rows.some((row) => !row.isEmpty);
    }

    /**
     * Retrieves the component usage, which is an array of custom component names that this class utilizes.
     *
     * @returns {Array<string>} An array of custom component names used by this class.
     */
    getComponentUsage() {
        return ["custom-field-data"];
    }
}
