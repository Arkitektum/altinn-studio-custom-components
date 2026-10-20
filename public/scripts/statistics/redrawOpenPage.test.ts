import {
    redrawOpenPage,
    renderAdminSidebar,
    renderComponentUsagePage,
    renderDataModelBindingsPage,
    renderPackageVersionsPage,
    renderResourceUsagePage
} from "./renderers.ts";

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

    it("draws Data model bindings again from the new data, keeping the app and finding chosen on it", () => {
        const bindingUsage = (id: string, appName: string, missing: string[]) => ({
            id,
            appOwner: "o",
            appName,
            layoutName: "DisplayLayout",
            missing,
            ignored: [],
            deprecated: [],
            unknown: []
        });
        globalThis.dataModelBindingDrift = [{ tagName: "custom-dispensasjon", usages: [bindingUsage("before", "a", ["plannavn"])] }];
        renderDataModelBindingsPage(main);
        choose(main.querySelector("#binding-drift-application-filter-select") as HTMLSelectElement, "o/a");
        choose(main.querySelector("#binding-drift-finding-filter-select") as HTMLSelectElement, "missing");
        const checkbox = main.querySelector("#binding-drift-show-without-findings") as HTMLInputElement;
        checkbox.checked = true;
        checkbox.dispatchEvent(new Event("change"));

        globalThis.dataModelBindingDrift = [
            { tagName: "custom-dispensasjon", usages: [bindingUsage("after-a", "a", ["plannavn"]), bindingUsage("after-b", "b", ["metadata"])] }
        ];
        redrawOpenPage();

        expect((main.querySelector("#binding-drift-application-filter-select") as HTMLSelectElement).value).toBe("o/a");
        expect((main.querySelector("#binding-drift-finding-filter-select") as HTMLSelectElement).value).toBe("missing");
        expect((main.querySelector("#binding-drift-show-without-findings") as HTMLInputElement).checked).toBe(true);
        expect(Array.from(main.querySelectorAll(".binding-drift-usage-id")).map((node) => node.textContent)).toEqual(["after-a"]);
        expect(main.querySelectorAll("h2").length).toBe(1);
    });

    it("opens Data model bindings from the sidebar with every filter reset", () => {
        globalThis.dataModelBindingDrift = [];
        Object.assign(globalThis, {
            bindingDriftSelectedAppOwner: "o",
            bindingDriftSelectedAppName: "a",
            bindingDriftSelectedForm: ":main",
            bindingDriftFindingFilter: "unknown",
            bindingDriftShowWithoutFindings: true
        });
        renderAdminSidebar();
        (
            Array.from(document.querySelectorAll("#sidebar button")).find(
                (button) => button.textContent === "Data model bindings"
            ) as HTMLButtonElement
        ).click();

        expect(main.querySelector("h2")!.textContent).toBe("Data model bindings");
        expect([globalThis.bindingDriftSelectedAppName, globalThis.bindingDriftSelectedForm, globalThis.bindingDriftFindingFilter]).toEqual([
            "",
            "",
            ""
        ]);
        expect(globalThis.bindingDriftShowWithoutFindings).toBe(false);
        expect((main.querySelector("#binding-drift-show-without-findings") as HTMLInputElement).checked).toBe(false);
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

describe("the Subform data models page", () => {
    let main: HTMLElement;
    const originalFetch = globalThis.fetch;

    /** The API's answer: two apps whose copies of one subform differ in one field. */
    function subformDataModels(extraField: string) {
        const field = (path: string) => ({ path, node: "element", type: "string", minOccurs: 1, maxOccurs: 1 });
        return [
            {
                dataType: "DispensasjonssoeknadDataV1",
                copies: [
                    { appOwner: "o", appName: "a", error: null, rootElement: "Dispensasjon", fields: [field("felles"), field(extraField)] },
                    { appOwner: "o", appName: "b", error: null, rootElement: "Dispensasjon", fields: [field("felles")] }
                ]
            }
        ];
    }

    /** Answers the next requests with the given bodies in turn, and counts them. */
    function stubFetch(...bodies: unknown[]) {
        const requested: string[] = [];
        globalThis.fetch = (async (url: string) => {
            requested.push(String(url));
            const body = bodies.shift();
            if (body instanceof Error) return { ok: false, statusText: body.message, json: async () => ({}) };
            return { ok: true, json: async () => body };
        }) as unknown as typeof fetch;
        return requested;
    }

    function openFromSidebar() {
        renderAdminSidebar();
        (
            Array.from(document.querySelectorAll("#sidebar button")).find(
                (button) => button.textContent === "Subform data models"
            ) as HTMLButtonElement
        ).click();
    }

    function differingPaths() {
        return Array.from(main.querySelectorAll(".subform-model-path")).map((node) => node.textContent);
    }

    beforeEach(() => {
        document.body.innerHTML = '<div id="sidebar"></div><main id="admin-main"></main>';
        main = document.getElementById("admin-main")!;
    });

    afterEach(() => {
        globalThis.fetch = originalFetch;
    });

    it("fetches the models when opened from the sidebar, saying so until they arrive, with every filter reset", async () => {
        const requested = stubFetch(subformDataModels("ny"));
        globalThis.subformModelSelectedApp = "o/a";
        globalThis.subformModelPathFilter = "nothing like it";
        globalThis.subformModelShowAgreeing = true;

        openFromSidebar();
        expect(main.querySelector(".subform-model-status")!.textContent).toContain("Reading every app's copy");
        await settle();

        expect(requested).toHaveLength(1);
        expect(requested[0]!.endsWith("/api/subformDataModels")).toBe(true);
        expect(main.querySelector(".subform-model-status")).toBeNull();
        expect((main.querySelector("#subform-model-application-filter-select") as HTMLSelectElement).value).toBe("");
        expect((main.querySelector("#subform-model-path-filter-input") as HTMLInputElement).value).toBe("");
        expect((main.querySelector("#subform-model-show-agreeing") as HTMLInputElement).checked).toBe(false);
        expect(differingPaths()).toEqual(["ny"]);
    });

    it("fetches the models again when drawn again after a synchronization, keeping the app and path chosen on it", async () => {
        const requested = stubFetch(subformDataModels("ny"), subformDataModels("nyere"));
        openFromSidebar();
        await settle();
        choose(main.querySelector("#subform-model-application-filter-select") as HTMLSelectElement, "o/b");
        const input = main.querySelector("#subform-model-path-filter-input") as HTMLInputElement;
        input.value = "ny";
        input.dispatchEvent(new Event("input"));

        await redrawOpenPage();

        expect(requested).toHaveLength(2);
        expect((main.querySelector("#subform-model-application-filter-select") as HTMLSelectElement).value).toBe("o/b");
        expect((main.querySelector("#subform-model-path-filter-input") as HTMLInputElement).value).toBe("ny");
        expect(differingPaths()).toEqual(["nyere"]);
        expect(main.querySelectorAll("h2").length).toBe(1);
    });

    it("says the models could not be fetched, rather than drawing an empty page", async () => {
        stubFetch(new Error("Bad Gateway"));
        openFromSidebar();
        await settle();

        expect(main.querySelector(".subform-model-status")!.textContent).toBe(
            "The subform data models could not be fetched: Failed to fetch subform data models: Bad Gateway"
        );
        expect(main.querySelector("#subform-model-list")).toBeNull();
    });

    it("does not draw the models into a page opened while they were being fetched", async () => {
        stubFetch(subformDataModels("ny"));
        openFromSidebar();
        (
            Array.from(document.querySelectorAll("#sidebar button")).find((button) => button.textContent === "Package versions") as HTMLButtonElement
        ).click();
        await settle();

        expect(main.querySelector("#subform-model-list")).toBeNull();
        expect(main.querySelector(".subform-model-status")).toBeNull();
        expect(Array.from(main.querySelectorAll("h2")).map((node) => node.textContent)).toEqual(["Package versions"]);
    });
});
