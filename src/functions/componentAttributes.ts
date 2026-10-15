import type { ComponentProps } from "../types.ts";
// Classes
import CustomComponent from "../classes/system-classes/CustomComponent.ts";

// Global functions
import { componentMap } from "./componentHelpers.ts";

// Constants
import { layoutAttributeSchemas } from "../constants/layoutAttributeSchemas.ts";

/**
 * Attributes a component reads only once it has data, so constructing it without data does not show them, each with the components that read it.
 *
 * src/functions/componentAttributes.test.ts fails when the source shows another component reading one of these attributes without it being listed.
 */
export const attributesReadWithData: Record<string, string[]> = {
    showRowNumbers: ["custom-table-data"]
};

type ComponentClass = new (props: ComponentProps) => unknown;

/** Constructs a component with props that record which of `names` it reads. */
function recordAttributeReads(ComponentClass: ComponentClass, tagName: string, names: string[]): Set<string> {
    const read: Set<string> = new Set();
    const props = new Proxy({ tagName, formData: {}, resourceBindings: {} } as Record<string, unknown>, {
        get(target, key) {
            if (typeof key === "string" && names.includes(key)) read.add(key);
            return target[key as string];
        }
    });
    const { warn, error } = console;
    // A component warns about the empty data it is given.
    console.warn = () => {};
    console.error = () => {};
    try {
        new ComponentClass(props as ComponentProps);
    } finally {
        console.warn = warn;
        console.error = error;
    }
    return read;
}

/**
 * The attributes only some components read: the ones the base class does not copy onto every component.
 *
 * The base class copies `hideIfEmpty`, `size` and the like onto every component, and whether a component honours them depends on how it hands them on while it renders, so those are accepted on every component. `resourceBindings` is accepted on every component too, since the keys in it are checked per component.
 *
 * @returns {string[]} The attribute names, in the order layoutAttributeSchemas lists them.
 */
export function getComponentSpecificAttributes(): string[] {
    const names = Object.keys(layoutAttributeSchemas);
    const copiedByTheBaseClass = recordAttributeReads(CustomComponent, "custom-component", names);
    return names.filter((name) => name !== "resourceBindings" && !copiedByTheBaseClass.has(name));
}

/**
 * The components that read each attribute only some components read, found by constructing every component and adding the ones in attributesReadWithData.
 *
 * @returns {Record<string, string[]>} For each such attribute, the tag names of the components that read it, in the order componentMap lists them.
 */
export function getAttributeOwners(): Record<string, string[]> {
    const specificAttributes = getComponentSpecificAttributes();
    const owners: Record<string, string[]> = Object.fromEntries(specificAttributes.map((name) => [name, []]));
    for (const [tagName, ComponentClass] of Object.entries(componentMap)) {
        if (tagName === "custom-component") continue;
        const read = recordAttributeReads(ComponentClass as ComponentClass, tagName, specificAttributes);
        for (const name of specificAttributes) {
            if (read.has(name) || attributesReadWithData[name]?.includes(tagName)) owners[name]!.push(tagName);
        }
    }
    return owners;
}
