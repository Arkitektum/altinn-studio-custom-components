import * as renderers from "./renderers.js";

/** The four questions this group asks, each a yes or a no. */
const booleanFields = [
    ["renderKrysserAvloepAnnensGrunnElement", "krysserAvloepAnnensGrunn", true],
    ["renderHarTinglystErklaeringElement", "harTinglystErklaering", false],
    ["renderSkalInstallereVannklosettElement", "skalInstallereVannklosett", true],
    ["renderHarUtslippstillatelseElement", "harUtslippstillatelse", false]
];

/** The sewage connection, with everything its renderers read. */
const component = {
    resourceBindings: {
        tilknytningstype: { title: "Tilknytningstype" },
        beskrivelse: { title: "Beskrivelse" },
        ...Object.fromEntries(booleanFields.map(([, key]) => [key, { title: key, trueText: "Ja", falseText: "Nei" }]))
    },
    resourceValues: {
        data: {
            tilknytningstype: { kodebeskrivelse: "Offentlig", kodeverdi: "OFF" },
            beskrivelse: "Tilknyttes kommunal ledning",
            ...Object.fromEntries(booleanFields.map(([, key, value]) => [key, value]))
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
        resourceBindings: readJson("resourcebindings"),
        resourceValues: readJson("resourcevalues"),
        wrapped: rendered.tagName === "DIV"
    };
}

describe("the header", () => {
    it("takes the title it is given and sits at h3 unless a level is asked for", () => {
        expect(attributes(renderers.renderHeaderElement("Avløp"))).toMatchObject({
            tagName: "custom-header-text",
            size: "h3",
            resourceValues: { title: "Avløp" }
        });
        expect(attributes(renderers.renderHeaderElement("Avløp", "h2")).size).toBe("h2");
    });
});

describe("the described fields", () => {
    it("shows the connection type by its description, not its code", () => {
        expect(attributes(renderers.renderTilknytningstypeElement(component))).toMatchObject({
            tagName: "custom-field-data",
            hideIfEmpty: "true",
            resourceBindings: { title: "Tilknytningstype" },
            resourceValues: { data: "Offentlig" }
        });
    });

    it("shows the description as it was written", () => {
        expect(attributes(renderers.renderBeskrivelseElement(component))).toMatchObject({
            tagName: "custom-field-data",
            resourceValues: { data: "Tilknyttes kommunal ledning" }
        });
    });
});

describe("the four yes or no questions", () => {
    it.each(booleanFields)("%s reads %s and turns it into words", (name, key, value) => {
        expect(attributes(renderers[name](component))).toMatchObject({
            tagName: "custom-field-boolean-text",
            hideIfEmpty: "true",
            resourceBindings: { title: key, trueText: "Ja", falseText: "Nei" },
            resourceValues: { data: value }
        });
    });

    it.each(booleanFields)("%s says nothing at all when the question went unanswered", (name) => {
        // Each of them sets an empty default rather than letting the shared "not given" wording appear, so an
        // unanswered question reads as absent rather than as a stated non-answer.
        expect(attributes(renderers[name](component)).resourceBindings.defaultText).toBe("");
        expect(attributes(renderers[name]({ resourceValues: { data: {} } })).resourceValues).toBeNull();
    });
});

describe("the empty field text", () => {
    it("renders whatever it was handed as the paragraph's own title", () => {
        expect(attributes(renderers.renderEmptyFieldText({ resourceValues: { data: "Ikke oppgitt" } }))).toMatchObject({
            tagName: "custom-paragraph",
            wrapped: true,
            resourceValues: { title: "Ikke oppgitt" }
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
        expect(attributes(renderers.renderHeaderElement("Avløp")).isChildComponent).toBe("true");
    });
});
