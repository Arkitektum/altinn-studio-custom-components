import * as renderers from "./renderers.ts";

/** The renderers looked up by name, which is how the table-driven tests below reach them. */
const byName = renderers as unknown as Record<string, (component?: unknown) => HTMLElement>;

/** The two places surface water may be led, each a yes or a no. */
const booleanFields: [string, string, ...unknown[]][] = [
    ["renderLedesOvervannTilTerrengElement", "ledesOvervannTilTerreng", true],
    ["renderLedesOvervannTilAvloepssystemElement", "ledesOvervannTilAvloepssystem", false]
];

/** The surface water handling, with everything its renderers read. */
const component = {
    resourceBindings: Object.fromEntries(booleanFields.map(([, key]) => [key, { title: key, trueText: "Ja", falseText: "Nei" }])),
    resourceValues: { data: Object.fromEntries(booleanFields.map(([, key, value]) => [key, value])) }
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
        resourceBindings: readJson("resourcebindings"),
        resourceValues: readJson("resourcevalues"),
        wrapped: rendered.tagName === "DIV"
    };
}

describe("the header", () => {
    it("takes the title it is given and sits at h3 unless a level is asked for", () => {
        expect(attributes(renderers.renderHeaderElement("Overvann"))).toMatchObject({
            tagName: "custom-header-text",
            size: "h3",
            resourceValues: { title: "Overvann" }
        });
        expect(attributes(renderers.renderHeaderElement("Overvann", "h2")).size).toBe("h2");
    });
});

describe("where the surface water is led", () => {
    it.each(booleanFields)("%s reads %s and turns it into words", (name, key, value) => {
        expect(attributes(byName[name]!(component))).toMatchObject({
            tagName: "custom-field-boolean-text",
            hideIfEmpty: "true",
            resourceBindings: { title: key, trueText: "Ja", falseText: "Nei" },
            resourceValues: { data: value }
        });
    });

    it.each(booleanFields)("%s says nothing at all when the question went unanswered", (name) => {
        // The empty default keeps the shared "not given" wording away, so an unanswered question reads as absent.
        expect(attributes(byName[name]!(component)).resourceBindings.defaultText).toBe("");
        expect(attributes(byName[name]!({ resourceValues: { data: {} } })).resourceValues).toBeNull();
    });

    it("keeps the two apart, since water may be led to both or to neither", () => {
        // They are separate questions rather than two sides of one, so each reads its own flag.
        expect(attributes(renderers.renderLedesOvervannTilTerrengElement(component)).resourceValues).toEqual({ data: true });
        expect(attributes(renderers.renderLedesOvervannTilAvloepssystemElement(component)).resourceValues).toEqual({ data: false });
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
        expect(attributes(renderers.renderHeaderElement("Overvann")).isChildComponent).toBe("true");
    });
});
