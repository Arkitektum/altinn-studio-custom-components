import type { ComponentProps } from "../types.ts";
// Global functions
import { componentMap } from "./componentHelpers.ts";

/**
 * The `resourceBindings` keys a component reads from its layout: each key is either a text resource id (`null`) or a group, listed with the keys read in it.
 *
 * For example `custom-table-part` reads `{ title: null, emptyFieldText: null, navn: ["title", "emptyFieldText"], ... }`, so a layout may write `"resourceBindings": { "title": "...", "navn": { "title": "..." } }`.
 */
export type ResourceBindingKeys = Record<string, string[] | null>;

/**
 * Components that read `resourceBindings` groups named after their data, which cannot be found by constructing them without data, each with what the groups are named after.
 *
 * src/functions/resourceBindingKeys.test.ts fails when another component starts reading `resourceBindings` keys by computed name, so a new one cannot go unlisted.
 */
export const resourceBindingGroupsFromData: Record<string, string> = {
    "custom-grouplist-utfall-svar-type":
        'One group per utfall type in the data, named after it in lower case, for example "mangel". Its title is the heading over that type.'
};

const STRING_MEMBERS = new Set(Object.getOwnPropertyNames(String.prototype));

type ComponentClass = new (props: ComponentProps) => unknown;

/**
 * Constructs a component with `resourceBindings` that record what is read, and leaves nothing behind: every read answers undefined, except the reads of `groupKey`, which answer with a recorder of their own.
 *
 * A component warns about the empty data it is given, so the console is quiet while it is constructed.
 */
function recordReads(ComponentClass: ComponentClass, tagName: string, groupKey?: string) {
    const keys: Set<string> = new Set();
    const keysInGroup: Set<string> = new Set();
    const group = new Proxy(
        {},
        {
            get(_target, key) {
                // Read as text rather than as a group: answer as an empty string would.
                if (key === Symbol.toPrimitive || key === "toString" || key === "valueOf") return () => "";
                if (typeof key !== "string") return undefined;
                if (STRING_MEMBERS.has(key)) return ""[key as keyof string];
                keysInGroup.add(key);
                return undefined;
            }
        }
    );
    const resourceBindings = new Proxy(
        {},
        {
            get(_target, key) {
                if (typeof key !== "string") return undefined;
                keys.add(key);
                return key === groupKey ? group : undefined;
            }
        }
    );
    const { warn, error } = console;
    console.warn = () => {};
    console.error = () => {};
    try {
        new ComponentClass({ tagName, resourceBindings, formData: {} } as ComponentProps);
    } finally {
        console.warn = warn;
        console.error = error;
    }
    return { keys, keysInGroup };
}

/**
 * Finds the `resourceBindings` keys a component reads, by constructing it: first to see which keys it reads, then once for each of them to see whether it is read as a group, and which keys in it.
 *
 * Construction is where a component reads its layout's `resourceBindings`: its renderers only read what the component worked out from them. Keys named after the data are the exception, see resourceBindingGroupsFromData.
 *
 * @param {Function} ComponentClass - The component class.
 * @param {string} tagName - Its tag name.
 * @returns {ResourceBindingKeys} The keys it reads, in alphabetical order.
 */
export function getResourceBindingKeys(ComponentClass: ComponentClass, tagName: string): ResourceBindingKeys {
    const keys = [...recordReads(ComponentClass, tagName).keys].sort((a, b) => a.localeCompare(b));
    return Object.fromEntries(
        keys.map((key) => {
            const keysInGroup = [...recordReads(ComponentClass, tagName, key).keysInGroup].sort((a, b) => a.localeCompare(b));
            return [key, keysInGroup.length ? keysInGroup : null];
        })
    );
}

/**
 * The `resourceBindings` keys every component reads, by tag name, in the order `componentMap` lists them.
 *
 * @returns {Record<string, ResourceBindingKeys>} The keys each component reads, an empty object for one that reads none.
 */
export function getResourceBindingKeysByTagName(): Record<string, ResourceBindingKeys> {
    return Object.fromEntries(
        Object.entries(componentMap)
            .filter(([tagName]) => tagName !== "custom-component")
            .map(([tagName, ComponentClass]) => [tagName, getResourceBindingKeys(ComponentClass as ComponentClass, tagName)])
    );
}
