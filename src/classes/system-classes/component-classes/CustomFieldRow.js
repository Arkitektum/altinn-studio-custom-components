// Dependencies
import { getTextResourceFromResourceBinding, getValueFromDataKey, hasValue } from "@arkitektum/altinn-studio-custom-components-utils";

// Classes
import CustomComponent from "../CustomComponent.js";

// Global functions
import { instantiateComponent } from "../../../functions/componentHelpers.js";

/**
 * CustomFieldRow renders a horizontal row of fields, one cell per column definition.
 *
 * Unlike a table, the cells come from separate data model bindings (one per column),
 * are laid out side by side on a single line, and keep their titles (the label is shown
 * above the value, mirroring the reference row of a formal letter).
 *
 * Each column reads its value from `formData[column.dataKey]` and is rendered by an
 * arbitrary child component (`column.tagName`, defaults to `custom-field-data`), so a
 * column can format dates, kommunens saksnummer, etc.
 *
 * @class
 * @extends CustomComponent
 *
 * @param {Object} props - The properties object.
 * @param {Object} [props.formData] - Resolved values, one entry per dataModelBindings key.
 * @param {Array<Object>} [props.tableColumns] - Column definitions: `{ dataKey, tagName, format, resourceBindings, styleOverride }`.
 * @param {Object} [props.resourceBindings] - Resource bindings (optional row caption via `title`).
 *
 * @property {boolean} isEmpty - True when every cell is empty.
 * @property {Object} resourceValues - `{ title, data }` where `data` is the array of cell component props.
 */
export default class CustomFieldRow extends CustomComponent {
    constructor(props) {
        super(props);
        const cells = this.getCellsFromProps(props);
        this.isEmpty = !this.hasContent(cells);
        this.resourceValues = {
            title: hasValue(props?.resourceValues?.title)
                ? props?.resourceValues?.title
                : getTextResourceFromResourceBinding(props?.resourceBindings?.title),
            data: cells
        };
    }

    /**
     * Builds the cell component props from the column definitions and resolved form data.
     *
     * @param {Object} props - The properties object containing `tableColumns` and `formData`.
     * @returns {Array<Object>} An array of child component props, one per column.
     */
    getCellsFromProps(props) {
        const tableColumns = Array.isArray(props?.tableColumns) ? props.tableColumns : [];
        const formData = props?.formData || {};
        return tableColumns.map((column) => {
            const cellData = hasValue(column?.value) ? column.value : getValueFromDataKey(formData, column?.dataKey);
            return {
                tagName: column?.tagName || "custom-field-data",
                isChildComponent: true,
                format: column?.format,
                enableLinks: column?.enableLinks,
                inline: column?.inline,
                resourceBindings: column?.resourceBindings,
                resourceValues: { data: cellData },
                styleOverride: column?.styleOverride
            };
        });
    }

    /**
     * Determines whether the row has any non-empty cell.
     *
     * @param {Array<Object>} cells - The cell component props.
     * @returns {boolean} True if at least one cell is non-empty.
     */
    hasContent(cells) {
        return Array.isArray(cells) && cells.some((cell) => !instantiateComponent(cell)?.isEmpty);
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
