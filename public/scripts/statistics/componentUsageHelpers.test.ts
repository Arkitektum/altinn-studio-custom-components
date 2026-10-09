import { getComponentUsageTreeForAllLayouts } from "./componentUsageHelpers.ts";

import type { ApiValue } from "../types.ts";

describe("getComponentUsageTreeForAllLayouts", () => {
    const layoutWith = (tagName: string, id: string) => ({ data: { layout: [{ id, tagName, type: "Custom" }] } });

    it("names the subform on a usage in a subform layout, and nothing on a usage in a main layout", () => {
        const layouts = [
            { appOwner: "o", appName: "a", layoutName: "DisplayLayout", layout: layoutWith("custom-field-data", "main") },
            {
                appOwner: "o",
                appName: "a",
                layoutName: "sub-v1",
                isSubform: true,
                subformAppName: "sub-v1",
                layout: layoutWith("custom-field-data", "sub")
            }
        ];
        const result = getComponentUsageTreeForAllLayouts(layouts);
        const usages = result.find((entry: ApiValue) => entry.tagName === "custom-field-data")!.usages;
        expect(Object.keys(usages.find((usage: ApiValue) => usage.id === "main"))).not.toContain("subformAppName");
        expect(usages.find((usage: ApiValue) => usage.id === "sub").subformAppName).toBe("sub-v1");
    });

    it("names the subform on the usages of the components a subform component uses", () => {
        const layouts = [
            {
                appOwner: "o",
                appName: "a",
                layoutName: "sub-v1",
                isSubform: true,
                subformAppName: "sub-v1",
                layout: layoutWith("custom-field-adresse", "adr")
            }
        ];
        const result = getComponentUsageTreeForAllLayouts(layouts);
        const indirectUsages = result.flatMap((entry: ApiValue) => entry.usages).filter((usage: ApiValue) => usage.parent?.id === "adr");
        expect(indirectUsages.length > 0).toBe(true);
        expect(indirectUsages.every((usage: ApiValue) => usage.subformAppName === "sub-v1")).toBe(true);
    });
});
