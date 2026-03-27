import { getAllTextResourceUsage, getDataFromLocalStorage, getMissingResourceBindingsWithUsage } from "./index";

jest.mock("../localStorage.js", () => ({
    getValueFromLocalStorage: (key) => {
        const map = {
            lastUpdated: "2024-01-01",
            multilingualDefaultTextResources: "1",
            displayLayouts: "2",
            packageVersions: "3",
            multilingualAppResourceValues: "4",
            exampleData: "5"
        };
        return map[key] || null;
    },
    getValuesFromLocalStorage: (keys) => {
        const map = {
            multilingualDefaultTextResources: 1,
            displayLayouts: 2,
            packageVersions: 3,
            multilingualAppResourceValues: 4,
            exampleData: 5
        };
        return keys.reduce((acc, key) => {
            acc[key] = map[key];
            return acc;
        }, {});
    }
}));

jest.mock("../validators.js", () => ({
    getResourceBindingsWithUsageFromApplications: jest.fn(() => new Set(["foo"])),
    getMissingResourceBindings: jest.fn(() => ({ missingResourceBindings: ["foo"] })),
    getUsageForMissingResources: jest.fn(() => ({ missingResourcesUsage: [1], missingResourcesWithLocalValueUsage: [2] })),
    getUsageForResources: jest.fn(() => [10])
}));

describe("getDataFromLocalStorage", () => {
    it("returns all expected keys from localStorage", () => {
        const result = getDataFromLocalStorage();
        expect(result.lastUpdated).toBe("2024-01-01");
        expect(result.multilingualDefaultTextResources).toBe(1);
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
        const result = getAllTextResourceUsage(displayLayouts, appResourceValues, defaultTextResources);
        expect(result).toEqual([10, 1, 2]);
    });
});
