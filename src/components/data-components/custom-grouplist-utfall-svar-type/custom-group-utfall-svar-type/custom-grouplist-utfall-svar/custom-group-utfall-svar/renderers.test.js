import * as renderers from "./renderers.js";

/** One answer with everything its renderers read. */
const data = {
    beskrivelse: "Send inn situasjonsplan",
    tema: { kodebeskrivelse: "Plan", kodeverdi: "PLAN" },
    kommentar: "Ettersendes",
    vedleggsliste: { vedlegg: [{ filnavn: "plan.pdf" }] },
    erUtfallBesvart: true
};

/** The component wrapping that answer, with the bindings the list passed down. */
const component = {
    enableLinks: true,
    resourceBindings: {
        kommentar: { title: "Kommentar" },
        tema: { title: "Tema" },
        utfallSvarStatus: { title: "Status", erUtfallBesvart: "Besvart", erUtfallBesvaresSenere: "Besvares senere", status: "Status" },
        vedleggsliste: { title: "Vedlegg" }
    },
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
    it("sits at h3 unless a level is asked for, one below the type header above it", () => {
        expect(attributes(renderers.renderHeaderElement("Situasjonsplan"))).toMatchObject({
            tagName: "custom-header-text",
            size: "h3",
            resourceValues: { title: "Situasjonsplan" }
        });
        expect(attributes(renderers.renderHeaderElement("Situasjonsplan", "h5")).size).toBe("h5");
    });
});

describe("the fields of an answer", () => {
    it("renders the description with no title of its own", () => {
        // The header above it already names the answer, so a label here would only repeat it.
        expect(attributes(renderers.renderBeskrivelseElement(component))).toMatchObject({
            tagName: "custom-field-data",
            hideIfEmpty: "true",
            resourceBindings: null,
            resourceValues: { data: "Send inn situasjonsplan" }
        });
    });

    it("shows the theme by its description, not its code", () => {
        expect(attributes(renderers.renderTemaElement(component))).toMatchObject({
            tagName: "custom-field-data",
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

    it("hands the whole answer to the status field, which decides the wording itself", () => {
        // The status is worked out from several flags on the answer, so the field gets all of it along with
        // the wording for each outcome.
        expect(attributes(renderers.renderStatusElement(component))).toMatchObject({
            tagName: "custom-field-utfall-svar-status",
            resourceBindings: { title: "Status", erUtfallBesvart: "Besvart", erUtfallBesvaresSenere: "Besvares senere", status: "Status" },
            resourceValues: { data }
        });
    });
});

describe("the comment", () => {
    it("shows the comment when there is one", () => {
        expect(attributes(renderers.renderKommentarElement(component)).resourceValues).toEqual({ data: "Ettersendes", emptyFieldText: "-" });
    });

    it("stays on the page as a dash when there is no comment", () => {
        // Alone among these fields it does not hide when empty, so the reader can tell an empty comment from a
        // missing one.
        const rendered = attributes(renderers.renderKommentarElement({ resourceValues: { data: {} } }));

        expect(rendered.hideIfEmpty).toBeNull();
        expect(rendered.resourceValues).toEqual({ emptyFieldText: "-" });
    });
});

describe("links in answers", () => {
    it("reaches the fields that may hold a link, and not the attachment list", () => {
        // An attachment list renders its own links, so it is not told about the setting.
        expect(attributes(renderers.renderBeskrivelseElement(component)).enableLinks).toBe("true");
        expect(attributes(renderers.renderKommentarElement(component)).enableLinks).toBe("true");
        expect(attributes(renderers.renderVedleggslisteElement(component)).enableLinks).toBeNull();
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
        expect(attributes(renderers.renderHeaderElement("T")).isChildComponent).toBe("true");
    });
});
