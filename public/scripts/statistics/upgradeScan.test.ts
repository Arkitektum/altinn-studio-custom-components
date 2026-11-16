import { getComparisonLink, getComponentNames, renderUpgradeCheckResults, runUpgradeScan } from "./upgradeScan.ts";
import { openPageFromLocation, redrawOpenPage, renderAdminSidebar } from "./renderers.ts";
import type { RenderTarget } from "./renderHealth.ts";

const target = (
    appName: string,
    formType: string,
    fileName: string | undefined,
    components: unknown[] = [{ id: "a", tagName: "custom-field-data" }]
): RenderTarget => ({
    appOwner: "dibk",
    appName,
    formName: formType.replace("layout:", ""),
    formType,
    components: components as RenderTarget["components"],
    dataModels: [],
    dataType: "Byggesoknad",
    fileNames: fileName ? { Byggesoknad: fileName } : {},
    fileName
});
const packageVersions = [
    { appOwner: "dibk", appName: "et-v4", packageVersions: { altinnStudioCustomComponents: "17.2.0" } },
    { appOwner: "dibk", appName: "rs-v4", packageVersions: { altinnStudioCustomComponents: "17.1.0" } },
    { appOwner: "dibk", appName: "ta-v4", packageVersions: { altinnStudioCustomComponents: "17.0.0" } }
];

describe("getComparisonLink", () => {
    it("links to the Display layouts comparison for the form and example file", () => {
        expect(getComparisonLink(target("et-v4", "layout:DisplayLayout", "eksempel 2.xml"))).toBe(
            "/statistics/display-layouts?owner=dibk&app=et-v4&form=layout%3ADisplayLayout&file.Byggesoknad=eksempel+2.xml&compare=1"
        );
        expect(getComparisonLink(target("et-v4", "sub-v1", "s.xml"))).toBe(
            "/statistics/display-layouts?owner=dibk&app=et-v4&form=sub-v1&file.Byggesoknad=s.xml&compare=1"
        );
    });
});

describe("getComponentNames", () => {
    it("names the drawn components by id, or tag name, skipping entries without a tag name, as they are drawn", () => {
        expect(
            getComponentNames(target("et-v4", "layout:X", "a.xml", [{ id: "a", tagName: "t" }, { id: "x" }, { tagName: "custom-divider" }]))
        ).toEqual(["a", "custom-divider"]);
    });
});

