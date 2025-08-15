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
    getComponentBooleanDataValues,
    getComponentBooleanTextValues,
    getComponentResourceValue,
    appendChildren
} from "./helpers";

// Mock for customElementTagNames
jest.mock("../constants/customElementTagNames.js", () => ["custom-tag", "another-tag"]);

describe("hasValue", () => {
    it("returns false for undefined and null", () => {
        expect(hasValue(undefined)).toBe(false);
        expect(hasValue(null)).toBe(false);
    });
    it("returns true for non-empty string, false for empty string", () => {
        expect(hasValue("hello")).toBe(true);
        expect(hasValue("")).toBe(false);
    });
    it("returns true for valid number, false for NaN", () => {
        expect(hasValue(123)).toBe(true);
        expect(hasValue(NaN)).toBe(false);
    });
    it("returns true for true boolean, false for false", () => {
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
        expect(isNumberLargerThanZero("2")).toBe(true);
    });
    it("returns false for numbers <= 0, NaN, non-numeric", () => {
        expect(isNumberLargerThanZero(0)).toBe(false);
        expect(isNumberLargerThanZero(-1)).toBe(false);
        expect(isNumberLargerThanZero("abc")).toBe(false);
        expect(isNumberLargerThanZero(NaN)).toBe(false);
    });
});

describe("addStyle", () => {
    it("applies styles to element", () => {
        const el = document.createElement("div");
        addStyle(el, { color: "red", backgroundColor: "blue" });
        expect(el.style.color).toBe("red");
        expect(el.style.backgroundColor).toBe("blue");
    });
});

describe("getEmptyFieldText", () => {
    it("returns emptyFieldText from resourceValues", () => {
        expect(getEmptyFieldText({ resourceValues: { emptyFieldText: "Empty!" } })).toBe("Empty!");
    });
    it("returns empty string if not present", () => {
        expect(getEmptyFieldText({})).toBe("");
    });
});

describe("getRowNumberTitle", () => {
    beforeEach(() => {
        global.window = Object.create(window);
        window.textResources = { resources: [{ id: "rowTitle", value: "Row #" }] };
    });
    it("returns text resource if found", () => {
        expect(getRowNumberTitle({ resourceBindings: { rowNumberTitle: "rowTitle" } })).toBe("Row #");
    });
});

describe("createCustomElement", () => {
    it("creates element with valid tag and attributes", () => {
        const el = createCustomElement("custom-tag", { foo: "bar" });
        expect(el.tagName.toLowerCase()).toBe("custom-tag");
        expect(el.getAttribute("foo")).toBe("bar");
        expect(el.getAttribute("tagName")).toBe("custom-tag");
    });
    it("throws error for invalid tag", () => {
        expect(() => createCustomElement("invalid-tag", {})).toThrow(/Invalid tag name/);
    });
});

describe("addContainerElement", () => {
    it("creates container with flex styles if flex is true", () => {
        const child = document.createElement("span");
        const container = addContainerElement(child, true);
        expect(container.style.flexGrow).toBe("0");
        expect(container.style.maxWidth).toBe("50%");
        expect(container.style.flexBasis).toBe("50%");
        expect(container.style.padding).toBe("0.75rem 0px");
        expect(container.querySelector("span")).toBe(child);
    });
    it("creates container with 100% styles if flex is false", () => {
        const child = document.createElement("span");
        const container = addContainerElement(child, false);
        expect(container.style.maxWidth).toBe("100%");
        expect(container.style.flexBasis).toBe("100%");
    });
});

describe("renderLayoutContainerElement", () => {
    it("creates flex container", () => {
        const el = renderLayoutContainerElement();
        expect(el.style.display).toBe("flex");
        expect(el.style.flexFlow).toBe("wrap");
        expect(el.style.justifyContent).toBe("start");
        expect(el.style.alignItems).toBe("flex-start");
    });
});

describe("getTextResources", () => {
    it("returns window.textResources if exists", () => {
        window.textResources = [1, 2, 3];
        expect(getTextResources()).toEqual([1, 2, 3]);
    });
    it("returns [] if not exists", () => {
        delete window.textResources;
        expect(getTextResources()).toEqual([]);
    });
});

describe("validateTexts", () => {
    beforeEach(() => jest.spyOn(console, "warn").mockImplementation(() => {}));
    afterEach(() => console.warn.mockRestore());
    it("warns if text missing and fallback exists", () => {
        validateTexts({ a: null }, { a: "fallback" }, ["a"], "Comp");
        expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('Using fallback text: "fallback"'));
    });
    it("warns if text missing and no fallback", () => {
        validateTexts({ a: null }, {}, ["a"], "Comp");
        expect(console.warn).toHaveBeenCalledWith(expect.stringContaining("Missing textResourceBindings.a"));
    });
    it("does not warn if text exists", () => {
        validateTexts({ a: "ok" }, {}, ["a"], "Comp");
        expect(console.warn).not.toHaveBeenCalled();
    });
});

