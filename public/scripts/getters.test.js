import { getAppResourceValuesForLanguage, getDataModelSummaryText, getDefaultValueForResource, getResourcesForLanguage } from "./getters";

describe("getDataModelSummaryText", () => {
    it("returns [main] for first index", () => {
        expect(getDataModelSummaryText({ dataType: "Person" }, 0)).toBe("[main] Person");
    });
    it("returns dataType for other indexes", () => {
        expect(getDataModelSummaryText({ dataType: "Person" }, 1)).toBe("Person");
    });
    it("returns fallback for missing dataType", () => {
        expect(getDataModelSummaryText({}, 2)).toBe("Data model 3");
    });
});

describe("getResourcesForLanguage", () => {
    const resources = [
        { id: "greeting", values: { nb: "Hei", en: "Hello" } },
        { id: "farewell", values: { nb: "Ha det", en: "Goodbye" } },
        { id: "welcome", values: { nb: "Velkommen", en: "Welcome" } }
    ];
    it("returns resources for nb", () => {
        const result = getResourcesForLanguage(resources, "nb");
        expect(result.language).toBe("nb");
        expect(result.resources).toEqual([
            { id: "greeting", value: "Hei" },
            { id: "farewell", value: "Ha det" },
            { id: "welcome", value: "Velkommen" }
        ]);
    });
    it("returns resources for en", () => {
        const result = getResourcesForLanguage(resources, "en");
        expect(result.language).toBe("en");
        expect(result.resources).toEqual([
            { id: "greeting", value: "Hello" },
            { id: "farewell", value: "Goodbye" },
            { id: "welcome", value: "Welcome" }
        ]);
    });
    it("returns empty for unknown language", () => {
        const result = getResourcesForLanguage(resources, "nn");
        expect(result.language).toBe("nn");
        expect(result.resources).toEqual([]);
    });
});

describe("getAppResourceValuesForLanguage", () => {
    const appResourceValues = [
        {
            appName: "App1",
            appOwner: "Owner1",
            resourceValues: [
                { id: "greeting", values: { nb: "Hei", en: "Hello" } },
                { id: "farewell", values: { nb: "Ha det", en: "Goodbye" } }
            ]
        },
        {
            appName: "App2",
            appOwner: "Owner2",
            resourceValues: [{ id: "welcome", values: { nb: "Velkommen", en: "Welcome" } }]
        }
    ];
    it("returns app resource values for nb", () => {
        const result = getAppResourceValuesForLanguage(appResourceValues, "nb");
        expect(result[0].appName).toBe("App1");
        expect(result[0].resources.language).toBe("nb");
        expect(result[0].resources.resources).toEqual([
            { id: "greeting", value: "Hei" },
            { id: "farewell", value: "Ha det" }
        ]);
        expect(result[1].appName).toBe("App2");
        expect(result[1].resources.language).toBe("nb");
        expect(result[1].resources.resources).toEqual([{ id: "welcome", value: "Velkommen" }]);
    });
});

describe("getDefaultValueForResource", () => {
    beforeEach(() => {
        globalThis.defaultTextResources = {
            resources: [
                { id: "greeting", value: "Hei" },
                { id: "farewell", value: "Ha det" }
            ]
        };
    });
    afterEach(() => {
        delete globalThis.defaultTextResources;
    });
    it("returns value for existing resource", () => {
        expect(getDefaultValueForResource("greeting")).toBe("Hei");
    });
    it("returns null for missing resource", () => {
        expect(getDefaultValueForResource("unknown")).toBeNull();
    });
});
