import type { FlattenedLayout, LayoutComponent } from "../types.ts";
import type { DataModelBindingKeys } from "../../../src/types.ts";
// Dependencies
import { customElementTagNames } from "@arkitektum/altinn-studio-custom-components-utils";

// Global functions
import { getComponentForTagName } from "../../../src/functions/componentHelpers.ts";

/** One use of a component in a layout whose `dataModelBindings` differ from what the component reads. */
export interface DataModelBindingDriftUsage {
    id: string | null;
    appOwner?: string;
    appName?: string;
    layoutName?: string;
    subformAppName?: string;
    /** Keys the component reads that the layout does not bind. A `oneOf` group bound by none of its keys is one entry, its keys joined by "or". */
    missing: string[];
    /** Keys the layout binds that the component does not read, because an earlier key in the same `oneOf` group is bound and read instead. */
    ignored: { key: string; usedInstead: string }[];
    /** Keys the layout binds that the component no longer reads, each with what replaced it. */
    deprecated: { key: string; hint: string }[];
    /** Keys the layout binds that the component neither reads nor used to read. */
    unknown: string[];
}

/**
 * Reads the binding keys a component class declares, for the components that declare them.
 *
 * @param {string} tagName - The component's tag name.
 * @returns {DataModelBindingKeys|null} The declared keys, or null when the component declares none.
 */
function getDataModelBindingKeys(tagName: string): DataModelBindingKeys | null {
    const ComponentClass = getComponentForTagName(tagName) as { dataModelBindingKeys?: DataModelBindingKeys } | null;
    return ComponentClass?.dataModelBindingKeys || null;
}

/**
 * Compares the keys a layout binds for one component with the keys the component declares.
 *
 * @param {Object} component - The component as the layout declares it.
 * @param {DataModelBindingKeys} bindingKeys - The keys the component declares.
 * @returns {Object} The missing, ignored, deprecated and unknown keys.
 */
export function getDataModelBindingDrift(component: LayoutComponent, bindingKeys: DataModelBindingKeys) {
    const boundKeys = Object.keys(component?.dataModelBindings || {});
    const oneOfGroups = bindingKeys.oneOf || [];
    const knownKeys = [...bindingKeys.expected, ...oneOfGroups.flat(), ...(bindingKeys.optional || [])];
    return {
        missing: [
            ...bindingKeys.expected.filter((key) => !boundKeys.includes(key)),
            ...oneOfGroups.filter((group) => !group.some((key) => boundKeys.includes(key))).map((group) => group.join(" or "))
        ],
        ignored: oneOfGroups.flatMap((group) => {
            const [usedKey, ...ignoredKeys] = group.filter((key) => boundKeys.includes(key));
            return ignoredKeys.map((key) => ({ key, usedInstead: usedKey! }));
        }),
        deprecated: Object.entries(bindingKeys.deprecated)
            .filter(([key]) => boundKeys.includes(key))
            .map(([key, hint]) => ({ key, hint })),
        unknown: boundKeys.filter((key) => !knownKeys.includes(key) && !Object.hasOwn(bindingKeys.deprecated, key))
    };
}

/**
 * Finds every use of a component whose layout binds other `dataModelBindings` than the component reads, across all layouts.
 *
 * Only components that declare their binding keys are checked. Each of them is in the result, with no usages when no layout binds other keys than it reads or no layout uses it, so a page can tell a component without drift from one that is not checked.
 *
 * @param {Array} layouts - The flattened layouts, one entry per layout of each app.
 * @returns {Array} One entry per checked component, `{ tagName, usages }`, sorted by tag name, the same shape as the component usage.
 */
export function getDataModelBindingDriftForAllLayouts(layouts: FlattenedLayout[] | undefined) {
    const driftByTagName: Map<string, DataModelBindingDriftUsage[]> = new Map();
    for (const tagName of customElementTagNames) {
        if (getDataModelBindingKeys(tagName)) driftByTagName.set(tagName, []);
    }
    for (const layout of layouts || []) {
        const componentsInLayout = Array.isArray(layout?.layout?.data?.layout) ? layout.layout.data.layout : [];
        for (const component of componentsInLayout) {
            if (!component?.tagName?.length || component?.type !== "Custom") continue;
            const tagName = component.tagName.toLowerCase();
            const bindingKeys = getDataModelBindingKeys(tagName);
            if (!bindingKeys) continue;
            const drift = getDataModelBindingDrift(component, bindingKeys);
            if (!drift.missing.length && !drift.ignored.length && !drift.deprecated.length && !drift.unknown.length) continue;
            const usages = driftByTagName.get(tagName) || [];
            usages.push({
                id: component.id || null,
                appOwner: layout.appOwner,
                appName: layout.appName,
                layoutName: layout.layoutName,
                ...(layout.subformAppName ? { subformAppName: layout.subformAppName } : {}),
                ...drift
            });
            driftByTagName.set(tagName, usages);
        }
    }
    return [...driftByTagName.entries()].map(([tagName, usages]) => ({ tagName, usages })).sort((a, b) => a.tagName.localeCompare(b.tagName));
}
