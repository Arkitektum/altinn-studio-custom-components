import type { ComponentProps, DataModelBindingKeys } from "../../../types.ts";

import { componentMap } from "../../../functions/componentHelpers.ts";

/**
 * Whether the binding keys each component declares are the ones it reads.
 *
 * The layout components read their keys in a layout class, and src/classes/layout-classes/dataModelBindingKeys.test.ts checks those. Every other component reads them in its own constructor, which is what is checked here.
 */

/** Read in a layout class, and checked against it in the layout classes' own test. */
const LAYOUT_COMPONENTS = ["custom-dispensasjon", "custom-dispensasjonsvarsel", "custom-gjennomfoeringsplan", "custom-gjenpart-nabovarsel"];

/**
 * Components deliberately without a list:
 *
 *   custom-component                  the fallback class, not a tag a layout writes
 *   the base primitives               built by other components from attributes, not bound by a layout
 *   custom-field-grid, custom-field-row   read the keys a layout names in its own tableColumns, and are being replaced by custom-matrix
 */
const WITHOUT_LISTS = [
    "custom-component",
    "custom-description-list",
    "custom-divider",
    "custom-feedback",
    "custom-field",
    "custom-header",
    "custom-list",
    "custom-matrix",
    "custom-paragraph",
    "custom-summation",
    "custom-table",
    "custom-field-grid",
    "custom-field-row"
];

type ComponentClass = (new (props: ComponentProps) => unknown) & { dataModelBindingKeys?: DataModelBindingKeys };

const componentClasses = Object.entries(componentMap) as [string, ComponentClass][];
const declaring = componentClasses.filter(([, ComponentClass]) => ComponentClass.dataModelBindingKeys) as [
    string,
    ComponentClass & { dataModelBindingKeys: DataModelBindingKeys }
][];

/** Every key a list names, in whichever part of it. */
function listedKeys(bindingKeys: DataModelBindingKeys) {
    return [...bindingKeys.expected, ...(bindingKeys.oneOf || []).flat(), ...(bindingKeys.optional || []), ...Object.keys(bindingKeys.deprecated)];
}

/**
 * Constructs a component with form data that records every key read from it.
 * Every read answers undefined, which every component takes for an empty value.
 */
function getKeysReadByConstructor(tagName: string, ComponentClass: ComponentClass): string[] {
    const readKeys: Set<string> = new Set();
    const formData = new Proxy(
        {},
        {
            get(_target, key) {
                if (typeof key === "string") readKeys.add(key);
                return undefined;
            }
        }
    );
    const originalWarn = console.warn;
    // A component warns about the empty value, which is all it is given here.
    console.warn = () => {};
    try {
        new ComponentClass({ tagName, formData, resourceBindings: {} } as ComponentProps);
    } finally {
        console.warn = originalWarn;
    }
    return [...readKeys].sort();
}

describe("dataModelBindingKeys on the components that read their own bindings", () => {
    const ownReaders = declaring.filter(([tagName]) => !LAYOUT_COMPONENTS.includes(tagName));

    it.each(ownReaders)("%s declares exactly the keys its constructor reads", (tagName, ComponentClass) => {
        const { expected, oneOf = [], optional = [] } = ComponentClass.dataModelBindingKeys;
        expect([...expected, ...oneOf.flat(), ...optional].sort()).toEqual(getKeysReadByConstructor(tagName, ComponentClass));
    });
});

describe("the binding key lists", () => {
    it.each(declaring)("%s names each key once, in one part of its list", (_tagName, ComponentClass) => {
        const keys = listedKeys(ComponentClass.dataModelBindingKeys);
        expect(keys.filter((key, index) => keys.indexOf(key) !== index)).toEqual([]);
    });

    it.each(declaring)("%s gives every oneOf group a choice of at least two keys", (_tagName, ComponentClass) => {
        expect((ComponentClass.dataModelBindingKeys.oneOf || []).filter((group) => group.length < 2)).toEqual([]);
    });

    it.each(declaring)("%s gives every deprecated key a hint", (_tagName, ComponentClass) => {
        const keysWithoutHint = Object.entries(ComponentClass.dataModelBindingKeys.deprecated)
            .filter(([, hint]) => !hint.trim())
            .map(([key]) => key);
        expect(keysWithoutHint).toEqual([]);
    });

    it("are declared by every component not listed as going without one", () => {
        // A new component has shipped without a list. Declare its dataModelBindingKeys, or add it to WITHOUT_LISTS with the reason.
        const missing = componentClasses
            .filter(([tagName, ComponentClass]) => !ComponentClass.dataModelBindingKeys && !WITHOUT_LISTS.includes(tagName))
            .map(([tagName]) => tagName);
        expect(missing).toEqual([]);
    });

    it("are not declared by a component listed as going without one", () => {
        expect(declaring.map(([tagName]) => tagName).filter((tagName) => WITHOUT_LISTS.includes(tagName))).toEqual([]);
    });
});
