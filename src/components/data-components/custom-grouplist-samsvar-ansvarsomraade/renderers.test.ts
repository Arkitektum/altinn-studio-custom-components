import * as renderers from "./renderers.ts";

/** One area of responsibility, as the group below will receive it. */
const samsvarAnsvarsomraade = { funksjon: { kodeverdi: "PRO" }, beskrivelseAvAnsvarsomraadet: "Prosjektering av bæresystem" };

/** The list of areas of responsibility. */
const component = {
    resourceBindings: { funksjon: { title: "Funksjon" }, beskrivelseAvAnsvarsomraadet: { title: "Beskrivelse" } },
    resourceValues: { data: [samsvarAnsvarsomraade] }
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

describe("one area of responsibility", () => {
    it("renders the area it is handed, not the list it came from", () => {
        expect(attributes(renderers.renderSamsvarAnsvarsomraadeGroup(samsvarAnsvarsomraade, component))).toMatchObject({
            tagName: "custom-group-samsvar-ansvarsomraade",
            hideIfEmpty: "true",
            wrapped: false,
            resourceValues: { data: samsvarAnsvarsomraade }
        });
    });

    it("passes the bindings down whole, since one area has none of its own", () => {
        expect(attributes(renderers.renderSamsvarAnsvarsomraadeGroup(samsvarAnsvarsomraade, component)).resourceBindings).toEqual(
            component.resourceBindings
        );
    });

    it("renders an area without a surrounding component rather than throwing", () => {
        expect(attributes(renderers.renderSamsvarAnsvarsomraadeGroup(samsvarAnsvarsomraade, undefined)).resourceValues).toEqual({
            data: samsvarAnsvarsomraade
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
    it("renders something when handed nothing at all", () => {
        expect(renderers.renderSamsvarAnsvarsomraadeGroup(undefined, undefined) !== null).toBe(true);
        expect(renderers.renderEmptyFieldText({}) !== null).toBe(true);
    });

    it("marks everything it renders as a child component", () => {
        expect(attributes(renderers.renderSamsvarAnsvarsomraadeGroup(samsvarAnsvarsomraade, component)).isChildComponent).toBe("true");
        expect(attributes(renderers.renderEmptyFieldText(component)).isChildComponent).toBe("true");
    });
});
