import type { ApiValue, DisplayLayoutEntry, FlattenedLayout } from "../types.ts";
/**
 * The layout name used for entries that do not declare a named display layout (e.g. standalone subforms).
 */
export const DEFAULT_LAYOUT_NAME = "DisplayLayout";

/**
 * Flattens app display layout entries into one entry per display layout.
 *
 * Each app entry may hold several named display layouts in its `displayLayouts` array. This helper expands those into
 * individual per-layout entries, tagging each with its `layoutName`, so that the per-layout aggregators
 * (component usage, resource usage) can process them uniformly. Standalone subform entries (which carry a single
 * `layout` instead of a `displayLayouts` array) pass through as a single entry with a default layout name.
 *
 * The subforms an app carries in its `subForms` array are expanded too, one entry each, credited to that app and named
 * after the subform app. These are the layouts fetched from the app's own repository, so they are what the app actually
 * uses. A subform whose layout could not be fetched is left out, since there is nothing in it to count.
 *
 * @param {Array<Object>} displayLayouts - The array of app/subform display layout entries.
 * @returns {Array<Object>} An array of per-layout entries, each with `appOwner`, `appName`, `dataType`, `layoutName`,
 *   `layout`, and (where applicable) `isSubform` and `subformAppName`.
 */
export function flattenAppLayouts(displayLayouts: DisplayLayoutEntry[] | undefined) {
    if (!Array.isArray(displayLayouts)) {
        return [];
    }
    return displayLayouts.flatMap((entry: ApiValue) => {
        // Standalone subform entries keep their single `layout` and are treated as a single display layout.
        if (!Array.isArray(entry?.displayLayouts)) {
            return [{ ...entry, layoutName: entry?.layoutName ?? DEFAULT_LAYOUT_NAME }];
        }
        const mainLayouts = entry.displayLayouts.map((displayLayout: FlattenedLayout | undefined) => ({
            appOwner: entry.appOwner,
            appName: entry.appName,
            dataType: entry.dataType,
            isSubform: entry.isSubform,
            layoutName: displayLayout!.name,
            path: displayLayout!.path,
            layout: displayLayout!.layout
        }));
        const subformLayouts = (Array.isArray(entry.subForms) ? entry.subForms : [])
            .filter((subForm: ApiValue) => subForm?.layout)
            .map((subForm: ApiValue) => ({
                appOwner: entry.appOwner,
                appName: entry.appName,
                dataType: subForm.dataType,
                isSubform: true,
                subformAppName: subForm.appName,
                layoutName: subForm.appName,
                layout: subForm.layout
            }));
        return [...mainLayouts, ...subformLayouts];
    });
}
