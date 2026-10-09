import { loadDevTools } from "./index.ts";

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
    applicationMetadata: []
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

function settle() {
    return new Promise((resolve) => setTimeout(resolve, 20));
}

describe("loadDevTools", () => {
    const originalFetch = globalThis.fetch;
    const originalConsoleError = console.error;

    beforeEach(() => {
        localStorage.clear();
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

        expect(requested.length).toBe(6);
        expect(document.querySelector("#sidebar ul")).not.toBeNull();
        expect(document.querySelector(".no-data-message")).toBeNull();
        expect(localStorage.getItem("lastUpdated")).not.toBeNull();
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

    it("says there is no data yet when the first synchronization fails, stores nothing, and renders no sidebar", async () => {
        stubApi(["exampleData"]);

        await loadDevTools();
        await settle();

        expect(document.querySelector(".no-data-message")!.textContent).toContain("No data yet");
        expect(document.querySelector("#sidebar ul")).toBeNull();
        expect(localStorage.getItem("lastUpdated")).toBeNull();
        expect(localStorage.getItem("displayLayouts")).toBeNull();
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
        expect(localStorage.getItem("lastUpdated")).not.toBeNull();
    });
});
