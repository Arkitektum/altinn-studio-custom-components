import { addDevToolsOverlay, isDevMode, renderHiddenDevToolsElement } from "./devToolsHelpers.js";
import { getComponentContainerElement } from "./helpers.js";
import { instantiateComponent } from "./componentHelpers.js";
import { renderCustomComponent, validateHostDataAttributes } from "./componentRenderHelpers";
import { renderFeedbackListElement } from "./feedbackHelpers.js";

jest.mock("./componentHelpers.js", () => ({ instantiateComponent: jest.fn() }));
jest.mock("./devToolsHelpers.js", () => ({
    addDevToolsOverlay: jest.fn(),
    isDevMode: jest.fn(),
    renderHiddenDevToolsElement: jest.fn()
}));
jest.mock("./helpers.js", () => ({ getComponentContainerElement: jest.fn() }));
jest.mock("./feedbackHelpers.js", () => ({ renderFeedbackListElement: jest.fn() }));

describe("renderCustomComponent", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("hides the container and skips render when hideIfEmpty and empty (not dev mode)", () => {
        const host = document.createElement("div");
        const container = document.createElement("div");
        instantiateComponent.mockReturnValue({ hideIfEmpty: true, isEmpty: true });
        getComponentContainerElement.mockReturnValue(container);
        isDevMode.mockReturnValue(false);
        const render = jest.fn();

        renderCustomComponent(host, { type: "data", render });

        expect(container.style.display).toBe("none");
        expect(render).not.toHaveBeenCalled();
        expect(addDevToolsOverlay).not.toHaveBeenCalled();
    });

    it("renders a DevTools placeholder when hidden in dev mode", () => {
        const host = document.createElement("div");
        const hidden = document.createElement("span");
        instantiateComponent.mockReturnValue({ hideIfEmpty: true, isEmpty: true });
        getComponentContainerElement.mockReturnValue(document.createElement("div"));
        isDevMode.mockReturnValue(true);
        renderHiddenDevToolsElement.mockReturnValue(hidden);
        const render = jest.fn();

        renderCustomComponent(host, { type: "data", render });

        expect(host.contains(hidden)).toBe(true);
        expect(render).not.toHaveBeenCalled();
    });

    it("does not hide an empty component without hideIfEmpty by default (renders instead)", () => {
        const host = document.createElement("div");
        const container = document.createElement("div");
        instantiateComponent.mockReturnValue({ isEmpty: true });
        getComponentContainerElement.mockReturnValue(container);
        isDevMode.mockReturnValue(false);
        const render = jest.fn();

        renderCustomComponent(host, { type: "data", render });

        expect(container.style.display).not.toBe("none");
        expect(render).toHaveBeenCalled();
    });

    it("hides an empty component when alwaysHideWhenEmpty is set, even without hideIfEmpty", () => {
        const host = document.createElement("div");
        const container = document.createElement("div");
        instantiateComponent.mockReturnValue({ isEmpty: true });
        getComponentContainerElement.mockReturnValue(container);
        isDevMode.mockReturnValue(false);
        const render = jest.fn();

        renderCustomComponent(host, { type: "data", render, alwaysHideWhenEmpty: true });

        expect(container.style.display).toBe("none");
        expect(render).not.toHaveBeenCalled();
    });

    it("invokes render and attaches the DevTools overlay when not hidden", () => {
        const host = document.createElement("div");
        instantiateComponent.mockReturnValue({ isEmpty: false });
        getComponentContainerElement.mockReturnValue(document.createElement("div"));
        const render = jest.fn((h) => h.appendChild(document.createElement("p")));

        renderCustomComponent(host, { type: "base", render });

        expect(render).toHaveBeenCalledWith(host, expect.any(Object));
        expect(addDevToolsOverlay).toHaveBeenCalledWith(host, expect.any(Object), "base");
        expect(host.querySelector("p")).not.toBeNull();
    });

    it("appends a feedback list when withFeedback and there are validation messages", () => {
        const host = document.createElement("div");
        const feedback = document.createElement("ul");
        instantiateComponent.mockReturnValue({ isEmpty: false, hasValidationMessages: true, validationMessages: {} });
        getComponentContainerElement.mockReturnValue(null);
        renderFeedbackListElement.mockReturnValue(feedback);

        renderCustomComponent(host, { type: "data", render: jest.fn(), withFeedback: true });

        expect(host.contains(feedback)).toBe(true);
    });

    it("does not append feedback when withFeedback is false", () => {
        const host = document.createElement("div");
        instantiateComponent.mockReturnValue({ isEmpty: false, hasValidationMessages: true, validationMessages: {} });
        getComponentContainerElement.mockReturnValue(null);

        renderCustomComponent(host, { type: "data", render: jest.fn() });

        expect(renderFeedbackListElement).not.toHaveBeenCalled();
    });

    it("validates host data attributes by default", () => {
        const host = document.createElement("custom-field-data");
        host.setAttribute("formdata", JSON.stringify({ unexpectedKey: "x" }));
        instantiateComponent.mockReturnValue({ isEmpty: false });
        getComponentContainerElement.mockReturnValue(document.createElement("div"));
        const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

        renderCustomComponent(host, { type: "data", render: jest.fn() });

        expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining("unrecognized formData keys: unexpectedKey"));
        errorSpy.mockRestore();
    });

    it("skips data-attribute validation when validateData is false", () => {
        const host = document.createElement("custom-field-grid");
        host.setAttribute("formdata", JSON.stringify({ unexpectedKey: "x" }));
        instantiateComponent.mockReturnValue({ isEmpty: false });
        getComponentContainerElement.mockReturnValue(document.createElement("div"));
        const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

        renderCustomComponent(host, { type: "data", render: jest.fn(), validateData: false });

        expect(errorSpy).not.toHaveBeenCalled();
        errorSpy.mockRestore();
    });
});

