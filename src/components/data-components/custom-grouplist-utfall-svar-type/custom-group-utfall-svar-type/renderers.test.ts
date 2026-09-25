import { renderEmptyFieldText, renderUtfallSvarGroupList } from "./renderers.ts";

/** The group for one answer type, holding that type's answers and the title the list above it worked out. */
const component = {
    enableLinks: true,
    resourceBindings: { kommentar: { title: "Kommentar" }, tema: { title: "Tema" } },
    resourceValues: { data: [{ beskrivelse: "Send inn situasjonsplan" }], title: "Tilleggsopplysninger" }
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
        enableLinks: read("enablelinks"),
        resourceBindings: readJson("resourcebindings"),
        resourceValues: readJson("resourcevalues"),
        wrapped: rendered.tagName === "DIV"
    };
}

describe("the list of answers for one type", () => {
    it("passes the answers and the type's title on to the list, unwrapped", () => {
        expect(attributes(renderUtfallSvarGroupList(component))).toMatchObject({
            tagName: "custom-grouplist-utfall-svar",
            hideIfEmpty: "true",
            wrapped: false,
            resourceValues: { data: [{ beskrivelse: "Send inn situasjonsplan" }], title: "Tilleggsopplysninger" }
        });
    });

    it("hands the bindings on whole rather than picking out the ones it knows", () => {
        // This group adds nothing of its own, so everything the levels below need has to survive the trip.
        expect(attributes(renderUtfallSvarGroupList(component)).resourceBindings).toEqual(component.resourceBindings);
    });

    it("carries the link setting on", () => {
        expect(attributes(renderUtfallSvarGroupList(component)).enableLinks).toBe("true");
    });
});

describe("the empty field text", () => {
    it("renders whatever it was handed as the paragraph's own title", () => {
        // Unlike the others it is handed the text itself, which is why the data ends up in title.
        expect(attributes(renderEmptyFieldText({ resourceValues: { data: "Ingen utfall" } }))).toMatchObject({
            tagName: "custom-paragraph",
            wrapped: true,
            resourceValues: { title: "Ingen utfall" }
        });
    });
});

describe("every renderer", () => {
    const renderers = { renderUtfallSvarGroupList, renderEmptyFieldText };

    it("renders something for a component with no data at all", () => {
        for (const [name, render] of Object.entries(renderers)) {
            expect({ name, rendered: render({}) !== null }).toEqual({ name, rendered: true });
        }
    });

    it("marks everything it renders as a child component", () => {
        for (const [name, render] of Object.entries(renderers)) {
            expect({ name, isChild: attributes(render(component)).isChildComponent }).toEqual({ name, isChild: "true" });
        }
    });
});
