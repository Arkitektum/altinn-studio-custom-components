import * as renderers from "./renderers.js";

/** One checklist requirement, with its question, its documentation and its answer. */
const component = {
    enableLinks: true,
    resourceBindings: { trueText: "Ja", falseText: "Nei", defaultText: "Ikke besvart" },
    resourceValues: {
        data: {
            sjekklistepunkt: { kodebeskrivelse: "Er tiltaket søknadspliktig" },
            dokumentasjon: "Se vedlegg",
            sjekklistepunktsvar: true
        }
    }
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
        hideTitle: read("hidetitle"),
        enableLinks: read("enablelinks"),
        grid: readJson("grid"),
        styleOverride: readJson("styleoverride"),
        resourceBindings: readJson("resourcebindings"),
        resourceValues: readJson("resourcevalues")
    };
}

describe("the header", () => {
    it("sits at h3 unless a level is asked for, one below the list header above it", () => {
        expect(attributes(renderers.renderHeaderElement("Krav"))).toMatchObject({
            tagName: "custom-header-text",
            size: "h3",
            resourceValues: { title: "Krav" }
        });
        expect(attributes(renderers.renderHeaderElement("Krav", "h5")).size).toBe("h5");
    });
});

describe("the question and its documentation", () => {
    it("shows the question as the title and the documentation as the value", () => {
        // The question comes from a code list, so it is the description rather than the code that is readable.
        expect(attributes(renderers.renderSjekklistepunkText(component))).toMatchObject({
            tagName: "custom-field",
            resourceValues: { title: "Er tiltaket søknadspliktig", data: "Se vedlegg" }
        });
    });

    it("stays on the page even when nothing was documented", () => {
        // The question has to be readable next to its answer, whether or not anything was written under it.
        expect(attributes(renderers.renderSjekklistepunkText(component)).hideIfEmpty).toBeNull();
    });

    it("takes eleven of the twelve columns, and keeps clear of the answer beside it", () => {
        expect(attributes(renderers.renderSjekklistepunkText(component)).grid).toEqual({ xs: 11 });
        expect(attributes(renderers.renderSjekklistepunkText(component)).styleOverride).toEqual({ paddingRight: "10px" });
    });
});

describe("the answer", () => {
    it("hands the answer to the element that turns it into words, with the wording for each outcome", () => {
        expect(attributes(renderers.renderSjekklistepunkValue(component))).toMatchObject({
            tagName: "custom-field-boolean-text",
            resourceBindings: { trueText: "Ja", falseText: "Nei", defaultText: "Ikke besvart" },
            resourceValues: { data: true }
        });
    });

    it("takes the last of the twelve columns and shows no title of its own", () => {
        // The question beside it already says what is being answered.
        expect(attributes(renderers.renderSjekklistepunkValue(component))).toMatchObject({
            grid: { xs: 1 },
            hideTitle: "true",
            hideIfEmpty: "true"
        });
    });
});

describe("the two together", () => {
    it("lays the question and the answer out on one row", () => {
        const row = renderers.renderSjekklistepunk(component);

        expect(row.style.display).toBe("flex");
        expect(row.children).toHaveLength(2);
    });

    it("puts the question first and the answer second", () => {
        const row = renderers.renderSjekklistepunk(component);
        const tagNames = [...row.children].map((child) => child.firstChild.firstChild.tagName.toLowerCase());

        expect(tagNames).toEqual(["custom-field", "custom-field-boolean-text"]);
    });
});

describe("links in requirements", () => {
    it("reaches the documentation, which may hold one, and not the answer, which is a yes or a no", () => {
        expect(attributes(renderers.renderSjekklistepunkText(component)).enableLinks).toBe("true");
        expect(attributes(renderers.renderSjekklistepunkValue(component)).enableLinks).toBeNull();
    });
});

describe("the empty field text", () => {
    it("renders whatever it was handed as the paragraph's own title", () => {
        expect(attributes(renderers.renderEmptyFieldText({ resourceValues: { data: "Ingen krav" } }))).toMatchObject({
            tagName: "custom-paragraph",
            resourceValues: { title: "Ingen krav" }
        });
    });
});

describe("every renderer that reads a component", () => {
    const fromComponent = {
        renderSjekklistepunkText: renderers.renderSjekklistepunkText,
        renderSjekklistepunkValue: renderers.renderSjekklistepunkValue,
        renderSjekklistepunk: renderers.renderSjekklistepunk,
        renderEmptyFieldText: renderers.renderEmptyFieldText
    };

    it("renders something for a component with no data at all", () => {
        for (const [name, render] of Object.entries(fromComponent)) {
            expect({ name, rendered: render({}) !== null }).toEqual({ name, rendered: true });
        }
    });

    it("renders without a component at all rather than throwing", () => {
        for (const [name, render] of Object.entries(fromComponent)) {
            expect({ name, rendered: render(undefined) !== undefined }).toEqual({ name, rendered: true });
        }
    });

    it("marks everything it renders as a child component", () => {
        const marked = {
            renderSjekklistepunkText: renderers.renderSjekklistepunkText(component),
            renderSjekklistepunkValue: renderers.renderSjekklistepunkValue(component),
            renderEmptyFieldText: renderers.renderEmptyFieldText(component),
            renderHeaderElement: renderers.renderHeaderElement("Krav")
        };
        for (const [name, rendered] of Object.entries(marked)) {
            expect({ name, isChild: attributes(rendered).isChildComponent }).toEqual({ name, isChild: "true" });
        }
    });
});
