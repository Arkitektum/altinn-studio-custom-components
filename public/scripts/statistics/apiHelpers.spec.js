import {
    fetchAltinnStudioForms,
    fetchAppResources,
    fetchApplicationMetadata,
    fetchDefaultTextResources,
    fetchDisplayLayouts,
    fetchExampleData,
    fetchPackageVersions,
    getUpdatedApiData
} from "./apiHelpers.js";

globalThis.fetch = jest.fn();

beforeEach(() => {
    jest.clearAllMocks();
});

describe("fetchDisplayLayouts", () => {
    it("returns JSON on ok", async () => {
        fetch.mockResolvedValue({ ok: true, json: () => Promise.resolve({ foo: 1 }) });
        await expect(fetchDisplayLayouts()).resolves.toEqual({ foo: 1 });
    });
    it("throws on not ok", async () => {
        fetch.mockResolvedValue({ ok: false, statusText: "fail" });
        await expect(fetchDisplayLayouts()).rejects.toThrow("Failed to fetch DisplayLayout.json: fail");
    });
});

describe("fetchPackageVersions", () => {
    it("returns JSON on ok", async () => {
        fetch.mockResolvedValue({ ok: true, json: () => Promise.resolve({ bar: 2 }) });
        await expect(fetchPackageVersions()).resolves.toEqual({ bar: 2 });
    });
    it("throws on not ok", async () => {
        fetch.mockResolvedValue({ ok: false, statusText: "fail" });
        await expect(fetchPackageVersions()).rejects.toThrow("Failed to fetch package.json files: fail");
    });
});

describe("fetchAppResources", () => {
    it("returns JSON on ok", async () => {
        fetch.mockResolvedValue({ ok: true, json: () => Promise.resolve({ baz: 3 }) });
        await expect(fetchAppResources("nb")).resolves.toEqual({ baz: 3 });
    });
    it("throws on not ok", async () => {
        fetch.mockResolvedValue({ ok: false, statusText: "fail" });
        await expect(fetchAppResources("nb")).rejects.toThrow("Failed to fetch app resource values: fail");
    });
});

describe("fetchDefaultTextResources", () => {
    it("returns the local JSON export", () => {
        const resources = fetchDefaultTextResources();
        // Should be the imported array from resources.json
        expect(Array.isArray(resources)).toBe(true);
        expect(resources.length).toBeGreaterThan(0);
        expect(resources[0]).toHaveProperty("id");
    });
});

describe("fetchExampleData", () => {
    it("returns JSON on ok", async () => {
        fetch.mockResolvedValue({ ok: true, json: () => Promise.resolve({ ex: 5 }) });
        await expect(fetchExampleData()).resolves.toEqual({ ex: 5 });
    });
    it("throws on not ok", async () => {
        fetch.mockResolvedValue({ ok: false, statusText: "fail" });
        await expect(fetchExampleData()).rejects.toThrow("Failed to fetch example data: fail");
    });
});

describe("fetchAltinnStudioForms", () => {
    it("returns JSON on ok", async () => {
        fetch.mockResolvedValue({ ok: true, json: () => Promise.resolve({ forms: 6 }) });
        await expect(fetchAltinnStudioForms()).resolves.toEqual({ forms: 6 });
    });
    it("throws on not ok", async () => {
        fetch.mockResolvedValue({ ok: false, statusText: "fail" });
        await expect(fetchAltinnStudioForms()).rejects.toThrow("Failed to fetch Altinn Studio forms: fail");
    });
});

describe("fetchApplicationMetadata", () => {
    it("returns JSON on ok", async () => {
        fetch.mockResolvedValue({ ok: true, json: () => Promise.resolve({ meta: 7 }) });
        await expect(fetchApplicationMetadata()).resolves.toEqual({ meta: 7 });
    });
    it("throws on not ok", async () => {
        fetch.mockResolvedValue({ ok: false, statusText: "fail" });
        await expect(fetchApplicationMetadata()).rejects.toThrow("Failed to fetch application metadata: fail");
    });
});

describe("getUpdatedApiData", () => {
    it("returns all data in order, with local defaultTextResources", async () => {
        // Arrange: mock fetch for the 5 fetch-based calls (skip for fetchDefaultTextResources)
        fetch
            .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(2) }) // layouts
            .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(3) }) // packageVersions
            .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(4) }) // latestPackageVersions
            .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(5) }) // appResources
            .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(6) }) // exampleData
            .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(7) }); // applicationMetadata
        // Mock showLoadingIndicator to avoid DOM side effects
        jest.spyOn(require("./renderers.js"), "showLoadingIndicator").mockImplementation(() => {});
        await expect(getUpdatedApiData()).resolves.toEqual([2, 3, 4, 5, 6, 7]);
    });
});
