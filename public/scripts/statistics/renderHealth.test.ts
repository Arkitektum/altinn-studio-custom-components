import "../../../src/components/index.ts";
import { checkRenderTarget, getRenderTargets, renderRenderHealthResults, runRenderHealthCheck } from "./renderHealth.ts";
import type { RenderTarget } from "./renderHealth.ts";

// Unmocked on purpose: the components are the real ones, drawn in jsdom, so a failure is one a reader would see.
const healthy = { id: "tittel", type: "Custom", tagName: "custom-field-data", dataModelBindings: { simpleBinding: "soeknad.tittel" } };
const failing = { id: "liste", type: "Custom", tagName: "custom-feedbacklist-data", dataModelBindings: { simpleBinding: "soeknad.antall" } };

function target(components: unknown[], data: unknown = { soeknad: { tittel: "Søknad", antall: 42 } }): RenderTarget {
    return {
        appOwner: "dibk",
        appName: "et-v4",
        formName: "DisplayLayout",
        components: components as RenderTarget["components"],
        dataModels: [{ dataType: "Byggesoknad", data: { "eksempel.xml": data } }],
        dataType: "Byggesoknad",
        fileNames: { Byggesoknad: "eksempel.xml" },
        fileName: "eksempel.xml"
    };
}

describe("getRenderTargets", () => {
    const displayLayouts = [
        {
            appOwner: "dibk",
            appName: "et-v4",
            dataType: "Byggesoknad",
            displayLayouts: [
                { name: "DisplayLayout", layout: { data: { layout: [healthy] } } },
                { name: "Empty", layout: { data: { layout: [] } } }
            ],
            subForms: [
                { appName: "sub-v1", dataType: "Vedlegg", layout: { data: { layout: [healthy] } } },
                { appName: "sub-v2", dataType: "Kart", layout: { data: { layout: [healthy] } } }
            ]
        }
    ];
    const exampleData = [
        {
            appOwner: "dibk",
            appName: "et-v4",
            dataType: "Byggesoknad",
            files: [
                { name: "a.xml", data: {} },
                { name: "b.xml", data: {} }
            ]
        },
        { appOwner: "dibk", appName: "et-v4", dataType: "Vedlegg", files: [{ name: "v.xml", data: {} }] },
        { appOwner: "other", appName: "et-v4", dataType: "Kart", files: [{ name: "not-this-app.xml", data: {} }] }
    ];
    const forms = [{ appOwner: "dibk", appName: "et-v4", dataType: "Byggesoknad" }];

    it("draws each form once per example file of its data type, and once without data when it has none", () => {
        const targets = getRenderTargets(displayLayouts, exampleData, forms);
        expect(targets.map(({ formName, fileName, fileNames }) => ({ formName, fileName, fileNames }))).toEqual([
            { formName: "DisplayLayout", fileName: "a.xml", fileNames: { Byggesoknad: "a.xml" } },
            { formName: "DisplayLayout", fileName: "b.xml", fileNames: { Byggesoknad: "b.xml" } },
            { formName: "sub-v1", fileName: "v.xml", fileNames: { Vedlegg: "v.xml" } },
            { formName: "sub-v2", fileName: undefined, fileNames: {} }
        ]);
    });
    it("reads text bindings from the app's main data type, as the display layouts page does", () => {
        const targets = getRenderTargets(displayLayouts, exampleData, forms);
        expect(targets.every(({ dataType }) => dataType === "Byggesoknad")).toBe(true);
        expect(targets[0]!.dataModels).toEqual([
            { dataType: "Byggesoknad", data: { "a.xml": {}, "b.xml": {} } },
            { dataType: "Vedlegg", data: { "v.xml": {} } }
        ]);
    });
    it("draws nothing without display layouts", () => {
        expect(getRenderTargets(undefined, exampleData, forms)).toEqual([]);
    });
});

