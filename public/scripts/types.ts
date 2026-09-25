/**
 * The shapes the development pages pass between their own parts.
 *
 * These describe what the local API answers with and what the pages build out of it. They are not the components'
 * own types: a component takes its configuration from element attributes, which src/types.ts describes.
 */

/**
 * A value the local development API answered with.
 *
 * The statistics page walks app metadata, display layouts and resource usage whose shape follows Altinn Studio's
 * rather than anything this repository declares. Restating that schema here would duplicate something owned
 * elsewhere and go stale with it, so what comes back is left open and the readers say what they expect.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ApiValue = any;

/** One component as a layout declares it: the kind of component it is, and whatever that kind reads. */
export interface LayoutComponent {
    id?: string;
    type?: string;
    tagName?: string;
    textResourceBindings?: ApiValue;
    dataModelBindings?: ApiValue;
    tableColumns?: ApiValue;
    /** A layout carries whatever a component declared, which is more than any one reader looks at. */
    [key: string]: ApiValue;
}

/** A layout file: the components on a page, under the wrapper Altinn Studio writes them in. */
export interface Layout {
    data?: { layout?: LayoutComponent[] };
    [key: string]: ApiValue;
}

/** One named display layout of an app, as the API hands it over. */
export interface DisplayLayout {
    name?: string;
    path?: string;
    layout?: Layout;
}

/**
 * One entry of the display layouts the API answers with.
 *
 * An app entry holds several named layouts; a standalone subform entry carries a single one instead, which is what
 * flattenAppLayouts evens out.
 */
export interface DisplayLayoutEntry {
    appOwner?: string;
    appName?: string;
    dataType?: string;
    isSubform?: boolean;
    layoutName?: string;
    path?: string;
    layout?: Layout;
    displayLayouts?: DisplayLayout[];
    [key: string]: ApiValue;
}

/** One layout of one app, after the app entries have been flattened to one entry per layout. */
export interface FlattenedLayout {
    appOwner?: string;
    appName?: string;
    dataType?: string;
    isSubform?: boolean;
    layoutName?: string;
    path?: string;
    layout?: Layout;
    [key: string]: ApiValue;
}
