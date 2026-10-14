import type { DataModelBindingKeys } from "../../types.ts";

import CustomDispensasjon from "../system-classes/component-classes/CustomDispensasjon.ts";
import CustomDispensasjonsvarsel from "../system-classes/component-classes/CustomDispensasjonsvarsel.ts";
import CustomGjennomfoeringsplan from "../system-classes/component-classes/CustomGjennomfoeringsplan.ts";
import CustomGjenpartNabovarsel from "../system-classes/component-classes/CustomGjenpartNabovarsel.ts";
import Dispensasjon from "./Dispensasjon.ts";
import Dispensasjonsvarsel from "./Dispensasjonsvarsel.ts";
import Gjennomfoeringsplan from "./Gjennomfoeringsplan.ts";
import GjenpartNabovarsel from "./GjenpartNabovarsel.ts";

/**
 * Constructs a layout class with props that record every key read from them, which is the set of bindings the class can use.
 * Every read answers undefined, so nothing nested is constructed and only the top-level keys are seen.
 */
function getKeysReadByConstructor(LayoutClass: new (props: Record<string, unknown>) => unknown): string[] {
    const readKeys: Set<string> = new Set();
    const props = new Proxy(
        {},
        {
            get(_target, key) {
                if (typeof key === "string") {
                    readKeys.add(key);
                }
                return undefined;
            }
        }
    );
    new LayoutClass(props);
    return [...readKeys].sort();
}

const layoutComponents: [name: string, bindingKeys: DataModelBindingKeys, LayoutClass: new (props: Record<string, unknown>) => unknown][] = [
    ["CustomDispensasjon", CustomDispensasjon.dataModelBindingKeys, Dispensasjon],
    ["CustomDispensasjonsvarsel", CustomDispensasjonsvarsel.dataModelBindingKeys, Dispensasjonsvarsel],
    ["CustomGjennomfoeringsplan", CustomGjennomfoeringsplan.dataModelBindingKeys, Gjennomfoeringsplan],
    ["CustomGjenpartNabovarsel", CustomGjenpartNabovarsel.dataModelBindingKeys, GjenpartNabovarsel]
];

describe("dataModelBindingKeys on layout components", () => {
    it.each(layoutComponents)("%s expects exactly the keys its layout class reads", (_name, bindingKeys, LayoutClass) => {
        expect([...bindingKeys.expected].sort()).toEqual(getKeysReadByConstructor(LayoutClass));
    });

    it.each(layoutComponents)("%s lists no key as both expected and deprecated", (_name, bindingKeys) => {
        const deprecatedAndExpected = Object.keys(bindingKeys.deprecated).filter((key) => bindingKeys.expected.includes(key));
        expect(deprecatedAndExpected).toEqual([]);
    });

    it.each(layoutComponents)("%s gives every deprecated key a hint", (_name, bindingKeys) => {
        const keysWithoutHint = Object.entries(bindingKeys.deprecated)
            .filter(([, hint]) => !hint.trim())
            .map(([key]) => key);
        expect(keysWithoutHint).toEqual([]);
    });
});
