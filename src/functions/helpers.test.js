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
    appendChildren,
    getAsync
} from "./helpers";

// Ensure jsdom environment is used for DOM-related tests
import { JSDOM } from "jsdom";
const { window } = new JSDOM();
global.document = window.document;
global.window = window;

// Mock getAsync function
global.getAsync = jest.fn();

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

        it("should throw a timeout error if the attribute is not set", async () => {
            const component = document.createElement("div");
            component.removeAttribute("texts");
            await expect(getComponentTexts(component)).rejects.toThrow("Timeout");
        });

        it("should throw an error if the attribute is not valid JSON", async () => {
            const component = document.createElement("div");
            component.setAttribute("texts", "invalid-json");
            await expect(getComponentTexts(component)).rejects.toThrow("Invalid JSON");
        });

        it("should resolve when the property is set within the timeout", async () => {
            const obj = {};
            const promise = getAsync(obj, "testProp", 500);
            setTimeout(() => {
                obj.testProp = "value";
            }, 100);
            await expect(promise).resolves.toBe("value");
        });

        it("should return parsed texts from the component's attribute", async () => {
            const component = document.createElement("div");
            component.setAttribute("texts", JSON.stringify({ key: "value" }));
            const texts = await getComponentTexts(component);
            expect(texts).toEqual({ key: "value" });
        });

        it("should throw an error if the attribute is not valid JSON", async () => {
            const component = document.createElement("div");
            component.setAttribute("texts", "invalid-json");
            await expect(getComponentTexts(component)).rejects.toThrow("Invalid JSON");
        });

        it("should throw an error if getAsync fails", async () => {
            const component = document.createElement("div");
            jest.spyOn(global, "getAsync").mockRejectedValue(new Error("Async error"));

            await expect(getComponentTexts(component)).rejects.toThrow("Timeout: texts was not set within 200ms");

            global.getAsync.mockRestore();
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

        it("should apply flex-based styles when the flex flag is true", () => {
            const component = document.createElement("div");
            const container = addContainerElement(component, true);

            expect(container.style.flexGrow).toBe("0");
            expect(container.style.maxWidth).toBe("50%");
            expect(container.style.flexBasis).toBe("50%");
            expect(container.style.padding).toBe("0.75rem 0px");
        });

        it("should apply default styles when the flex flag is false", () => {
            const component = document.createElement("div");
            const container = addContainerElement(component, false);

            expect(container.style.flexBasis).toBe("100%");
            expect(container.style.maxWidth).toBe("100%");
            expect(container.style.padding).toBe("0.75rem 0px");
        });

        it("should handle cases where the flex flag is not provided", () => {
            const component = document.createElement("div");
            const container = addContainerElement(component);

            expect(container.style.flexBasis).toBe("100%");
            expect(container.style.maxWidth).toBe("100%");
            expect(container.style.padding).toBe("0.75rem 0px");
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
        it("should log warnings for missing text resources without fallback", () => {
            const consoleSpy = jest.spyOn(console, "warn").mockImplementation();
            const texts = { key1: "value1" };
            const fallbackTexts = {};
            const keys = ["key1", "key2"];
            const componentName = "TestComponent";

            validateTexts(texts, fallbackTexts, keys, componentName);

            expect(consoleSpy).toHaveBeenCalledTimes(1);
            expect(consoleSpy).toHaveBeenCalledWith(`Missing textResourceBindings.key2 for "TestComponent".`);

            consoleSpy.mockRestore();
        });

        it("should log warnings for missing text resources with fallback", () => {
            const consoleSpy = jest.spyOn(console, "warn").mockImplementation();
            const texts = { key1: "value1" };
            const fallbackTexts = { key2: "fallbackValue" };
            const keys = ["key1", "key2"];
            const componentName = "TestComponent";

            validateTexts(texts, fallbackTexts, keys, componentName);

            expect(consoleSpy).toHaveBeenCalledTimes(1);
            expect(consoleSpy).toHaveBeenCalledWith(`Missing textResourceBindings.key2 for "TestComponent". Using fallback text: "fallbackValue"`);

            consoleSpy.mockRestore();
        });

        it("should not log warnings if all keys are present in texts", () => {
            const consoleSpy = jest.spyOn(console, "warn").mockImplementation();
            const texts = { key1: "value1", key2: "value2" };
            const fallbackTexts = { key2: "fallbackValue" };
            const keys = ["key1", "key2"];
            const componentName = "TestComponent";

            validateTexts(texts, fallbackTexts, keys, componentName);

            expect(consoleSpy).not.toHaveBeenCalled();

            consoleSpy.mockRestore();
        });

        it("should handle empty keys array without logging warnings", () => {
            const consoleSpy = jest.spyOn(console, "warn").mockImplementation();
            const texts = { key1: "value1" };
            const fallbackTexts = { key2: "fallbackValue" };
            const keys = [];
            const componentName = "TestComponent";

            validateTexts(texts, fallbackTexts, keys, componentName);

            expect(consoleSpy).not.toHaveBeenCalled();

            consoleSpy.mockRestore();
        });

        it("should log warnings for multiple missing keys", () => {
            const consoleSpy = jest.spyOn(console, "warn").mockImplementation();
            const texts = {};
            const fallbackTexts = { key1: "fallback1", key2: "fallback2" };
            const keys = ["key1", "key2", "key3"];
            const componentName = "TestComponent";

            validateTexts(texts, fallbackTexts, keys, componentName);

            expect(consoleSpy).toHaveBeenCalledTimes(3);
            expect(consoleSpy).toHaveBeenCalledWith(`Missing textResourceBindings.key1 for "TestComponent". Using fallback text: "fallback1"`);
            expect(consoleSpy).toHaveBeenCalledWith(`Missing textResourceBindings.key2 for "TestComponent". Using fallback text: "fallback2"`);
            expect(consoleSpy).toHaveBeenCalledWith(`Missing textResourceBindings.key3 for "TestComponent".`);

            consoleSpy.mockRestore();
        });
    });

    describe("validateFormData", () => {
        it("should log warnings for missing form data keys", () => {
            const consoleSpy = jest.spyOn(console, "warn").mockImplementation();
            const data = {};
            const dataKeys = ["key1", "key2"];
            const componentName = "TestComponent";

            validateFormData(data, dataKeys, componentName);

            expect(consoleSpy).toHaveBeenCalledTimes(2);
            expect(consoleSpy).toHaveBeenCalledWith(`Missing dataModelBindings.key1 for "TestComponent".`);
            expect(consoleSpy).toHaveBeenCalledWith(`Missing dataModelBindings.key2 for "TestComponent".`);

            consoleSpy.mockRestore();
        });

        it("should not log warnings if all keys are present in the data", () => {
            const consoleSpy = jest.spyOn(console, "warn").mockImplementation();
            const data = { key1: "value1", key2: "value2" };
            const dataKeys = ["key1", "key2"];
            const componentName = "TestComponent";

            validateFormData(data, dataKeys, componentName);

            expect(consoleSpy).not.toHaveBeenCalled();

            consoleSpy.mockRestore();
        });

        it("should handle an empty dataKeys array without logging warnings", () => {
            const consoleSpy = jest.spyOn(console, "warn").mockImplementation();
            const data = { key1: "value1" };
            const dataKeys = [];
            const componentName = "TestComponent";

            validateFormData(data, dataKeys, componentName);

            expect(consoleSpy).not.toHaveBeenCalled();

            consoleSpy.mockRestore();
        });

        it("should log warnings for multiple missing keys", () => {
            const consoleSpy = jest.spyOn(console, "warn").mockImplementation();
            const data = { key1: "value1" };
            const dataKeys = ["key1", "key2", "key3"];
            const componentName = "TestComponent";

            validateFormData(data, dataKeys, componentName);

            expect(consoleSpy).toHaveBeenCalledTimes(2);
            expect(consoleSpy).toHaveBeenCalledWith(`Missing dataModelBindings.key2 for "TestComponent".`);
            expect(consoleSpy).toHaveBeenCalledWith(`Missing dataModelBindings.key3 for "TestComponent".`);

            consoleSpy.mockRestore();
        });
    });

    describe("getComponentContainerElement", () => {
        it("should return the container element of a component", () => {
            const component = document.createElement("div");
            const container = addContainerElement(component);
            expect(getComponentContainerElement(component)).toBe(container);
        });
        it("should return the component itself if it is a child component", () => {
            const component = document.createElement("div");
            component.setAttribute("isChildComponent", "true");
            expect(getComponentContainerElement(component)).toBe(component);
        });

        it("should return the grandparent element if the component is not a child component", () => {
            const grandparent = document.createElement("div");
            const parent = document.createElement("div");
            const component = document.createElement("div");

            grandparent.appendChild(parent);
            parent.appendChild(component);

            expect(getComponentContainerElement(component)).toBe(grandparent);
        });

        it("should return null if the component has no grandparent", () => {
            const component = document.createElement("div");
            expect(getComponentContainerElement(component)).toBeNull();
        });

        it("should return null if the component is not attached to the DOM", () => {
            const component = document.createElement("div");
            expect(getComponentContainerElement(component)).toBeNull();
        });
    });

    describe("getValueFromDataKey", () => {
        it("should retrieve a value from a nested object using dot notation", () => {
            const data = { a: { b: { c: 42 } } };
            expect(getValueFromDataKey(data, "a.b.c")).toBe(42);
        });

        it("should retrieve a value from a nested object using bracket notation", () => {
            const data = { a: [{ b: { c: 42 } }] };
            expect(getValueFromDataKey(data, "a[0].b.c")).toBe(42);
        });

        it("should retrieve a value from a nested object using mixed notation", () => {
            const data = { a: [{ b: { c: 42 } }] };
            expect(getValueFromDataKey(data, "a[0].b.c")).toBe(42);
        });

        it("should return the original data if no dataKey is provided", () => {
            const data = { a: { b: { c: 42 } } };
            expect(getValueFromDataKey(data, "")).toBe(data);
        });

        it("should return undefined if the path does not exist", () => {
            const data = { a: { b: { c: 42 } } };
            expect(getValueFromDataKey(data, "a.b.d")).toBeUndefined();
        });

        it("should handle array indices correctly", () => {
            const data = { a: [{ b: 42 }, { b: 43 }] };
            expect(getValueFromDataKey(data, "a[1].b")).toBe(43);
        });

        it("should handle deeply nested structures", () => {
            const data = { a: { b: { c: { d: { e: 42 } } } } };
            expect(getValueFromDataKey(data, "a.b.c.d.e")).toBe(42);
        });

        it("should handle invalid dataKey gracefully", () => {
            const data = { a: { b: { c: 42 } } };
            expect(getValueFromDataKey(data, "a..b.c")).toBeUndefined();
        });

        it("should handle empty objects gracefully", () => {
            const data = {};
            expect(getValueFromDataKey(data, "a.b.c")).toBeUndefined();
        });

        it("should handle null or undefined data gracefully", () => {
            expect(getValueFromDataKey(null, "a.b.c")).toBeUndefined();
            expect(getValueFromDataKey(undefined, "a.b.c")).toBeUndefined();
        });
    });

    describe("getTextResourceFromResourceBinding", () => {
        it("should retrieve the correct text resource value for a valid resource binding", () => {
            const textResources = {
                resources: [
                    { id: "key1", value: "value1" },
                    { id: "key2", value: "value2" }
                ]
            };
            expect(getTextResourceFromResourceBinding(textResources, "key1")).toBe("value1");
            expect(getTextResourceFromResourceBinding(textResources, "key2")).toBe("value2");
        });

        it("should return the resource binding itself if no matching text resource is found", () => {
            const textResources = {
                resources: [{ id: "key1", value: "value1" }]
            };
            expect(getTextResourceFromResourceBinding(textResources, "key2")).toBe("key2");
        });

        it("should return the resource binding itself if the textResources object is undefined", () => {
            expect(getTextResourceFromResourceBinding(undefined, "key1")).toBe("key1");
        });

        it("should return the resource binding itself if the resources array is undefined", () => {
            const textResources = {};
            expect(getTextResourceFromResourceBinding(textResources, "key1")).toBe("key1");
        });

        it("should handle an empty resources array gracefully", () => {
            const textResources = { resources: [] };
            expect(getTextResourceFromResourceBinding(textResources, "key1")).toBe("key1");
        });

        it("should handle null or undefined resource binding gracefully", () => {
            const textResources = {
                resources: [{ id: "key1", value: "value1" }]
            };
            expect(getTextResourceFromResourceBinding(textResources, null)).toBe(null);
            expect(getTextResourceFromResourceBinding(textResources, undefined)).toBe(undefined);
        });
    });

    describe("getTextResourcesFromResourceBindings", () => {
        it("should extract text resources based on bindings", () => {
            const textResources = { resources: [{ id: "key1", value: "value1" }] };
            const resourceBindings = { key1: "key1" };
            expect(getTextResourcesFromResourceBindings(textResources, resourceBindings)).toEqual({ key1: "value1" });
        });
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

    describe("getAsync", () => {
        it("should resolve when the property is set within the timeout", async () => {
            const obj = {};
            const proxy = getAsync(obj, "testProp", 500);
            setTimeout(() => {
                obj.testProp = "value";
            }, 100);
            await expect(proxy).resolves.toBe("value");
        });

        it("should reject if the property is not set within the timeout", async () => {
            const obj = {};
            const proxy = getAsync(obj, "testProp", 200);
            await expect(proxy).rejects.toThrow("Timeout: testProp was not set within 200ms");
        });

        it("should resolve immediately if the property is already set", async () => {
            const obj = { testProp: "value" };
            const result = await getAsync(obj, "testProp", 200);
            expect(result).toBe("value");
        });

        it("should handle multiple properties being set on the object", async () => {
            const obj = {};
            const proxy = getAsync(obj, "testProp", 500);
            setTimeout(() => {
                obj.otherProp = "otherValue";
                obj.testProp = "value";
            }, 100);
            await expect(proxy).resolves.toBe("value");
        });

        it("should not resolve if a different property is set", async () => {
            const obj = {};
            const proxy = getAsync(obj, "testProp", 200);
            setTimeout(() => {
                obj.otherProp = "value";
            }, 100);
            await expect(proxy).rejects.toThrow("Timeout: testProp was not set within 200ms");
        });

        it("should reject if the property is not set within the timeout", async () => {
            const obj = {};
            const promise = getAsync(obj, "testProp", 200);
            await expect(promise).rejects.toThrow("Timeout: testProp was not set within 200ms");
        });

        it("should resolve immediately if the property is already set", async () => {
            const obj = { testProp: "value" };
            const result = await getAsync(obj, "testProp", 200);
            expect(result).toBe("value");
        });

        it("should handle multiple properties being set on the object", async () => {
            const obj = {};
            const promise = getAsync(obj, "testProp", 500);
            setTimeout(() => {
                obj.otherProp = "otherValue";
                obj.testProp = "value";
            }, 100);
            await expect(promise).resolves.toBe("value");
        });

        it("should not resolve if a different property is set", async () => {
            const obj = {};
            const promise = getAsync(obj, "testProp", 200);
            setTimeout(() => {
                obj.otherProp = "value";
            }, 100);
            await expect(promise).rejects.toThrow("Timeout: testProp was not set within 200ms");
        });
    });
});