describe("checkRenderTarget", () => {
    let host: HTMLElement;
    const { error } = console;
    beforeEach(() => {
        globalThis.defaultTextResources = { resources: [] };
        globalThis.textResources = { resources: [] };
        host = document.createElement("div");
        document.body.appendChild(host);
    });
    afterEach(() => {
        host.remove();
        console.error = error;
    });

    it("finds nothing in a form whose components all draw", () => {
        expect(checkRenderTarget(target([healthy]), host)).toEqual([]);
    });
    it("lists a component that showed the render error notice, with what it threw", () => {
        const failures = checkRenderTarget(target([healthy, failing]), host);
        expect(failures).toHaveLength(1);
        expect(failures[0]).toMatchObject({
            appOwner: "dibk",
            appName: "et-v4",
            formName: "DisplayLayout",
            fileName: "eksempel.xml",
            component: "custom-feedbacklist-data",
            componentId: "liste",
            layoutComponent: "liste"
        });
        expect(/^\w*Error: .+/.test(failures[0]!.error)).toBe(true);
    });
    it("reports a form that could not be drawn at all", () => {
        expect(checkRenderTarget(target([healthy, { id: "x", tagName: "custom-component" }]), host)).toEqual([
            {
                appOwner: "dibk",
                appName: "et-v4",
                formName: "DisplayLayout",
                fileName: "eksempel.xml",
                component: "(the whole form)",
                componentId: "",
                layoutComponent: "",
                error: "Error: Invalid tag name custom-component"
            }
        ]);
    });
    it("empties the element it drew in, keeps the failures' log lines off the console, and gives the console back", () => {
        const logged: unknown[][] = [];
        console.error = (...args: unknown[]) => {
            logged.push(args);
        };
        const ownConsoleError = console.error;
        checkRenderTarget(target([failing]), host);
        expect(host.childNodes).toHaveLength(0);
        expect(logged).toEqual([]);
        expect(console.error).toBe(ownConsoleError);
    });
});

describe("runRenderHealthCheck", () => {
    it("draws every form out of sight, reports progress after each, and removes what it drew in", async () => {
        Object.assign(globalThis, {
            multilingualDefaultTextResources: [],
            multilingualAppResourceValues: [{ appOwner: "dibk", appName: "et-v4", resourceValues: [{ id: "app.title", values: { nb: "Tittel" } }] }]
        });
        const progress: [number, number][] = [];
        let hiddenWhileDrawing: HTMLElement["hidden"] | undefined;
        const failures = await runRenderHealthCheck([target([failing]), target([healthy])], (done, total) => {
            progress.push([done, total]);
            hiddenWhileDrawing = (document.querySelector(".render-health-drawing") as HTMLElement | null)?.hidden;
        });
        expect(failures.map(({ component }) => component)).toEqual(["custom-feedbacklist-data"]);
        expect(progress).toEqual([
            [1, 2],
            [2, 2]
        ]);
        expect(hiddenWhileDrawing).toBe(true);
        expect(document.querySelector(".render-health-drawing")).toBeNull();
        expect(globalThis.textResources).toEqual({ language: "nb", resources: [{ id: "app.title", value: "Tittel" }] });
    });
});

describe("renderRenderHealthResults", () => {
    const failure = {
        appOwner: "dibk",
        appName: "et-v4",
        formName: "sub-v1",
        fileName: undefined,
        component: "custom-field-data",
        componentId: "inner",
        layoutComponent: "outer",
        error: "TypeError: <b>x</b>"
    };
    beforeEach(() => {
        globalThis.lastUpdated = "2026-11-13T10:00:00.000Z";
    });

    it("says every component was drawn when none failed", () => {
        const element = document.createElement("div");
        renderRenderHealthResults(element, { failures: [], drawings: 12, lastUpdated: globalThis.lastUpdated });
        expect(element.textContent).toBe("Every component was drawn, in 12 drawings.");
    });
    it("counts the failures and the drawings they were in, and lists them as text", () => {
        const element = document.createElement("div");
        renderRenderHealthResults(element, {
            failures: [failure, { ...failure, componentId: "other" }],
            drawings: 12,
            lastUpdated: globalThis.lastUpdated
        });
        expect(element.querySelector(".render-health-summary")!.textContent).toBe("2 components could not be drawn, in 1 of 12 drawings.");
        const cells = Array.from(element.querySelectorAll("tbody tr:first-child td")).map((cell) => cell.textContent);
        expect(cells).toEqual(["dibk/et-v4", "sub-v1", "None", "<custom-field-data> inner, in outer", "TypeError: <b>x</b>"]);
        expect(element.querySelector("tbody b")).toBeNull();
    });
    it("says when the results are from before the last synchronization", () => {
        const element = document.createElement("div");
        renderRenderHealthResults(element, { failures: [], drawings: 1, lastUpdated: "2026-11-01T10:00:00.000Z" });
        expect(element.querySelector(".render-health-stale")!.textContent).toBe(
            "These results are from before the last synchronization. Check again to see the current data."
        );
    });
    it("shows nothing before the first check", () => {
        const element = document.createElement("div");
        element.textContent = "old";
        renderRenderHealthResults(element, null);
        expect(element.textContent).toBe("");
    });
});
