import { DEFAULT_LAYOUT_NAME, flattenAppLayouts } from "./displayLayoutHelpers.ts";

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

    it("passes standalone subform entries through with a default layout name", () => {
        const displayLayouts = [{ appOwner: "o", appName: "sub", dataType: "SubDT", isSubform: true, layout: { data: { layout: [] } } }];
        const result = flattenAppLayouts(displayLayouts);
        expect(result.length).toBe(1);
        expect(result[0].layoutName).toBe(DEFAULT_LAYOUT_NAME);
        expect(result[0].isSubform).toBe(true);
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
