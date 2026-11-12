import { loadApiData, saveApiData } from "./apiDataStore.ts";
import { loadDevTools } from "./index.ts";
import { useFakeIndexedDb } from "./fakeIndexedDb.ts";

/**
 * loadDevTools runs against the real helpers here, with only fetch stubbed, for the same reason as
 * applyApiData.test.ts: index.test.ts mocks what this would need to exercise.
 */
const bodies: Record<string, unknown> = {
    displayLayouts: [],
    packageVersions: [],
    latestPackageVersions: {},
    appResources: [],
    exampleData: [],
    applicationMetadata: [],
    subformDataModels: [{ dataType: "SubformDataV1", copies: [] }]
};

/** Answers every API request from `bodies`, failing the ones named in `failing`. */
function stubApi(failing: string[] = []) {
    const requested: string[] = [];
    globalThis.fetch = (async (url: string) => {
        const endpoint = String(url).split("/api/")[1]!.split("?")[0]!;
        requested.push(endpoint);
        if (failing.includes(endpoint)) {
            return { ok: false, statusText: "Bad Gateway", json: async () => null };
        }
        return { ok: true, json: async () => bodies[endpoint] };
    }) as unknown as typeof fetch;
    return requested;
}

/** The stored values for the given names. */
async function stored(...keys: string[]) {
    return loadApiData(keys);
}

function settle() {
    return new Promise((resolve) => setTimeout(resolve, 20));
}

describe("loadDevTools", () => {
    const originalFetch = globalThis.fetch;
    const originalConsoleError = console.error;

    beforeEach(() => {
        localStorage.clear();
        useFakeIndexedDb();
        document.body.innerHTML = '<div id="sidebar"></div><main id="admin-main"></main>';
        // The fetch helpers log each failure; the failures here are on purpose.
        console.error = () => {};
    });

    afterEach(() => {
        globalThis.fetch = originalFetch;
        console.error = originalConsoleError;
    });

    it("synchronizes when nothing is stored, then renders the sidebar", async () => {
        const requested = stubApi();

        await loadDevTools();

        expect(requested.length).toBe(7);
        expect(requested).toContain("subformDataModels");
        expect(document.querySelector("#sidebar ul")).not.toBeNull();
        expect(document.querySelector(".no-data-message")).toBeNull();
        expect((await stored("lastUpdated")).lastUpdated).toEqual(expect.any(String));
        expect((await stored("subformDataModels")).subformDataModels).toEqual([{ dataType: "SubformDataV1", copies: [] }]);
    });

    it("uses what is stored without asking the API", async () => {
        stubApi();
        await loadDevTools();
        document.body.innerHTML = '<div id="sidebar"></div><main id="admin-main"></main>';
        const requested = stubApi();

        await loadDevTools();

        expect(requested).toEqual([]);
        expect(document.querySelector("#sidebar ul")).not.toBeNull();
    });

    it("synchronizes when what is stored is from before the subform data models were synchronized", async () => {
        await saveApiData({
            displayLayouts: [],
            packageVersions: [],
            latestPackageVersions: {},
            multilingualAppResourceValues: [],
            exampleData: [],
            applicationMetadata: [],
            lastUpdated: "2026-10-01T10:00:00.000Z"
        });
        document.body.innerHTML = '<div id="sidebar"></div><main id="admin-main"></main>';
        const requested = stubApi();

        await loadDevTools();

        expect(requested.length).toBe(7);
        expect((await stored("subformDataModels")).subformDataModels).toEqual([{ dataType: "SubformDataV1", copies: [] }]);
    });

    it("says there is no data yet when the first synchronization fails, stores nothing, and renders no sidebar", async () => {
        stubApi(["exampleData"]);

        await loadDevTools();
        await settle();

        expect(document.querySelector(".no-data-message")!.textContent).toContain("No data yet");
        expect(document.querySelector("#sidebar ul")).toBeNull();
        expect(await stored("lastUpdated", "displayLayouts")).toEqual({ lastUpdated: undefined, displayLayouts: undefined });
    });

    it("draws the open page again from what a synchronization brings", async () => {
        stubApi();
        await loadDevTools();
        (
            Array.from(document.querySelectorAll("#sidebar button")).find((button) =>
                button.textContent!.includes("Package versions")
            ) as HTMLButtonElement
        ).click();
        expect(document.getElementById("admin-main")!.textContent).not.toContain("dibk/new-v1");

        bodies.packageVersions = [{ appOwner: "dibk", appName: "new-v1", packageVersions: { altinnStudioCustomComponents: "1.0.0" } }];
        try {
            (
                Array.from(document.querySelectorAll("#sidebar button")).find(
                    (button) => button.textContent === "Synchronize data"
                ) as HTMLButtonElement
            ).click();
            await settle();
        } finally {
            bodies.packageVersions = [];
        }

        expect(document.getElementById("admin-main")!.textContent).toContain("dibk/new-v1");
    });

    it("loads the tools when Try again succeeds", async () => {
        stubApi(["exampleData"]);
        await loadDevTools();
        await settle();
        stubApi();

        (document.querySelector(".no-data-message button") as HTMLButtonElement).click();
        await settle();

        expect(document.querySelector(".no-data-message")).toBeNull();
        expect(document.querySelector("#sidebar ul")).not.toBeNull();
        expect((await stored("lastUpdated")).lastUpdated).toEqual(expect.any(String));
    });

    it("stores what a synchronization brings, for the next page load", async () => {
        stubApi();
        await loadDevTools();

        bodies.packageVersions = [{ appOwner: "dibk", appName: "new-v1", packageVersions: { altinnStudioCustomComponents: "1.0.0" } }];
        try {
            (
                Array.from(document.querySelectorAll("#sidebar button")).find(
                    (button) => button.textContent === "Synchronize data"
                ) as HTMLButtonElement
            ).click();
            await settle();
        } finally {
            bodies.packageVersions = [];
        }

        expect(((await stored("packageVersions")).packageVersions as { appName: string }[]).map((app) => app.appName)).toEqual(["new-v1"]);
    });

    it("removes what was kept in localStorage before, and leaves the dev tools page's own values", async () => {
        localStorage.setItem("exampleData", "[]");
        localStorage.setItem("lastUpdated", "2026-10-01T10:00:00.000Z");
        localStorage.setItem("dataModels", "[]");
        stubApi();

        await loadDevTools();

        expect([localStorage.getItem("exampleData"), localStorage.getItem("lastUpdated"), localStorage.getItem("dataModels")]).toEqual([
            null,
            null,
            "[]"
        ]);
    });

    it("still loads the tools when the data cannot be stored", async () => {
        // No IndexedDB at all: reading fails, so it synchronizes, and storing fails too.
        (globalThis as { indexedDB?: unknown }).indexedDB = undefined;
        const requested = stubApi();

        await loadDevTools();

        expect(requested.length).toBe(7);
        expect(document.querySelector("#sidebar ul")).not.toBeNull();
        expect(document.querySelector(".no-data-message")).toBeNull();
    });
});
