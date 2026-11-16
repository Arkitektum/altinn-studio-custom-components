import "../../../src/components/index.ts";
import { openPageFromLocation, renderAdminSidebar } from "./renderers.ts";

// Unmocked on purpose: the button is drawn by the real display layouts page.
describe("Compare with installed version on the display layouts page", () => {
    const originalWarn = console.warn;
    const originalError = console.error;
    const originalFetch = globalThis.fetch;

    /** The label the button shows now: it holds every label it switches between, stacked, so it keeps its width. */
    const shownLabel = (button: HTMLElement) => button.querySelector(".stacked-labels > span:not(.stacked-label-unused)")!.textContent;

    async function openPage(
        packageVersions: unknown[],
        { language = "nb", multilingualAppResourceValues = [] as unknown[], otherApps = [] as unknown[] } = {}
    ) {
        document.body.innerHTML = '<div id="sidebar"></div><main id="admin-main"></main>';
        Object.assign(globalThis, {
            displayLayouts: [
                {
                    appOwner: "dibk",
                    appName: "et-v4",
                    displayLayouts: [
                        {
                            name: "DisplayLayout",
                            layout: {
                                data: {
                                    layout: [
                                        { id: "tittel", type: "Custom", tagName: "custom-field-data", dataModelBindings: { simpleBinding: "tittel" } }
                                    ]
                                }
                            }
                        }
                    ]
                },
                ...otherApps
            ],
            exampleData: [],
            applicationMetadata: [],
            altinnStudioForms: [{ appOwner: "dibk", appName: "et-v4", dataType: "Byggesoknad" }],
            multilingualDefaultTextResources: [],
            multilingualAppResourceValues,
            appResourceValues: [],
            packageVersions
        });
        history.replaceState(null, "", `/statistics/display-layouts?owner=dibk&app=et-v4${language === "nb" ? "" : `&lang=${language}`}`);
        await openPageFromLocation();
        await new Promise((resolve) => setTimeout(resolve, 20));
        return document.getElementById("admin-main")!;
    }

    beforeEach(() => {
        console.warn = () => {};
        console.error = () => {};
        globalThis.fetch = (async () => ({
            ok: false,
            status: 502,
            json: async () => ({ error: "Failed to fetch package files" })
        })) as unknown as typeof fetch;
    });
    afterEach(() => {
        console.warn = originalWarn;
        console.error = originalError;
        globalThis.fetch = originalFetch;
        history.replaceState(null, "", "/statistics");
    });

    it("offers to compare with the version the app has installed, beside Open in developer tools", async () => {
        const main = await openPage([{ appOwner: "dibk", appName: "et-v4", packageVersions: { altinnStudioCustomComponents: "17.2.0" } }]);
        const button = main.querySelector(".upgrade-preview-button") as HTMLButtonElement;
        expect(shownLabel(button)).toBe("Compare with 17.2.0");
        expect(button.disabled).toBe(false);
        expect(button.parentElement!.querySelector(".open-in-devtools-button")).not.toBeNull();
    });

    it("shows the comparison in place of the drawing, and the drawing again when closed", async () => {
        const main = await openPage([{ appOwner: "dibk", appName: "et-v4", packageVersions: { altinnStudioCustomComponents: "17.2.0" } }]);
        const button = main.querySelector(".upgrade-preview-button") as HTMLButtonElement;
        const preview = main.querySelector(".upgrade-preview") as HTMLElement;
        const page = main.querySelector(".page") as HTMLElement;
        expect(preview.hidden).toBe(true);
        await (button.onclick as unknown as () => Promise<void>)();
        expect(preview.hidden).toBe(false);
        expect(page.hidden).toBe(true);
        expect(shownLabel(button)).toBe("Close comparison");
        expect(Array.from(button.querySelectorAll(".stacked-labels > span")).map((label) => label.textContent)).toEqual([
            "Compare with 17.2.0",
            "Close comparison"
        ]);
        expect(preview.querySelector(".upgrade-preview-status")!.textContent).toBe(
            "Version 17.2.0 could not be loaded from the API. Is it running, and can it reach npm?"
        );
        await (button.onclick as unknown as () => Promise<void>)();
        expect(preview.hidden).toBe(true);
        expect(preview.childNodes).toHaveLength(0);
        expect(page.hidden).toBe(false);
        expect(shownLabel(button)).toBe("Compare with 17.2.0");
    });

    it("cannot compare when the app's installed version is not known, and says why", async () => {
        const main = await openPage([]);
        const button = main.querySelector(".upgrade-preview-button") as HTMLButtonElement;
        expect(button.textContent).toBe("Compare with installed version");
        expect(button.disabled).toBe(true);
        expect(button.title).toBe("The app's installed version of the package is not known. Synchronize to read it from the app.");
    });

    it("gives the comparison the form's elements with their data, and nothing drawn", async () => {
        const asked: string[] = [];
        const main = await openPage([{ appOwner: "dibk", appName: "et-v4", packageVersions: { altinnStudioCustomComponents: "17.2.0" } }], {
            language: "nn",
            multilingualAppResourceValues: [
                { appOwner: "dibk", appName: "et-v4", resourceValues: [{ id: "app.only.nb", values: { nb: "Bare bokmål" } }] }
            ]
        });
        globalThis.fetch = (async (url: string) => {
            asked.push(String(url));
            return { ok: true, json: async () => ({ language: "nb", resources: [] }) };
        }) as unknown as typeof fetch;
        const button = main.querySelector(".upgrade-preview-button") as HTMLButtonElement;
        void (button.onclick as unknown as () => Promise<void>)();
        await new Promise((resolve) => setTimeout(resolve, 20));
        const frames = Array.from(main.querySelectorAll(".upgrade-preview iframe")) as HTMLIFrameElement[];
        expect(frames.map((frame) => frame.title)).toEqual(["The form drawn with version 17.2.0", "The form drawn with the local build"]);
        expect(frames.map((frame) => frame.style.width)).toEqual(["21cm", "21cm"]);
        const components = new DOMParser().parseFromString(frames[0]!.srcdoc, "text/html").querySelector("#preview-components")!;
        const frameDocument = new DOMParser().parseFromString(frames[0]!.srcdoc, "text/html");
        expect(frameDocument.body.className).toBe("org-dibk app-et-v4");
        expect(frameDocument.querySelector("#admin-main > .page > img.logo-image")).not.toBeNull();
        expect(frameDocument.querySelector("#admin-main > .page > h1")!.textContent).toBe(
            document.querySelector("#admin-main > .page > h1")!.textContent
        );
        expect(frameDocument.querySelector("#preview-components h1")).toBeNull();
        expect(
            Array.from(frameDocument.querySelector("#admin-main > .page")!.children).map(
                (child) => child.tagName.toLowerCase() + (child.id ? `#${child.id}` : "")
            )
        ).toEqual(["img", "h1", "div#preview-components"]);
        const field = components.querySelector("custom-field-data")!;
        expect(field.id).toBe("tittel");
        expect(field.children).toHaveLength(0);
        expect(frames[0]!.srcdoc).toContain("/api/packageFiles/17.2.0/main.js");
        for (const frame of frames) {
            const frameGlobals: Record<string, unknown> = {};
            new Function("globalThis", new DOMParser().parseFromString(frame.srcdoc, "text/html").querySelector("head script")!.textContent!)(
                frameGlobals
            );
            expect(frameGlobals.fallbackTextResources).toEqual({ language: "nb", resources: [{ id: "app.only.nb", value: "Bare bokmål" }] });
            expect((frameGlobals.fallbackDefaultTextResources as { language: string }).language).toBe("nb");
        }
        expect(frames[1]!.srcdoc).toContain(`${location.origin}/main.js`);
        const scriptSource = (frame: HTMLIFrameElement) =>
            new DOMParser()
                .parseFromString(frame.srcdoc, "text/html")
                .querySelector('meta[http-equiv="Content-Security-Policy"]')!
                .getAttribute("content")!;
        expect(scriptSource(frames[0]!)).not.toContain("'unsafe-eval'");
        expect(scriptSource(frames[1]!)).toContain("script-src 'unsafe-inline' 'unsafe-eval'");
        expect(asked).toHaveLength(1);
    });

    describe("staying open as the choices change", () => {
        const versions = [
            { appOwner: "dibk", appName: "et-v4", packageVersions: { altinnStudioCustomComponents: "17.2.0" } },
            { appOwner: "dibk", appName: "rs-v4", packageVersions: { altinnStudioCustomComponents: "17.1.0" } }
        ];
        const settle = () => new Promise((resolve) => setTimeout(resolve, 20));
        const secondApp = {
            appOwner: "dibk",
            appName: "rs-v4",
            displayLayouts: [{ name: "DisplayLayout", layout: { data: { layout: [{ id: "x", type: "Custom", tagName: "custom-field-data" }] } } }]
        };
        const isComparing = (main: HTMLElement) =>
            !(main.querySelector(".upgrade-preview") as HTMLElement).hidden && (main.querySelector("#admin-main > .page") as HTMLElement).hidden;

        it("puts an open comparison in the address, and takes it out when closed", async () => {
            const main = await openPage(versions);
            const button = main.querySelector(".upgrade-preview-button") as HTMLButtonElement;
            await (button.onclick as unknown as () => Promise<void>)();
            expect(location.pathname + location.search).toBe("/statistics/display-layouts?owner=dibk&app=et-v4&compare=1");
            await (button.onclick as unknown as () => Promise<void>)();
            expect(location.pathname + location.search).toBe("/statistics/display-layouts?owner=dibk&app=et-v4");
        });

        it("keeps comparing when another app is chosen, with that app's installed version", async () => {
            const main = await openPage(versions, { otherApps: [secondApp] });
            await (main.querySelector(".upgrade-preview-button") as HTMLButtonElement as unknown as { onclick: () => Promise<void> }).onclick();
            const select = main.querySelector("#select-display-layout-application") as HTMLSelectElement;
            select.value = "dibk/rs-v4";
            select.dispatchEvent(new Event("change"));
            await settle();
            expect(isComparing(main)).toBe(true);
            expect(shownLabel(main.querySelector(".upgrade-preview-button")!)).toBe("Close comparison");
            expect(main.querySelector(".upgrade-preview-status")!.textContent).toContain("17.1.0");
            expect(location.pathname + location.search).toBe("/statistics/display-layouts?owner=dibk&app=rs-v4&compare=1");
        });

        it("keeps comparing when the language changes", async () => {
            const main = await openPage(versions);
            await (main.querySelector(".upgrade-preview-button") as HTMLButtonElement as unknown as { onclick: () => Promise<void> }).onclick();
            const select = main.querySelector("#select-language-for-resources") as HTMLSelectElement;
            select.value = "nn";
            select.dispatchEvent(new Event("change"));
            await settle();
            expect(isComparing(main)).toBe(true);
            expect(location.pathname + location.search).toBe("/statistics/display-layouts?owner=dibk&app=et-v4&lang=nn&compare=1");
        });

        it("opens comparing from an address that says so", async () => {
            document.body.innerHTML = '<div id="sidebar"></div><main id="admin-main"></main>';
            history.replaceState(null, "", "/statistics/display-layouts?owner=dibk&app=et-v4&compare=1");
            await openPageFromLocation();
            await settle();
            const main = document.getElementById("admin-main")!;
            expect(isComparing(main)).toBe(true);
        });

        it("shows an app with no known installed version on its own, and compares again for the next app that has one", async () => {
            const main = await openPage([versions[0]], { otherApps: [secondApp] });
            await (main.querySelector(".upgrade-preview-button") as HTMLButtonElement as unknown as { onclick: () => Promise<void> }).onclick();
            const select = main.querySelector("#select-display-layout-application") as HTMLSelectElement;
            select.value = "dibk/rs-v4";
            select.dispatchEvent(new Event("change"));
            await settle();
            expect(isComparing(main)).toBe(false);
            expect((main.querySelector(".upgrade-preview-button") as HTMLButtonElement).disabled).toBe(true);
            const back = main.querySelector("#select-display-layout-application") as HTMLSelectElement;
            back.value = "dibk/et-v4";
            back.dispatchEvent(new Event("change"));
            await settle();
            expect(isComparing(main)).toBe(true);
        });

        it("starts closed when the page is opened from the sidebar", async () => {
            const main = await openPage(versions);
            await (main.querySelector(".upgrade-preview-button") as HTMLButtonElement as unknown as { onclick: () => Promise<void> }).onclick();
            renderAdminSidebar();
            (Array.from(document.querySelectorAll("#sidebar button")).find((b) => b.textContent === "Display layouts") as HTMLButtonElement).click();
            await settle();
            const select = document.querySelector("#select-display-layout-application") as HTMLSelectElement;
            select.value = "dibk/et-v4";
            select.dispatchEvent(new Event("change"));
            await settle();
            expect(isComparing(document.getElementById("admin-main")!)).toBe(false);
        });
    });
});
