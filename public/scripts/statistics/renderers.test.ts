import type { ApiValue } from "../types.ts";
// Minimal tests for exported functions in statistics/renderers.js

// Mock the utils package
jest.mock("@arkitektum/altinn-studio-custom-components-utils", () => ({
    CustomElementHtmlAttributes: jest.fn(),
    addContainerElement: jest.fn(),
    appendChildren: jest.fn(),
    createCustomElement: jest.fn(),
    getDataForComponent: jest.fn()
}));

// Mock local dependencies
jest.mock("../localStorage.ts", () => ({
    addDataToGlobalThis: jest.fn(),
    addValueToLocalStorage: jest.fn(),
    addValuesToLocalStorage: jest.fn()
}));

jest.mock("./apiHelpers.ts", () => ({
    fetchAltinnStudioForms: (jest.fn() as unknown as jest.Mock).mockResolvedValue([]),
    fetchApplicationMetadata: (jest.fn() as unknown as jest.Mock).mockResolvedValue([]),
    fetchExampleData: (jest.fn() as unknown as jest.Mock).mockResolvedValue([]),
    getUpdatedApiData: (jest.fn() as unknown as jest.Mock).mockResolvedValue({})
}));

jest.mock("../getters.ts", () => ({
    getAppResourceValuesForLanguage: jest.fn(),
    getResourcesForLanguage: jest.fn()
}));

jest.mock("../textResourceUsageRenderers.ts", () => ({
    renderDefaultTextResourcesList: jest.fn(),
    renderSelectApplicationFilterForTextResourcesList: jest.fn(),
    renderSelectFormFilterForTextResourcesList: jest.fn(),
    renderTextInputFilterForTextResourcesList: jest.fn(),
    renderUsageFilterForTextResourcesList: jest.fn()
}));

jest.mock("../languages.ts", () => ({
    languages: ["nb", "en"]
}));

jest.mock("./componentUsageRenderers.ts", () => ({
    renderComponentUsageList: jest.fn(),
    renderSelectApplicationFilterForComponentUsageList: jest.fn(),
    renderSelectComponentTypeFilterForComponentUsageList: jest.fn(),
    renderSelectFormFilterForComponentUsageList: jest.fn(),
    renderTextInputFilterForComponentUsageList: jest.fn(),
    renderUsageFilterForComponentUsageList: jest.fn()
}));

jest.mock("../../../src/functions/htmlElementHelpers.ts", () => ({
    updateBodyClassNamesForApplication: jest.fn()
}));

import {
    findExampleDataForApp,
    getApplicationMetadataForSelectedApp,
    getDataModelsForApp,
    getDisplayLayoutMainHeading,
    getLocalTextResourcesForApp,
    renderAdminSidebar,
    renderComponentUsagePage,
    renderExampleDataError,
    renderLogoImage,
    renderNoDataMessage,
    renderPackageVersionsPage,
    renderResourceUsagePage,
    renderSynchronizeButton,
    setDefaultSelectedFileNameForDisplayLayouts
} from "./renderers.ts";

// Import the mocked modules to set up their implementations
import {
    renderComponentUsageList,
    renderSelectApplicationFilterForComponentUsageList,
    renderSelectComponentTypeFilterForComponentUsageList,
    renderSelectFormFilterForComponentUsageList,
    renderTextInputFilterForComponentUsageList,
    renderUsageFilterForComponentUsageList
} from "./componentUsageRenderers.ts";
import {
    renderDefaultTextResourcesList,
    renderSelectApplicationFilterForTextResourcesList,
    renderSelectFormFilterForTextResourcesList,
    renderTextInputFilterForTextResourcesList,
    renderUsageFilterForTextResourcesList
} from "../textResourceUsageRenderers.ts";
import { getUpdatedApiData } from "./apiHelpers.ts";

