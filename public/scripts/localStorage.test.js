import * as localStorageUtils from "./localStorage";

describe("addValueToLocalStorage and getValueFromLocalStorage", () => {
    beforeEach(() => {
        localStorage.clear();
    });
    it("sets and gets a value", () => {
        localStorageUtils.addValueToLocalStorage("foo", "bar");
        expect(localStorageUtils.getValueFromLocalStorage("foo")).toBe("bar");
    });
});

describe("addValuesToLocalStorage and getValuesFromLocalStorage", () => {
    beforeEach(() => {
        localStorage.clear();
    });
    it("sets and gets multiple values", () => {
        localStorageUtils.addValuesToLocalStorage({ a: 1, b: { x: 2 } });
        const result = localStorageUtils.getValuesFromLocalStorage(["a", "b"]);
        expect(result.a).toBe(1);
        expect(result.b).toEqual({ x: 2 });
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
        const models = JSON.parse(localStorage.getItem("dataModels"));
        expect(Array.isArray(models)).toBe(true);
        expect(models[0]).toHaveProperty("data");
        expect(models[0]).toHaveProperty("dataType");
        expect(models[0]).toHaveProperty("expanded", true);
    });
});

describe("addDataToGlobalThis", () => {
    it("adds properties to globalThis", () => {
        localStorageUtils.addDataToGlobalThis({ foo: 1, bar: 2 });
        expect(globalThis.foo).toBe(1);
        expect(globalThis.bar).toBe(2);
        delete globalThis.foo;
        delete globalThis.bar;
    });
});
