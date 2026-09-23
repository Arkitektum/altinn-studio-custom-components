import * as renderers from "./renderers.js";

/** The three declaration texts this group shows, each under a binding named for the role it belongs to. */
const textFields = [
    ["renderErklaeringTekstElement", "samsvarErklaeringTekst"],
    ["renderPROTekstElement", "samsvarPROTekst"],
    ["renderUTFTekstElement", "samsvarUTFTekst"]
];

/** The declarations of conformity, which hold nothing but the texts to show. */
const component = {
    resourceBindings: Object.fromEntries(textFields.map(([, key]) => [key, { title: `Tekst for ${key}` }]))
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
    it("names the title as a binding rather than handing over a finished string", () => {
        // The groups that show data resolve their title first; this one shows only text resources, so the
        // element it makes is left to look the title up for itself.
        expect(attributes(renderers.renderHeaderElement("resource.samsvar.title"))).toMatchObject({
            tagName: "custom-header-text",
            size: "h3",
            resourceBindings: { title: "resource.samsvar.title" },
            resourceValues: null
        });
    });

    it("sits at h3 unless a level is asked for", () => {
        expect(attributes(renderers.renderHeaderElement("Samsvar", "h2")).size).toBe("h2");
    });
});

describe("the three declaration texts", () => {
    it.each(textFields)("%s shows the text bound to %s", (name, key) => {
        expect(attributes(renderers[name](component))).toMatchObject({
            tagName: "custom-paragraph-text",
            hideIfEmpty: "true",
            wrapped: true,
            resourceBindings: { title: `Tekst for ${key}` }
        });
    });

    it.each(textFields)("%s carries no data of its own, only the text", (name) => {
        // There is nothing from the form here: a declaration is wording that stands whether or not anything
        // was filled in, and an unbound one simply does not appear.
        expect(attributes(renderers[name](component)).resourceValues).toBeNull();
        expect(attributes(renderers[name]({})).resourceBindings).toBeNull();
    });

    it("keeps the two role texts apart, since they differ only by role", () => {
        const titles = textFields.map(([name]) => attributes(renderers[name](component)).resourceBindings.title);

        expect(new Set(titles).size).toBe(textFields.length);
    });
});

describe("the empty field text", () => {
    it("renders whatever it was handed as the paragraph's own title", () => {
        expect(attributes(renderers.renderEmptyFieldText({ resourceValues: { data: "Ingen erklæringer" } }))).toMatchObject({
            tagName: "custom-paragraph",
            wrapped: true,
            resourceValues: { title: "Ingen erklæringer" }
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
        expect(attributes(renderers.renderHeaderElement("Samsvar")).isChildComponent).toBe("true");
    });
});
