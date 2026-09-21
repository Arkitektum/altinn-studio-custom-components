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
jest.mock("../localStorage.js", () => ({
    addDataToGlobalThis: jest.fn(),
    addValueToLocalStorage: jest.fn(),
    addValuesToLocalStorage: jest.fn()
}));

jest.mock("./apiHelpers.js", () => ({
    fetchAltinnStudioForms: jest.fn().mockResolvedValue([]),
    fetchApplicationMetadata: jest.fn().mockResolvedValue([]),
    fetchExampleData: jest.fn().mockResolvedValue([]),
    getUpdatedApiData: jest.fn().mockResolvedValue({})
}));

jest.mock("../getters.js", () => ({
    getAppResourceValuesForLanguage: jest.fn(),
    getResourcesForLanguage: jest.fn()
}));

jest.mock("../textResourceUsageRenderers.js", () => ({
    renderDefaultTextResourcesList: jest.fn(),
    renderSelectApplicationFilterForTextResourcesList: jest.fn(),
    renderTextInputFilterForTextResourcesList: jest.fn(),
    renderUsageFilterForTextResourcesList: jest.fn()
}));

jest.mock("../languages.js", () => ({
    languages: ["nb", "en"]
}));

jest.mock("./componentUsageRenderers.js", () => ({
    renderComponentUsageList: jest.fn(),
    renderSelectApplicationFilterForComponentUsageList: jest.fn(),
    renderSelectComponentTypeFilterForComponentUsageList: jest.fn(),
    renderTextInputFilterForComponentUsageList: jest.fn(),
    renderUsageFilterForComponentUsageList: jest.fn()
}));