describe("validateHostDataAttributes", () => {
    let errorSpy;

    beforeEach(() => {
        errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
        errorSpy.mockRestore();
    });

    it("reports unrecognized formData keys with a hint pointing to getComponentDataValue", () => {
        const host = document.createElement("custom-field-data");
        host.setAttribute("formdata", JSON.stringify({ data: "ok", unexpectedKey: "x" }));

        validateHostDataAttributes(host, "data");

        expect(errorSpy).toHaveBeenCalledTimes(1);
        const message = errorSpy.mock.calls[0][0];
        expect(message).toContain("unrecognized formData keys: unexpectedKey");
        expect(message).toContain("getComponentDataValue");
    });

    it("does not report when all formData keys are allowed for the type", () => {
        const host = document.createElement("custom-field-data");
        host.setAttribute("formdata", JSON.stringify({ data: "ok", simpleBinding: "value" }));

        validateHostDataAttributes(host, "data");

        expect(errorSpy).not.toHaveBeenCalled();
    });

    it("reports unrecognized resourceValues keys", () => {
        const host = document.createElement("custom-field-data");
        host.setAttribute("resourcevalues", JSON.stringify({ data: "ok", bogus: 1 }));

        validateHostDataAttributes(host, "data");

        expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining("unrecognized resourceValues keys: bogus"));
    });

    it("allows all keys for layout components (allow-all sentinel)", () => {
        const host = document.createElement("custom-dispensasjon");
        host.setAttribute("formdata", JSON.stringify({ tiltakshaver: {}, someUnlistedModelProp: {} }));
        host.setAttribute("resourcevalues", JSON.stringify({ anything: 1 }));

        validateHostDataAttributes(host, "layout");

        expect(errorSpy).not.toHaveBeenCalled();
    });

    it("reports invalid JSON without throwing", () => {
        const host = document.createElement("custom-field-data");
        host.setAttribute("formdata", "{ not valid json");

        expect(() => validateHostDataAttributes(host, "data")).not.toThrow();
        expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('invalid JSON in its "formdata" attribute'));
    });

    it("does nothing when there are no data attributes", () => {
        const host = document.createElement("custom-field-data");

        validateHostDataAttributes(host, "data");

        expect(errorSpy).not.toHaveBeenCalled();
    });
});
