import type { ApiValue, DisplayLayoutEntry, FlattenedLayout } from "../types.ts";
import { MAIN_FORM_FILTER_VALUE } from "../filters.ts";

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

/**
 * The options for a form filter: every form, the main form, and each subform the selected app carries.
 *
 * With no app selected, the subforms are those carried by any app, so a subform can be followed across every app that
 * uses it. Each subform is offered once, in alphabetical order, labelled as the Display layouts page labels it.
 *
 * @param {Array<Object>} displayLayouts - The app/subform display layout entries the API answered with.
 * @param {string} [appOwner] - The owner of the selected app, if any.
 * @param {string} [appName] - The name of the selected app, if any.
 * @returns {Array<{ value: string, text: string }>} The options, "All forms" first.
 */
export function getFormFilterOptions(displayLayouts: DisplayLayoutEntry[] | undefined, appOwner?: string, appName?: string) {
    const apps = (Array.isArray(displayLayouts) ? displayLayouts : []).filter(
        (entry: DisplayLayoutEntry) => (!appOwner || entry?.appOwner === appOwner) && (!appName || entry?.appName === appName)
    );
    const subformAppNames: Set<string> = new Set(
        apps
            .flatMap((entry: DisplayLayoutEntry) => (Array.isArray(entry?.subForms) ? entry.subForms : []))
            .map((subForm: ApiValue) => subForm?.appName)
            .filter(Boolean)
    );
    return [
        { value: "", text: "All forms" },
        { value: MAIN_FORM_FILTER_VALUE, text: "Main form" },
        ...[...subformAppNames]
            .sort((a, b) => a.localeCompare(b))
            .map((subformAppName) => ({ value: subformAppName, text: `${subformAppName} (subform)` }))
    ];
}

/**
 * Replaces a select's options, keeping the current choice when it is still offered and falling back to the first
 * option when it is not.
 *
 * @param {HTMLSelectElement} selectElement - The select to fill.
 * @param {Array<{ value: string, text: string }>} options - The options to offer.
 * @param {string} selectedValue - The value to keep selected if it is among the options.
 * @returns {string} The value that ended up selected.
 */
export function setSelectOptions(selectElement: HTMLSelectElement, options: { value: string; text: string }[], selectedValue: string) {
    selectElement.replaceChildren(
        ...options.map((option) => {
            const optionElement = document.createElement("option");
            optionElement.value = option.value;
            optionElement.textContent = option.text;
            return optionElement;
        })
    );
    selectElement.value = options.some((option) => option.value === selectedValue) ? selectedValue : (options[0]?.value ?? "");
    return selectElement.value;
}
