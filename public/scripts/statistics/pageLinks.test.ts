import {
    applyPageFilters,
    getAddressFromOldLink,
    getCurrentAddress,
    getDisplayLayoutsAddress,
    getDisplayLayoutsOptions,
    getPageAddress,
    isOverviewAddress,
    pageFilters,
    parsePageAddress,
    resetPageFilters,
    setLocation
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

describe("getPageAddress", () => {
    it("names only the page when every filter is at its default", () => {
        resetPageFilters("resource-usage");
        expect(getPageAddress("resource-usage")).toBe("/statistics/resource-usage");
        expect(getPageAddress("package-versions")).toBe("/statistics/package-versions");
    });
    it("names the filters that are not at their default, encoded", () => {
        resetPageFilters("subform-data-models");
        Object.assign(globalThis, { subformModelPathFilter: "a b&c", subformModelShowAgreeing: true });
        expect(getPageAddress("subform-data-models")).toBe("/statistics/subform-data-models?path=a+b%26c&agreeing=1");
    });
    it("gives back the same filters when the address is read again", () => {
        resetPageFilters("component-usage");
        Object.assign(globalThis, {
            componentSelectedAppOwner: "o",
            componentSelectedAppName: "a",
            componentTypeFilter: "data",
            componentMatchBy: "id"
        });
        const hash = getPageAddress("component-usage");
        resetPageFilters("component-usage");
        applyPageFilters("component-usage", parsePageAddress(hash)!.params);
        expect(getPageAddress("component-usage")).toBe(hash);
        expect(globalThis.componentTypeFilter).toBe("data");
    });
});

describe("parsePageAddress", () => {
    it("reads the page and its filters", () => {
        const page = parsePageAddress("/statistics/component-usage?app=a&type=data");
        expect(page!.pageId).toBe("component-usage");
        expect(page!.params.get("app")).toBe("a");
        expect(page!.params.get("type")).toBe("data");
    });
    it("reads a page without filters", () => {
        expect(parsePageAddress("/statistics/package-versions")!.params.toString()).toBe("");
    });
    it.each([
        "",
        "/statistics",
        "/statistics/",
        "/statistics/unknown-page",
        "/statistics/constructor",
        "/statistics/component-usage/extra",
        "/statisticsx/component-usage",
        "/other/component-usage",
        "/app/statistics/component-usage",
        "#/component-usage",
        "statistics/component-usage"
    ])("names no page in %p", (address) => {
        expect(parsePageAddress(address)).toBeNull();
    });
});

describe("isOverviewAddress", () => {
    it.each([
        ["/statistics", true],
        ["/statistics/", true],
        ["/statistics/component-usage", false],
        ["/statistics.html", false],
        ["/devTools", false]
    ])("says %s is the overview: %s", (pathname, expected) => {
        expect(isOverviewAddress(pathname as string)).toBe(expected);
    });
});

describe("getAddressFromOldLink", () => {
    it("gives the address an old # link means, with its choices", () => {
        expect(getAddressFromOldLink("#/component-usage?app=a&type=data")).toBe("/statistics/component-usage?app=a&type=data");
        expect(getAddressFromOldLink("#/package-versions")).toBe("/statistics/package-versions");
    });
    it.each(["", "#", "#/", "#/unknown-page", "#component-usage"])("gives nothing for %p, which names no page", (hash) => {
        expect(getAddressFromOldLink(hash)).toBeNull();
    });
});

describe("display layouts address", () => {
    it("names only the page when every choice is at its default", () => {
        expect(getDisplayLayoutsAddress({ formType: "main", language: "nb", fileNames: {} })).toBe("/statistics/display-layouts");
    });
    it("names the app, form, language and example file chosen", () => {
        const options = {
            displayLayoutAppOwner: "dibk",
            displayLayoutAppName: "et-v4",
            formType: "sub-v1",
            language: "nn",
            fileNames: { ByggesoknadV4: "eksempel 2.xml" },
            compare: false
        };
        const hash = getDisplayLayoutsAddress(options);
        expect(hash).toBe("/statistics/display-layouts?owner=dibk&app=et-v4&form=sub-v1&lang=nn&file.ByggesoknadV4=eksempel+2.xml");
        expect(getDisplayLayoutsOptions(parsePageAddress(hash)!.params)).toEqual(options);
    });
    it("names an open comparison, and reads it back, only when it is open", () => {
        const hash = getDisplayLayoutsAddress({ displayLayoutAppOwner: "dibk", displayLayoutAppName: "et-v4", compare: true });
        expect(hash).toBe("/statistics/display-layouts?owner=dibk&app=et-v4&compare=1");
        expect(getDisplayLayoutsOptions(parsePageAddress(hash)!.params).compare).toBe(true);
        expect(getDisplayLayoutsAddress({ displayLayoutAppOwner: "dibk", displayLayoutAppName: "et-v4", compare: false })).toBe(
            "/statistics/display-layouts?owner=dibk&app=et-v4"
        );
        expect(getDisplayLayoutsOptions(new URLSearchParams("compare=yes")).compare).toBe(false);
    });
    it("reads the defaults for the choices an address leaves out", () => {
        expect(getDisplayLayoutsOptions(new URLSearchParams("file.=x"))).toEqual({
            displayLayoutAppOwner: null,
            displayLayoutAppName: null,
            formType: "main",
            language: "nb",
            fileNames: {},
            compare: false
        });
    });
});

describe("setLocation", () => {
    it("adds an entry to the history for a new page, and replaces it for a filter choice", () => {
        const length = history.length;
        setLocation("/statistics/package-versions", { newEntry: true });
        expect(location.pathname + location.search).toBe("/statistics/package-versions");
        expect(history.length).toBe(length + 1);
        setLocation("/statistics/component-usage?app=a");
        expect(location.pathname + location.search).toBe("/statistics/component-usage?app=a");
        expect(history.length).toBe(length + 1);
    });
    it("takes an old # off the address, also when the path is already the one given", () => {
        history.replaceState(null, "", "/statistics/resource-usage#/component-usage");
        setLocation("/statistics/resource-usage");
        expect(location.hash).toBe("");
        expect(getCurrentAddress()).toBe("/statistics/resource-usage");
    });
    it("leaves the history alone when the address is already the one given", () => {
        setLocation("/statistics/resource-usage", { newEntry: true });
        const length = history.length;
        setLocation("/statistics/resource-usage", { newEntry: true });
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
