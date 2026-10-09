import { applyApiData } from "./index.ts";
import { getValueFromLocalStorage } from "../localStorage.ts";

import type { ApiValue } from "../types.ts";

/**
 * applyApiData runs against the real helpers here. index.test.ts mocks the validators and localStorage for its whole
 * file, which would hide exactly what this function is for: working the usage out again from the data it is given.
 */
function apiDataWithComponent(appName: string, tagName: string) {
    return {
        displayLayouts: [
            {
                appOwner: "dibk",
                appName,
                dataType: "DT",
                displayLayouts: [{ name: "DisplayLayout", path: "p", layout: { data: { layout: [{ id: "c1", tagName, type: "Custom" }] } } }]
            }
        ],
        packageVersions: [],
        latestPackageVersions: {},
        multilingualAppResourceValues: [{ appOwner: "dibk", appName, resourceValues: [{ id: "appName", values: { nb: "Appen" } }] }],
        exampleData: [],
        applicationMetadata: []
    };
}

function appsUsing(tagName: string) {
    const entry = globalThis.componentUsage.find((component: ApiValue) => component.tagName === tagName);
    return entry.usages.map((usage: ApiValue) => usage.appName);
}

describe("applyApiData", () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it("works the component usage out from the data it is given, every time it is called", () => {
        applyApiData(apiDataWithComponent("first-v1", "custom-field-data"), "2026-10-09T10:00:00.000Z");
        expect(appsUsing("custom-field-data")).toEqual(["first-v1"]);

        // A second call is what a synchronization makes. The usage has to follow the new layouts.
        applyApiData(apiDataWithComponent("second-v1", "custom-field-data"), "2026-10-09T11:00:00.000Z");
        expect(appsUsing("custom-field-data")).toEqual(["second-v1"]);
    });

    it("works out the text resource usage and the app text resources in the default language", () => {
        applyApiData(apiDataWithComponent("first-v1", "custom-field-data"), "2026-10-09T10:00:00.000Z");

        expect(Array.isArray(globalThis.allTextResourceUsage)).toBe(true);
        expect(globalThis.allTextResourceUsage.length > 0).toBe(true);
        expect(globalThis.appResourceValues).toEqual([
            { appOwner: "dibk", appName: "first-v1", resources: { language: "nb", resources: [{ id: "appName", value: "Appen" }] } }
        ]);
    });

    it("puts the fetched data and when it was fetched on globalThis, and stores the data", () => {
        const apiData = apiDataWithComponent("first-v1", "custom-field-data");
        // Taken first, since working out the component usage adds formData to the layouts it reads.
        const storedLayouts = JSON.parse(JSON.stringify(apiData.displayLayouts));
        applyApiData(apiData, "2026-10-09T10:00:00.000Z");

        expect(globalThis.displayLayouts).toBe(apiData.displayLayouts);
        expect(globalThis.lastUpdated).toBe("2026-10-09T10:00:00.000Z");
        expect(JSON.parse(getValueFromLocalStorage("displayLayouts") as string)).toEqual(storedLayouts);
    });
});
