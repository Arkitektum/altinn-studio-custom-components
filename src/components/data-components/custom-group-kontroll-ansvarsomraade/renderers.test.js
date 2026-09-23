import * as renderers from "./renderers.js";

/** One area of responsibility under control, with everything its renderers read. */
const component = {
    resourceBindings: {
        funksjon: { title: "Funksjon" },
        beskrivelseAvAnsvarsomraadet: { title: "Beskrivelse" },
        datoAnsvarsrettErklaert: { title: "Ansvarsrett erklært" },
        erAnsvarsomraadetAvsluttet: { title: "Avsluttet", trueText: "Ja", falseText: "Nei", defaultText: "Ikke oppgitt" },
        erDetFunnetAvvik: { title: "Kontrollerende" }
    },
    resourceValues: {
        data: {
            funksjon: { kodeverdi: "KONTROLL", kodebeskrivelse: "Kontrollerende" },
            beskrivelseAvAnsvarsomraadet: "Kontroll av våtrom",
            datoAnsvarsrettErklaert: "2026-09-01",
            erAnsvarsomraadetAvsluttet: true,
            kontrollerendeList: { resourceValues: { data: ["Firma AS"] } }
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
        format: read("format"),
        isChildComponent: read("ischildcomponent"),
        hideIfEmpty: read("hideifempty"),
        resourceBindings: readJson("resourcebindings"),
        resourceValues: readJson("resourcevalues"),
        wrapped: rendered.tagName === "DIV"
    };
}

describe("the header", () => {
    it("names the title as a binding and sits at h2 unless a level is asked for", () => {
        expect(attributes(renderers.renderHeaderElement("resource.kontroll.title"))).toMatchObject({
            tagName: "custom-header-text",
            size: "h2",
            resourceBindings: { title: "resource.kontroll.title" }
        });
        expect(attributes(renderers.renderHeaderElement("Kontroll", "h4")).size).toBe("h4");
    });
});

describe("what the area of responsibility is", () => {
    it("shows the function by its code, not its description", () => {
        // Functions are known by their short codes here, SOEK and PRO and the rest, which is how they are
        // written in a responsibility table.
        expect(attributes(renderers.renderFunksjonElement(component))).toMatchObject({
            tagName: "custom-field-data",
            hideIfEmpty: "true",
            resourceBindings: { title: "Funksjon" },
            resourceValues: { data: "KONTROLL" }
        });
    });

    it("shows the description as it was written", () => {
        expect(attributes(renderers.renderBeskrivelseElement(component)).resourceValues).toEqual({ data: "Kontroll av våtrom" });
    });

    it("formats the date responsibility was declared as a date", () => {
        expect(attributes(renderers.renderAnsvarsrettErklaertElement(component))).toMatchObject({
            format: "date",
            resourceValues: { data: "2026-09-01" }
        });
    });
});

describe("whether the work is finished", () => {
    it("turns the flag into words, taking every wording from the one binding", () => {
        expect(attributes(renderers.renderArbeidetAvsluttetElement(component))).toMatchObject({
            tagName: "custom-field-boolean-text",
            resourceBindings: { title: "Avsluttet", trueText: "Ja", falseText: "Nei", defaultText: "Ikke oppgitt" },
            resourceValues: { data: true }
        });
    });

    it("keeps the wording for an unanswered question, unlike the connection groups", () => {
        // This one passes the default through rather than silencing it, so an unanswered question still says so.
        expect(attributes(renderers.renderArbeidetAvsluttetElement({ ...component, resourceValues: { data: {} } }))).toMatchObject({
            resourceBindings: { defaultText: "Ikke oppgitt" },
            resourceValues: null
        });
    });
});

describe("the controllers", () => {
    it("reads the list out of the nested component that holds it", () => {
        // The list arrives already built by a component of its own, so the data sits one level in under its
        // own resourceValues rather than directly on the area of responsibility.
        expect(attributes(renderers.renderFunnetAvvikElement(component))).toMatchObject({
            tagName: "custom-field-data",
            resourceBindings: { title: "Kontrollerende" },
            resourceValues: { data: ["Firma AS"] }
        });
    });
});

describe("the empty field text", () => {
    it("renders whatever it was handed as the paragraph's own title", () => {
        expect(attributes(renderers.renderEmptyFieldText({ resourceValues: { data: "Ingen ansvarsområder" } }))).toMatchObject({
            tagName: "custom-paragraph",
            wrapped: true,
            resourceValues: { title: "Ingen ansvarsområder" }
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
        expect(attributes(renderers.renderHeaderElement("Kontroll")).isChildComponent).toBe("true");
    });
});
