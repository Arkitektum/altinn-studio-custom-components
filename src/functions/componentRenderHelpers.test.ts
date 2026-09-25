import { addDevToolsOverlay, isDevMode, renderHiddenDevToolsElement } from "./devToolsHelpers.ts";
import { renderCustomComponent, validateHostDataAttributes } from "./componentRenderHelpers.ts";
import { getComponentContainerElement } from "./helpers.ts";
import { instantiateComponent } from "./componentHelpers.ts";
import { renderFeedbackListElement } from "./feedbackHelpers.ts";

jest.mock("./componentHelpers.ts", () => ({ instantiateComponent: jest.fn() }));
jest.mock("./devToolsHelpers.ts", () => ({
    addDevToolsOverlay: jest.fn(),
    isDevMode: jest.fn(),
    renderHiddenDevToolsElement: jest.fn()
}));
jest.mock("./helpers.ts", () => ({ getComponentContainerElement: jest.fn() }));
jest.mock("./feedbackHelpers.ts", () => ({ renderFeedbackListElement: jest.fn() }));

describe("renderCustomComponent", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("hides the container and skips render when hideIfEmpty and empty (not dev mode)", () => {
        const host = document.createElement("div");
        const container = document.createElement("div");
        jest.mocked(instantiateComponent).mockReturnValue({ hideIfEmpty: true, isEmpty: true });
        jest.mocked(getComponentContainerElement).mockReturnValue(container);
        jest.mocked(isDevMode).mockReturnValue(false);
        const render = jest.fn();

        renderCustomComponent(host, { type: "data", render });

        expect(container.style.display).toBe("none");
        expect(render).not.toHaveBeenCalled();
        expect(addDevToolsOverlay).not.toHaveBeenCalled();
    });

    it("renders a DevTools placeholder when hidden in dev mode", () => {
        const host = document.createElement("div");
        const hidden = document.createElement("span");
        jest.mocked(instantiateComponent).mockReturnValue({ hideIfEmpty: true, isEmpty: true });
        jest.mocked(getComponentContainerElement).mockReturnValue(document.createElement("div"));
        jest.mocked(isDevMode).mockReturnValue(true);
        jest.mocked(renderHiddenDevToolsElement).mockReturnValue(hidden as unknown as HTMLDivElement);
        const render = jest.fn();

        renderCustomComponent(host, { type: "data", render });

        expect(host.contains(hidden)).toBe(true);
        expect(render).not.toHaveBeenCalled();
    });

    it("does not hide an empty component without hideIfEmpty by default (renders instead)", () => {
        const host = document.createElement("div");
        const container = document.createElement("div");
        jest.mocked(instantiateComponent).mockReturnValue({ isEmpty: true });
        jest.mocked(getComponentContainerElement).mockReturnValue(container);
        jest.mocked(isDevMode).mockReturnValue(false);
        const render = jest.fn();

        renderCustomComponent(host, { type: "data", render });

        expect(container.style.display).not.toBe("none");
        expect(render).toHaveBeenCalled();
    });

    it("hides an empty component when alwaysHideWhenEmpty is set, even without hideIfEmpty", () => {
        const host = document.createElement("div");
        const container = document.createElement("div");
        jest.mocked(instantiateComponent).mockReturnValue({ isEmpty: true });
        jest.mocked(getComponentContainerElement).mockReturnValue(container);
        jest.mocked(isDevMode).mockReturnValue(false);
        const render = jest.fn();

        renderCustomComponent(host, { type: "data", render, alwaysHideWhenEmpty: true });

        expect(container.style.display).toBe("none");
        expect(render).not.toHaveBeenCalled();
    });

    it("invokes render and attaches the DevTools overlay when not hidden", () => {
        const host = document.createElement("div");
        jest.mocked(instantiateComponent).mockReturnValue({ isEmpty: false });
        jest.mocked(getComponentContainerElement).mockReturnValue(document.createElement("div"));
        const render: jest.Mock<(host: HTMLElement, component: unknown) => void> = jest.fn((h: HTMLElement) => {
            h.appendChild(document.createElement("p"));
        });

        renderCustomComponent(host, { type: "base", render });

        expect(render).toHaveBeenCalledTimes(1);
        expect(render.mock.calls[0]![0]).toBe(host);
        expect(render.mock.calls[0]![1]).toBeInstanceOf(Object);
        expect(host.querySelector("p")).not.toBeNull();
    });

    it("appends a feedback list when withFeedback and there are validation messages", () => {
        const host = document.createElement("div");
        const feedback = document.createElement("ul");
        jest.mocked(instantiateComponent).mockReturnValue({ isEmpty: false, hasValidationMessages: true, validationMessages: {} });
        jest.mocked(getComponentContainerElement).mockReturnValue(null);
        jest.mocked(renderFeedbackListElement).mockReturnValue(feedback);

        renderCustomComponent(host, { type: "data", render: jest.fn(), withFeedback: true });

        expect(host.contains(feedback)).toBe(true);
    });

    it("does not append feedback when withFeedback is false", () => {
        const host = document.createElement("div");
        jest.mocked(instantiateComponent).mockReturnValue({ isEmpty: false, hasValidationMessages: true, validationMessages: {} });
        jest.mocked(getComponentContainerElement).mockReturnValue(null);

        renderCustomComponent(host, { type: "data", render: jest.fn() });

        expect(renderFeedbackListElement).not.toHaveBeenCalled();
    });

    it("validates host data attributes by default", () => {
        const host = document.createElement("custom-field-data");
        host.setAttribute("formdata", JSON.stringify({ unexpectedKey: "x" }));
        jest.mocked(instantiateComponent).mockReturnValue({ isEmpty: false });
        jest.mocked(getComponentContainerElement).mockReturnValue(document.createElement("div"));
        const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

        renderCustomComponent(host, { type: "data", render: jest.fn() });

        expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining("unrecognized formData keys: unexpectedKey"));
        jest.mocked(errorSpy).mockRestore();
    });

    it("skips data-attribute validation when validateData is false", () => {
        const host = document.createElement("custom-field-grid");
        host.setAttribute("formdata", JSON.stringify({ unexpectedKey: "x" }));
        jest.mocked(instantiateComponent).mockReturnValue({ isEmpty: false });
        jest.mocked(getComponentContainerElement).mockReturnValue(document.createElement("div"));
        const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

        renderCustomComponent(host, { type: "data", render: jest.fn(), validateData: false });

        expect(errorSpy).not.toHaveBeenCalled();
        jest.mocked(errorSpy).mockRestore();
    });
});

