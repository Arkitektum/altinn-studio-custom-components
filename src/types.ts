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
 * One entry in a component's resourceBindings.
 *
 * A leaf component writes a binding id straight under the key; a composite one writes a group of ids under it, one
 * per part it renders. Both shapes reach the same attribute and nothing narrows them at the boundary, so this is
 * left open. Writing the union instead would put a narrowing at several hundred read sites without making one of
 * them safer: the keys come from configuration, so a wrong key reads as absent either way.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ResourceBindingValue = any;

/**
 * A group of binding ids, as a component builds one for each part it renders.
 *
 * This is the shape a component class produces, as against the open one it is configured with: every id it names
 * is a key into the text resources, and any of them may be left out.
 */
export interface ResourceBindingGroup {
    title?: string;
    emptyFieldText?: string;
    [key: string]: string | undefined;
}

/**
 * Everything a component can be configured with, which is what an element's attributes are read into and what a
 * component class is constructed from.
 *
 * Every field is optional: a component says only what it needs, and the rest take their meaning from the element
 * that renders it. The values are whatever the attribute parsed to, which is why several are left unknown.
 */
export interface ComponentProps {
    tagName?: string;
    /** The element's id, which is also what a validation message names the component by. */
    id?: string;
    /** Worked out by a parent that already read the data, so a child need not read it again. */
    isEmpty?: boolean;
    text?: unknown;
    texts?: unknown;
    inline?: boolean;
    /**
     * Whether to hide the title.
     *
     * Widened to the string form because the guards in the component classes accept `"true"` as well as `true`.
     * Props read off an element are parsed to a boolean, so the string only arises if something hands these props
     * over directly.
     */
    hideTitle?: boolean | string;
    /** Whether to hide the component when it resolves to nothing. Accepts the string form, as hideTitle does. */
    hideIfEmpty?: boolean | string;
    hideOrgNr?: boolean;
    enableLinks?: boolean;
    showRowNumbers?: boolean;
    isChildComponent?: boolean;
    size?: string;
    format?: string;
    feedbackType?: string;
    order?: ComponentOrder;
    itemKey?: string;
    itemTermKey?: string;
    itemDescriptionKey?: string;
    dataItemKey?: string;
    dataTitleItemKey?: string;
    formData?: Record<string, unknown>;
    tableColumns?: TableColumn[];
    resourceBindings?: Record<string, ResourceBindingValue>;
    resourceValues?: Record<string, unknown>;
    styleOverride?: Record<string, string>;
}

/**
 * How a table or matrix is sorted: which column, and which way.
 *
 * Both are optional because a component need not say: an unsorted one names no key, and a component that names one
 * without a direction is sorted ascending.
 */
export interface ComponentOrder {
    key?: string | null;
    direction?: string;
}

/**
 * The three values a boolean component can resolve to, before its condition picks one of them.
 *
 * Read either from the resource values, for a child component, or from the form data. Each is left unknown: what a
 * component shows for true is whatever its layout put there.
 */
export interface BooleanDataValues {
    trueData?: unknown;
    falseData?: unknown;
    defaultData?: unknown;
}

/** The same three, for a boolean component that shows a text resource rather than a value from the form data. */
export interface BooleanTextValues {
    trueText?: unknown;
    falseText?: unknown;
    defaultText?: unknown;
}

/**
 * What a component class answers once it has been built from an element's props, and what a renderer is handed.
 *
 * The classes are one per component and share no base beyond CustomComponent, so this names what every caller can
 * read off one: the few things CustomComponent works out, and the configuration it carries over from the props.
 *
 * The resource values and bindings are left open. A renderer goes with exactly one component class and reads what
 * that class put there, which differs per class and runs as deep as the model the data came from; modelling it
 * would mean typing each class's resourceValues.data as the data class it holds, which is a change to the classes
 * rather than to their renderers.
 */
export interface InstantiatedComponent {
    /** Whether the component resolved to nothing, which is what decides if it hides itself. */
    isEmpty?: boolean;
    /** Carried straight over from the props, string form and all, and read as a truthy value. */
    hideIfEmpty?: boolean | string;
    /** Messages gathered while building it, keyed by severity. */
    validationMessages?: unknown;
    hasValidationMessages?: unknown;
    resourceValues?: ResourceBindingValue;
    resourceBindings?: ResourceBindingValue;
    // Carried over from the props by CustomComponent, and read again by whatever renders the component.
    tagName?: string;
    inline?: boolean;
    hideTitle?: boolean | string;
    size?: string;
    styleOverride?: Record<string, string>;
    isChildComponent?: boolean;
    feedbackType?: string;
    hideOrgNr?: boolean;
    format?: string;
    enableLinks?: boolean;
    order?: ComponentOrder;
    /** Which list element a list component renders as. */
    listType?: string;
    /** The alt text an image component carries, which the element takes as its own attribute. */
    alt?: string;
    // Worked out by CustomDispensasjonsvarsel, and read by the renderer that decides what a varsel shows.
    isPlanBestemmelsesType?: boolean;
    isAndrePlanbestemmelser?: boolean;
    isAnnetLovForskrift?: boolean;
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

/**
 * One text resource binding, naming the title to show for a single entry.
 *
 * The list classes under system-classes/data-classes are handed one of these per entry they can produce, and a
 * binding may be absent: a component builds them from its own bindings, which need not carry every entry.
 */
export interface TitleResourceBinding {
    title?: string;
}

/** A column heading, once its text resource has been resolved. */
export interface TableHeader {
    /** Absent when the column named no heading binding, which is how a column renders without one. */
    text: string | undefined;
    styleOverride?: Record<string, string>;
}

/** What a table component is handed to draw: the headings, and one array of cells per row. */
export interface TableData {
    tableHeaders?: TableHeader[];
    tableRows?: CellComponentProps[][];
}

/** The same for a matrix, which names its two halves for itself. */
export interface MatrixData {
    matrixHeaders?: TableHeader[];
    matrixRows?: CellComponentProps[][];
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
