// Minimal tests for exported functions in statistics/renderers.js
import { renderAdminSidebar, renderSynchronizeButton, showLoadingIndicator } from "./renderers";

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