describe("runUpgradeScan", () => {
    beforeEach(() => {
        Object.assign(globalThis, { multilingualDefaultTextResources: [], multilingualAppResourceValues: [] });
    });

    it("compares every drawing with an example file against its app's installed version, and lists those that differ", async () => {
        const asked: string[] = [];
        const progress: [number, number][] = [];
        const apps = await runUpgradeScan(
            [
                target("et-v4", "layout:DisplayLayout", "a.xml"),
                target("et-v4", "layout:DisplayLayout", "b.xml"),
                target("et-v4", "sub-v1", undefined),
                target("rs-v4", "layout:DisplayLayout", "r.xml")
            ],
            packageVersions,
            async (drawing, version) => {
                asked.push(`${drawing.appName} ${drawing.fileName} ${version}`);
                return drawing.fileName === "b.xml" ? ["a"] : [];
            },
            (done, total) => progress.push([done, total])
        );
        expect(asked).toEqual(["et-v4 a.xml 17.2.0", "et-v4 b.xml 17.2.0", "rs-v4 r.xml 17.1.0"]);
        expect(progress).toEqual([
            [1, 3],
            [2, 3],
            [3, 3]
        ]);
        expect(apps).toEqual([
            {
                appOwner: "dibk",
                appName: "et-v4",
                version: "17.2.0",
                drawings: 2,
                changes: [
                    {
                        formName: "DisplayLayout",
                        fileName: "b.xml",
                        components: ["a"],
                        link: getComparisonLink(target("et-v4", "layout:DisplayLayout", "b.xml"))
                    }
                ]
            },
            { appOwner: "dibk", appName: "rs-v4", version: "17.1.0", drawings: 1, changes: [] }
        ]);
    });

    it("lists an app with no known installed version without drawing it", async () => {
        let drawn = 0;
        const apps = await runUpgradeScan([target("ukjent-v1", "layout:X", "a.xml")], packageVersions, async () => {
            drawn++;
            return [];
        });
        expect(drawn).toBe(0);
        expect(apps).toEqual([{ appOwner: "dibk", appName: "ukjent-v1", version: undefined, drawings: 0, changes: [] }]);
    });

    it("stops drawing an app once its installed version cannot be loaded", async () => {
        let drawn = 0;
        const apps = await runUpgradeScan([target("ta-v4", "layout:X", "a.xml"), target("ta-v4", "layout:X", "b.xml")], packageVersions, async () => {
            drawn++;
            return null;
        });
        expect(drawn).toBe(1);
        expect(apps[0]).toMatchObject({ appName: "ta-v4", unavailable: true, drawings: 0 });
    });

    it("draws each app with its own nb texts", async () => {
        Object.assign(globalThis, {
            multilingualAppResourceValues: [
                { appOwner: "dibk", appName: "et-v4", resourceValues: [{ id: "appName", values: { nb: "Søknad" } }] },
                { appOwner: "dibk", appName: "rs-v4", resourceValues: [{ id: "appName", values: { nb: "Ramme" } }] }
            ]
        });
        const seen: unknown[] = [];
        await runUpgradeScan([target("et-v4", "layout:X", "a.xml"), target("rs-v4", "layout:X", "a.xml")], packageVersions, async () => {
            seen.push((globalThis.textResources as { resources: { value: string }[] }).resources[0]!.value);
            return [];
        });
        expect(seen).toEqual(["Søknad", "Ramme"]);
    });
});

describe("renderUpgradeCheckResults", () => {
    beforeEach(() => {
        globalThis.lastUpdated = "2026-11-16T10:00:00.000Z";
    });
    const result = {
        lastUpdated: "2026-11-16T10:00:00.000Z",
        apps: [
            {
                appOwner: "dibk",
                appName: "et-v4",
                version: "17.2.0",
                drawings: 4,
                changes: [
                    {
                        formName: "DisplayLayout",
                        fileName: "b.xml",
                        components: ["tittel", "<b>x</b>"],
                        link: "/statistics/display-layouts?owner=dibk&app=et-v4&compare=1"
                    }
                ]
            },
            { appOwner: "dibk", appName: "rs-v4", version: "17.1.0", drawings: 1, changes: [] },
            { appOwner: "dibk", appName: "ta-v4", version: "17.0.0", drawings: 0, changes: [], unavailable: true },
            { appOwner: "dibk", appName: "ukjent-v1", version: undefined, drawings: 0, changes: [] }
        ]
    };

    it("lists the apps that would change, with each drawing linked to its comparison, as text", () => {
        const element = document.createElement("div");
        renderUpgradeCheckResults(element, result);
        expect(element.querySelector(".upgrade-check-summary")!.textContent).toBe("1 of 2 checked apps would draw differently with the local build.");
        const app = element.querySelector("details.upgrade-check-app")!;
        expect(app.querySelector("summary")!.textContent).toBe("dibk/et-v4, installed 17.2.0: 1 of 4 drawings change");
        const link = app.querySelector("li a") as HTMLAnchorElement;
        expect(link.getAttribute("href")).toBe("/statistics/display-layouts?owner=dibk&app=et-v4&compare=1");
        expect(link.textContent).toBe("DisplayLayout, b.xml");
        expect(app.querySelector("li")!.textContent).toBe("DisplayLayout, b.xml: tittel, <b>x</b>");
        expect(app.querySelector("li b")).toBeNull();
    });
    it("names the apps that draw the same and those that were not checked, and why", () => {
        const element = document.createElement("div");
        renderUpgradeCheckResults(element, result);
        expect(Array.from(element.querySelectorAll(".upgrade-check-others")).map((line) => line.textContent)).toEqual([
            "Draw the same: dibk/rs-v4 (17.1.0)",
            "Not checked, the installed version could not be loaded: dibk/ta-v4 (17.0.0)",
            "Not checked, the installed version is not known: dibk/ukjent-v1"
        ]);
    });
    it("says every checked app draws the same when none changes", () => {
        const element = document.createElement("div");
        renderUpgradeCheckResults(element, { lastUpdated: globalThis.lastUpdated, apps: [result.apps[1]!] });
        expect(element.querySelector(".upgrade-check-summary")!.textContent).toBe("Every checked app draws the same with the local build, 1 app.");
    });
    it("says when the results are from before the last synchronization, and shows nothing before the first check", () => {
        const element = document.createElement("div");
        renderUpgradeCheckResults(element, { ...result, lastUpdated: "2026-11-01T10:00:00.000Z" });
        expect(element.querySelector(".render-health-stale")).not.toBeNull();
        renderUpgradeCheckResults(element, null);
        expect(element.textContent).toBe("");
    });
});

