// Minimal tests for exported functions in statistics/renderers.js
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

describe("renderAdminSidebar", () => {
    beforeEach(() => {
        document.body.innerHTML = '<div id="admin-main"></div><div id="sidebar"></div>';
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
        globalThis.displayLayouts = [{ appName: "app1", appOwner: "owner1", isSubform: false, layout: { data: { layout: [{ tagName: "div" }] } } }];
        globalThis.allTextResourceUsage = [];
        globalThis.packageVersions = [
            {
                appName: "app1",
                appOwner: "owner1",
                packageVersions: { altinnStudioCustomComponents: "1.0", altinnAppFrontendCSS: "2.0", altinnAppFrontendJS: "3.0" }
            }
        ];
        globalThis.textResources = { resources: [{ id: "appName", value: "Test App" }] };
        globalThis.appResourceValues = [{ appName: "app1", appOwner: "owner1", resources: [{ id: "appLogo.url", value: "logo.svg" }] }];
        globalThis.multilingualDefaultTextResources = [];
        globalThis.multilingualAppResourceValues = [];
        globalThis.exampleData = [{ dataType: "dt", data: { file1: {} } }];
        globalThis.altinnStudioForms = [{ appName: "app1", appOwner: "owner1", dataType: "dt" }];
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
