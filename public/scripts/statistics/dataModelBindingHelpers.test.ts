import { getDataModelBindingDrift, getDataModelBindingDriftForAllLayouts } from "./dataModelBindingHelpers.ts";
import CustomGjennomfoeringsplan from "../../../src/classes/system-classes/component-classes/CustomGjennomfoeringsplan.ts";
import { getDataModelBindingKeysByTagName } from "../../../src/functions/componentHelpers.ts";

import type { ApiValue, LayoutComponent } from "../types.ts";

/** Binds each key to a path of the same name, which is all the check looks at. */
function bindingsFor(keys: readonly string[]) {
    return Object.fromEntries(keys.map((key) => [key, `model.${key}`]));
}

const gjennomfoeringsplanKeys = CustomGjennomfoeringsplan.dataModelBindingKeys.expected;

function gjennomfoeringsplan(id: string, keys: readonly string[]): LayoutComponent {
    return { id, type: "Custom", tagName: "custom-gjennomfoeringsplan", dataModelBindings: bindingsFor(keys) };
}

function layoutWith(components: LayoutComponent[], extra: Record<string, unknown> = {}) {
    return { appOwner: "dibk", appName: "app-v1", layoutName: "DisplayLayout", ...extra, layout: { data: { layout: components } } };
}

function usagesFor(result: ApiValue[], tagName: string) {
    return result.find((entry) => entry.tagName === tagName)?.usages;
}

describe("getDataModelBindingDrift", () => {
    const bindingKeys = { expected: ["a", "b", "c"], deprecated: { old: "Renamed to a" } };

    it("sorts the keys a layout binds into missing, deprecated and unknown", () => {
        const drift = getDataModelBindingDrift({ dataModelBindings: bindingsFor(["a", "old", "typo"]) }, bindingKeys);
        expect(drift).toEqual({ missing: ["b", "c"], ignored: [], deprecated: [{ key: "old", hint: "Renamed to a" }], unknown: ["typo"] });
    });

    it("reports every expected key as missing when the layout binds nothing", () => {
        expect(getDataModelBindingDrift({}, bindingKeys)).toEqual({ missing: ["a", "b", "c"], ignored: [], deprecated: [], unknown: [] });
    });

    it("finds nothing when the layout binds exactly the expected keys", () => {
        expect(getDataModelBindingDrift({ dataModelBindings: bindingsFor(["c", "a", "b"]) }, bindingKeys)).toEqual({
            missing: [],
            ignored: [],
            deprecated: [],
            unknown: []
        });
    });

    it("does not take a key inherited from Object.prototype for a deprecated one", () => {
        expect(getDataModelBindingDrift({ dataModelBindings: bindingsFor(["a", "b", "c", "toString"]) }, bindingKeys).unknown).toEqual(["toString"]);
    });
});

describe("getDataModelBindingDrift with oneOf and optional keys", () => {
    const bindingKeys = { expected: ["trueData"], oneOf: [["simpleBinding", "data"]], optional: ["dataTitle"], deprecated: {} };

    it("finds nothing when one key of each group is bound, whichever it is, with or without the optional key", () => {
        const noDrift = { missing: [], ignored: [], deprecated: [], unknown: [] };
        expect(getDataModelBindingDrift({ dataModelBindings: bindingsFor(["trueData", "data"]) }, bindingKeys)).toEqual(noDrift);
        expect(getDataModelBindingDrift({ dataModelBindings: bindingsFor(["trueData", "simpleBinding", "dataTitle"]) }, bindingKeys)).toEqual(
            noDrift
        );
    });

    it("reports a group with none of its keys bound as one missing entry, and never an optional key", () => {
        expect(getDataModelBindingDrift({ dataModelBindings: bindingsFor(["trueData"]) }, bindingKeys).missing).toEqual(["simpleBinding or data"]);
    });

    it("reports the later keys of a group as ignored when an earlier one is bound, naming the key read instead", () => {
        const drift = getDataModelBindingDrift({ dataModelBindings: bindingsFor(["data", "trueData", "simpleBinding"]) }, bindingKeys);
        expect(drift.ignored).toEqual([{ key: "data", usedInstead: "simpleBinding" }]);
        expect(drift.unknown).toEqual([]);
        expect(drift.missing).toEqual([]);
    });

    it("still reports a key outside every list as unknown", () => {
        expect(getDataModelBindingDrift({ dataModelBindings: bindingsFor(["trueData", "data", "dataTittle"]) }, bindingKeys).unknown).toEqual([
            "dataTittle"
        ]);
    });
});