describe("renderAdminSidebar", () => {
    beforeEach(() => {
        document.body.innerHTML = '<div id="admin-main"></div><div id="sidebar"></div>';

        // Setup mock return values
        (renderDefaultTextResourcesList as unknown as jest.Mock).mockReturnValue(document.createElement("div"));
        (renderSelectApplicationFilterForTextResourcesList as unknown as jest.Mock).mockReturnValue(document.createElement("div"));
        (renderSelectFormFilterForTextResourcesList as unknown as jest.Mock).mockReturnValue(document.createElement("div"));
        (renderTextInputFilterForTextResourcesList as unknown as jest.Mock).mockReturnValue(document.createElement("div"));
        (renderUsageFilterForTextResourcesList as unknown as jest.Mock).mockReturnValue(document.createElement("div"));
        (renderComponentUsageList as unknown as jest.Mock).mockReturnValue(document.createElement("div"));
    });
    it("renders sidebar with navigation buttons", () => {
        renderAdminSidebar();
        const sidebar = document.getElementById("sidebar");
        expect(sidebar!.querySelector("ul")).not.toBeNull();
        expect(sidebar!.textContent).toContain("Resource usage");
        expect(sidebar!.textContent).toContain("Package versions");
        expect(sidebar!.textContent).toContain("Display layouts");
    });
});

describe("renderSynchronizeButton", () => {
    beforeEach(() => {
        document.body.innerHTML = '<div id="sidebar"></div>';
        globalThis.lastUpdated = Date.now();

        // Setup mock return values
        (renderDefaultTextResourcesList as unknown as jest.Mock).mockReturnValue(document.createElement("div"));
        (renderSelectApplicationFilterForTextResourcesList as unknown as jest.Mock).mockReturnValue(document.createElement("div"));
        (renderSelectFormFilterForTextResourcesList as unknown as jest.Mock).mockReturnValue(document.createElement("div"));
        (renderTextInputFilterForTextResourcesList as unknown as jest.Mock).mockReturnValue(document.createElement("div"));
        (renderUsageFilterForTextResourcesList as unknown as jest.Mock).mockReturnValue(document.createElement("div"));
        (renderComponentUsageList as unknown as jest.Mock).mockReturnValue(document.createElement("div"));
    });
    it("renders synchronize button and last updated", () => {
        renderSynchronizeButton();
        const sidebar = document.getElementById("sidebar");
        expect(sidebar!.querySelector("button")).not.toBeNull();
        expect(sidebar!.textContent).toContain("Synchronize data");
        expect(sidebar!.textContent).toContain("Last updated:");
    });
    it("can only be pressed once while a synchronization runs, and can be pressed again after it fails", async () => {
        let fail: (reason: unknown) => void = () => {};
        (getUpdatedApiData as unknown as jest.Mock).mockReturnValueOnce(
            new Promise((resolve, reject) => {
                fail = reject;
            })
        );
        renderSynchronizeButton(jest.fn());
        const button = document.querySelector("#sidebar button") as HTMLButtonElement;

        button.click();
        expect(button.disabled).toBe(true);
        expect(button.textContent).toBe("Synchronizing…");

        fail(new Error("Failed to fetch example data: Bad Gateway"));
        await new Promise((resolve) => setTimeout(resolve, 0));
        expect(button.disabled).toBe(false);
        expect(button.textContent).toBe("Synchronize data");
    });
    it("hands nothing on and keeps the old timestamp when the synchronization fails", async () => {
        (getUpdatedApiData as unknown as jest.Mock).mockRejectedValueOnce(new Error("Failed to fetch example data: Bad Gateway"));
        const onSynchronized = jest.fn();
        renderSynchronizeButton(onSynchronized);
        const before = document.querySelector(".last-updated")!.textContent;

        (document.querySelector("#sidebar button") as HTMLButtonElement).click();
        await new Promise((resolve) => setTimeout(resolve, 0));

        expect(onSynchronized).not.toHaveBeenCalled();
        expect(document.querySelector(".last-updated")!.textContent).toBe(before);
    });
    it("hands what it fetched to onSynchronized, with when it was fetched", async () => {
        (getUpdatedApiData as unknown as jest.Mock).mockResolvedValueOnce([1, 2, 3, 4, 5, 6]);
        const onSynchronized = jest.fn();
        renderSynchronizeButton(onSynchronized);

        (document.querySelector("#sidebar button") as HTMLButtonElement).click();
        await new Promise((resolve) => setTimeout(resolve, 0));

        expect(onSynchronized).toHaveBeenCalledTimes(1);
        expect((document.querySelector("#sidebar button") as HTMLButtonElement).disabled).toBe(false);
        const [apiData, lastUpdated] = onSynchronized.mock.calls[0] as [unknown, string];
        expect(apiData).toEqual({
            displayLayouts: 1,
            packageVersions: 2,
            latestPackageVersions: 3,
            multilingualAppResourceValues: 4,
            exampleData: 5,
            applicationMetadata: 6
        });
        expect(new Date(lastUpdated).toISOString()).toBe(lastUpdated);
        expect(document.querySelector(".last-updated")!.textContent).toBe(`Last updated: ${new Date(lastUpdated).toLocaleString()}`);
    });
});