jest.mock("../../../src/functions/htmlElementHelpers.js", () => ({
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
    renderPackageVersionsPage,
    renderResourceUsagePage,
    renderSynchronizeButton,
    setDefaultSelectedFileNameForDisplayLayouts,
    showLoadingIndicator
} from "./renderers";

// Import the mocked modules to set up their implementations
import {
    renderComponentUsageList,
    renderSelectApplicationFilterForComponentUsageList,
    renderSelectComponentTypeFilterForComponentUsageList,
    renderTextInputFilterForComponentUsageList,
    renderUsageFilterForComponentUsageList
} from "./componentUsageRenderers.js";
import {
    renderDefaultTextResourcesList,
    renderSelectApplicationFilterForTextResourcesList,
    renderTextInputFilterForTextResourcesList,
    renderUsageFilterForTextResourcesList
} from "../textResourceUsageRenderers.js";

describe("renderAdminSidebar", () => {
    beforeEach(() => {
        document.body.innerHTML = '<div id="admin-main"></div><div id="sidebar"></div>';

        // Setup mock return values
        renderDefaultTextResourcesList.mockReturnValue(document.createElement("div"));
        renderSelectApplicationFilterForTextResourcesList.mockReturnValue(document.createElement("div"));
        renderTextInputFilterForTextResourcesList.mockReturnValue(document.createElement("div"));
        renderUsageFilterForTextResourcesList.mockReturnValue(document.createElement("div"));
        renderComponentUsageList.mockReturnValue(document.createElement("div"));
    });
    it("renders sidebar with navigation buttons", () => {
        renderAdminSidebar();
        const sidebar = document.getElementById("sidebar");
        expect(sidebar.querySelector("ul")).not.toBeNull();
        expect(sidebar.textContent).toContain("Resource usage");
        expect(sidebar.textContent).toContain("Package versions");
        expect(sidebar.textContent).toContain("Display layouts");
    });
});

describe("showLoadingIndicator", () => {
    beforeEach(() => {
        document.body.innerHTML = "";

        // Setup mock return values
        renderDefaultTextResourcesList.mockReturnValue(document.createElement("div"));
        renderSelectApplicationFilterForTextResourcesList.mockReturnValue(document.createElement("div"));
        renderTextInputFilterForTextResourcesList.mockReturnValue(document.createElement("div"));
        renderUsageFilterForTextResourcesList.mockReturnValue(document.createElement("div"));
        renderComponentUsageList.mockReturnValue(document.createElement("div"));
    });
    it("shows and removes loading indicator after promises resolve", async () => {
        const p1 = Promise.resolve();
        const p2 = Promise.resolve();
        showLoadingIndicator([p1, p2]);
        expect(document.querySelector(".progress-indicator")).not.toBeNull();
        await Promise.all([p1, p2]);
        // The indicator should be removed after all promises resolve (simulate microtask queue)
        await new Promise((r) => setTimeout(r, 0));
        expect(document.querySelector(".progress-indicator")).toBeNull();
    });
});

describe("renderSynchronizeButton", () => {
    beforeEach(() => {
        document.body.innerHTML = '<div id="sidebar"></div>';
        globalThis.lastUpdated = Date.now();

        // Setup mock return values
        renderDefaultTextResourcesList.mockReturnValue(document.createElement("div"));
        renderSelectApplicationFilterForTextResourcesList.mockReturnValue(document.createElement("div"));
        renderTextInputFilterForTextResourcesList.mockReturnValue(document.createElement("div"));
        renderUsageFilterForTextResourcesList.mockReturnValue(document.createElement("div"));
        renderComponentUsageList.mockReturnValue(document.createElement("div"));
    });
    it("renders synchronize button and last updated", () => {
        renderSynchronizeButton();
        const sidebar = document.getElementById("sidebar");
        expect(sidebar.querySelector("button")).not.toBeNull();
        expect(sidebar.textContent).toContain("Synchronize data");
        expect(sidebar.textContent).toContain("Last updated:");
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
        renderDefaultTextResourcesList.mockReturnValue(document.createElement("div"));
        renderSelectApplicationFilterForTextResourcesList.mockReturnValue(document.createElement("div"));
        renderTextInputFilterForTextResourcesList.mockReturnValue(document.createElement("div"));
        renderUsageFilterForTextResourcesList.mockReturnValue(document.createElement("div"));
        renderComponentUsageList.mockReturnValue(document.createElement("div"));
        renderSelectApplicationFilterForComponentUsageList.mockReturnValue(document.createElement("div"));
        renderSelectComponentTypeFilterForComponentUsageList.mockReturnValue(document.createElement("div"));
        renderTextInputFilterForComponentUsageList.mockReturnValue(document.createElement("div"));
        renderUsageFilterForComponentUsageList.mockReturnValue(document.createElement("div"));
    });
    it("renderComponentUsagePage runs without error", () => {
        const el = document.createElement("div");
        expect(() => renderComponentUsagePage(el)).not.toThrow();
        expect(el.textContent).toContain("Component usage");
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
    const subForm = {
        appOwner: null,
        appName: null,
        dataType: "GjennomfoeringsplanDataV7",
        error: null,
        files: [{ name: "GjennomfoeringsplanDataV7", data: {} }]
    };
    const exampleData = [faV3, faV5, subForm];

    it("gives each app its own examples when two apps share a data type", () => {
        // fa-v3 and fa-v5 are both filed under FA and hold different data. Matched on the data type alone, whichever
        // came first in the list answered for both.
        expect(findExampleDataForApp(exampleData, { appOwner: "dibk", appName: "fa-v5" }, "FA")).toBe(faV5);
        expect(findExampleDataForApp(exampleData, { appOwner: "dibk", appName: "fa-v3" }, "FA")).toBe(faV3);
    });

    it("falls back to an entry naming no app, which is how one subform matches every parent that declares it", () => {
        expect(findExampleDataForApp(exampleData, { appOwner: "dibk", appName: "es-v2" }, "GjennomfoeringsplanDataV7")).toBe(subForm);
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
        appOwner: null,
        appName: null,
        dataType: "GjennomfoeringsplanDataV7",
        error: null,
        files: [{ name: "GjennomfoeringsplanDataV7", data: { plan: true } }]
    };
    const exampleData = [faV3, faV5, subForm];

    it("keeps this app's own data type and drops the other app's", () => {
        // getDataForComponent matches on the data type, so FA has to appear once. Which one it is, is decided here.
        const dataModels = getDataModelsForApp(exampleData, { appOwner: "dibk", appName: "fa-v5" });

        expect(dataModels.filter((dataModel) => dataModel.dataType === "FA")).toEqual([{ dataType: "FA", data: { Standard: { version: 5 } } }]);
    });

    it("keeps subforms, so a component binding to a subform's data type still resolves", () => {
        const dataModels = getDataModelsForApp(exampleData, { appOwner: "dibk", appName: "fa-v5" });

        expect(dataModels).toContainEqual({
            dataType: "GjennomfoeringsplanDataV7",
            data: { GjennomfoeringsplanDataV7: { plan: true } }
        });
    });

    it("keys the files by name, which is what selectedOptions.fileNames holds", () => {
        const dataModels = getDataModelsForApp(exampleData, { appOwner: "dibk", appName: "fa-v3" });
        const fa = dataModels.find((dataModel) => dataModel.dataType === "FA");

        expect(fa.data.Standard).toEqual({ version: 3 });
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
        const rendered = renderExampleDataError(containerElement, { dataType: "FA", error: "the testmotor could not be reached" }, "FA");

        expect(rendered).toBe(true);
        expect(containerElement.textContent).toContain("Example data for FA could not be fetched");
        expect(containerElement.textContent).toContain("the testmotor could not be reached");
    });

    it("stays quiet when there simply are no examples", () => {
        const containerElement = document.createElement("div");

        expect(renderExampleDataError(containerElement, { dataType: "TS", error: null, files: [] }, "TS")).toBe(false);
        expect(renderExampleDataError(containerElement, undefined, "TS")).toBe(false);
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
