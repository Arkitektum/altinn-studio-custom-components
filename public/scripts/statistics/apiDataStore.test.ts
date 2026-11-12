import { LEGACY_LOCAL_STORAGE_KEYS, loadApiData, removeLegacyLocalStorage, saveApiData } from "./apiDataStore.ts";
import { useFakeIndexedDb } from "./fakeIndexedDb.ts";

describe("the synchronized data store", () => {
    beforeEach(() => {
        useFakeIndexedDb();
    });

    it("reads back what was stored, as it was stored", async () => {
        const exampleData = [{ appOwner: "dibk", appName: "app-v1", files: [{ name: "Eksempel", data: { felt: 1 } }] }];
        await saveApiData({ exampleData, lastUpdated: "2026-11-12T10:00:00.000Z" });

        expect(await loadApiData(["exampleData", "lastUpdated"])).toEqual({ exampleData, lastUpdated: "2026-11-12T10:00:00.000Z" });
    });

    it("reads a name with nothing stored as undefined", async () => {
        expect(await loadApiData(["exampleData"])).toEqual({ exampleData: undefined });
    });

    it("stores more than localStorage could hold", async () => {
        // About 6 million characters, more than the 5 MB a site gets in localStorage.
        const eiendom = Array.from({ length: 60000 }, (_, index) => ({ id: index, beskrivelse: "x".repeat(90) }));
        await saveApiData({ exampleData: eiendom });

        expect(((await loadApiData(["exampleData"])).exampleData as unknown[]).length).toBe(60000);
    });

    it("replaces everything that was stored before", async () => {
        await saveApiData({ exampleData: ["old"], packageVersions: ["old"] });
        await saveApiData({ exampleData: ["new"] });

        expect(await loadApiData(["exampleData", "packageVersions"])).toEqual({ exampleData: ["new"], packageVersions: undefined });
    });

    it("saves nothing when one value cannot be stored, keeping what was stored before", async () => {
        await saveApiData({ exampleData: ["old"], lastUpdated: "before" });

        await expect(saveApiData({ lastUpdated: "after", exampleData: [() => "not cloneable"] })).rejects.toBeDefined();

        expect(await loadApiData(["exampleData", "lastUpdated"])).toEqual({ exampleData: ["old"], lastUpdated: "before" });
    });
});

describe("removeLegacyLocalStorage", () => {
    it("removes what the statistics page kept in localStorage and leaves the dev tools page's own values", () => {
        localStorage.clear();
        for (const key of LEGACY_LOCAL_STORAGE_KEYS) {
            localStorage.setItem(key, "[]");
        }
        localStorage.setItem("dataModels", "[]");
        localStorage.setItem("code", "{}");
        localStorage.setItem("textResources", "{}");

        removeLegacyLocalStorage();

        expect(LEGACY_LOCAL_STORAGE_KEYS.filter((key) => localStorage.getItem(key) !== null)).toEqual([]);
        expect(["dataModels", "code", "textResources"].map((key) => localStorage.getItem(key))).toEqual(["[]", "{}", "{}"]);
    });
});