describe("renderNoDataMessage", () => {
    beforeEach(() => {
        document.body.innerHTML = '<main id="admin-main"></main>';
    });

    it("says there is no data yet, in the main area", () => {
        renderNoDataMessage(() => {});
        const message = document.querySelector("#admin-main .no-data-message");
        expect(message!.textContent).toContain("No data yet");
        expect(message!.querySelector("button")!.textContent).toBe("Try again");
    });

    it("removes itself and calls onRetry when Try again is pressed", () => {
        let retried = 0;
        renderNoDataMessage(() => {
            retried++;
        });

        (document.querySelector(".no-data-message button") as HTMLButtonElement).click();

        expect(retried).toBe(1);
        expect(document.querySelector(".no-data-message")).toBeNull();
    });
});

describe("internal renderers functions", () => {
    beforeEach(() => {
        document.body.innerHTML = '<div id="admin-main"></div><div id="sidebar"></div>';
        globalThis.displayLayouts = [
            {
                appName: "app1",
                appOwner: "owner1",
                displayLayouts: [
                    { name: "DisplayLayout", path: "App/ui/form/layouts/DisplayLayout.json", layout: { data: { layout: [{ tagName: "div" }] } } }
                ]
            }
        ];
        globalThis.allTextResourceUsage = [];
        globalThis.packageVersions = [
            {
                appName: "app1",
                appOwner: "owner1",
                packageVersions: { altinnStudioCustomComponents: "1.0", altinnAppFrontendCSS: "2.0", altinnAppFrontendJS: "3.0" }
            }
        ];
        globalThis.latestPackageVersions = {
            altinnStudioCustomComponents: "2.0",
            altinnAppFrontend: "3.0"
        };
        globalThis.textResources = { resources: [{ id: "appName", value: "Test App" }] };
        globalThis.appResourceValues = [{ appName: "app1", appOwner: "owner1", resources: [{ id: "appLogo.url", value: "logo.svg" }] }];
        globalThis.multilingualDefaultTextResources = [];
        globalThis.multilingualAppResourceValues = [];
        globalThis.exampleData = [
            {
                appOwner: "owner1",
                appName: "app1",
                dataType: "dt",
                error: null,
                files: [
                    { name: "Standard", data: {} },
                    { name: "Maksimumsversjon", data: {} }
                ]
            }
        ];
        globalThis.altinnStudioForms = [{ appName: "app1", appOwner: "owner1", dataType: "dt" }];
        globalThis.componentUsage = [{ tagName: "custom-field", usages: [] }];

        // Setup mock return values
        (renderDefaultTextResourcesList as unknown as jest.Mock).mockReturnValue(document.createElement("div"));
        (renderSelectApplicationFilterForTextResourcesList as unknown as jest.Mock).mockReturnValue(document.createElement("div"));
        (renderSelectFormFilterForTextResourcesList as unknown as jest.Mock).mockReturnValue(document.createElement("div"));
        (renderTextInputFilterForTextResourcesList as unknown as jest.Mock).mockReturnValue(document.createElement("div"));
        (renderUsageFilterForTextResourcesList as unknown as jest.Mock).mockReturnValue(document.createElement("div"));
        (renderComponentUsageList as unknown as jest.Mock).mockReturnValue(document.createElement("div"));
        (renderSelectApplicationFilterForComponentUsageList as unknown as jest.Mock).mockReturnValue(document.createElement("div"));
        (renderSelectComponentTypeFilterForComponentUsageList as unknown as jest.Mock).mockReturnValue(document.createElement("div"));
        (renderSelectFormFilterForComponentUsageList as unknown as jest.Mock).mockReturnValue(document.createElement("div"));
        (renderTextInputFilterForComponentUsageList as unknown as jest.Mock).mockReturnValue(document.createElement("div"));
        (renderUsageFilterForComponentUsageList as unknown as jest.Mock).mockReturnValue(document.createElement("div"));
    });
    it("renderComponentUsagePage runs without error", () => {
        const el = document.createElement("div");
        expect(() => renderComponentUsagePage(el)).not.toThrow();
        expect(el.textContent).toContain("Component usage");
    });
    it("offers only apps, not standalone subform entries, to the usage pages' application and form filters", () => {
        globalThis.displayLayouts = [...globalThis.displayLayouts, { appOwner: "owner1", appName: "sub-v1", isSubform: true, layout: {} }];
        const lastApplications = (mock: unknown) => (mock as jest.Mock).mock.calls.at(-1)![2].map((entry: ApiValue) => entry.appName);

        renderResourceUsagePage(document.createElement("div"));
        expect(lastApplications(renderSelectApplicationFilterForTextResourcesList)).toEqual(["app1"]);
        expect(lastApplications(renderSelectFormFilterForTextResourcesList)).toEqual(["app1"]);

        renderComponentUsagePage(document.createElement("div"));
        expect(lastApplications(renderSelectApplicationFilterForComponentUsageList)).toEqual(["app1"]);
        expect(lastApplications(renderSelectFormFilterForComponentUsageList)).toEqual(["app1"]);
    });
    it("renderResourceUsagePage runs without error", () => {
        const el = document.createElement("div");
        expect(() => renderResourceUsagePage(el)).not.toThrow();
        expect(el.textContent).toContain("Resource usage");
    });
    it("renderPackageVersionsPage runs without error", () => {
        const el = document.createElement("div");
        expect(() => renderPackageVersionsPage(el)).not.toThrow();
        expect(el.textContent).toContain("Package versions");
    });
    it("getLocalTextResourcesForApp returns resources or empty array", () => {
        expect(getLocalTextResourcesForApp("app1", "owner1", globalThis.appResourceValues)).toEqual([{ id: "appLogo.url", value: "logo.svg" }]);
        expect(getLocalTextResourcesForApp("nope", "nope", globalThis.appResourceValues)).toEqual([]);
    });
    it("getDisplayLayoutMainHeading returns h1 element", () => {
        const h1 = getDisplayLayoutMainHeading();
        expect(h1.tagName).toBe("H1");
        expect(h1.textContent).toBe("Test App");
    });
    it("setDefaultSelectedFileNameForDisplayLayouts returns unchanged fileNames if empty", () => {
        const selectedOptions = { formType: "main", fileNames: {} };
        const result = setDefaultSelectedFileNameForDisplayLayouts(globalThis.displayLayouts[0], globalThis.exampleData, selectedOptions);
        expect(result).toEqual({});
    });
    it("setDefaultSelectedFileNameForDisplayLayouts defaults to the first file in the order the API gave them", () => {
        // "Standard" comes first in the payload but second alphabetically, so a stray sort would show up here. The
        // ordering prefix is stripped before the names get this far, which is why the array order is all there is.
        const displayLayout = { appName: "app1", appOwner: "owner1", dataType: "dt" };
        const result = setDefaultSelectedFileNameForDisplayLayouts(displayLayout, globalThis.exampleData, { formType: "main", fileNames: {} });
        expect(result).toEqual({ dt: "Standard" });
    });
    it("setDefaultSelectedFileNameForDisplayLayouts does not default from another app's examples", () => {
        const displayLayout = { appName: "app2", appOwner: "owner1", dataType: "dt" };
        const result = setDefaultSelectedFileNameForDisplayLayouts(displayLayout, globalThis.exampleData, { formType: "main", fileNames: {} });
        expect(result).toEqual({});
    });
});

