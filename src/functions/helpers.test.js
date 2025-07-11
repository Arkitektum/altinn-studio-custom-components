import {
    hasValue,
    isNumberLargerThanZero,
    addStyle,
    getEmptyFieldText,
    getRowNumberTitle,
    createCustomElement,
    addContainerElement,
    renderLayoutContainerElement,
    getTextResources,
    validateTexts,
    validateFormData,
    getComponentContainerElement,
    getValueFromDataKey,
    getTextResourceFromResourceBinding,
    getTextResourcesFromResourceBindings,
    getComponentDataValue,
    appendChildren
} from "./helpers.js";

// Mock for customElementTagNames
jest.mock("../constants/customElementTagNames.js", () => ["custom-tag", "another-tag"]);

describe("hasValue", () => {
    it("returns false for undefined or null", () => {
        expect(hasValue(undefined)).toBe(false);
        expect(hasValue(null)).toBe(false);
    });
    it("returns true for non-empty string, false for empty string", () => {
        expect(hasValue("abc")).toBe(true);
        expect(hasValue("")).toBe(false);
    });
    it("returns true for number (not NaN), false for NaN", () => {
        expect(hasValue(123)).toBe(true);
        expect(hasValue(NaN)).toBe(false);
    });
    it("returns true for boolean true, false for false", () => {
        expect(hasValue(true)).toBe(true);
        expect(hasValue(false)).toBe(false);
    });
    it("returns true for non-empty array, false for empty array", () => {
        expect(hasValue([1])).toBe(true);
        expect(hasValue([])).toBe(false);
    });
    it("returns true for object with non-empty string property", () => {
        expect(hasValue({ a: "x" })).toBe(true);
        expect(hasValue({ a: "" })).toBe(false);
        expect(hasValue({})).toBe(false);
    });
});

describe("isNumberLargerThanZero", () => {
    it("returns true for numbers > 0", () => {
        expect(isNumberLargerThanZero(1)).toBe(true);
        expect(isNumberLargerThanZero(100)).toBe(true);
    });
    it("returns false for numbers <= 0", () => {
        expect(isNumberLargerThanZero(0)).toBe(false);
        expect(isNumberLargerThanZero(-1)).toBe(false);
        expect(isNumberLargerThanZero("1")).toBe(true);
        expect(isNumberLargerThanZero(null)).toBe(false);
    });
});

describe("addStyle", () => {
    it("applies styles to element", () => {
        const el = document.createElement("div");
        addStyle(el, { color: "red", background: "blue" });
        expect(el.style.color).toBe("red");
        expect(el.style.background).toBe("blue");
    });
});

describe("getEmptyFieldText", () => {
    it("returns emptyFieldText if present", () => {
        expect(getEmptyFieldText({ resourceValues: { emptyFieldText: "abc" } })).toBe("abc");
    });
    it("returns empty string if not present", () => {
        expect(getEmptyFieldText({})).toBe("");
    });
});

describe("getRowNumberTitle", () => {
    beforeEach(() => {
        global.window = Object.create(window);
        window.textResources = { resources: [{ id: "row", value: "Rad" }] };
    });
    it("returns resource value if found", () => {
        expect(getRowNumberTitle({ resourceBindings: { rowNumberTitle: "row" } })).toBe("Rad");
    });
    it("returns # if not found", () => {
        expect(getRowNumberTitle({ resourceBindings: {} })).toBe("#");
    });
});

describe("createCustomElement", () => {
    it("creates element with attributes", () => {
        const el = createCustomElement("custom-tag", { foo: "bar" });
        expect(el.tagName.toLowerCase()).toBe("custom-tag");
        expect(el.getAttribute("foo")).toBe("bar");
        expect(el.getAttribute("tagName")).toBe("custom-tag");
    });
    it("throws for invalid tag", () => {
        expect(() => createCustomElement("invalid", {})).toThrow(/Invalid tag name/);
    });
});

describe("addContainerElement", () => {
    it("creates container with flex styles if flex is true", () => {
        const comp = document.createElement("span");
        const el = addContainerElement(comp, true);
        expect(el.style.flexGrow).toBe("0");
        expect(el.style.maxWidth).toBe("50%");
        expect(el.style.flexBasis).toBe("50%");
        expect(el.style.padding).toBe("0.75rem 0px");
        expect(el.querySelector("span")).toBe(comp);
    });
    it("creates container with 100% styles if flex is false", () => {
        const comp = document.createElement("span");
        const el = addContainerElement(comp, false);
        expect(el.style.flexBasis).toBe("100%");
        expect(el.style.maxWidth).toBe("100%");
    });
});

describe("renderLayoutContainerElement", () => {
    it("returns a div with flex styles", () => {
        const el = renderLayoutContainerElement();
        expect(el.style.display).toBe("flex");
        expect(el.style.flexFlow).toBe("wrap");
        expect(el.style.justifyContent).toBe("start");
        expect(el.style.alignItems).toBe("flex-start");
    });
});

describe("getTextResources", () => {
    it("returns window.textResources if present", () => {
        window.textResources = [1, 2, 3];
        expect(getTextResources()).toEqual([1, 2, 3]);
    });
    it("returns [] if not present", () => {
        delete window.textResources;
        expect(getTextResources()).toEqual([]);
    });
});

