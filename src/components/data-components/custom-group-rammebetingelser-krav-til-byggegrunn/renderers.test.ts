import * as renderers from "./renderers.ts";

/** The requirements on the ground being built on. */
const component = {
    resourceBindings: {
        harMiljoeforhold: { title: "Miljøforhold", trueText: "Ja", falseText: "Nei" },
        omraaderisiko: { title: "Områderisiko", description: "Risikoer som gjelder området" }
    },
    resourceValues: {
        data: {
            harMiljoeforhold: true,
            muligeOmraadeRisikoer: { omraadeRisiko: [{ kodebeskrivelse: "Flom" }] }
        }
    }
};

/** The custom element a renderer produced, unwrapped from the container when it added one. */
const element = (rendered: HTMLElement): HTMLElement =>
    rendered.tagName === "DIV" ? ((rendered.firstChild as HTMLElement).firstChild as HTMLElement) : rendered;

/** The attributes a custom element carries, with the JSON-valued ones parsed back. */
function attributes(rendered: HTMLElement) {
    const target = element(rendered);
    const read = (name: string) => target.getAttribute(name);
    const readJson = (name: string) => (read(name) === null ? null : JSON.parse(read(name)!));
    return {
        tagName: target.tagName.toLowerCase(),
        size: read("size"),
        isChildComponent: read("ischildcomponent"),
        hideIfEmpty: read("hideifempty"),
        hideTitle: read("hidetitle"),
        resourceBindings: readJson("resourcebindings"),
        resourceValues: readJson("resourcevalues"),
        wrapped: rendered.tagName === "DIV"
    };
}

describe("the header", () => {
    it("takes the title it is given and sits at h2 unless a level is asked for", () => {
        expect(attributes(renderers.renderHeaderElement("Krav til byggegrunn"))).toMatchObject({
            tagName: "custom-header-text",
            size: "h2",
            resourceValues: { title: "Krav til byggegrunn" }
        });
        expect(attributes(renderers.renderHeaderElement("Krav til byggegrunn", "h4")).size).toBe("h4");
    });
});

describe("whether there are environmental conditions", () => {
    it("turns the flag into words", () => {
        expect(attributes(renderers.renderHarMiljoeforholdElement(component))).toMatchObject({
            tagName: "custom-field-boolean-text",
            hideIfEmpty: "true",
            resourceBindings: { title: "Miljøforhold", trueText: "Ja", falseText: "Nei" },
            resourceValues: { data: true }
        });
    });

    it("leaves the wording for an unanswered question to whatever the shared default says", () => {
        // Unlike the connection groups, which silence it with an empty string, this one names no default at all.
        expect(attributes(renderers.renderHarMiljoeforholdElement(component)).resourceBindings.defaultText).toBeUndefined();
    });
});

describe("the area risks", () => {
    it("reads the risks out of their wrapper and renders them as a table", () => {
        expect(attributes(renderers.renderOmraaderisiko(component))).toMatchObject({
            tagName: "custom-table-omraaderisiko",
            hideIfEmpty: "true",
            hideTitle: null,
            wrapped: false,
            resourceBindings: { title: "Områderisiko", description: "Risikoer som gjelder området" },
            resourceValues: { data: [{ kodebeskrivelse: "Flom" }] }
        });
    });

    it("titles the table one level below whatever level this group was given", () => {
        expect(attributes(renderers.renderOmraaderisiko(component)).size).toBe("h3");
        expect(attributes(renderers.renderOmraaderisiko({ ...component, size: "h3" })).size).toBe("h4");
    });

    it("stops at the smallest heading rather than asking for one that does not exist", () => {
        expect(attributes(renderers.renderOmraaderisiko({ ...component, size: "h6" })).size).toBe("h6");
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
    const fromComponent = Object.fromEntries(Object.entries(renderers).filter(([name]) => name !== "renderHeaderElement")) as Record<
        string,
        (component?: unknown) => HTMLElement
    >;

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
        expect(attributes(renderers.renderHeaderElement("Krav til byggegrunn")).isChildComponent).toBe("true");
    });
});