describe("findExampleDataForApp", () => {
    const faV3 = { appOwner: "dibk", appName: "fa-v3", dataType: "FA", error: null, files: [{ name: "Standard", data: { version: 3 } }] };
    const faV5 = { appOwner: "dibk", appName: "fa-v5", dataType: "FA", error: null, files: [{ name: "Standard", data: { version: 5 } }] };
    const subForm = (appName: string | null) => ({
        appOwner: appName ? "dibk" : null,
        appName,
        dataType: "GjennomfoeringsplanDataV7",
        error: null,
        files: [{ name: `${appName}.xml`, data: {} }]
    });
    const sharedCopy = subForm(null);
    const esV2SubForm = subForm("es-v2");
    const exampleData = [faV3, faV5, sharedCopy, esV2SubForm];

    it("gives each app its own examples when two apps share a data type", () => {
        // fa-v3 and fa-v5 are both filed under FA and hold different data. Matched on the data type alone, whichever
        // came first in the list answered for both.
        expect(findExampleDataForApp(exampleData, { appOwner: "dibk", appName: "fa-v5" }, "FA")).toBe(faV5);
        expect(findExampleDataForApp(exampleData, { appOwner: "dibk", appName: "fa-v3" }, "FA")).toBe(faV3);
    });

    it("gives an app its own entry for a subform, even when an entry naming no app comes first", () => {
        expect(findExampleDataForApp(exampleData, { appOwner: "dibk", appName: "es-v2" }, "GjennomfoeringsplanDataV7")).toBe(esV2SubForm);
    });

    it("does not fall back to an entry naming no app for a subform the app has no entry for", () => {
        expect(findExampleDataForApp(exampleData, { appOwner: "dibk", appName: "ta-v4" }, "GjennomfoeringsplanDataV7")).toBeUndefined();
    });

    it("gives an app nothing rather than another app's examples", () => {
        expect(findExampleDataForApp(exampleData, { appOwner: "dibk", appName: "mb-v5" }, "FA")).toBeUndefined();
    });

    it("tells apps in different organisations apart", () => {
        expect(findExampleDataForApp(exampleData, { appOwner: "dat", appName: "fa-v5" }, "FA")).toBeUndefined();
    });

    it("copes with no example data and no data type", () => {
        expect(findExampleDataForApp(undefined, { appOwner: "dibk", appName: "fa-v5" }, "FA")).toBeUndefined();
        expect(findExampleDataForApp(exampleData, { appOwner: "dibk", appName: "fa-v5" }, undefined)).toBeUndefined();
    });
});