describe("validateFormData", () => {
    beforeEach(() => jest.spyOn(console, "warn").mockImplementation(() => {}));
    afterEach(() => console.warn.mockRestore());
    it("warns if data missing", () => {
        validateFormData({ a: null }, ["a"], "Comp");
        expect(console.warn).toHaveBeenCalledWith(expect.stringContaining("Missing dataModelBindings.a"));
    });
    it("does not warn if data exists", () => {
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
        const el = document.createElement("div");
        const parent = document.createElement("div");
        const grandparent = document.createElement("div");
        parent.appendChild(el);
        grandparent.appendChild(parent);
        expect(getComponentContainerElement(el)).toBe(grandparent);
    });
    it("returns null if no grandparent", () => {
        const el = document.createElement("div");
        expect(getComponentContainerElement(el)).toBeNull();
    });
});

describe("getValueFromDataKey", () => {
    it("returns data if no dataKey", () => {
        expect(getValueFromDataKey({ a: 1 }, "")).toEqual({ a: 1 });
    });
    it("returns undefined if data is null", () => {
        expect(getValueFromDataKey(null, "a")).toBeUndefined();
    });
    it("returns undefined for invalid dataKey", () => {
        expect(getValueFromDataKey({ a: 1 }, ".a")).toBeUndefined();
        expect(getValueFromDataKey({ a: 1 }, "a..b")).toBeUndefined();
    });
    it("returns nested value for dot/bracket notation", () => {
        const data = { a: { b: [{ c: 42 }] } };
        expect(getValueFromDataKey(data, "a.b[0].c")).toBe(42);
        expect(getValueFromDataKey(data, "a.b")).toEqual([{ c: 42 }]);
    });
});

describe("getTextResourceFromResourceBinding", () => {
    beforeEach(() => {
        window.textResources = { resources: [{ id: "foo", value: "bar" }] };
    });
    it("returns value if found", () => {
        expect(getTextResourceFromResourceBinding("foo")).toBe("bar");
    });
    it("returns resourceBinding if not found", () => {
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
    it("returns mapped resources", () => {
        expect(getTextResourcesFromResourceBindings({ a: "foo", b: "baz", c: "none" })).toEqual({
            a: "bar",
            b: "qux",
            c: "none"
        });
    });
});

describe("getComponentDataValue", () => {
    it("returns resourceValues.data if isChildComponent", () => {
        expect(getComponentDataValue({ isChildComponent: true, resourceValues: { data: 123 } })).toBe(123);
    });
    it("returns formData.simpleBinding if present", () => {
        expect(getComponentDataValue({ isChildComponent: false, formData: { simpleBinding: "abc", data: "def" } })).toBe("abc");
    });
    it("returns formData.data if simpleBinding not present", () => {
        expect(getComponentDataValue({ isChildComponent: false, formData: { data: "def" } })).toBe("def");
    });
});

describe("getComponentBooleanDataValues", () => {
    it("returns resourceValues for child", () => {
        const comp = { isChildComponent: true, resourceValues: { trueData: 1, falseData: 2, defaultData: 3 } };
        expect(getComponentBooleanDataValues(comp)).toEqual({ trueData: 1, falseData: 2, defaultData: 3 });
    });
    it("returns formData for non-child", () => {
        const comp = { isChildComponent: false, formData: { trueData: 4, falseData: 5, defaultData: 6 } };
        expect(getComponentBooleanDataValues(comp)).toEqual({ trueData: 4, falseData: 5, defaultData: 6 });
    });
});

describe("getComponentBooleanTextValues", () => {
    beforeEach(() => {
        window.textResources = {
            resources: [
                { id: "trueText", value: "Yes" },
                { id: "falseText", value: "No" },
                { id: "defaultText", value: "Maybe" }
            ]
        };
    });
    it("prefers resourceValues over resourceBindings", () => {
        const comp = {
            resourceValues: { trueText: "Y", falseText: "N", defaultText: "M" },
            resourceBindings: { trueText: "trueText", falseText: "falseText", defaultText: "defaultText" }
        };
        expect(getComponentBooleanTextValues(comp)).toEqual({ trueText: "Y", falseText: "N", defaultText: "M" });
    });
    it("falls back to resourceBindings", () => {
        const comp = {
            resourceValues: {},
            resourceBindings: { trueText: "trueText", falseText: "falseText", defaultText: "defaultText" }
        };
        expect(getComponentBooleanTextValues(comp)).toEqual({ trueText: "Yes", falseText: "No", defaultText: "Maybe" });
    });
});

describe("getComponentResourceValue", () => {
    beforeEach(() => {
        window.textResources = { resources: [{ id: "foo", value: "bar" }] };
    });
    it("returns resourceValues if hasValue", () => {
        const comp = { resourceValues: { foo: "baz" }, resourceBindings: { foo: "foo" } };
        expect(getComponentResourceValue(comp, "foo")).toBe("baz");
    });
    it("returns resourceBinding if no resourceValues", () => {
        const comp = { resourceValues: {}, resourceBindings: { foo: "foo" } };
        expect(getComponentResourceValue(comp, "foo")).toBe("bar");
    });
});

describe("appendChildren", () => {
    it("appends HTMLElements and strings", () => {
        const parent = document.createElement("div");
        const child1 = document.createElement("span");
        const child2 = "<b>hi</b>";
        appendChildren(parent, [child1, child2]);
        expect(parent.querySelector("span")).toStrictEqual(child1);
        expect(parent.innerHTML).toContain("<b>hi</b>");
    });
    it("filters out falsy children", () => {
        const parent = document.createElement("div");
        appendChildren(parent, [null, undefined, false, "ok"]);
        expect(parent.innerHTML).toContain("ok");
    });
});
