import {
    applyPageFilters,
    getDisplayLayoutsHash,
    getDisplayLayoutsOptions,
    getPageHash,
    pageFilters,
    parsePageHash,
    resetPageFilters,
    setLocationHash
} from "./pageLinks.ts";

describe("resetPageFilters", () => {
    it("sets every filter of the page to its default", () => {
        Object.assign(globalThis, { componentUsageFilter: "used", componentTextFilter: "x", componentMatchBy: "id", textFilter: "kept" });
        resetPageFilters("component-usage");
        expect(globalThis.componentUsageFilter).toBe("all");
        expect(globalThis.componentTextFilter).toBe("");
        expect(globalThis.componentMatchBy).toBe("tag");
        expect(globalThis.textFilter).toBe("kept");
    });
    it("sets a checkbox filter to false", () => {
        globalThis.subformModelShowAgreeing = true;
        resetPageFilters("subform-data-models");
        expect(globalThis.subformModelShowAgreeing).toBe(false);
    });
});

describe("applyPageFilters", () => {
    it("sets the filters the address names, and the others to their default", () => {
        globalThis.bindingDriftSelectedForm = "left over";
        applyPageFilters("data-model-bindings", new URLSearchParams("owner=o&app=a&finding=missing&all=1"));
        expect(globalThis.bindingDriftSelectedAppOwner).toBe("o");
        expect(globalThis.bindingDriftSelectedAppName).toBe("a");
        expect(globalThis.bindingDriftFindingFilter).toBe("missing");
        expect(globalThis.bindingDriftShowWithoutFindings).toBe(true);
        expect(globalThis.bindingDriftSelectedForm).toBe("");
    });
    it("reads a checkbox filter as ticked only from 1", () => {
        applyPageFilters("subform-data-models", new URLSearchParams("agreeing=yes"));
        expect(globalThis.subformModelShowAgreeing).toBe(false);
    });
});

describe("getPageHash", () => {
    it("names only the page when every filter is at its default", () => {
        resetPageFilters("resource-usage");
        expect(getPageHash("resource-usage")).toBe("#/resource-usage");
        expect(getPageHash("package-versions")).toBe("#/package-versions");
    });
    it("names the filters that are not at their default, encoded", () => {
        resetPageFilters("subform-data-models");
        Object.assign(globalThis, { subformModelPathFilter: "a b&c", subformModelShowAgreeing: true });
        expect(getPageHash("subform-data-models")).toBe("#/subform-data-models?path=a+b%26c&agreeing=1");
    });
    it("gives back the same filters when the address is read again", () => {
        resetPageFilters("component-usage");
        Object.assign(globalThis, {
            componentSelectedAppOwner: "o",
            componentSelectedAppName: "a",
            componentTypeFilter: "data",
            componentMatchBy: "id"
        });
        const hash = getPageHash("component-usage");
        resetPageFilters("component-usage");
        applyPageFilters("component-usage", parsePageHash(hash)!.params);
        expect(getPageHash("component-usage")).toBe(hash);
        expect(globalThis.componentTypeFilter).toBe("data");
    });
});

describe("parsePageHash", () => {
    it("reads the page and its filters", () => {
        const page = parsePageHash("#/component-usage?app=a&type=data");
        expect(page!.pageId).toBe("component-usage");
        expect(page!.params.get("app")).toBe("a");
        expect(page!.params.get("type")).toBe("data");
    });
    it("reads a page without filters", () => {
        expect(parsePageHash("#/package-versions")!.params.toString()).toBe("");
    });
    it.each(["", "#", "#/", "#/unknown-page", "#component-usage", "#/constructor", "#/component-usage/extra"])("names no page in %p", (hash) => {
        expect(parsePageHash(hash)).toBeNull();
    });
});

describe("display layouts address", () => {
    it("names only the page when every choice is at its default", () => {
        expect(getDisplayLayoutsHash({ formType: "main", language: "nb", fileNames: {} })).toBe("#/display-layouts");
    });
    it("names the app, form, language and example file chosen", () => {
        const options = {
            displayLayoutAppOwner: "dibk",
            displayLayoutAppName: "et-v4",
            formType: "sub-v1",
            language: "nn",
            fileNames: { ByggesoknadV4: "eksempel 2.xml" }
        };
        const hash = getDisplayLayoutsHash(options);
        expect(hash).toBe("#/display-layouts?owner=dibk&app=et-v4&form=sub-v1&lang=nn&file.ByggesoknadV4=eksempel+2.xml");
        expect(getDisplayLayoutsOptions(parsePageHash(hash)!.params)).toEqual(options);
    });
    it("reads the defaults for the choices an address leaves out", () => {
        expect(getDisplayLayoutsOptions(new URLSearchParams("file.=x"))).toEqual({
            displayLayoutAppOwner: null,
            displayLayoutAppName: null,
            formType: "main",
            language: "nb",
            fileNames: {}
        });
    });
});

describe("setLocationHash", () => {
    it("adds an entry to the history for a new page, and replaces it for a filter choice", () => {
        const length = history.length;
        setLocationHash("#/package-versions", { newEntry: true });
        expect(location.hash).toBe("#/package-versions");
        expect(history.length).toBe(length + 1);
        setLocationHash("#/component-usage?app=a");
        expect(location.hash).toBe("#/component-usage?app=a");
        expect(history.length).toBe(length + 1);
    });
    it("leaves the history alone when the address is already the one given", () => {
        setLocationHash("#/resource-usage", { newEntry: true });
        const length = history.length;
        setLocationHash("#/resource-usage", { newEntry: true });
        expect(history.length).toBe(length);
    });
});

describe("pageFilters", () => {
    it("keeps each filter in a global of its own", () => {
        for (const filters of Object.values(pageFilters)) {
            const globalsUsed = Object.values(filters).map(({ global }) => global);
            expect(new Set(globalsUsed).size).toBe(globalsUsed.length);
        }
    });
});