describe("getDataModelsForApp", () => {
    const faV3 = { appOwner: "dibk", appName: "fa-v3", dataType: "FA", error: null, files: [{ name: "Standard", data: { version: 3 } }] };
    const faV5 = { appOwner: "dibk", appName: "fa-v5", dataType: "FA", error: null, files: [{ name: "Standard", data: { version: 5 } }] };
    const subForm = {
        appOwner: "dibk",
        appName: "fa-v5",
        dataType: "GjennomfoeringsplanDataV7",
        error: null,
        files: [{ name: "GjennomfoeringsplanDataV7", data: { plan: true } }]
    };
    const exampleData = [faV3, faV5, subForm];

    it("keeps this app's own data type and drops the other app's", () => {
        // getDataForComponent matches on the data type, so FA has to appear once. Which one it is, is decided here.
        const dataModels = getDataModelsForApp(exampleData, { appOwner: "dibk", appName: "fa-v5" });

        expect(dataModels.filter((dataModel: ApiValue) => dataModel.dataType === "FA")).toEqual([
            { dataType: "FA", data: { Standard: { version: 5 } } }
        ]);
    });

    it("keeps subforms, so a component binding to a subform's data type still resolves", () => {
        const dataModels = getDataModelsForApp(exampleData, { appOwner: "dibk", appName: "fa-v5" });

        expect(dataModels).toContainEqual({
            dataType: "GjennomfoeringsplanDataV7",
            data: { GjennomfoeringsplanDataV7: { plan: true } }
        });
    });

    it("keeps only this app's own copy of a subform, so getDataForComponent cannot take another app's", () => {
        // The API placed an app-less copy of the first declaring app's subform right after that app's entry, so for a
        // later app the copy came first, and getDataForComponent takes the first model with a matching data type.
        const sharedCopy = { ...subForm, appOwner: null, appName: null, files: [{ name: "FromFaV3.xml", data: { from: "fa-v3" } }] };
        const own = { ...subForm, files: [{ name: "FromFaV5.xml", data: { from: "fa-v5" } }] };
        const dataModels = getDataModelsForApp([faV3, sharedCopy, faV5, own], { appOwner: "dibk", appName: "fa-v5" });

        expect(dataModels.filter((dataModel: ApiValue) => dataModel.dataType === "GjennomfoeringsplanDataV7")).toEqual([
            { dataType: "GjennomfoeringsplanDataV7", data: { "FromFaV5.xml": { from: "fa-v5" } } }
        ]);
    });

    it("keys the files by name, which is what selectedOptions.fileNames holds", () => {
        const dataModels = getDataModelsForApp(exampleData, { appOwner: "dibk", appName: "fa-v3" });
        const fa = dataModels.find((dataModel: ApiValue) => dataModel.dataType === "FA");

        expect(fa!.data.Standard).toEqual({ version: 3 });
    });

    it("copes with an entry that has no files and with no example data", () => {
        const noFiles = [{ appOwner: "dibk", appName: "ts-v1", dataType: "TS", error: null }];

        expect(getDataModelsForApp(noFiles, { appOwner: "dibk", appName: "ts-v1" })).toEqual([{ dataType: "TS", data: {} }]);
        expect(getDataModelsForApp(undefined, { appOwner: "dibk", appName: "fa-v5" })).toEqual([]);
    });
});

