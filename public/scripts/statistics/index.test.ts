import type { DisplayLayoutEntry } from "../types.ts";

import { getAllTextResourceUsage, getMissingResourceBindingsWithUsage } from "./index.ts";

jest.mock("../validators.ts", () => ({
    getResourceBindingsWithUsageFromApplications: jest.fn(() => new Set(["foo"])),
    getMissingResourceBindings: jest.fn(() => ({ missingResourceBindings: ["foo"] })),
    getUsageForMissingResources: jest.fn(() => ({ missingResourcesUsage: [1], missingResourcesWithLocalValueUsage: [2] })),
    getUsageForResources: jest.fn(() => [10])
}));

describe("getMissingResourceBindingsWithUsage", () => {
    it("returns missingResourceBindings and usages", () => {
        const displayLayouts = [{ id: 1 }];
        const appResourceValues = [{ id: 2 }];
        const defaultTextResources = [{ id: 3 }];
        const result = getMissingResourceBindingsWithUsage(displayLayouts, appResourceValues, defaultTextResources);
        expect(result.missingResourceBindings).toEqual(["foo"]);
        expect(result.missingResourcesUsage).toEqual([1]);
        expect(result.missingResourcesWithLocalValueUsage).toEqual([2]);
    });
});

describe("getAllTextResourceUsage", () => {
    it("returns combined usage", () => {
        const displayLayouts = [1];
        const appResourceValues = [2];
        const defaultTextResources = [3];
        const result = getAllTextResourceUsage(displayLayouts as unknown as DisplayLayoutEntry[], appResourceValues, defaultTextResources);
        expect(result).toEqual([10, 1, 2]);
    });
});
