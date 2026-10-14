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
    // The shape of every list, these included, is checked in src/classes/system-classes/component-classes/dataModelBindingKeys.test.ts.
    it.each(layoutComponents)("%s declares exactly the keys its layout class reads", (_name, bindingKeys, LayoutClass) => {
        const { expected, oneOf = [], optional = [] } = bindingKeys;
        expect([...expected, ...oneOf.flat(), ...optional].sort()).toEqual(getKeysReadByConstructor(LayoutClass));
    });
});
