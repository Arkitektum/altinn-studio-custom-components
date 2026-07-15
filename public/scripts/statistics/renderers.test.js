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
    renderComponentUsageList: jest.fn()
}));

jest.mock("../../../src/functions/htmlElementHelpers.js", () => ({
    updateBodyClassNamesForApplication: jest.fn()
}));

import {
    getApplicationMetadataForSelectedApp,
    getDisplayLayoutMainHeading,
    getLocalTextResourcesForApp,
    renderAdminSidebar,
    renderLogoImage,
    renderPackageVersionsPage,
    renderResourceUsagePage,
    renderSynchronizeButton,
    setDefaultSelectedFileNameForDisplayLayouts,
    showLoadingIndicator
} from "./renderers";

// Import the mocked modules to set up their implementations
import {
    renderDefaultTextResourcesList,
    renderSelectApplicationFilterForTextResourcesList,
    renderTextInputFilterForTextResourcesList,
    renderUsageFilterForTextResourcesList
} from "../textResourceUsageRenderers.js";
import { renderComponentUsageList } from "./componentUsageRenderers.js";

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
        globalThis.exampleData = [{ dataType: "dt", data: { file1: {} } }];
        globalThis.altinnStudioForms = [{ appName: "app1", appOwner: "owner1", dataType: "dt" }];

        // Setup mock return values
        renderDefaultTextResourcesList.mockReturnValue(document.createElement("div"));
        renderSelectApplicationFilterForTextResourcesList.mockReturnValue(document.createElement("div"));
        renderTextInputFilterForTextResourcesList.mockReturnValue(document.createElement("div"));
        renderUsageFilterForTextResourcesList.mockReturnValue(document.createElement("div"));
        renderComponentUsageList.mockReturnValue(document.createElement("div"));
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
