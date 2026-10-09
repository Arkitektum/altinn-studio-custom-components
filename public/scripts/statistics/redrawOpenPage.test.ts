import { redrawOpenPage, renderAdminSidebar, renderComponentUsagePage, renderPackageVersionsPage, renderResourceUsagePage } from "./renderers.ts";

/**
 * The pages are drawn for real here, with nothing mocked, since what is under test is that each one comes back from
 * the new data on globalThis with the choices made on it intact. renderers.test.ts mocks every page's parts.
 */
const usage = (appName: string, subformAppName?: string) => ({
    appOwner: "o",
    appName,
    layouts: [{ layoutName: subformAppName || "DisplayLayout", ...(subformAppName ? { subformAppName } : {}), componentsUsingResource: [] }]
});

function choose(select: HTMLSelectElement, value: string) {
    select.value = value;
    select.dispatchEvent(new Event("change"));
}

function settle() {
    return new Promise((resolve) => setTimeout(resolve, 20));
}

describe("redrawOpenPage", () => {
    let main: HTMLElement;
    const originalWarn = console.warn;

    beforeEach(() => {
        document.body.innerHTML = '<div id="sidebar"></div><main id="admin-main"></main>';
        main = document.getElementById("admin-main")!;
        // Instantiating components for usage counts warns about tags the fixtures make up.
        console.warn = () => {};
        Object.assign(globalThis, {
            displayLayouts: [
                { appOwner: "o", appName: "a", displayLayouts: [], subForms: [{ appName: "sub-v1" }] },
                { appOwner: "o", appName: "b", displayLayouts: [] }
            ],
            allTextResourceUsage: [
                { resource: { id: "before.main", values: { nb: "Hei" } }, usage: [usage("a")] },
                { resource: { id: "before.sub", values: { nb: "Hallo" } }, usage: [usage("a", "sub-v1")] }
            ],
            componentUsage: [{ tagName: "custom-header", usages: [{ id: "h", appOwner: "o", appName: "a", subformAppName: "sub-v1" }] }],
            packageVersions: [{ appOwner: "o", appName: "a", packageVersions: { altinnStudioCustomComponents: "1.0.0" } }],
            latestPackageVersions: { altinnStudioCustomComponents: "1.0.0", altinnAppFrontend: "4.0.0" }
        });
    });

    afterEach(() => {
        console.warn = originalWarn;
    });

    // First in the file on purpose: which page is open is kept for the module, and every later test opens one.
    it("leaves the main area alone when no page has been opened", async () => {
        main.innerHTML = "<p>untouched</p>";
        await redrawOpenPage();
        expect(main.innerHTML).toBe("<p>untouched</p>");
    });

    it("draws Resource usage again from the new data, keeping the app and form chosen on it", () => {
        renderResourceUsagePage(main);
        choose(main.querySelector("#application-filter-select") as HTMLSelectElement, "o/a");
        choose(main.querySelector("#form-filter-select") as HTMLSelectElement, "sub-v1");

        globalThis.allTextResourceUsage = [
            { resource: { id: "after.main", values: { nb: "Hei" } }, usage: [usage("a")] },
            { resource: { id: "after.sub", values: { nb: "Hallo" } }, usage: [usage("a", "sub-v1")] }
        ];
        redrawOpenPage();

        expect((main.querySelector("#application-filter-select") as HTMLSelectElement).value).toBe("o/a");
        expect((main.querySelector("#form-filter-select") as HTMLSelectElement).value).toBe("sub-v1");
        expect(Array.from(main.querySelectorAll(".resource-id")).map((node) => node.textContent)).toEqual(["after.sub"]);
        expect(main.querySelectorAll("h2").length).toBe(1);
    });

    it("draws Component usage again from the new data, keeping the form chosen on it", () => {
        renderComponentUsagePage(main);
        choose(main.querySelector("#component-form-filter-select") as HTMLSelectElement, "sub-v1");

        globalThis.componentUsage = [
            { tagName: "custom-header", usages: [{ id: "h", appOwner: "o", appName: "a" }] },
            { tagName: "custom-field-data", usages: [{ id: "d", appOwner: "o", appName: "a", subformAppName: "sub-v1" }] }
        ];
        redrawOpenPage();

        expect((main.querySelector("#component-form-filter-select") as HTMLSelectElement).value).toBe("sub-v1");
        expect(Array.from(main.querySelectorAll("#component-usage-list .component-tag-name")).map((node) => node.textContent)).toEqual([
            "custom-field-data"
        ]);
    });

    it("draws Package versions again from the new data", () => {
        renderPackageVersionsPage(main);
        globalThis.packageVersions = [{ appOwner: "o", appName: "b", packageVersions: { altinnStudioCustomComponents: "2.0.0" } }];

        redrawOpenPage();

        expect(main.textContent).toContain("o/b");
        expect(main.textContent).not.toContain("o/a");
    });

    it("draws Display layouts again with the app and language chosen on it, setting that language up again", async () => {
        Object.assign(globalThis, {
            displayLayouts: [
                {
                    appOwner: "o",
                    appName: "a",
                    dataType: "A",
                    displayLayouts: [
                        { name: "DisplayLayout", layout: { data: { layout: [{ id: "t", tagName: "custom-header-text", type: "Custom" }] } } }
                    ]
                }
            ],
            exampleData: [{ appOwner: "o", appName: "a", dataType: "A", error: null, files: [{ name: "Standard", data: {} }] }],
            applicationMetadata: [{ appOwner: "o", appName: "a", metadata: {} }],
            altinnStudioForms: [{ appOwner: "o", appName: "a", dataType: "A" }],
            multilingualDefaultTextResources: [{ id: "common.yes", values: { nb: "Ja", en: "Yes" } }],
            multilingualAppResourceValues: [
                { appOwner: "o", appName: "a", resourceValues: [{ id: "appName", values: { nb: "Søknad", en: "Application" } }] }
            ],
            appResourceValues: []
        });
        renderAdminSidebar();
        (
            Array.from(document.querySelectorAll("#sidebar button")).find((button) =>
                button.textContent!.includes("Display layouts")
            ) as HTMLButtonElement
        ).click();
        await settle();
        choose(main.querySelector("#select-display-layout-application") as HTMLSelectElement, "o/a");
        await settle();
        choose(main.querySelector("#select-language-for-resources") as HTMLSelectElement, "en");
        await settle();

        // What a synchronization leaves behind: new app texts, and the default language's resources on globalThis.
        globalThis.multilingualAppResourceValues = [
            { appOwner: "o", appName: "a", resourceValues: [{ id: "appName", values: { nb: "Ny søknad", en: "New application" } }] }
        ];
        globalThis.defaultTextResources = { language: "nb", resources: [{ id: "common.yes", value: "Ja" }] };
        await redrawOpenPage();

        expect((main.querySelector("#select-display-layout-application") as HTMLSelectElement).value).toBe("o/a");
        expect((main.querySelector("#select-language-for-resources") as HTMLSelectElement).value).toBe("en");
        expect(globalThis.defaultTextResources).toEqual({ language: "en", resources: [{ id: "common.yes", value: "Yes" }] });
        expect(globalThis.textResources).toEqual({ language: "en", resources: [{ id: "appName", value: "New application" }] });
        expect(main.querySelectorAll("h2").length).toBe(1);
    });
});
