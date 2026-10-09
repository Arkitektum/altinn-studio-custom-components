import {
    DEFAULT_LAYOUT_NAME,
    flattenAppLayouts,
    getAppEntries,
    getFormFilterOptions,
    selectStoredOption,
    setSelectOptions
} from "./displayLayoutHelpers.ts";
import { MAIN_FORM_FILTER_VALUE } from "../filters.ts";

import type { ApiValue } from "../types.ts";

describe("flattenAppLayouts", () => {
    it("expands app entries into one entry per display layout", () => {
        const displayLayouts = [
            {
                appOwner: "o",
                appName: "a",
                dataType: "DT",
                displayLayouts: [
                    { name: "DisplayLayout", path: "p1", layout: { data: { layout: [] } } },
                    { name: "SvarSkjema", path: "p2", layout: { data: { layout: [] } } }
                ]
            }
        ];
        const result = flattenAppLayouts(displayLayouts);
        expect(result.length).toBe(2);
        expect(result.map((entry: ApiValue) => entry.layoutName)).toEqual(["DisplayLayout", "SvarSkjema"]);
        expect(result[0]).toMatchObject({ appOwner: "o", appName: "a", dataType: "DT", path: "p1" });
        expect(result[1].layout).toEqual({ data: { layout: [] } });
    });

    it("passes an entry with a single layout through with a default layout name", () => {
        const displayLayouts = [{ appOwner: "o", appName: "a", dataType: "DT", layout: { data: { layout: [] } } }];
        const result = flattenAppLayouts(displayLayouts);
        expect(result.length).toBe(1);
        expect(result[0].layoutName).toBe(DEFAULT_LAYOUT_NAME);
        expect(result[0].appName).toBe("a");
    });

    it("leaves out standalone subform entries", () => {
        const displayLayouts = [
            {
                appOwner: "o",
                appName: "a",
                dataType: "DT",
                displayLayouts: [{ name: "DisplayLayout", path: "p1", layout: { data: { layout: [] } } }]
            },
            { appOwner: "o", appName: "sub", dataType: "SubDT", isSubform: true, layout: { data: { layout: [] } } }
        ];
        const result = flattenAppLayouts(displayLayouts);
        expect(result.map((entry: ApiValue) => entry.appName)).toEqual(["a"]);
    });

    it("credits each subform an app carries to that app, named after the subform app", () => {
        const subformLayout = { data: { layout: [{ id: "sub" }] } };
        const displayLayouts = [
            {
                appOwner: "o",
                appName: "a",
                dataType: "DT",
                displayLayouts: [{ name: "DisplayLayout", path: "p1", layout: { data: { layout: [] } } }],
                subForms: [{ appName: "sub-v1", dataType: "SubDT", layout: subformLayout }]
            }
        ];
        const result = flattenAppLayouts(displayLayouts);
        expect(result.map((entry: ApiValue) => entry.layoutName)).toEqual(["DisplayLayout", "sub-v1"]);
        expect(result[0].isSubform).toBeUndefined();
        expect(result[1]).toMatchObject({
            appOwner: "o",
            appName: "a",
            dataType: "SubDT",
            isSubform: true,
            subformAppName: "sub-v1",
            layout: subformLayout
        });
    });

    it("leaves out a subform whose layout could not be fetched", () => {
        const displayLayouts = [
            {
                appOwner: "o",
                appName: "a",
                dataType: "DT",
                displayLayouts: [{ name: "DisplayLayout", path: "p1", layout: { data: { layout: [] } } }],
                subForms: [
                    { appName: "missing-v1", dataType: "MissingDT", layout: null },
                    { appName: "sub-v1", dataType: "SubDT", layout: { data: { layout: [] } } }
                ]
            }
        ];
        const result = flattenAppLayouts(displayLayouts);
        expect(result.map((entry: ApiValue) => entry.layoutName)).toEqual(["DisplayLayout", "sub-v1"]);
    });

    it("returns an empty array for non-array input", () => {
        expect(flattenAppLayouts(undefined)).toEqual([]);
        expect(flattenAppLayouts(null as unknown as undefined)).toEqual([]);
    });
});