describe("renderCustomComponent — padded container wrapper", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.mocked(isDevMode).mockReturnValue(false);
        document.body.innerHTML = "";
    });

    /**
     * Mirrors what `addContainerElement` builds: a padded `[data-summary-target]` container holding a content div
     * that holds the component.
     */
    function buildWrappedField() {
        const layoutContainer = document.createElement("div");
        document.body.appendChild(layoutContainer);
        const wrapper = document.createElement("div");
        wrapper.setAttribute("data-summary-target", "");
        wrapper.style.padding = "0.75rem 0px";
        const contentElement = document.createElement("div");
        const host = document.createElement("custom-field-boolean-text");
        host.setAttribute("isChildComponent", "true");
        host.setAttribute("hideIfEmpty", "true");
        contentElement.appendChild(host);
        wrapper.appendChild(contentElement);
        layoutContainer.appendChild(wrapper);
        return { wrapper, host };
    }

    it("hides the padded wrapper rather than the component, so its padding collapses too", () => {
        const { wrapper, host } = buildWrappedField();
        // A child component's container is the component itself, which would leave the wrapper's padding behind.
        jest.mocked(getComponentContainerElement).mockReturnValue(host);
        jest.mocked(instantiateComponent).mockReturnValue({ isEmpty: true });
        const render = jest.fn();

        renderCustomComponent(host, { type: "data", render });

        expect(wrapper.style.display).toBe("none");
        expect(render).not.toHaveBeenCalled();
    });

    it("keeps the wrapper visible when the component has content", () => {
        const { wrapper, host } = buildWrappedField();
        jest.mocked(getComponentContainerElement).mockReturnValue(host);
        jest.mocked(instantiateComponent).mockReturnValue({ isEmpty: false });

        renderCustomComponent(host, { type: "data", render: jest.fn() });

        expect(wrapper.style.display).not.toBe("none");
    });

    it("does not collapse an enclosing group's wrapper when the component is not directly wrapped", () => {
        const groupWrapper = document.createElement("div");
        groupWrapper.setAttribute("data-summary-target", "");
        document.body.appendChild(groupWrapper);
        const groupContent = document.createElement("div");
        const groupHost = document.createElement("custom-group-avloep");
        groupContent.appendChild(groupHost);
        groupWrapper.appendChild(groupContent);
        const layoutContainer = document.createElement("div");
        groupHost.appendChild(layoutContainer);
        const host = document.createElement("custom-field-boolean-text");
        host.setAttribute("isChildComponent", "true");
        host.setAttribute("hideIfEmpty", "true");
        layoutContainer.appendChild(host);
        jest.mocked(getComponentContainerElement).mockReturnValue(host);
        jest.mocked(instantiateComponent).mockReturnValue({ isEmpty: true });

        renderCustomComponent(host, { type: "data", render: jest.fn() });

        expect(groupWrapper.style.display).not.toBe("none");
        expect(host.style.display).toBe("none");
    });
});