describe("validateTexts", () => {
    beforeEach(() => {
        jest.spyOn(console, "warn").mockImplementation(() => {});
    });
    afterEach(() => {
        console.warn.mockRestore();
    });
    it("warns if missing and fallback exists", () => {
        validateTexts({ a: 1 }, { b: "fallback" }, ["b"], "Comp");
        expect(console.warn).toHaveBeenCalledWith(expect.stringContaining("Using fallback text"));
    });
    it("warns if missing and no fallback", () => {
        validateTexts({ a: 1 }, {}, ["b"], "Comp");
        expect(console.warn).toHaveBeenCalledWith(expect.stringContaining("Missing textResourceBindings.b"));
    });
    it("does not warn if present", () => {
        validateTexts({ a: 1 }, {}, ["a"], "Comp");
        expect(console.warn).not.toHaveBeenCalled();
    });
});

describe("validateFormData", () => {
    beforeEach(() => {
        jest.spyOn(console, "warn").mockImplementation(() => {});
    });
    afterEach(() => {
        console.warn.mockRestore();
    });
    it("warns if missing", () => {
        validateFormData({ a: 1 }, ["b"], "Comp");
        expect(console.warn).toHaveBeenCalledWith(expect.stringContaining("Missing dataModelBindings.b"));
    });
    it("does not warn if present", () => {
        validateFormData({ a: 1 }, ["a"], "Comp");
        expect(console.warn).not.toHaveBeenCalled();
    });
});

describe("getComponentContainerElement", () => {
    it("returns component if isChildComponent is true", () => {
        const el = document.createElement("div");
        el.setAttribute("isChildComponent", "true");
        expect(getComponentContainerElement(el)).toBe(el);
    });
    it("returns grandparent if not child", () => {
        const parent = document.createElement("div");
        const grandparent = document.createElement("div");
        const el = document.createElement("div");
        parent.appendChild(el);
        grandparent.appendChild(parent);
        expect(getComponentContainerElement(el)).toBe(grandparent);
    });
    it("returns null if no grandparent", () => {
        const el = document.createElement("div");
        expect(getComponentContainerElement(el)).toBe(null);
    });
});

describe("getValueFromDataKey", () => {
    const data = { a: { b: [{ c: 5 }] }, d: 2 };
    it("returns value for dot/bracket notation", () => {
        expect(getValueFromDataKey(data, "a.b[0].c")).toBe(5);
        expect(getValueFromDataKey(data, "d")).toBe(2);
    });
    it("returns data if no key", () => {
        expect(getValueFromDataKey(data, "")).toBe(data);
    });
    it("returns undefined for invalid key or null data", () => {
        expect(getValueFromDataKey(null, "a")).toBeUndefined();
        expect(getValueFromDataKey(data, ".a")).toBeUndefined();
        expect(getValueFromDataKey(data, "a..b")).toBeUndefined();
    });
});

describe("getTextResourceFromResourceBinding", () => {
    beforeEach(() => {
        window.textResources = {
            resources: [
                { id: "foo", value: "bar" },
                { id: "baz", value: "qux" }
            ]
        };
    });
    it("returns value if found", () => {
        expect(getTextResourceFromResourceBinding("foo")).toBe("bar");
    });
    it("returns binding if not found", () => {
        expect(getTextResourceFromResourceBinding("notfound")).toBe("notfound");
    });
});

describe("getTextResourcesFromResourceBindings", () => {
    beforeEach(() => {
        window.textResources = {
            resources: [
                { id: "foo", value: "bar" },
                { id: "baz", value: "qux" }
            ]
        };
    });
    it("returns mapped object", () => {
        expect(getTextResourcesFromResourceBindings({ a: "foo", b: "baz", c: "nope" })).toEqual({ a: "bar", b: "qux", c: "nope" });
    });
});

describe("getComponentDataValue", () => {
    it("returns resourceValues.data for child", () => {
        expect(getComponentDataValue({ isChildComponent: true, resourceValues: { data: 1 } })).toBe(1);
    });
    it("returns formData.simpleBinding if present", () => {
        expect(getComponentDataValue({ isChildComponent: false, formData: { simpleBinding: 2 } })).toBe(2);
    });
    it("returns formData.data if no simpleBinding", () => {
        expect(getComponentDataValue({ isChildComponent: false, formData: { data: 3 } })).toBe(3);
    });
    it("returns undefined if nothing present", () => {
        expect(getComponentDataValue({ isChildComponent: false, formData: {} })).toBeUndefined();
    });
});

describe("appendChildren", () => {
    it("appends HTMLElements and strings", () => {
        const parent = document.createElement("div");
        const child1 = document.createElement("span");
        appendChildren(parent, [child1, "hello"]);
        expect(parent.querySelector("span")).toStrictEqual(child1);
        expect(parent.innerHTML).toContain("hello");
    });
    it("ignores falsy children", () => {
        const parent = document.createElement("div");
        appendChildren(parent, [null, undefined, false, "ok"]);
        expect(parent.innerHTML).toContain("ok");
    });
});