describe("renderExampleDataError", () => {
    it("says the examples could not be fetched, rather than rendering nothing", () => {
        // "No examples for this data type" and "the examples could not be fetched" used to look identical: no
        // dropdown either way.
        const containerElement = document.createElement("div");
        const rendered = renderExampleDataError(containerElement!, { dataType: "FA", error: "the testmotor could not be reached" }, "FA");

        expect(rendered).toBe(true);
        expect(containerElement.textContent).toContain("Example data for FA could not be fetched");
        expect(containerElement.textContent).toContain("the testmotor could not be reached");
    });

    it("stays quiet when there simply are no examples", () => {
        const containerElement = document.createElement("div");

        expect(renderExampleDataError(containerElement!, { dataType: "TS", error: null, files: [] }, "TS")).toBe(false);
        expect(renderExampleDataError(containerElement!, undefined, "TS")).toBe(false);
        expect(containerElement.childElementCount).toBe(0);
    });
    it("getApplicationMetadataForSelectedApp returns metadata or null", () => {
        const metaArr = [{ appName: "app1", appOwner: "owner1", metadata: { foo: 1 } }];
        expect(getApplicationMetadataForSelectedApp("app1", "owner1", metaArr)).toEqual({ foo: 1 });
        expect(getApplicationMetadataForSelectedApp("no", "no", metaArr)).toBeUndefined();
    });
    it("renderLogoImage appends an img", () => {
        const el = document.createElement("div");
        const metaArr = [{ appName: "app1", appOwner: "owner1", metadata: { logo: { source: "org" } } }];
        renderLogoImage(el, metaArr, { displayLayoutAppName: "app1", displayLayoutAppOwner: "owner1" });
        expect(el.querySelector("img")).not.toBeNull();
    });
});
