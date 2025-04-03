import {
    hasValue,
    addStyle,
    getComponentTexts,
    createCustomElement,
    addContainerElement,
    renderLayoutContainerElement,
    validateTexts,
    validateFormData,
    getComponentContainerElement,
    getValueFromDataKey,
    getTextResourceFromResourceBinding,
    getTextResourcesFromResourceBindings,
    appendChildren
} from "./helpers";

// Ensure jsdom environment is used for DOM-related tests
import { JSDOM } from "jsdom";
const { window } = new JSDOM();
global.document = window.document;
global.window = window;

describe("helpers.js", () => {
    describe("hasValue", () => {
        it("should return true for non-empty strings", () => {
            expect(hasValue("test")).toBe(true);
        });

        it("should return false for empty strings", () => {
            expect(hasValue("")).toBe(false);
        });

        it("should return true for valid numbers", () => {
            expect(hasValue(123)).toBe(true);
        });

        it("should return false for NaN", () => {
            expect(hasValue(NaN)).toBe(false);
        });

        it("should return true for objects with non-empty string properties", () => {
            expect(hasValue({ key: "value" })).toBe(true);
        });

        it("should return false for empty objects", () => {
            expect(hasValue({})).toBe(false);
        });
    });

    describe("addStyle", () => {
        it("should apply styles to an HTML element", () => {
            const element = document.createElement("div");
            addStyle(element, { color: "red", fontSize: "16px" });
            expect(element.style.color).toBe("red");
            expect(element.style.fontSize).toBe("16px");
        });
    });

    describe("getComponentTexts", () => {
        it("should return parsed texts from the component's attribute", async () => {
            const component = document.createElement("div");
            component.setAttribute("texts", JSON.stringify({ key: "value" }));
            const texts = await getComponentTexts(component);
            expect(texts).toEqual({ key: "value" });
        });
    });

    describe("createCustomElement", () => {
        it("should create a custom element with attributes", () => {
            const tagName = "custom-field-data";
            const attributes = { id: "test-id", formData: "test-data" };
            const element = createCustomElement(tagName, attributes);
            expect(element.tagName.toLowerCase()).toBe(tagName);
            expect(element.getAttribute("id")).toBe("test-id");
            expect(element.getAttribute("formData")).toBe("test-data");
        });

        it("should throw an error for invalid tag names", () => {
            expect(() => createCustomElement("invalid-tag", {})).toThrow("Invalid tag name");
        });
    });

    describe("addContainerElement", () => {
        it("should create a container element with nested component", () => {
            const component = document.createElement("div");
            const container = addContainerElement(component);
            expect(container.tagName).toBe("DIV");
            expect(container.firstChild.firstChild).toBe(component);
        });
    });

    describe("renderLayoutContainerElement", () => {
        it("should create a layout container element with predefined styles", () => {
            const container = renderLayoutContainerElement();
            expect(container.style.display).toBe("flex");
            expect(container.style.flexFlow).toBe("wrap");
            expect(container.style.justifyContent).toBe("start");
            expect(container.style.alignItems).toBe("flex-start");
        });
    });

    describe("validateTexts", () => {
        it("should log warnings for missing text resources", () => {
            const consoleSpy = jest.spyOn(console, "warn").mockImplementation();
            validateTexts({}, {}, ["key1", "key2"], "TestComponent");
            expect(consoleSpy).toHaveBeenCalledTimes(2);
            consoleSpy.mockRestore();
        });
    });

    describe("validateFormData", () => {
        it("should log warnings for missing form data keys", () => {
            const consoleSpy = jest.spyOn(console, "warn").mockImplementation();
            validateFormData({}, ["key1", "key2"], "TestComponent");
            expect(consoleSpy).toHaveBeenCalledTimes(2);
            consoleSpy.mockRestore();
        });
    });

    describe("getComponentContainerElement", () => {
        it("should return the container element of a component", () => {
            const component = document.createElement("div");
            const container = addContainerElement(component);
            expect(getComponentContainerElement(component)).toBe(container);
        });
    });

    describe("getValueFromDataKey", () => {
        it("should retrieve a value from a nested data object", () => {
            const data = { a: { b: { c: 42 } } };
            expect(getValueFromDataKey(data, "a.b.c")).toBe(42);
        });
    });

    describe("getTextResourceFromResourceBinding", () => {
        it("should retrieve a text resource by its binding", () => {
            const textResources = { resources: [{ id: "key1", value: "value1" }] };
            expect(getTextResourceFromResourceBinding(textResources, "key1")).toBe("value1");
        });
    });

    describe("getTextResourcesFromResourceBindings", () => {
        it("should extract text resources based on bindings", () => {
            const textResources = { resources: [{ id: "key1", value: "value1" }] };
            const resourceBindings = { key1: "key1" };
            expect(getTextResourcesFromResourceBindings(textResources, resourceBindings)).toEqual({ key1: "value1" });
        });

        describe("appendChildren", () => {
            it("should append HTMLElement children to the parent element", () => {
                const parent = document.createElement("div");
                const child1 = document.createElement("span");
                const child2 = document.createElement("p");

                appendChildren(parent, [child1, child2]);

                expect(parent.children.length).toBe(2);
                expect(parent.children[0]).toBe(child1);
                expect(parent.children[1]).toBe(child2);
            });

            it("should append string children to the parent's innerHTML", () => {
                const parent = document.createElement("div");

                appendChildren(parent, ["<span>Child 1</span>", "<p>Child 2</p>"]);

                expect(parent.innerHTML).toBe("<span>Child 1</span><p>Child 2</p>");
            });

            it("should ignore falsy children", () => {
                const parent = document.createElement("div");
                const child1 = document.createElement("span");

                appendChildren(parent, [child1, null, undefined, false, ""]);

                expect(parent.children.length).toBe(1);
                expect(parent.children[0]).toBe(child1);
            });
        });
    });
});
