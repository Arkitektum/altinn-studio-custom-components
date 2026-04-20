import { addDevToolsOverlay, isDevMode, renderHiddenDevToolsElement } from "./devToolsHelpers";

// Mock URLSearchParams to control isDevMode behavior
const mockURLSearchParams = jest.fn();
globalThis.URLSearchParams = mockURLSearchParams;

describe("devToolsHelpers", () => {
    beforeEach(() => {
        // Clear document body
        document.body.innerHTML = "";

        // Reset URLSearchParams mock
        mockURLSearchParams.mockReset();
        mockURLSearchParams.mockReturnValue({
            get: jest.fn().mockReturnValue(null)
        });
    });

    afterAll(() => {
        // Restore original URLSearchParams if needed
        globalThis.URLSearchParams = URLSearchParams;
    });

    describe("isDevMode", () => {
        it("returns true when devtools parameter is 'true'", () => {
            mockURLSearchParams.mockReturnValue({
                get: jest.fn().mockReturnValue("true")
            });

            expect(isDevMode()).toBe(true);
        });

        it("returns false when devtools parameter is not 'true'", () => {
            mockURLSearchParams.mockReturnValue({
                get: jest.fn().mockReturnValue("false")
            });

            expect(isDevMode()).toBe(false);
        });

        it("returns false when devtools parameter is missing", () => {
            mockURLSearchParams.mockReturnValue({
                get: jest.fn().mockReturnValue(null)
            });

            expect(isDevMode()).toBe(false);
        });
    });

    describe("addDevToolsOverlay", () => {
        let element, component;

        beforeEach(() => {
            element = document.createElement("div");
            component = {
                id: "test-id",
                type: "test-type",
                visible: true
            };
            document.body.appendChild(element);
        });

        it("does nothing when not in dev mode", () => {
            mockURLSearchParams.mockReturnValue({
                get: jest.fn().mockReturnValue(null)
            });

            addDevToolsOverlay(element, component);

            expect(element.children.length).toBe(0);
        });

        it("adds overlay elements when in dev mode", () => {
            mockURLSearchParams.mockReturnValue({
                get: jest.fn().mockReturnValue("true")
            });

            addDevToolsOverlay(element, component);

            expect(element.children.length).toBe(2); // button and panel
            expect(element.querySelector("button")).toBeTruthy();
        });

        it("sets element position to relative if not already set", () => {
            mockURLSearchParams.mockReturnValue({
                get: jest.fn().mockReturnValue("true")
            });

            addDevToolsOverlay(element, component);

            expect(element.style.position).toBe("relative");
        });

        it("does not override existing position", () => {
            mockURLSearchParams.mockReturnValue({
                get: jest.fn().mockReturnValue("true")
            });
            element.style.position = "absolute";

            addDevToolsOverlay(element, component);

            expect(element.style.position).toBe("absolute");
        });

        it("creates different button styles for different types", () => {
            mockURLSearchParams.mockReturnValue({
                get: jest.fn().mockReturnValue("true")
            });

            // Test base type (default)
            addDevToolsOverlay(element, component);
            let button = element.querySelector("button");
            expect(button.textContent).toBe("B");

            // Clear and test data type
            element.innerHTML = "";
            addDevToolsOverlay(element, component, "data");
            button = element.querySelector("button");
            expect(button.textContent).toBe("D");

            // Clear and test layout type
            element.innerHTML = "";
            addDevToolsOverlay(element, component, "layout");
            button = element.querySelector("button");
            expect(button.textContent).toBe("L");
        });
    });

    describe("renderHiddenDevToolsElement", () => {
        let element, component;

        beforeEach(() => {
            element = document.createElement("span");
            component = {
                type: "hidden",
                visible: false
            };
        });

        it("returns null when not in dev mode", () => {
            mockURLSearchParams.mockReturnValue({
                get: jest.fn().mockReturnValue(null)
            });

            const result = renderHiddenDevToolsElement(element, component);

            expect(result).toBeNull();
        });

        it("returns container element when in dev mode", () => {
            mockURLSearchParams.mockReturnValue({
                get: jest.fn().mockReturnValue("true")
            });

            const result = renderHiddenDevToolsElement(element, component);

            expect(result).toBeTruthy();
            expect(result.tagName).toBe("DIV");
        });

        it("includes type labels and hidden indicator", () => {
            mockURLSearchParams.mockReturnValue({
                get: jest.fn().mockReturnValue("true")
            });

            const container = renderHiddenDevToolsElement(element, component);

            const spans = container.querySelectorAll("span");
            expect(spans.length).toBeGreaterThanOrEqual(3);

            // Should contain "hidden" text
            const hiddenSpan = Array.from(spans).find((span) => span.textContent === "hidden");
            expect(hiddenSpan).toBeTruthy();
        });

        it("creates different styles for different component types", () => {
            mockURLSearchParams.mockReturnValue({
                get: jest.fn().mockReturnValue("true")
            });

            // Test base type - check for RGBA values (browsers convert hex to RGBA)
            const baseContainer = renderHiddenDevToolsElement(element, component);
            expect(baseContainer.style.background).toMatch(/rgba\(26, 26, 53|#1a1a35/);

            // Test data type
            const dataContainer = renderHiddenDevToolsElement(element, component, "data");
            expect(dataContainer.style.background).toMatch(/rgba\(13, 37, 24|#0d2518/);

            // Test layout type
            const layoutContainer = renderHiddenDevToolsElement(element, component, "layout");
            expect(layoutContainer.style.background).toMatch(/rgba\(30, 8, 56|#1e0838/);
        });
    });

    describe("panel interactions", () => {
        it("shows panel when button is clicked", () => {
            mockURLSearchParams.mockReturnValue({
                get: jest.fn().mockReturnValue("true")
            });

            const element = document.createElement("div");
            const component = { type: "test" };
            document.body.appendChild(element);

            addDevToolsOverlay(element, component);

            const button = element.querySelector("button");
            const panels = element.querySelectorAll("div");
            const panel = Array.from(panels).find((p) => p.style.display === "none");

            expect(panel).toBeTruthy();

            button.click();

            expect(panel.style.display).toBe("block");
        });
    });
});
