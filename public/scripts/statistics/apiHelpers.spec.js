import {
    fetchAltinnStudioForms,
    fetchAppResources,
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
    it("returns JSON on ok", async () => {
        fetch.mockResolvedValue({ ok: true, json: () => Promise.resolve({ def: 4 }) });
        await expect(fetchDefaultTextResources()).resolves.toEqual({ def: 4 });
    });
    it("throws on not ok", async () => {
        fetch.mockResolvedValue({ ok: false, statusText: "fail" });
        await expect(fetchDefaultTextResources()).rejects.toThrow("Failed to fetch default text resources: fail");
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

describe("getUpdatedApiData", () => {
    it("returns all data in order", async () => {
        const data = [1, 2, 3, 4, 5];
        fetch
            .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(1) })
            .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(2) })
            .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(3) })
            .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(4) })
            .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(5) });
        // Mock showLoadingIndicator to avoid DOM side effects
        jest.spyOn(require("./renderers.js"), "showLoadingIndicator").mockImplementation(() => {});
        await expect(getUpdatedApiData()).resolves.toEqual(data);
    });
});
