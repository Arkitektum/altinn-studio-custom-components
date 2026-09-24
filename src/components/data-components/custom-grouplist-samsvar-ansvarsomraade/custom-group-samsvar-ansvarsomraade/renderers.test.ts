import * as renderers from "./renderers.ts";

/** The renderers looked up by name, which is how the table-driven tests below reach them. */
const byName = renderers as unknown as Record<string, (component?: unknown) => HTMLElement>;

/** One area of responsibility, with everything its renderers read. */
const data = {
    funksjon: { kodeverdi: "PRO", kodebeskrivelse: "Prosjekterende" },
    beskrivelseAvAnsvarsomraadet: "Prosjektering av bæresystem",
    datoAnsvarsrettErklaert: "2026-09-01",
    erAnsvarsomraadetAvsluttet: true,
    prosjekterendeList: { resourceValues: { data: ["Gjenstående prosjektering"] } },
    utfoerende: {
        utfoerendeList: { resourceValues: { data: ["Gjenstående utførelse"] } },
        midlertidigBrukstillatelse: {
            gjenstaaendeArbeider: { gjenstaaendeInnenfor: "Maling innvendig", gjenstaaendeUtenfor: "Asfaltering" },
            sikkerhet: { harTilstrekkeligSikkerhet: true, utfoertInnen: "2026-12-01", typeArbeider: "Utvendige arbeider" }
        }
    }
};

/** The component wrapping that area, with a binding for each field it shows. */
const component = {
    resourceBindings: {
        funksjon: { title: "Funksjon" },
        beskrivelseAvAnsvarsomraadet: { title: "Beskrivelse" },
        datoAnsvarsrettErklaert: { title: "Ansvarsrett erklært" },
        erAnsvarsomraadetAvsluttet: { title: "Avsluttet", trueText: "Ja", falseText: "Nei", defaultText: "Ikke oppgitt" },
        avdekketArbeider: { title: "Avdekket arbeider", emptyFieldText: "Ingen" },
        arbeidGjenstaaendeInnenfor: { title: "Gjenstående innenfor", emptyFieldText: "Ingen" },
        arbeidGjenstaaendeUtenfor: { title: "Gjenstående utenfor", emptyFieldText: "Ingen" },
        tilstrekkeligSikkerhet: { title: "Tilstrekkelig sikkerhet", trueText: "Ja", falseText: "Nei", defaultText: "Ikke oppgitt" },
        utfoereInnen: { title: "Utføres innen", emptyFieldText: "Ingen" },
        typeArbeider: { title: "Type arbeider", emptyFieldText: "Ingen" }
    },
    resourceValues: { data }
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
        format: read("format"),
        isChildComponent: read("ischildcomponent"),
        hideIfEmpty: read("hideifempty"),
        styleOverride: readJson("styleoverride"),
        resourceBindings: readJson("resourcebindings"),
        resourceValues: readJson("resourcevalues"),
        wrapped: rendered.tagName === "DIV"
    };
}

describe("the header", () => {
    it("names the title as a binding and sits at h2 unless a level is asked for", () => {
        expect(attributes(renderers.renderHeaderElement("resource.samsvar.title"))).toMatchObject({
            tagName: "custom-header-text",
            size: "h2",
            resourceBindings: { title: "resource.samsvar.title" }
        });
        expect(attributes(renderers.renderHeaderElement("Samsvar", "h4")).size).toBe("h4");
    });
});

describe("what the area of responsibility is", () => {
    it("shows the function by its code, not its description", () => {
        expect(attributes(renderers.renderFunksjonElement(component)).resourceValues).toEqual({ data: "PRO" });
    });

    it("shows the description as it was written", () => {
        expect(attributes(renderers.renderBeskrivelseElement(component)).resourceValues).toEqual({ data: "Prosjektering av bæresystem" });
    });

    it("formats the date responsibility was declared as a date", () => {
        expect(attributes(renderers.renderAnsvarsrettErklaertElement(component))).toMatchObject({
            format: "date",
            resourceValues: { data: "2026-09-01" }
        });
    });

    it("turns the finished flag into words", () => {
        expect(attributes(renderers.renderArbeidetAvsluttetElement(component))).toMatchObject({
            tagName: "custom-field-boolean-text",
            resourceBindings: { trueText: "Ja", falseText: "Nei", defaultText: "Ikke oppgitt" },
            resourceValues: { data: true }
        });
    });
});

describe("the two lists of outstanding work", () => {
    it("reads each list out of the nested component that holds it, from two different places", () => {
        // The designers' list sits on the area itself, the builders' list one level in under utfoerende.
        expect(attributes(renderers.renderAvdekketGjenstaaendePROElement(component)).resourceValues).toEqual({
            data: ["Gjenstående prosjektering"]
        });
        expect(attributes(renderers.renderAvdekketGjenstaaendeUTFElement(component)).resourceValues).toEqual({
            data: ["Gjenstående utførelse"]
        });
    });

    it("labels both with the same binding, since they are the same question of two roles", () => {
        const pro = attributes(renderers.renderAvdekketGjenstaaendePROElement(component)).resourceBindings;
        const utf = attributes(renderers.renderAvdekketGjenstaaendeUTFElement(component)).resourceBindings;

        expect(pro).toEqual({ title: "Avdekket arbeider", emptyFieldText: "Ingen" });
        expect(utf).toEqual(pro);
    });

    it("strips the bullets and the indent off both lists", () => {
        // They read as answers to a question rather than as a bulleted list under a heading.
        for (const name of ["renderAvdekketGjenstaaendePROElement", "renderAvdekketGjenstaaendeUTFElement"]) {
            expect({ name, style: attributes(byName[name]!(component)).styleOverride }).toEqual({
                name,
                style: { listStyle: "none", paddingInline: "0" }
            });
        }
    });
});

describe("the temporary use permit", () => {
    it("reads the outstanding work inside and outside from under the permit", () => {
        expect(attributes(renderers.renderGjenstaaendeArbeiderInnenforElement(component))).toMatchObject({
            resourceBindings: { title: "Gjenstående innenfor" },
            resourceValues: { data: "Maling innvendig" }
        });
        expect(attributes(renderers.renderGjenstaaendeArbeiderUtenforElement(component)).resourceValues).toEqual({ data: "Asfaltering" });
    });

    it("reads the three safety fields from under the permit's own safety section", () => {
        expect(attributes(renderers.renderTilstrekkeligSikkerhetElement(component))).toMatchObject({
            tagName: "custom-field-boolean-text",
            resourceValues: { data: true }
        });
        expect(attributes(renderers.renderUtfoereInnenElement(component))).toMatchObject({
            format: "date",
            resourceValues: { data: "2026-12-01" }
        });
        expect(attributes(renderers.renderTypeArbeiderElement(component)).resourceValues).toEqual({ data: "Utvendige arbeider" });
    });

    it("shows nothing from the permit when there is no permit", () => {
        // A permit that was never applied for leaves every one of these fields empty rather than breaking the page.
        const withoutPermit = { ...component, resourceValues: { data: { utfoerende: {} } } };
        const permitFields = [
            "renderGjenstaaendeArbeiderInnenforElement",
            "renderGjenstaaendeArbeiderUtenforElement",
            "renderTilstrekkeligSikkerhetElement",
            "renderUtfoereInnenElement",
            "renderTypeArbeiderElement"
        ];

        for (const name of permitFields) {
            expect({ name, values: attributes(byName[name]!(withoutPermit)).resourceValues }).toEqual({ name, values: null });
        }
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
        expect(attributes(renderers.renderHeaderElement("Samsvar")).isChildComponent).toBe("true");
    });
});
