import * as renderers from "./renderers.ts";

/** One later submission, as the group below will receive it. */
const ettersending = { tema: { kodebeskrivelse: "Plan" }, kommentar: "Sendes senere" };

/** The list of later submissions. */
const component = {
    enableLinks: true,
    resourceBindings: { tema: { title: "Tema" }, kommentar: { title: "Kommentar" }, vedleggsliste: { title: "Vedlegg" } },
    resourceValues: { data: [ettersending] }
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
    it("takes the title it is given and sits at h2 unless a level is asked for", () => {
        expect(attributes(renderers.renderHeaderElement("Ettersendinger"))).toMatchObject({
            tagName: "custom-header-text",
            size: "h2",
            resourceValues: { title: "Ettersendinger" }
        });
        expect(attributes(renderers.renderHeaderElement("Ettersendinger", "h4")).size).toBe("h4");
    });
});

describe("one later submission", () => {
    it("renders the submission it is handed, not the list it came from", () => {
        expect(attributes(renderers.renderEttersendingGroup(ettersending, component))).toMatchObject({
            tagName: "custom-group-ettersending",
            hideIfEmpty: "true",
            wrapped: false,
            resourceValues: { data: ettersending }
        });
    });

    it("passes the bindings down whole, since one submission has none of its own", () => {
        expect(attributes(renderers.renderEttersendingGroup(ettersending, component)).resourceBindings).toEqual(component.resourceBindings);
        expect(attributes(renderers.renderEttersendingGroup(ettersending, component)).enableLinks).toBe("true");
    });

    it("renders a submission without a surrounding component rather than throwing", () => {
        expect(attributes(renderers.renderEttersendingGroup(ettersending, undefined)).resourceValues).toEqual({ data: ettersending });
    });
});

describe("the empty field text", () => {
    it("renders whatever it was handed as the paragraph's own title", () => {
        expect(attributes(renderers.renderEmptyFieldText({ resourceValues: { data: "Ingen ettersendinger" } }))).toMatchObject({
            tagName: "custom-paragraph",
            wrapped: true,
            resourceValues: { title: "Ingen ettersendinger" }
        });
    });
});

describe("every renderer", () => {
    it("renders something when handed nothing at all", () => {
        expect(renderers.renderHeaderElement(undefined as unknown as string) !== null).toBe(true);
        expect(renderers.renderEttersendingGroup(undefined, undefined) !== null).toBe(true);
        expect(renderers.renderEmptyFieldText({}) !== null).toBe(true);
    });

    it("marks everything it renders as a child component", () => {
        const rendered = {
            renderHeaderElement: renderers.renderHeaderElement("Ettersendinger"),
            renderEttersendingGroup: renderers.renderEttersendingGroup(ettersending, component),
            renderEmptyFieldText: renderers.renderEmptyFieldText(component)
        };
        for (const [name, node] of Object.entries(rendered)) {
            expect({ name, isChild: attributes(node).isChildComponent }).toEqual({ name, isChild: "true" });
        }
    });
});
