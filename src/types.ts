/**
 * The shapes this package passes between its own parts.
 *
 * They describe how a component is configured and what a table builds out of that, rather than the domain data a
 * form carries. The domain shapes live in the data classes, one per model.
 */

/**
 * One column of a table or matrix, as a component declares it.
 *
 * Everything is optional because a column says only what it needs: most name a tag and a binding, and the rest
 * take their meaning from the element that ends up rendering the cell.
 */
export interface TableColumn {
    /** Which element renders the cell. Falls back to a plain data field when a column does not say. */
    tagName?: string;
    /** Where in the row the value comes from. */
    dataKey?: string;
    /** Several places, for a cell built out of more than one value. */
    dataKeys?: string[];
    /** What separates those values once read. */
    separator?: string;
    /** A value written into the column rather than read from the row. */
    value?: unknown;
    format?: string;
    hideTitle?: boolean;
    inline?: boolean;
    enableLinks?: boolean;
    itemKey?: string;
    itemTermKey?: string;
    itemDescriptionKey?: string;
    /**
     * Which text resource the column heading and its empty-field text come from.
     *
     * The values are binding ids, and any one of them may be absent: a component builds these from its own
     * bindings, which need not carry the one a column asks for.
     */
    resourceBindings?: Record<string, string | undefined>;
    /** Checked by the header validation, which reports a binding that names a text resource nothing provides. */
    textResourceBindings?: Record<string, string | undefined>;
    styleOverride?: Record<string, string>;
}

/**
 * One field carried alongside a log entry, naming something about where the entry came from.
 *
 * Shaped as the client logger declares it. A value can be missing in practice, when whatever it names could not be
 * worked out, and the one place that happens says so where the fields are built.
 */
export interface LogCustomField {
    key: string;
    value: string;
}

/** A column heading, once its text resource has been resolved. */
export interface TableHeader {
    /** Absent when the column named no heading binding, which is how a column renders without one. */
    text: string | undefined;
    styleOverride?: Record<string, string>;
}

/**
 * What one cell is handed, which is what any component is handed: the element to render, where its value came
 * from, and how to label it.
 */
export interface CellComponentProps {
    tagName?: string;
    format?: string;
    hideTitle?: boolean;
    isChildComponent?: boolean;
    itemTermKey?: string;
    itemDescriptionKey?: string;
    resourceBindings?: Record<string, string | undefined>;
    /** Always built, because a cell always has a value to carry even when that value is nothing. */
    resourceValues: {
        data?: unknown;
        /** Added only when the column names one, so a cell with nothing to show says what it is missing. */
        emptyFieldText?: unknown;
        title?: unknown;
    };
    styleOverride?: Record<string, string>;
}
