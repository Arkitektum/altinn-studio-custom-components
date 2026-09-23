import * as renderers from "./renderers.js";

/** One neighbour, as the group below will receive it. */
const naboGjenboerEiendom = { eier: { navn: "Kari Nordmann" }, eiendommer: { eiendom: [{ adresse: "Storgata 3" }] } };

/** The list of neighbours. */
const component = {
    resourceBindings: { eier: { title: "Eier" }, eiendom: { title: "Eiendom" } },
    resourceValues: { data: [naboGjenboerEiendom] }
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
        hideTitle: read("hidetitle"),
        styleOverride: readJson("styleoverride"),
        resourceBindings: readJson("resourcebindings"),
        resourceValues: readJson("resourcevalues"),
        wrapped: rendered.tagName === "DIV"
    };
}

describe("the header", () => {
    it("takes the title it is given and sits at h3 unless a level is asked for", () => {
        expect(attributes(renderers.renderHeaderElement("Naboer og gjenboere"))).toMatchObject({
            tagName: "custom-header-text",
            size: "h3",
            resourceValues: { title: "Naboer og gjenboere" }
        });
        expect(attributes(renderers.renderHeaderElement("Naboer og gjenboere", "h2")).size).toBe("h2");
    });
});

describe("one neighbour", () => {
    it("renders the neighbour it is handed, not the list it came from", () => {
        expect(attributes(renderers.renderNaboGjenboerEiendomGroup(naboGjenboerEiendom, component))).toMatchObject({
            tagName: "custom-group-nabo-gjenboer-eiendom",
            hideIfEmpty: "true",
            wrapped: false,
            resourceValues: { data: naboGjenboerEiendom }
        });
    });

    it("titles each neighbour at h4, one below the list header above them", () => {
        expect(attributes(renderers.renderNaboGjenboerEiendomGroup(naboGjenboerEiendom, component))).toMatchObject({
            size: "h4",
            hideTitle: null
        });
    });

    it("passes the bindings down whole, since one neighbour has none of its own", () => {
        expect(attributes(renderers.renderNaboGjenboerEiendomGroup(naboGjenboerEiendom, component)).resourceBindings).toEqual(
            component.resourceBindings
        );
    });

    it("renders a neighbour without a surrounding component rather than throwing", () => {
        expect(attributes(renderers.renderNaboGjenboerEiendomGroup(naboGjenboerEiendom, undefined)).resourceValues).toEqual({
            data: naboGjenboerEiendom
        });
    });
});

describe("the empty field text", () => {
    it("renders whatever it was handed as the paragraph's own title", () => {
        expect(attributes(renderers.renderEmptyFieldText({ resourceValues: { data: "Ingen naboer" } }))).toMatchObject({
            tagName: "custom-paragraph",
            wrapped: true,
            resourceValues: { title: "Ingen naboer" }
        });
    });
});

describe("the divider between neighbours", () => {
    it("renders without being told anything, and carries no margin of its own", () => {
        expect(attributes(renderers.renderDivider())).toMatchObject({
            tagName: "custom-divider",
            styleOverride: { margin: 0 }
        });
    });

    it("is not marked as a child component, unlike everything else here", () => {
        // It carries no content, so nothing about it depends on the component it sits in.
        expect(attributes(renderers.renderDivider()).isChildComponent).toBeNull();
    });
});

describe("every renderer", () => {
    it("renders something when handed nothing at all", () => {
        expect(renderers.renderHeaderElement(undefined) !== null).toBe(true);
        expect(renderers.renderNaboGjenboerEiendomGroup(undefined, undefined) !== null).toBe(true);
        expect(renderers.renderEmptyFieldText({}) !== null).toBe(true);
    });

    it("marks everything that carries content as a child component", () => {
        const rendered = {
            renderHeaderElement: renderers.renderHeaderElement("Naboer"),
            renderNaboGjenboerEiendomGroup: renderers.renderNaboGjenboerEiendomGroup(naboGjenboerEiendom, component),
            renderEmptyFieldText: renderers.renderEmptyFieldText(component)
        };
        for (const [name, node] of Object.entries(rendered)) {
            expect({ name, isChild: attributes(node).isChildComponent }).toEqual({ name, isChild: "true" });
        }
    });
});
