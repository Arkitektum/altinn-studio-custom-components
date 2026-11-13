import * as localStorageUtils from "./localStorage.ts";

describe("addValueToLocalStorage and getValueFromLocalStorage", () => {
    beforeEach(() => {
        localStorage.clear();
    });
    it("sets and gets a value", () => {
        localStorageUtils.addValueToLocalStorage("foo", "bar");
        expect(localStorageUtils.getValueFromLocalStorage("foo")).toBe("bar");
    });
});

describe("getLayoutCode", () => {
    beforeEach(() => {
        localStorage.clear();
    });
    it("returns parsed layout code", () => {
        localStorage.setItem("code", '{"foo":1}');
        expect(localStorageUtils.getLayoutCode()).toEqual({ foo: 1 });
    });
    it("returns empty object if not set", () => {
        expect(localStorageUtils.getLayoutCode()).toEqual({});
    });
});

describe("getDataModels", () => {
    beforeEach(() => {
        localStorage.clear();
    });
    it("returns parsed data models", () => {
        localStorage.setItem("dataModels", "[1,2]");
        expect(localStorageUtils.getDataModels()).toEqual([1, 2]);
    });
    it("returns empty array if not set", () => {
        expect(localStorageUtils.getDataModels()).toEqual([]);
    });
});

describe("getTextResources", () => {
    beforeEach(() => {
        localStorage.clear();
    });
    it("returns parsed text resources", () => {
        localStorage.setItem("textResources", '{"foo":1}');
        expect(localStorageUtils.getTextResources()).toEqual({ foo: 1 });
    });
    it("returns empty object if not set", () => {
        expect(localStorageUtils.getTextResources()).toEqual({});
    });
});

describe("addDataModel", () => {
    beforeEach(() => {
        localStorage.clear();
    });
    it("adds a new data model", () => {
        localStorageUtils.addDataModel();
        const models = JSON.parse(localStorage.getItem("dataModels")!);
        expect(Array.isArray(models)).toBe(true);
        expect(models[0]).toHaveProperty("data");
        expect(models[0]).toHaveProperty("dataType");
        expect(models[0]).toHaveProperty("expanded", true);
    });
});

describe("addDataToGlobalThis", () => {
    it("adds properties to globalThis", () => {
        localStorageUtils.addDataToGlobalThis({ foo: 1, bar: 2 });
        expect((globalThis as Record<string, unknown>).foo).toBe(1);
        expect((globalThis as Record<string, unknown>).bar).toBe(2);
        delete (globalThis as Record<string, unknown>).foo;
        delete (globalThis as Record<string, unknown>).bar;
    });
});

describe("getSelectedLanguage and setSelectedLanguage", () => {
    beforeEach(() => {
        localStorage.clear();
    });
    it("is nb until another language is chosen", () => {
        expect(localStorageUtils.getSelectedLanguage()).toBe("nb");
    });
    it("returns the stored language", () => {
        localStorageUtils.setSelectedLanguage("nn");
        expect(localStorage.getItem("devToolsLanguage")).toBe("nn");
        expect(localStorageUtils.getSelectedLanguage()).toBe("nn");
    });
    it("falls back to nb for a stored value that is not one of the languages", () => {
        localStorage.setItem("devToolsLanguage", "se");
        expect(localStorageUtils.getSelectedLanguage()).toBe("nb");
    });
});

describe("getTextResourcesStorageKey", () => {
    beforeEach(() => {
        localStorage.clear();
    });
    it("keeps nb under the key used before there were languages", () => {
        expect(localStorageUtils.getTextResourcesStorageKey("nb")).toBe("textResources");
    });
    it("keeps other languages under a key of their own", () => {
        expect(localStorageUtils.getTextResourcesStorageKey("nn")).toBe("textResources.nn");
        expect(localStorageUtils.getTextResourcesStorageKey("en")).toBe("textResources.en");
    });
    it("uses the chosen language when none is given", () => {
        expect(localStorageUtils.getTextResourcesStorageKey()).toBe("textResources");
        localStorageUtils.setSelectedLanguage("en");
        expect(localStorageUtils.getTextResourcesStorageKey()).toBe("textResources.en");
    });
});

describe("getTextResources for a language", () => {
    beforeEach(() => {
        localStorage.clear();
        localStorage.setItem("textResources", '{"language":"nb"}');
        localStorage.setItem("textResources.nn", '{"language":"nn"}');
    });
    it("reads the given language's text resources", () => {
        expect(localStorageUtils.getTextResources("nn")).toEqual({ language: "nn" });
        expect(localStorageUtils.getTextResources("en")).toEqual({});
    });
    it("reads the chosen language's text resources when none is given", () => {
        localStorageUtils.setSelectedLanguage("nn");
        expect(localStorageUtils.getTextResources()).toEqual({ language: "nn" });
    });
});
