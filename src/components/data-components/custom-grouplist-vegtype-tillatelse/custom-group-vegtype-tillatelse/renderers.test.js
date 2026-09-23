import * as renderers from "./renderers.js";

/** One road type and whether permission was given for it. */
const component = {
    resourceBindings: {
        vegtype: { title: "Vegtype" },
        erTillatelseGitt: { title: "Er tillatelse gitt", trueText: "Ja", falseText: "Nei", defaultText: "Ikke oppgitt" }
    },
    resourceValues: { data: { kode: { kodebeskrivelse: "Kommunal veg", kodeverdi: "K" }, erTillatelseGitt: false } }
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
        itemKey: read("itemkey"),
        isChildComponent: read("ischildcomponent"),
        hideIfEmpty: read("hideifempty"),
        resourceBindings: readJson("resourcebindings"),
        resourceValues: readJson("resourcevalues"),
        wrapped: rendered.tagName === "DIV"
    };
}

describe("the road type", () => {
    it("shows the type by its description, not its code", () => {
        expect(attributes(renderers.renderVegtypeElement(component))).toMatchObject({
            tagName: "custom-field-data",
            hideIfEmpty: "true",
            resourceBindings: { title: "Vegtype" },
            resourceValues: { data: "Kommunal veg" }
        });
    });

    it("names the property to read when the value turns out to be a code rather than a string", () => {
        expect(attributes(renderers.renderVegtypeElement(component)).itemKey).toBe("kodebeskrivelse");
    });
});

describe("whether permission was given", () => {
    it("hands the flag to the element that turns it into words, along with the wording for each outcome", () => {
        expect(attributes(renderers.renderErTillatelseGittElement(component))).toMatchObject({
            tagName: "custom-field-boolean-text",
            resourceBindings: { title: "Er tillatelse gitt", trueText: "Ja", falseText: "Nei", defaultText: "Ikke oppgitt" },
            resourceValues: { data: false }
        });
    });

    it("stays on the page when the flag is missing, so the default wording can be shown", () => {
        // Hiding it would lose the difference between a refusal and an unanswered question, which is why this
        // field alone does not hide when empty.
        const rendered = attributes(renderers.renderErTillatelseGittElement({ ...component, resourceValues: { data: {} } }));

        expect(rendered.hideIfEmpty).toBeNull();
        expect(rendered.resourceValues).toBeNull();
        expect(rendered.resourceBindings.defaultText).toBe("Ikke oppgitt");
    });
});

describe("the empty field text", () => {
    it("renders whatever it was handed as the paragraph's own title", () => {
        expect(attributes(renderers.renderEmptyFieldText({ resourceValues: { data: "Ingen veger" } }))).toMatchObject({
            tagName: "custom-paragraph",
            wrapped: true,
            resourceValues: { title: "Ingen veger" }
        });
    });
});

describe("every renderer", () => {
    it("renders something for a component with no data at all", () => {
        for (const [name, render] of Object.entries(renderers)) {
            expect({ name, rendered: render({}) !== null }).toEqual({ name, rendered: true });
        }
    });

    it("renders without a component at all rather than throwing", () => {
        for (const [name, render] of Object.entries(renderers)) {
            expect({ name, rendered: render(undefined) !== undefined }).toEqual({ name, rendered: true });
        }
    });

    it("marks everything it renders as a child component", () => {
        for (const [name, render] of Object.entries(renderers)) {
            expect({ name, isChild: attributes(render(component)).isChildComponent }).toEqual({ name, isChild: "true" });
        }
    });
});
