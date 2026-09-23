import * as renderers from "./renderers.js";

/** One later submission with everything its renderers read. */
const data = {
    tema: { kodebeskrivelse: "Plan", kodeverdi: "PLAN" },
    kommentar: "Sendes senere",
    vedleggsliste: { vedlegg: [{ filnavn: "plan.pdf" }] }
};

/** The component wrapping that submission. */
const component = {
    enableLinks: true,
    resourceBindings: { tema: { title: "Tema" }, kommentar: { title: "Kommentar" }, vedleggsliste: { title: "Vedlegg" } },
    resourceValues: { data }
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
        resourceBindings: readJson("resourcebindings"),
        resourceValues: readJson("resourcevalues"),
        wrapped: rendered.tagName === "DIV"
    };
}

describe("the header", () => {
    it("sits at h3 unless a level is asked for, one below the list header above it", () => {
        expect(attributes(renderers.renderHeaderElement("Ettersending"))).toMatchObject({
            tagName: "custom-header-text",
            size: "h3",
            resourceValues: { title: "Ettersending" }
        });
        expect(attributes(renderers.renderHeaderElement("Ettersending", "h5")).size).toBe("h5");
    });
});

describe("the fields of a submission", () => {
    it("shows the theme by its description, not its code", () => {
        expect(attributes(renderers.renderTemaElement(component))).toMatchObject({
            tagName: "custom-field-data",
            hideIfEmpty: "true",
            resourceBindings: { title: "Tema" },
            resourceValues: { data: "Plan" }
        });
    });

    it("reads the attachments out of the list wrapper", () => {
        expect(attributes(renderers.renderVedleggslisteElement(component))).toMatchObject({
            tagName: "custom-list-vedlegg",
            resourceBindings: { title: "Vedlegg" },
            resourceValues: { data: [{ filnavn: "plan.pdf" }] }
        });
    });
});

describe("the comment", () => {
    it("shows the comment when there is one", () => {
        expect(attributes(renderers.renderKommentarElement(component)).resourceValues).toEqual({ data: "Sendes senere", emptyFieldText: "-" });
    });

    it("stays on the page as a dash when there is no comment", () => {
        // Alone among these fields it does not hide when empty, so an empty comment reads differently from a
        // missing one.
        const rendered = attributes(renderers.renderKommentarElement({ resourceValues: { data: {} } }));

        expect(rendered.hideIfEmpty).toBeNull();
        expect(rendered.resourceValues).toEqual({ emptyFieldText: "-" });
    });
});

describe("links in submissions", () => {
    it("reaches the theme and the comment, and not the attachment list", () => {
        // An attachment list renders its own links.
        expect(attributes(renderers.renderTemaElement(component)).enableLinks).toBe("true");
        expect(attributes(renderers.renderKommentarElement(component)).enableLinks).toBe("true");
        expect(attributes(renderers.renderVedleggslisteElement(component)).enableLinks).toBeNull();
    });
});

describe("the empty field text", () => {
    it("renders whatever it was handed as the paragraph's own title", () => {
        expect(attributes(renderers.renderEmptyFieldText({ resourceValues: { data: "Ingen ettersendinger" } }))).toMatchObject({
            tagName: "custom-paragraph",
            wrapped: true,
            resourceValues: { title: "Ingen ettersendinger" }
        });
    });
});

describe("every renderer", () => {
    const fromComponent = Object.fromEntries(Object.entries(renderers).filter(([name]) => name !== "renderHeaderElement"));

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
        for (const [name, render] of Object.entries(fromComponent)) {
            expect({ name, isChild: attributes(render(component)).isChildComponent }).toEqual({ name, isChild: "true" });
        }
        expect(attributes(renderers.renderHeaderElement("E")).isChildComponent).toBe("true");
    });
});
