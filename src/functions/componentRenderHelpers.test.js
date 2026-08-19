import { addDevToolsOverlay, isDevMode, renderHiddenDevToolsElement } from "./devToolsHelpers.js";
import { renderCustomComponent, validateHostDataAttributes } from "./componentRenderHelpers";
import { getComponentContainerElement } from "./helpers.js";
import { instantiateComponent } from "./componentHelpers.js";
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

describe("renderCustomComponent — layout components", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        isDevMode.mockReturnValue(false);
        getComponentContainerElement.mockReturnValue(null);
        document.body.innerHTML = "";
    });

    function createLayoutHost(attributes = {}) {
        const host = document.createElement("custom-dispensasjon");
        Object.entries(attributes).forEach(([name, value]) => host.setAttribute(name, value));
        document.body.appendChild(host);
        return host;
    }

    it("hides an empty layout by default, without the host asking for it", () => {
        const host = createLayoutHost();
        instantiateComponent.mockReturnValue({ isEmpty: true });
        const render = jest.fn();

        renderCustomComponent(host, { type: "layout", render });

        expect(render).not.toHaveBeenCalled();
        expect(document.body.contains(host)).toBe(false);
    });

    it("removes an empty layout even though it has no container to hide", () => {
        const host = createLayoutHost();
        instantiateComponent.mockReturnValue({ isEmpty: true });
        getComponentContainerElement.mockReturnValue(null);

        renderCustomComponent(host, { type: "layout", render: jest.fn() });

        expect(document.body.contains(host)).toBe(false);
    });

    it("removes the container rather than the host when the layout has one", () => {
        const container = document.createElement("div");
        document.body.appendChild(container);
        const host = document.createElement("custom-dispensasjon");
        container.appendChild(host);
        instantiateComponent.mockReturnValue({ isEmpty: true });
        getComponentContainerElement.mockReturnValue(container);

        renderCustomComponent(host, { type: "layout", render: jest.fn() });

        expect(document.body.contains(container)).toBe(false);
    });

    it("removes a layout that holds data but renders nothing visible", () => {
        const host = createLayoutHost();
        instantiateComponent.mockReturnValue({ isEmpty: false });
        const render = jest.fn((hostElement) => {
            const emptyChild = document.createElement("div");
            emptyChild.style.display = "none";
            emptyChild.textContent = "Ikke registrert";
            hostElement.appendChild(emptyChild);
        });

        renderCustomComponent(host, { type: "layout", render });

        expect(render).toHaveBeenCalled();
        expect(document.body.contains(host)).toBe(false);
    });

    it("keeps a layout that rendered content", () => {
        const host = createLayoutHost();
        instantiateComponent.mockReturnValue({ isEmpty: false });
        const render = jest.fn((hostElement) => {
            const paragraph = document.createElement("p");
            paragraph.textContent = "Dispensasjonen gjelder";
            hostElement.appendChild(paragraph);
        });

        renderCustomComponent(host, { type: "layout", render });

        expect(document.body.contains(host)).toBe(true);
    });

    it('renders and keeps an empty layout when the host opts out with hideIfEmpty="false"', () => {
        const host = createLayoutHost({ hideIfEmpty: "false" });
        instantiateComponent.mockReturnValue({ isEmpty: true });
        const render = jest.fn();

        renderCustomComponent(host, { type: "layout", render });

        expect(render).toHaveBeenCalled();
        expect(document.body.contains(host)).toBe(true);
    });

    it("renders a DevTools placeholder instead of removing an empty layout in dev mode", () => {
        const host = createLayoutHost();
        const hidden = document.createElement("span");
        instantiateComponent.mockReturnValue({ isEmpty: true });
        isDevMode.mockReturnValue(true);
        renderHiddenDevToolsElement.mockReturnValue(hidden);

        renderCustomComponent(host, { type: "layout", render: jest.fn() });

        expect(host.contains(hidden)).toBe(true);
        expect(document.body.contains(host)).toBe(true);
    });

    it("keeps an empty layout whose only content is its validation feedback", () => {
        const host = createLayoutHost();
        const feedback = document.createElement("ul");
        feedback.textContent = "Mangler tekstressurs";
        instantiateComponent.mockReturnValue({ isEmpty: true, hasValidationMessages: true, validationMessages: {} });
        renderFeedbackListElement.mockReturnValue(feedback);

        renderCustomComponent(host, { type: "layout", render: jest.fn(), withFeedback: true });

        expect(host.contains(feedback)).toBe(true);
        expect(document.body.contains(host)).toBe(true);
    });

    it("hides rather than removes an empty data component, leaving its tag in place", () => {
        const container = document.createElement("div");
        document.body.appendChild(container);
        const host = document.createElement("custom-field-data");
        container.appendChild(host);
        instantiateComponent.mockReturnValue({ hideIfEmpty: true, isEmpty: true });
        getComponentContainerElement.mockReturnValue(container);

        renderCustomComponent(host, { type: "data", render: jest.fn() });

        expect(container.style.display).toBe("none");
        expect(document.body.contains(container)).toBe(true);
        expect(container.contains(host)).toBe(true);
    });

    it("does not remove an empty data component that has no container", () => {
        const host = document.createElement("custom-field-data");
        document.body.appendChild(host);
        instantiateComponent.mockReturnValue({ hideIfEmpty: true, isEmpty: true });
        getComponentContainerElement.mockReturnValue(null);
        const render = jest.fn();

        renderCustomComponent(host, { type: "data", render });

        expect(render).toHaveBeenCalled();
        expect(document.body.contains(host)).toBe(true);
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
