import * as renderers from "./renderers.js";

jest.mock("../localStorage.js", () => ({
    getLayoutCode: jest.fn(() => [{ tagName: "custom-header-text" }]),
    getDataModels: jest.fn(() => []),
    getDataForComponent: jest.fn(() => ({ foo: "bar" })),
    addValueToLocalStorage: jest.fn(),
    getTextResources: jest.fn(() => ({ resources: [] })),
    addDataModel: jest.fn()
}));
jest.mock("../UI.js", () => ({
    closeValidationDialog: jest.fn(),
    openValidationDialog: jest.fn(),
    setActiveSidebarElement: jest.fn(),
    updateDataInputElement: jest.fn()
}));

function mockCreateElement(tag = "div") {
    if (typeof document !== "undefined") {
        return document.createElement(tag);
    }
    return {};
}
jest.mock("../getters.js", () => ({
    getCodeInputElementForLayoutCode: jest.fn(() => mockCreateElement("input")),
    getCodeInputElementForTextResources: jest.fn(() => mockCreateElement("input")),
    getDataModelListElements: jest.fn(() => mockCreateElement("div"))
}));
jest.mock("../validators.js", () => ({
    renderValidationMessages: jest.fn(() => []),
    validateResources: jest.fn(() => ({
        missingResourceBindings: [],
        duplicateTextResources: [],
        unusedResourceBindings: [],
        literalValues: [],
        emptyTextResources: []
    }))
}));
jest.mock("../../../src/functions/feedbackHelpers.js", () => ({
    renderFeedbackListElement: jest.fn(() => mockCreateElement("ul"))
}));
jest.mock("@arkitektum/altinn-studio-custom-components-utils", () => ({
    CustomElementHtmlAttributes: jest.fn(() => ({})),
    addContainerElement: jest.fn((el) => el),
    appendChildren: jest.fn(),
    createCustomElement: jest.fn(() => mockCreateElement("div")),
    getDataForComponent: jest.fn(() => ({}))
}));

beforeEach(() => {
    document.body.innerHTML = `
    <div id="code-results"></div>
    <div id="text-resource-status-indicators"></div>
    <div id="sidebar"></div>
  `;
    jest.clearAllMocks();
});

describe("renderResults", () => {
    it("renders components into #code-results", () => {
        renderers.renderResults();
        // appendChildren should be called with the container and results
        const { appendChildren } = require("@arkitektum/altinn-studio-custom-components-utils");
        expect(appendChildren).toHaveBeenCalled();
    });
});

describe("renderTextResourceStatusIndicators", () => {
    it("renders status indicators with correct counts and classes", () => {
        const validationResults = {
            missingResourceBindings: [1],
            duplicateTextResources: [2],
            unusedResourceBindings: [3],
            literalValues: [4],
            emptyTextResources: [5]
        };
        renderers.renderTextResourceStatusIndicators(validationResults);
        const spans = document.querySelectorAll("#text-resource-status-indicators span");
        expect(spans.length).toBe(3);
        expect(spans[0].textContent).toBe("2"); // errors
        expect(spans[1].textContent).toBe("2"); // warnings
        expect(spans[2].textContent).toBe("1"); // info
        expect(spans[0].classList.contains("missing")).toBe(true);
        expect(spans[1].classList.contains("unused")).toBe(true);
        expect(spans[2].classList.contains("empty")).toBe(true);
    });
});

describe("renderSidebar", () => {
    it("renders sidebar UI and attaches event handlers", () => {
        renderers.renderSidebar();
        expect(document.getElementById("sidebar").innerHTML).toContain("file-list");
        expect(document.getElementById("sidebar").innerHTML).toContain("Add Data Model");
    });
});
