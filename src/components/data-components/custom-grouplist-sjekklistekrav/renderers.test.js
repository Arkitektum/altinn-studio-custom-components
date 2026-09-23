import * as renderers from "./renderers.js";

/** One checklist requirement, as the group below will receive it. */
const sjekklistekrav = { sjekklistepunkt: { kodebeskrivelse: "Er tiltaket søknadspliktig" }, sjekklistepunktsvar: true };

/** The list of requirements, with the wording for each answer and the two column headings. */
const component = {
    enableLinks: true,
    resourceBindings: {
        sjekklistepunkt: "Sjekklistepunkt",
        sjekklistepunktsvar: "Svar",
        trueText: "Ja",
        falseText: "Nei",
        defaultText: "Ikke besvart"
    },
    resourceValues: { data: [sjekklistekrav], description: "Kravene gjelder tiltaket" }
};

/** The custom element a renderer produced, unwrapped from the container when it added one. */
const element = (rendered) => (rendered.tagName === "DIV" ? rendered.firstChild.firstChild : rendered);

/** The attributes a custom element carries, with the JSON-valued ones parsed back. */
function attributes(rendered) {
    const target = element(rendered);
    const read = (name) => target.getAttribute(name);
    const readJson = (name) => (read(name) === null ? null : JSON.parse(read(name)));
    return {
        tagName: target.tagName.toLowerCase(),
        size: read("size"),
        isChildComponent: read("ischildcomponent"),
        hideIfEmpty: read("hideifempty"),
        enableLinks: read("enablelinks"),
        styleOverride: readJson("styleoverride"),
        resourceBindings: readJson("resourcebindings"),
        resourceValues: readJson("resourcevalues"),
        wrapped: rendered.tagName === "DIV"
    };
}

describe("the header", () => {
    it("takes the title it is given and sits at h2 unless a level is asked for", () => {
        expect(attributes(renderers.renderHeaderElement("Sjekkliste"))).toMatchObject({
            tagName: "custom-header-text",
            size: "h2",
            resourceValues: { title: "Sjekkliste" }
        });
        expect(attributes(renderers.renderHeaderElement("Sjekkliste", "h4")).size).toBe("h4");
    });
});

describe("the column headings", () => {
    it("passes both headings down to the row that draws them", () => {
        expect(attributes(renderers.renderSjekklistekravGroupListHeader(component))).toMatchObject({
            tagName: "custom-group-sjekklistekrav-header-text",
            resourceBindings: { sjekklistepunkt: "Sjekklistepunkt", sjekklistepunktsvar: "Svar" }
        });
    });

    it("draws no heading row at all unless both headings are named", () => {
        // A row with one of its two columns unlabelled would read as a mistake, so it declines to render.
        expect(renderers.renderSjekklistekravGroupListHeader({ resourceBindings: { sjekklistepunktsvar: "Svar" } })).toBeNull();
        expect(renderers.renderSjekklistekravGroupListHeader({ resourceBindings: { sjekklistepunkt: "Sjekklistepunkt" } })).toBeNull();
        expect(renderers.renderSjekklistekravGroupListHeader({})).toBeNull();
    });
});

describe("one requirement", () => {
    it("renders the requirement it is handed, not the list it came from", () => {
        expect(attributes(renderers.renderSjekklistekravGroup(sjekklistekrav, component))).toMatchObject({
            tagName: "custom-group-sjekklistekrav",
            hideIfEmpty: "true",
            wrapped: false,
            resourceValues: { data: sjekklistekrav }
        });
    });

    it("takes down only the wording for the answer, not the column headings", () => {
        // The headings are drawn once above the list, so a row has no use for them.
        expect(attributes(renderers.renderSjekklistekravGroup(sjekklistekrav, component)).resourceBindings).toEqual({
            trueText: "Ja",
            falseText: "Nei",
            defaultText: "Ikke besvart"
        });
    });

    it("renders a requirement without a surrounding component rather than throwing", () => {
        expect(attributes(renderers.renderSjekklistekravGroup(sjekklistekrav, undefined)).resourceValues).toEqual({ data: sjekklistekrav });
    });
});

describe("the description above the list", () => {
    it("renders the description, which is a resource value rather than the data", () => {
        expect(attributes(renderers.renderDescription(component))).toMatchObject({
            tagName: "custom-paragraph",
            wrapped: true,
            resourceValues: { title: "Kravene gjelder tiltaket" }
        });
    });

    it("sets it in italics and keeps it with the list when the page breaks", () => {
        // A description stranded at the foot of a page, away from the requirements it introduces, reads as an orphan.
        expect(attributes(renderers.renderDescription(component)).styleOverride).toEqual({
            pageBreakBefore: "avoid",
            pageBreakInside: "avoid",
            fontStyle: "italic"
        });
    });
});

describe("the empty field text", () => {
    it("renders whatever it was handed as the paragraph's own title", () => {
        expect(attributes(renderers.renderEmptyFieldText({ resourceValues: { data: "Ingen krav" } }))).toMatchObject({
            tagName: "custom-paragraph",
            wrapped: true,
            resourceValues: { title: "Ingen krav" }
        });
    });
});

describe("the divider", () => {
    it("renders without being told anything, and carries no margin of its own", () => {
        expect(attributes(renderers.renderDivider())).toMatchObject({
            tagName: "custom-divider",
            styleOverride: { margin: 0 }
        });
    });

    it("is not marked as a child component, unlike everything else here", () => {
        // It carries no content, so nothing about it depends on the component it sits in.
        expect(attributes(renderers.renderDivider()).isChildComponent).toBeNull();
    });
});

describe("every renderer that reads a component", () => {
    const fromComponent = {
        renderSjekklistekravGroupListHeader: renderers.renderSjekklistekravGroupListHeader,
        renderDescription: renderers.renderDescription,
        renderEmptyFieldText: renderers.renderEmptyFieldText
    };

    it("renders something, or deliberately nothing, for a component with no data at all", () => {
        for (const [name, render] of Object.entries(fromComponent)) {
            expect({ name, threw: false, rendered: render({}) !== undefined }).toEqual({ name, threw: false, rendered: true });
        }
    });

    it("renders without a component at all rather than throwing", () => {
        for (const [name, render] of Object.entries(fromComponent)) {
            expect({ name, threw: false, rendered: render(undefined) !== undefined }).toEqual({ name, threw: false, rendered: true });
        }
    });
});
