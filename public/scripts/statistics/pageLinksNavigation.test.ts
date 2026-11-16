import { openPageFromLocation, redrawOpenPage, renderAdminSidebar } from "./renderers.ts";

/**
 * Unmocked on purpose, like redrawOpenPage.test.ts: what is under test is that the address follows the real filter controls, and that the controls follow the address.
 */
function choose(select: HTMLSelectElement, value: string) {
    select.value = value;
    select.dispatchEvent(new Event("change", { bubbles: true }));
}

function clickSidebar(label: string) {
    (Array.from(document.querySelectorAll("#sidebar button")).find((button) => button.textContent === label) as HTMLButtonElement).click();
}

function settle() {
    return new Promise((resolve) => setTimeout(resolve, 20));
}

async function openFromAddress(hash: string) {
    history.replaceState(null, "", hash);
    await openPageFromLocation();
}

describe("statistics page links", () => {
    let main: HTMLElement;
    const originalWarn = console.warn;

    beforeEach(() => {
        document.body.innerHTML = '<div id="sidebar"></div><main id="admin-main"></main>';
        main = document.getElementById("admin-main")!;
        console.warn = () => {};
        Object.assign(globalThis, {
            displayLayouts: [
                { appOwner: "o", appName: "a", displayLayouts: [], subForms: [{ appName: "sub-v1" }] },
                { appOwner: "o", appName: "b", displayLayouts: [] }
            ],
            allTextResourceUsage: [],
            componentUsage: [
                { tagName: "custom-header", usages: [{ id: "h", appOwner: "o", appName: "a" }] },
                { tagName: "custom-field-data", usages: [{ id: "d", appOwner: "o", appName: "a", subformAppName: "sub-v1" }] }
            ],
            dataModelBindingDrift: [],
            subformDataModelDrift: [],
            packageVersions: [],
            latestPackageVersions: {}
        });
        history.replaceState(null, "", "/statistics");
        renderAdminSidebar();
    });

    afterEach(() => {
        console.warn = originalWarn;
    });

    it("puts a page opened from the sidebar in the address, with an entry in the history", () => {
        const length = history.length;
        clickSidebar("Component usage");
        expect(location.pathname + location.search).toBe("/statistics/component-usage");
        expect(history.length).toBe(length + 1);
        clickSidebar("Package versions");
        expect(location.pathname + location.search).toBe("/statistics/package-versions");
        expect(history.length).toBe(length + 2);
    });

    it("puts the page in the address as soon as it is chosen, before a page that loads data first is drawn", () => {
        clickSidebar("Display layouts");
        expect(location.pathname + location.search).toBe("/statistics/display-layouts");
    });

    it("puts a filter choice in the address without adding to the history", () => {
        clickSidebar("Component usage");
        const length = history.length;
        choose(main.querySelector("#component-form-filter-select") as HTMLSelectElement, "sub-v1");
        expect(location.pathname + location.search).toBe("/statistics/component-usage?form=sub-v1");
        expect(history.length).toBe(length);
    });

    it("puts typed text in the address as it is typed", () => {
        clickSidebar("Subform data models");
        const input = main.querySelector('input[type="text"]') as HTMLInputElement;
        input.value = "eiendom";
        input.dispatchEvent(new Event("input", { bubbles: true }));
        expect(location.pathname + location.search).toBe("/statistics/subform-data-models?path=eiendom");
    });

    it("opens the page an address names, with its filters chosen and the list filtered by them", async () => {
        await openFromAddress("/statistics/component-usage?form=sub-v1");
        expect(main.querySelector("h2")!.textContent).toBe("Component usage");
        expect((main.querySelector("#component-form-filter-select") as HTMLSelectElement).value).toBe("sub-v1");
        expect(Array.from(main.querySelectorAll("#component-usage-list .component-tag-name")).map((node) => node.textContent)).toEqual([
            "custom-field-data"
        ]);
        expect(location.pathname + location.search).toBe("/statistics/component-usage?form=sub-v1");
    });

    it("opens a page from the sidebar with the filters reset, after one opened from an address", async () => {
        await openFromAddress("/statistics/data-model-bindings?finding=missing&all=1");
        expect((main.querySelector("#binding-drift-show-without-findings") as HTMLInputElement).checked).toBe(true);
        clickSidebar("Data model bindings");
        expect((main.querySelector("#binding-drift-show-without-findings") as HTMLInputElement).checked).toBe(false);
        expect(location.pathname + location.search).toBe("/statistics/data-model-bindings");
    });

    it("drops choices the page no longer offers from the address", async () => {
        await openFromAddress("/statistics/component-usage?owner=o&app=gone&form=nope");
        expect((main.querySelector("#component-form-filter-select") as HTMLSelectElement).value).toBe("");
        expect(location.pathname + location.search).toBe("/statistics/component-usage");
    });

    it("opens the page an old # link names, and moves the address to the new form", async () => {
        history.replaceState(null, "", "/statistics.html#/component-usage?form=sub-v1");
        await openPageFromLocation();
        expect(main.querySelector("h2")!.textContent).toBe("Component usage");
        expect((main.querySelector("#component-form-filter-select") as HTMLSelectElement).value).toBe("sub-v1");
        expect(location.pathname + location.search + location.hash).toBe("/statistics/component-usage?form=sub-v1");
    });

    it("opens a statistics page linked from another in place, with an entry in the history", async () => {
        clickSidebar("Package versions");
        const length = history.length;
        const link = document.createElement("a");
        link.href = "/statistics/component-usage?form=sub-v1";
        main.appendChild(link);
        const event = new MouseEvent("click", { bubbles: true, cancelable: true, button: 0 });
        link.dispatchEvent(event);
        await new Promise((resolve) => setTimeout(resolve, 0));
        expect(event.defaultPrevented).toBe(true);
        expect(main.querySelector("h2")!.textContent).toBe("Component usage");
        expect(location.pathname + location.search).toBe("/statistics/component-usage?form=sub-v1");
        expect(history.length).toBe(length + 1);
    });

    it("leaves other links, and links opened with a modifier key, to the browser", () => {
        clickSidebar("Package versions");
        const other = document.createElement("a");
        other.href = "/devTools";
        const statistics = document.createElement("a");
        statistics.href = "/statistics/component-usage";
        main.append(other, statistics);
        const plain = new MouseEvent("click", { bubbles: true, cancelable: true, button: 0 });
        other.dispatchEvent(plain);
        const withCtrl = new MouseEvent("click", { bubbles: true, cancelable: true, button: 0, ctrlKey: true });
        statistics.dispatchEvent(withCtrl);
        expect(plain.defaultPrevented).toBe(false);
        expect(withCtrl.defaultPrevented).toBe(false);
        expect(main.querySelector("h2")!.textContent).toBe("Package versions");
    });

    it("leaves the open page alone for an address that names no page", async () => {
        clickSidebar("Package versions");
        await openFromAddress("/statistics/no-such-page");
        expect(main.querySelector("h2")!.textContent).toBe("Package versions");
    });

    it("keeps the address in step when the open page is drawn again after a synchronization", async () => {
        clickSidebar("Component usage");
        choose(main.querySelector("#component-form-filter-select") as HTMLSelectElement, "sub-v1");
        history.replaceState(null, "", "/statistics/component-usage");
        await redrawOpenPage();
        expect(location.pathname + location.search).toBe("/statistics/component-usage?form=sub-v1");
    });

    describe("display layouts", () => {
        beforeEach(() => {
            Object.assign(globalThis, {
                exampleData: [],
                applicationMetadata: [],
                multilingualDefaultTextResources: [{ id: "resource.a", values: { nb: "A", nn: "A på nynorsk" } }],
                multilingualAppResourceValues: [],
                appResourceValues: [],
                defaultTextResources: undefined
            });
        });

        it("puts the app chosen on the page in the address", async () => {
            clickSidebar("Display layouts");
            await settle();
            expect(location.pathname + location.search).toBe("/statistics/display-layouts");
            choose(main.querySelector("#select-display-layout-application") as HTMLSelectElement, "o/a");
            await settle();
            expect(location.pathname + location.search).toBe("/statistics/display-layouts?owner=o&app=a");
        });

        it("puts the language chosen in the address before any app is chosen", async () => {
            clickSidebar("Display layouts");
            await settle();
            choose(main.querySelector("#select-language-for-resources") as HTMLSelectElement, "nn");
            await settle();
            expect(location.pathname + location.search).toBe("/statistics/display-layouts?lang=nn");
        });

        it("opens with the app and language an address names, and that language's text resources", async () => {
            await openFromAddress("/statistics/display-layouts?owner=o&app=a&lang=nn");
            await settle();
            expect((main.querySelector("#select-display-layout-application") as HTMLSelectElement).value).toBe("o/a");
            expect((main.querySelector("#select-language-for-resources") as HTMLSelectElement).value).toBe("nn");
            expect((globalThis.defaultTextResources as { language: string }).language).toBe("nn");
            expect(location.pathname + location.search).toBe("/statistics/display-layouts?owner=o&app=a&lang=nn");
        });
    });
});
