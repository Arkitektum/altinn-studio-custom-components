import { openPageFromLocation } from "./renderers.ts";

// Unmocked on purpose: the logo is sized by the org class on body, which the real page sets as it draws.
describe("the app's classes on body, on the display layouts page", () => {
    const originalWarn = console.warn;
    const layout = (appOwner: string, appName: string) => ({
        appOwner,
        appName,
        displayLayouts: [{ name: "DisplayLayout", layout: { data: { layout: [{ id: "t", type: "Custom", tagName: "custom-field-data" }] } } }]
    });

    beforeEach(() => {
        console.warn = () => {};
        document.body.className = "developer-tools admin";
        document.body.innerHTML = '<div id="sidebar"></div><main id="admin-main"></main>';
        Object.assign(globalThis, {
            displayLayouts: [layout("dibk", "et-v4"), layout("dat", "kart-v1")],
            exampleData: [],
            applicationMetadata: [],
            altinnStudioForms: [],
            multilingualDefaultTextResources: [],
            multilingualAppResourceValues: [],
            appResourceValues: [],
            packageVersions: []
        });
    });
    afterEach(() => {
        console.warn = originalWarn;
        history.replaceState(null, "", "#");
    });

    async function openAddress(hash: string) {
        history.replaceState(null, "", hash);
        await openPageFromLocation();
        await new Promise((resolve) => setTimeout(resolve, 20));
    }

    it("are set when the page opens on an app from its address, so the logo is sized from the start", async () => {
        await openAddress("#/display-layouts?owner=dibk&app=et-v4");
        expect(document.body.classList.contains("org-dibk")).toBe(true);
        expect(document.body.classList.contains("app-et-v4")).toBe(true);
        expect(document.body.classList.contains("developer-tools")).toBe(true);
    });

    it("follow the app chosen in the picker", async () => {
        await openAddress("#/display-layouts?owner=dibk&app=et-v4");
        const select = document.getElementById("select-display-layout-application") as HTMLSelectElement;
        select.value = "dat/kart-v1";
        select.dispatchEvent(new Event("change"));
        await new Promise((resolve) => setTimeout(resolve, 20));
        expect(document.body.classList.contains("org-dat")).toBe(true);
        expect(document.body.classList.contains("app-kart-v1")).toBe(true);
        expect(document.body.classList.contains("org-dibk")).toBe(false);
    });

    it("are taken away when the page opens with no app chosen", async () => {
        await openAddress("#/display-layouts?owner=dibk&app=et-v4");
        await openAddress("#/display-layouts");
        expect(document.body.classList.contains("org-dibk")).toBe(false);
        expect(document.body.classList.contains("app-et-v4")).toBe(false);
    });
});
