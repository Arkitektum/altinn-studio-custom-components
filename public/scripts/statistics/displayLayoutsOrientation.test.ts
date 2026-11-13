import "../../../src/components/index.ts";
import { openPageFromLocation } from "./renderers.ts";

// Unmocked on purpose: gjennomfoeringsplan says it prints in landscape as the real component is placed.
describe("the page's orientation on the display layouts page", () => {
    const originalWarn = console.warn;
    const app = (appName: string, tagName: string) => ({
        appOwner: "dibk",
        appName,
        displayLayouts: [
            { name: "DisplayLayout", layout: { data: { layout: [{ id: "c", type: "Custom", tagName, dataModelBindings: { data: "x" } }] } } }
        ]
    });

    beforeEach(() => {
        console.warn = () => {};
        document.body.innerHTML = '<div id="sidebar"></div><main id="admin-main"></main>';
        Object.assign(globalThis, {
            displayLayouts: [app("plan-v1", "custom-gjennomfoeringsplan"), app("soknad-v1", "custom-field-data")],
            exampleData: [],
            applicationMetadata: [],
            altinnStudioForms: [],
            multilingualDefaultTextResources: [],
            multilingualAppResourceValues: [],
            appResourceValues: [],
            packageVersions: [],
            defaultTextResources: { resources: [] },
            textResources: { resources: [] }
        });
    });
    afterEach(() => {
        console.warn = originalWarn;
        history.replaceState(null, "", "#");
    });

    async function openApp(appName: string) {
        history.replaceState(null, "", `#/display-layouts?owner=dibk&app=${appName}`);
        await openPageFromLocation();
        await new Promise((resolve) => setTimeout(resolve, 20));
        return document.querySelector("#admin-main > .page")!;
    }

    it("draws a form that prints in landscape on a landscape page", async () => {
        expect((await openApp("plan-v1")).classList.contains("landscape")).toBe(true);
        expect(globalThis.pageOrientation).toBe("landscape");
    });

    it("draws the next form on a portrait page again, rather than keeping the landscape of the one before", async () => {
        await openApp("plan-v1");
        const page = await openApp("soknad-v1");
        expect(page.classList.contains("landscape")).toBe(false);
        expect(globalThis.pageOrientation).toBeUndefined();
    });
});