describe("getFormFilterOptions", () => {
    const applications = [
        { appOwner: "o", appName: "a", subForms: [{ appName: "sub-v1" }, { appName: "other-v1" }] },
        { appOwner: "o", appName: "b", subForms: [{ appName: "sub-v1" }] },
        { appOwner: "o", appName: "c" }
    ];

    it("offers every subform any app carries, once each and in alphabetical order, when no app is selected", () => {
        expect(getFormFilterOptions(applications)).toEqual([
            { value: "", text: "All forms" },
            { value: MAIN_FORM_FILTER_VALUE, text: "Main form" },
            { value: "other-v1", text: "other-v1 (subform)" },
            { value: "sub-v1", text: "sub-v1 (subform)" }
        ]);
    });

    it("offers only the selected app's subforms", () => {
        expect(getFormFilterOptions(applications, "o", "b").map((option: ApiValue) => option.value)).toEqual(["", MAIN_FORM_FILTER_VALUE, "sub-v1"]);
    });

    it("offers only every form and the main form for an app without subforms", () => {
        expect(getFormFilterOptions(applications, "o", "c").map((option: ApiValue) => option.value)).toEqual(["", MAIN_FORM_FILTER_VALUE]);
    });

    it("does not match a same-named app under a different owner", () => {
        expect(getFormFilterOptions(applications, "x", "a").map((option: ApiValue) => option.value)).toEqual(["", MAIN_FORM_FILTER_VALUE]);
    });
});

describe("setSelectOptions", () => {
    const options = [
        { value: "", text: "All" },
        { value: "x", text: "X" }
    ];

    it("replaces the options and keeps a choice that is still offered", () => {
        const select = document.createElement("select");
        select.appendChild(document.createElement("option"));
        expect(setSelectOptions(select, options, "x")).toBe("x");
        expect(Array.from(select.options).map((option) => option.textContent)).toEqual(["All", "X"]);
        expect(select.value).toBe("x");
    });

    it("falls back to the first option when the choice is no longer offered", () => {
        // A first option with a real value, since a select with no match also reads as "" and would hide the fallback.
        const select = document.createElement("select");
        const named = [
            { value: "first", text: "First" },
            { value: "second", text: "Second" }
        ];
        expect(setSelectOptions(select, named, "gone")).toBe("first");
        expect(select.value).toBe("first");
    });
});

describe("getAppEntries", () => {
    it("keeps the apps and leaves out the standalone subform entries", () => {
        const displayLayouts = [
            { appOwner: "o", appName: "a", displayLayouts: [] },
            { appOwner: "o", appName: "sub", isSubform: true, layout: {} },
            { appOwner: "o", appName: "b", displayLayouts: [] }
        ];
        expect(getAppEntries(displayLayouts).map((entry: ApiValue) => entry.appName)).toEqual(["a", "b"]);
    });

    it("answers with no apps for input that is not a list", () => {
        expect(getAppEntries(undefined)).toEqual([]);
    });
});

describe("selectStoredOption", () => {
    function selectWith(...values: string[]) {
        const select = document.createElement("select");
        setSelectOptions(
            select,
            values.map((value) => ({ value, text: value })),
            values[0]!
        );
        return select;
    }

    it("selects the stored value when it is offered", () => {
        const select = selectWith("all", "unused", "used-once");
        expect(selectStoredOption(select, "unused", "all")).toBe("unused");
        expect(select.value).toBe("unused");
    });

    it("selects the fallback when the stored value is not offered, or there is none", () => {
        const select = selectWith("all", "unused");
        expect(selectStoredOption(select, "gone", "unused")).toBe("unused");
        expect(selectStoredOption(select, undefined, "all")).toBe("all");
    });
});