describe("upgrade check page", () => {
    const originalFetch = globalThis.fetch;
    const originalError = console.error;
    afterEach(() => {
        globalThis.fetch = originalFetch;
        console.error = originalError;
        history.replaceState(null, "", "/statistics");
    });

    it("opens from the sidebar, and lists an app whose installed version cannot be loaded as not checked", async () => {
        console.error = () => {};
        globalThis.fetch = (async () => ({ ok: false, status: 502, json: async () => ({}) })) as unknown as typeof fetch;
        document.body.innerHTML = '<div id="sidebar"></div><main id="admin-main"></main>';
        Object.assign(globalThis, {
            lastUpdated: "2026-11-16T10:00:00.000Z",
            displayLayouts: [
                {
                    appOwner: "dibk",
                    appName: "et-v4",
                    dataType: "Byggesoknad",
                    displayLayouts: [{ name: "DisplayLayout", layout: { data: { layout: [{ id: "a", tagName: "custom-field-data" }] } } }]
                }
            ],
            exampleData: [{ appOwner: "dibk", appName: "et-v4", dataType: "Byggesoknad", files: [{ name: "a.xml", data: {} }] }],
            altinnStudioForms: [{ appOwner: "dibk", appName: "et-v4", dataType: "Byggesoknad" }],
            packageVersions: [packageVersions[0]],
            multilingualDefaultTextResources: [],
            multilingualAppResourceValues: []
        });
        renderAdminSidebar();
        (
            Array.from(document.querySelectorAll("#sidebar button")).find((button) => button.textContent === "Upgrade check") as HTMLButtonElement
        ).click();
        expect(location.pathname + location.search).toBe("/statistics/upgrade-check");
        const button = document.getElementById("upgrade-check-button") as HTMLButtonElement;
        expect(button.textContent).toBe("Check all apps");
        await (button.onclick as unknown as () => Promise<void>)();
        expect(button.disabled).toBe(false);
        expect(document.querySelector(".upgrade-check-others")!.textContent).toBe(
            "Not checked, the installed version could not be loaded: dibk/et-v4 (17.2.0)"
        );
        expect(document.querySelector(".upgrade-scan-frames")).toBeNull();
        history.replaceState(null, "", "/statistics/upgrade-check");
        await openPageFromLocation();
        expect(document.querySelector(".upgrade-check-others")!.textContent).toContain("dibk/et-v4");
        globalThis.lastUpdated = "2026-11-17T10:00:00.000Z";
        await redrawOpenPage();
        expect(document.querySelectorAll("#admin-main h2")).toHaveLength(1);
        expect(document.querySelector("#admin-main .render-health-stale")).not.toBeNull();
    });
});
