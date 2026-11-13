import type { ApiValue, LayoutComponent } from "../types.ts";
import type { ComponentProps } from "../../../src/types.ts";
// Dependencies
import { customElementTagNames, getDataForComponent } from "@arkitektum/altinn-studio-custom-components-utils";

// Local functions
import { getDataModelBindingDrift, getDataModelBindingKeys } from "../statistics/dataModelBindingHelpers.ts";

// Global functions
import { type ResourceBindingKeys, getResourceBindingKeys, resourceBindingGroupsFromData } from "../../../src/functions/resourceBindingKeys.ts";
import { getComponentForTagName } from "../../../src/functions/componentHelpers.ts";

export interface LayoutFinding {
    component: string;
    severity: "warning" | "info";
    message: string;
}

const resourceBindingKeysCache: Map<string, ResourceBindingKeys | null> = new Map();

/**
 * The `resourceBindings` keys a component reads, found once per tag name by constructing it.
 *
 * @param {string} tagName - The component's tag name, in lower case.
 * @returns {ResourceBindingKeys | null} The keys it reads, or null when there is no component class for the tag name.
 */
function getResourceBindingKeysForTagName(tagName: string) {
    if (!resourceBindingKeysCache.has(tagName)) {
        const ComponentClass = getComponentForTagName(tagName) as (new (props: ComponentProps) => unknown) | null;
        resourceBindingKeysCache.set(tagName, ComponentClass ? getResourceBindingKeys(ComponentClass, tagName) : null);
    }
    return resourceBindingKeysCache.get(tagName) ?? null;
}

/**
 * Names a component in a finding: its id, or its tag name and position in the layout code when it has no id.
 *
 * @param {Object} component - The component.
 * @param {number} index - Its position in the layout code.
 * @returns {string} The name.
 */
export function getComponentLabel(component: LayoutComponent, index: number) {
    return component.id?.length ? component.id : `${component.tagName} #${index + 1}`;
}

/**
 * Finds `resourceBindings` keys the component never reads, and groups written as text.
 *
 * @param {Object} resourceBindings - The component's `resourceBindings`.
 * @param {Object} keys - The keys the component reads.
 * @param {boolean} hasGroupsFromData - Whether the component also reads groups named after its data, which any unknown key may be.
 * @returns {string[]} A message for each problem.
 */
export function getResourceBindingMessages(resourceBindings: ApiValue, keys: ResourceBindingKeys, hasGroupsFromData: boolean) {
    if (!resourceBindings || typeof resourceBindings !== "object") return [];
    const messages: string[] = [];
    for (const [key, value] of Object.entries(resourceBindings)) {
        if (!Object.hasOwn(keys, key)) {
            if (!hasGroupsFromData) messages.push(`resourceBindings.${key} is never read`);
            continue;
        }
        const keysInGroup = keys[key];
        if (!keysInGroup) continue;
        if (!value || typeof value !== "object") {
            messages.push(`resourceBindings.${key} should be an object with ${keysInGroup.join(", ")}`);
            continue;
        }
        for (const keyInGroup of Object.keys(value)) {
            if (!keysInGroup.includes(keyInGroup)) messages.push(`resourceBindings.${key}.${keyInGroup} is never read`);
        }
    }
    return messages;
}

/**
 * Finds data model bindings that point at nothing in the loaded data models.
 * A binding to a value the example data leaves out is reported too, which is why these findings are only information.
 *
 * @param {Object} dataModelBindings - The component's `dataModelBindings`.
 * @param {Array} dataModels - The data models loaded in devTools.
 * @param {string[]} [unreadKeys] - Binding keys the component does not read, which are not checked.
 * @returns {string[]} A message for each binding without a value.
 */
export function getBindingPathMessages(dataModelBindings: ApiValue, dataModels: ApiValue[], unreadKeys: string[] = []) {
    if (!dataModelBindings || typeof dataModelBindings !== "object" || !dataModels.length) return [];
    const messages: string[] = [];
    for (const [key, binding] of Object.entries(dataModelBindings)) {
        if (unreadKeys.includes(key)) continue;
        if (binding && typeof binding === "object") {
            const { dataType, field } = binding as { dataType?: string; field?: string };
            if (!dataModels.some((dataModel) => dataModel?.dataType === dataType)) {
                messages.push(`dataModelBindings.${key}: no data model has the data type "${dataType}"`);
                continue;
            }
            if (getDataForComponent({ dataModelBindings: { [key]: binding } }, dataModels)[key] === undefined) {
                messages.push(`dataModelBindings.${key}: no value at "${field}" in the "${dataType}" data model`);
            }
        } else if (typeof binding === "string") {
            if (getDataForComponent({ dataModelBindings: { [key]: binding } }, dataModels)[key] === undefined) {
                messages.push(`dataModelBindings.${key}: no value at "${binding}" in the main data model`);
            }
        }
    }
    return messages;
}

/**
 * Checks the components in the devTools layout code against what each component reads, and against the loaded data models.
 *
 * Warnings: a tag name that is not a custom component, the data model binding findings the statistics page reports (missing, ignored, deprecated, unknown), and `resourceBindings` the component never reads.
 * Information: bindings the component reads that have no value in the loaded data models.
 *
 * @param {Array} components - The components in the layout code.
 * @param {Array} dataModels - The data models loaded in devTools.
 * @returns {Array} The findings, in layout order.
 */
export function checkLayoutComponents(components: LayoutComponent[], dataModels: ApiValue[]): LayoutFinding[] {
    const findings: LayoutFinding[] = [];
    components.forEach((component, index) => {
        if (!component?.tagName) return;
        const label = getComponentLabel(component, index);
        const warn = (message: string) => findings.push({ component: label, severity: "warning", message });
        const tagName = component.tagName.toLowerCase();
        if (!customElementTagNames.includes(tagName)) {
            warn(`${component.tagName} is not a custom component`);
            return;
        }
        const bindingKeys = getDataModelBindingKeys(tagName);
        const unreadBindingKeys: string[] = [];
        if (bindingKeys) {
            const drift = getDataModelBindingDrift(component, bindingKeys);
            drift.missing.forEach((key) => warn(`dataModelBindings.${key} is missing`));
            drift.ignored.forEach(({ key, usedInstead }) => warn(`dataModelBindings.${key} is ignored, ${usedInstead} is used instead`));
            drift.deprecated.forEach(({ key, hint }) => warn(`dataModelBindings.${key} is deprecated: ${hint}`));
            drift.unknown.forEach((key) => warn(`dataModelBindings.${key} is never read`));
            unreadBindingKeys.push(...drift.unknown, ...drift.ignored.map(({ key }) => key));
        }
        const resourceBindingKeys = getResourceBindingKeysForTagName(tagName);
        if (resourceBindingKeys) {
            getResourceBindingMessages(
                component.resourceBindings,
                resourceBindingKeys,
                Object.hasOwn(resourceBindingGroupsFromData, tagName)
            ).forEach(warn);
        }
        getBindingPathMessages(component.dataModelBindings, dataModels, unreadBindingKeys).forEach((message) =>
            findings.push({ component: label, severity: "info", message })
        );
    });
    return findings;
}
