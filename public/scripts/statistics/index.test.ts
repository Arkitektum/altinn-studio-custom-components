
import type { DisplayLayoutEntry } from "../types.ts";

import { getAllTextResourceUsage, getDataFromLocalStorage, getMissingResourceBindingsWithUsage } from "./index";

jest.mock("../localStorage.ts", () => ({
    getValueFromLocalStorage: (key: string) => {
        const map: Record<string, string> = {
            lastUpdated: "2024-01-01",
            multilingualDefaultTextResources: "1",
            displayLayouts: "2",
            packageVersions: "3",
            multilingualAppResourceValues: "4",
            exampleData: "5"
        };
        return map[key] || null;
    },
    getValuesFromLocalStorage: (keys: string[]) => {
        const map: Record<string, number> = {
            multilingualDefaultTextResources: 1,
            displayLayouts: 2,
            packageVersions: 3,
            multilingualAppResourceValues: 4,
            exampleData: 5
        };
        return keys.reduce((acc: Record<string, number | undefined>, key: string) => {
            acc[key] = map[key];
            return acc;
        }, {});
    }
}));

jest.mock("../validators.ts", () => ({
    getResourceBindingsWithUsageFromApplications: jest.fn(() => new Set(["foo"])),
    getMissingResourceBindings: jest.fn(() => ({ missingResourceBindings: ["foo"] })),
    getUsageForMissingResources: jest.fn(() => ({ missingResourcesUsage: [1], missingResourcesWithLocalValueUsage: [2] })),
    getUsageForResources: jest.fn(() => [10])
}));

describe("getDataFromLocalStorage", () => {
    it("returns all expected keys from localStorage", () => {
        const result = getDataFromLocalStorage();
        expect(result.lastUpdated).toBe("2024-01-01");
        expect(result.displayLayouts).toBe(2);
        expect(result.packageVersions).toBe(3);
        expect(result.multilingualAppResourceValues).toBe(4);
        expect(result.exampleData).toBe(5);
    });
});

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