describe("getDataModelBindingDriftForAllLayouts", () => {
    it("reports a use whose layout binds other keys than the component reads, with where it is", () => {
        const keysWithoutFirst = gjennomfoeringsplanKeys.slice(1);
        const result = getDataModelBindingDriftForAllLayouts([layoutWith([gjennomfoeringsplan("plan", [...keysWithoutFirst, "typo"])])]);
        expect(usagesFor(result, "custom-gjennomfoeringsplan")).toEqual([
            {
                id: "plan",
                appOwner: "dibk",
                appName: "app-v1",
                layoutName: "DisplayLayout",
                missing: [gjennomfoeringsplanKeys[0]],
                ignored: [],
                deprecated: [],
                unknown: ["typo"]
            }
        ]);
    });

    it("leaves out a use whose layout binds exactly what the component reads, and keeps the component", () => {
        const result = getDataModelBindingDriftForAllLayouts([layoutWith([gjennomfoeringsplan("plan", gjennomfoeringsplanKeys)])]);
        expect(usagesFor(result, "custom-gjennomfoeringsplan")).toEqual([]);
    });

    it("lists every component that declares its keys, even one no layout uses, and no component that does not", () => {
        const tagNames = getDataModelBindingDriftForAllLayouts([]).map((entry: ApiValue) => entry.tagName);
        expect(tagNames).toEqual(Object.keys(getDataModelBindingKeysByTagName()).sort((a, b) => a.localeCompare(b)));
        expect(tagNames).toContain("custom-field-data");
        expect(tagNames).not.toContain("custom-field");
    });

    it("reports a use whose only finding is a key read in place of another, as ignored", () => {
        const fieldData = { id: "both", type: "Custom", tagName: "custom-field-data", dataModelBindings: bindingsFor(["simpleBinding", "data"]) };
        const usages = usagesFor(getDataModelBindingDriftForAllLayouts([layoutWith([fieldData])]), "custom-field-data");
        expect(usages.map((usage: ApiValue) => [usage.id, usage.ignored, usage.missing, usage.unknown])).toEqual([
            ["both", [{ key: "data", usedInstead: "simpleBinding" }], [], []]
        ]);
    });

    it("names the subform on a use in a subform layout, and nothing on a use in a main layout", () => {
        const result = getDataModelBindingDriftForAllLayouts([
            layoutWith([gjennomfoeringsplan("main", [])]),
            layoutWith([gjennomfoeringsplan("sub", [])], { layoutName: "sub-v1", isSubform: true, subformAppName: "sub-v1" })
        ]);
        const usages = usagesFor(result, "custom-gjennomfoeringsplan");
        expect(Object.keys(usages.find((usage: ApiValue) => usage.id === "main"))).not.toContain("subformAppName");
        expect(usages.find((usage: ApiValue) => usage.id === "sub").subformAppName).toBe("sub-v1");
    });

    it("checks a tag name written in capitals, and skips components that are not custom", () => {
        const result = getDataModelBindingDriftForAllLayouts([
            layoutWith([
                { ...gjennomfoeringsplan("capitals", []), tagName: "CUSTOM-GJENNOMFOERINGSPLAN" },
                { ...gjennomfoeringsplan("not-custom", []), type: "Summary2" }
            ])
        ]);
        expect(usagesFor(result, "custom-gjennomfoeringsplan").map((usage: ApiValue) => usage.id)).toEqual(["capitals"]);
    });

    it("skips a layout without components", () => {
        const result = getDataModelBindingDriftForAllLayouts([{ appOwner: "dibk", appName: "app-v1", layout: {} }]);
        expect(usagesFor(result, "custom-gjennomfoeringsplan")).toEqual([]);
    });
});
