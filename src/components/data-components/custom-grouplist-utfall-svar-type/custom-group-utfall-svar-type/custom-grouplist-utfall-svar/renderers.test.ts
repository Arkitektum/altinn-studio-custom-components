import { renderEmptyFieldText, renderHeaderElement, renderUtfallSvarGroup } from "./renderers.ts";

/** One answer, as it arrives from the list. */
const utfallSvar = { beskrivelse: "Send inn situasjonsplan", kommentar: "Ettersendes" };

/** The list of answers within one type. */
const component = {
    enableLinks: true,
    resourceBindings: { kommentar: { title: "Kommentar" }, tema: { title: "Tema" } },
    resourceValues: { data: [utfallSvar], title: "Tilleggsopplysninger" }
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
        enableLinks: read("enablelinks"),
        resourceBindings: readJson("resourcebindings"),
        resourceValues: readJson("resourcevalues"),
        wrapped: rendered.tagName === "DIV"
    };
}

describe("the header", () => {
    it("takes the title it is given rather than reading one off a component", () => {
        // The title belongs to the answer type, which the caller already worked out, so it arrives as a plain string.
        expect(attributes(renderHeaderElement("Tilleggsopplysninger"))).toMatchObject({
            tagName: "custom-header-text",
            size: "h2",
            resourceValues: { title: "Tilleggsopplysninger" }
        });
    });

    it("sits at h2 unless a level is asked for", () => {
        expect(attributes(renderHeaderElement("Tilleggsopplysninger", "h4")).size).toBe("h4");
    });
});

describe("one answer", () => {
    it("renders the answer itself, not the list it came from", () => {
        // The answer arrives as the first argument, so a list of ten produces ten of these.
        expect(attributes(renderUtfallSvarGroup(utfallSvar, component))).toMatchObject({
            tagName: "custom-group-utfall-svar",
            hideIfEmpty: "true",
            wrapped: false,
            resourceValues: { data: utfallSvar }
        });
    });

    it("takes its bindings from the surrounding list, since one answer has none of its own", () => {
        expect(attributes(renderUtfallSvarGroup(utfallSvar, component)).resourceBindings).toEqual(component.resourceBindings);
        expect(attributes(renderUtfallSvarGroup(utfallSvar, component)).enableLinks).toBe("true");
    });

    it("renders an answer without a surrounding component rather than throwing", () => {
        expect(attributes(renderUtfallSvarGroup(utfallSvar, undefined)).resourceValues).toEqual({ data: utfallSvar });
    });
});

describe("the empty field text", () => {
    it("renders whatever it was handed as the paragraph's own title", () => {
        expect(attributes(renderEmptyFieldText({ resourceValues: { data: "Ingen utfall" } }))).toMatchObject({
            tagName: "custom-paragraph",
            wrapped: true,
            resourceValues: { title: "Ingen utfall" }
        });
    });
});

describe("every renderer", () => {
    it("marks everything it renders as a child component", () => {
        const rendered = {
            renderHeaderElement: renderHeaderElement("Tilleggsopplysninger"),
            renderUtfallSvarGroup: renderUtfallSvarGroup(utfallSvar, component),
            renderEmptyFieldText: renderEmptyFieldText(component)
        };
        for (const [name, element] of Object.entries(rendered)) {
            expect({ name, isChild: attributes(element).isChildComponent }).toEqual({ name, isChild: "true" });
        }
    });

    it("renders something when handed nothing at all", () => {
        expect(renderHeaderElement(undefined as unknown as string) !== null).toBe(true);
        expect(renderUtfallSvarGroup(undefined, undefined) !== null).toBe(true);
        expect(renderEmptyFieldText({}) !== null).toBe(true);
    });
});
