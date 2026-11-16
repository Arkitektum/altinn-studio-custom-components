import * as renderers from "./renderers.ts";

jest.mock("../localStorage.ts", () => ({
    getLayoutCode: jest.fn(() => [{ tagName: "custom-header-text" }]),
    getDataModels: jest.fn(() => []),
    getDataForComponent: jest.fn(() => ({ foo: "bar" })),
    addValueToLocalStorage: jest.fn(),
    getTextResources: jest.fn(() => ({ resources: [] })),
    getSelectedLanguage: jest.fn(() => "nb"),
    setSelectedLanguage: jest.fn(),
    getTextResourcesStorageKey: jest.fn(() => "textResources"),
    addDataModel: jest.fn()
}));
jest.mock("../UI.ts", () => ({
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
jest.mock("../getters.ts", () => ({
    getCodeInputElementForLayoutCode: jest.fn(() => mockCreateElement("input")),
    getCodeInputElementForTextResources: jest.fn(() => mockCreateElement("input")),
    getDataModelListElements: jest.fn(() => mockCreateElement("div"))
}));
jest.mock("../validators.ts", () => ({
    renderValidationMessages: jest.fn(() => []),
    validateResources: jest.fn(() => ({
        missingResourceBindings: [],
        duplicateTextResources: [],
        unusedResourceBindings: [],
        literalValues: [],
        emptyTextResources: []
    }))
}));
jest.mock("./layoutChecks.ts", () => ({
    checkLayoutComponents: jest.fn(() => [])
}));
jest.mock("../../../src/functions/feedbackHelpers.ts", () => ({
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
        expect(spans[0]!.textContent!).toBe("2"); // errors
        expect(spans[1]!.textContent!).toBe("2"); // warnings
        expect(spans[2]!.textContent!).toBe("1"); // info
        expect(spans[0]!.classList.contains("missing")!).toBe(true);
        expect(spans[1]!.classList.contains("unused")!).toBe(true);
        expect(spans[2]!.classList.contains("empty")!).toBe(true);
    });

    it("says in each count's tooltip what it counts", () => {
        renderers.renderTextResourceStatusIndicators({
            missingResourceBindings: [1],
            duplicateTextResources: [],
            unusedResourceBindings: [3],
            literalValues: [4],
            emptyTextResources: []
        });
        const titles = Array.from(document.querySelectorAll("#text-resource-status-indicators span")).map((span) => span.getAttribute("title"));
        expect(titles).toEqual([
            "1 error: missing or duplicate resources",
            "2 warnings: unused resources or literal values",
            "0 notes: empty resources"
        ]);
    });

    it("names the button it is in by the check and every count, and marks zeros as success", () => {
        document.body.innerHTML = '<button><div id="text-resource-status-indicators"></div></button>';
        renderers.renderTextResourceStatusIndicators({
            missingResourceBindings: [1, 2],
            duplicateTextResources: [],
            unusedResourceBindings: [],
            literalValues: [],
            emptyTextResources: [5]
        });
        expect(document.querySelector("button")!.getAttribute("aria-label")).toBe("Text resource check: 2 errors, 0 warnings, 1 note");
        expect(document.querySelectorAll("#text-resource-status-indicators .success")).toHaveLength(1);
    });

    it("replaces the counts drawn before", () => {
        const noFindings = {
            missingResourceBindings: [],
            duplicateTextResources: [],
            unusedResourceBindings: [],
            literalValues: [],
            emptyTextResources: []
        };
        renderers.renderTextResourceStatusIndicators({ ...noFindings, missingResourceBindings: [1] });
        renderers.renderTextResourceStatusIndicators(noFindings);
        const spans = Array.from(document.querySelectorAll("#text-resource-status-indicators span"));
        expect(spans.map((span) => span.textContent)).toEqual(["0", "0", "0"]);
    });

    it("does nothing when the sidebar is not drawn", () => {
        document.body.innerHTML = "";
        expect(() =>
            renderers.renderTextResourceStatusIndicators({
                missingResourceBindings: [],
                duplicateTextResources: [],
                unusedResourceBindings: [],
                literalValues: [],
                emptyTextResources: []
            })
        ).not.toThrow();
    });
});

describe("renderSidebar", () => {
    it("renders sidebar UI and attaches event handlers", () => {
        renderers.renderSidebar();
        expect(document.getElementById("sidebar")!.innerHTML!).toContain("file-list");
        expect(document.getElementById("sidebar")!.innerHTML!).toContain("Add data model");
    });
});

describe("renderLayoutFindingsIndicators", () => {
    beforeEach(() => {
        document.body.innerHTML = `<div id="layout-findings-indicators"></div>`;
    });
    it("shows the number of warnings and of notes", () => {
        renderers.renderLayoutFindingsIndicators([
            { component: "a", severity: "warning", message: "x" },
            { component: "b", severity: "warning", message: "y" },
            { component: "c", severity: "info", message: "z" }
        ]);
        const spans = document.querySelectorAll("#layout-findings-indicators span");
        expect(spans).toHaveLength(2);
        expect(spans[0]!.textContent).toBe("2");
        expect(spans[0]!.classList.contains("unused")).toBe(true);
        expect(spans[0]!.getAttribute("title")).toBe("2 warnings");
        expect(spans[1]!.textContent).toBe("1");
        expect(spans[1]!.classList.contains("empty")).toBe(true);
        expect(spans[1]!.getAttribute("title")).toBe("1 note");
    });
    it("names the button it is in by the check and both counts", () => {
        document.body.innerHTML = '<button><div id="layout-findings-indicators"></div></button>';
        renderers.renderLayoutFindingsIndicators([{ component: "a", severity: "warning", message: "x" }]);
        expect(document.querySelector("button")!.getAttribute("aria-label")).toBe("Layout check: 1 warning, 0 notes");
    });
    it("marks a count of zero as success, and replaces the earlier counts", () => {
        renderers.renderLayoutFindingsIndicators([{ component: "a", severity: "warning", message: "x" }]);
        renderers.renderLayoutFindingsIndicators([]);
        const spans = document.querySelectorAll("#layout-findings-indicators span");
        expect(spans).toHaveLength(2);
        expect(spans[0]!.textContent).toBe("0");
        expect(spans[0]!.classList.contains("success")).toBe(true);
        expect(spans[1]!.classList.contains("success")).toBe(true);
    });
});

describe("renderLayoutFindingsPanel", () => {
    const findings: Parameters<typeof renderers.renderLayoutFindingsPanel>[0] = [
        { component: "tittel", severity: "warning", message: "dataModelBindings.feil is never read" },
        { component: "<img src=x>", severity: "info", message: "<b>not markup</b>" }
    ];
    beforeEach(() => {
        document.body.innerHTML = `<section id="data-input"><textarea id="code-input" data-editor="layout"></textarea></section>`;
    });
    it("lists the findings above the layout code editor, as text", () => {
        renderers.renderLayoutFindingsPanel(findings);
        const panel = document.querySelector("#data-input > .layout-findings") as HTMLDetailsElement;
        expect(panel.nextElementSibling!.id).toBe("code-input");
        expect(panel.open).toBe(true);
        expect(panel.querySelector("summary")!.textContent).toBe("Layout check: 1 warning, 1 note");
        const items = panel.querySelectorAll("li");
        expect(items).toHaveLength(2);
        expect(items[0]!.classList.contains("warning")).toBe(true);
        expect(items[0]!.textContent).toBe("tittel dataModelBindings.feil is never read");
        expect(items[1]!.classList.contains("info")).toBe(true);
        expect(items[1]!.querySelector("img")).toBeNull();
        expect(items[1]!.querySelector("b")).toBeNull();
        expect(items[1]!.textContent).toBe("<img src=x> <b>not markup</b>");
    });
    it("replaces the earlier list and keeps it folded when it was folded", () => {
        renderers.renderLayoutFindingsPanel(findings);
        (document.querySelector(".layout-findings") as HTMLDetailsElement).open = false;
        renderers.renderLayoutFindingsPanel(findings.slice(0, 1));
        const panels = document.querySelectorAll(".layout-findings");
        expect(panels).toHaveLength(1);
        expect((panels[0] as HTMLDetailsElement).open).toBe(false);
        expect(panels[0]!.querySelector("summary")!.textContent).toBe("Layout check: 1 warning, 0 notes");
    });
    it("removes the list when there are no findings", () => {
        renderers.renderLayoutFindingsPanel(findings);
        renderers.renderLayoutFindingsPanel([]);
        expect(document.querySelector(".layout-findings")).toBeNull();
    });
    it("shows nothing when another editor is open", () => {
        document.body.innerHTML = `<section id="data-input"><textarea id="code-input"></textarea></section>`;
        renderers.renderLayoutFindingsPanel(findings);
        expect(document.querySelector(".layout-findings")).toBeNull();
    });
});
