import { DEFAULT_LAYOUT_NAME, flattenAppLayouts } from "./displayLayoutHelpers";

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
        expect(result.map((entry) => entry.layoutName)).toEqual(["DisplayLayout", "SvarSkjema"]);
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

    it("returns an empty array for non-array input", () => {
        expect(flattenAppLayouts(undefined)).toEqual([]);
        expect(flattenAppLayouts(null)).toEqual([]);
    });
});
