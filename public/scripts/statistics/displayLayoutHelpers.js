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
 * @param {Array<Object>} displayLayouts - The array of app/subform display layout entries.
 * @returns {Array<Object>} An array of per-layout entries, each with `appOwner`, `appName`, `dataType`, `layoutName`,
 *   `layout`, and (where applicable) `isSubform`.
 */
export function flattenAppLayouts(displayLayouts) {
    if (!Array.isArray(displayLayouts)) {
        return [];
    }
    return displayLayouts.flatMap((entry) => {
        // Standalone subform entries keep their single `layout` and are treated as a single display layout.
        if (!Array.isArray(entry?.displayLayouts)) {
            return [{ ...entry, layoutName: entry?.layoutName ?? DEFAULT_LAYOUT_NAME }];
        }
        return entry.displayLayouts.map((displayLayout) => ({
            appOwner: entry.appOwner,
            appName: entry.appName,
            dataType: entry.dataType,
            isSubform: entry.isSubform,
            layoutName: displayLayout.name,
            path: displayLayout.path,
            layout: displayLayout.layout
        }));
    });
}
