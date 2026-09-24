import { renderEmptyFieldText, renderVegtypeTillatelseElement } from "./renderers.ts";

/** One road type and whether permission was given for it. */
const vegtypeTillatelse = { kode: { kodebeskrivelse: "Kommunal veg", kodeverdi: "K" }, erTillatelseGitt: false };

/** The list holding those entries. */
const component = {
    resourceBindings: {
        vegtype: { title: "Vegtype" },
        erTillatelseGitt: { title: "Er tillatelse gitt", trueText: "Ja", falseText: "Nei", defaultText: "Ikke oppgitt" }
    },
    resourceValues: { data: [vegtypeTillatelse] }
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
        isChildComponent: read("ischildcomponent"),
        hideIfEmpty: read("hideifempty"),
        resourceBindings: readJson("resourcebindings"),
        resourceValues: readJson("resourcevalues"),
        wrapped: rendered.tagName === "DIV"
    };
}

describe("one road type", () => {
    it("renders the entry it is handed, not the list it came from", () => {
        // The entry arrives as the second argument, so a list of several produces one of these each.
        expect(attributes(renderVegtypeTillatelseElement(component, vegtypeTillatelse))).toMatchObject({
            tagName: "custom-group-vegtype-tillatelse",
            hideIfEmpty: "true",
            wrapped: false,
            resourceValues: { data: vegtypeTillatelse }
        });
    });

    it("passes down the bindings for both of the fields the group will render", () => {
        expect(attributes(renderVegtypeTillatelseElement(component, vegtypeTillatelse)).resourceBindings).toEqual({
            vegtype: { title: "Vegtype" },
            erTillatelseGitt: { title: "Er tillatelse gitt", trueText: "Ja", falseText: "Nei", defaultText: "Ikke oppgitt" }
        });
    });

    it("renders an entry without a surrounding component rather than throwing", () => {
        expect(attributes(renderVegtypeTillatelseElement(undefined, vegtypeTillatelse)).resourceValues).toEqual({ data: vegtypeTillatelse });
    });
});

describe("the empty field text", () => {
    it("renders whatever it was handed as the paragraph's own title", () => {
        expect(attributes(renderEmptyFieldText({ resourceValues: { data: "Ingen veger" } }))).toMatchObject({
            tagName: "custom-paragraph",
            wrapped: true,
            resourceValues: { title: "Ingen veger" }
        });
    });
});

describe("every renderer", () => {
    it("renders something when handed nothing at all", () => {
        expect(renderVegtypeTillatelseElement(undefined, undefined) !== null).toBe(true);
        expect(renderEmptyFieldText({}) !== null).toBe(true);
    });

    it("marks everything it renders as a child component", () => {
        expect(attributes(renderVegtypeTillatelseElement(component, vegtypeTillatelse)).isChildComponent).toBe("true");
        expect(attributes(renderEmptyFieldText(component)).isChildComponent).toBe("true");
    });
});