describe("renderCustomComponent — layout components", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.mocked(isDevMode).mockReturnValue(false);
        jest.mocked(getComponentContainerElement).mockReturnValue(null);
        document.body.innerHTML = "";
    });

    function createLayoutHost(attributes: Record<string, string> = {}) {
        const host = document.createElement("custom-dispensasjon");
        Object.entries(attributes).forEach(([name, value]) => host.setAttribute(name, value));
        document.body.appendChild(host);
        return host;
    }

    it("hides an empty layout by default, without the host asking for it", () => {
        const host = createLayoutHost();
        jest.mocked(instantiateComponent).mockReturnValue({ isEmpty: true });
        const render = jest.fn();

        renderCustomComponent(host, { type: "layout", render });

        expect(render).not.toHaveBeenCalled();
        expect(document.body.contains(host)).toBe(false);
    });

    it("removes an empty layout even though it has no container to hide", () => {
        const host = createLayoutHost();
        jest.mocked(instantiateComponent).mockReturnValue({ isEmpty: true });
        jest.mocked(getComponentContainerElement).mockReturnValue(null);

        renderCustomComponent(host, { type: "layout", render: jest.fn() });

        expect(document.body.contains(host)).toBe(false);
    });

    it("removes the container rather than the host when the layout has one", () => {
        const container = document.createElement("div");
        document.body.appendChild(container);
        const host = document.createElement("custom-dispensasjon");
        container.appendChild(host);
        jest.mocked(instantiateComponent).mockReturnValue({ isEmpty: true });
        jest.mocked(getComponentContainerElement).mockReturnValue(container);

        renderCustomComponent(host, { type: "layout", render: jest.fn() });

        expect(document.body.contains(container)).toBe(false);
    });

    it("removes a layout that holds data but renders nothing visible", () => {
        const host = createLayoutHost();
        jest.mocked(instantiateComponent).mockReturnValue({ isEmpty: false });
        const render = jest.fn((hostElement: HTMLElement) => {
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
        jest.mocked(instantiateComponent).mockReturnValue({ isEmpty: false });
        const render = jest.fn((hostElement: HTMLElement) => {
            const paragraph = document.createElement("p");
            paragraph.textContent = "Dispensasjonen gjelder";
            hostElement.appendChild(paragraph);
        });

        renderCustomComponent(host, { type: "layout", render });

        expect(document.body.contains(host)).toBe(true);
    });

    it('removes an empty layout even when the host asks for hideIfEmpty="false"', () => {
        // A layout cannot opt out. One left in the document puts a gap in the summary view and the PDF that
        // nothing downstream can tell apart from a real section.
        const host = createLayoutHost({ hideIfEmpty: "false" });
        jest.mocked(instantiateComponent).mockReturnValue({ isEmpty: true });
        const render = jest.fn();

        renderCustomComponent(host, { type: "layout", render });

        expect(render).not.toHaveBeenCalled();
        expect(document.body.contains(host)).toBe(false);
    });

    it("renders a DevTools placeholder instead of removing an empty layout in dev mode", () => {
        const host = createLayoutHost();
        const hidden = document.createElement("span");
        jest.mocked(instantiateComponent).mockReturnValue({ isEmpty: true });
        jest.mocked(isDevMode).mockReturnValue(true);
        jest.mocked(renderHiddenDevToolsElement).mockReturnValue(hidden as unknown as HTMLDivElement);

        renderCustomComponent(host, { type: "layout", render: jest.fn() });

        expect(host.contains(hidden)).toBe(true);
        expect(document.body.contains(host)).toBe(true);
    });

    it("keeps an empty layout whose only content is its validation feedback", () => {
        const host = createLayoutHost();
        const feedback = document.createElement("ul");
        feedback.textContent = "Mangler tekstressurs";
        jest.mocked(instantiateComponent).mockReturnValue({ isEmpty: true, hasValidationMessages: true, validationMessages: {} });
        jest.mocked(renderFeedbackListElement).mockReturnValue(feedback);

        renderCustomComponent(host, { type: "layout", render: jest.fn(), withFeedback: true });

        expect(host.contains(feedback)).toBe(true);
        expect(document.body.contains(host)).toBe(true);
    });

    it("hides rather than removes an empty data component, leaving its tag in place", () => {
        const container = document.createElement("div");
        document.body.appendChild(container);
        const host = document.createElement("custom-field-data");
        container.appendChild(host);
        jest.mocked(instantiateComponent).mockReturnValue({ hideIfEmpty: true, isEmpty: true });
        jest.mocked(getComponentContainerElement).mockReturnValue(container);

        renderCustomComponent(host, { type: "data", render: jest.fn() });

        expect(container.style.display).toBe("none");
        expect(document.body.contains(container)).toBe(true);
        expect(container.contains(host)).toBe(true);
    });

    it("does not remove an empty data component that has no container", () => {
        const host = document.createElement("custom-field-data");
        document.body.appendChild(host);
        jest.mocked(instantiateComponent).mockReturnValue({ hideIfEmpty: true, isEmpty: true });
        jest.mocked(getComponentContainerElement).mockReturnValue(null);
        const render = jest.fn();

        renderCustomComponent(host, { type: "data", render });

        expect(render).toHaveBeenCalled();
        expect(document.body.contains(host)).toBe(true);
    });
});

describe("validateHostDataAttributes", () => {
    let errorSpy: ReturnType<typeof jest.spyOn>;

    beforeEach(() => {
        errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
        jest.mocked(errorSpy).mockRestore();
    });

    it("reports unrecognized formData keys with a hint pointing to getComponentDataValue", () => {
        const host = document.createElement("custom-field-data");
        host.setAttribute("formdata", JSON.stringify({ data: "ok", unexpectedKey: "x" }));

        validateHostDataAttributes(host, "data");

        expect(errorSpy).toHaveBeenCalledTimes(1);
        const message = jest.mocked(errorSpy).mock.calls[0][0];
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
