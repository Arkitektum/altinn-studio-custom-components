import * as renderers from "./renderers.ts";

/** The access to the property, as the component class has already assembled it. */
const component = {
    resourceBindings: {
        erNyEllerEndretAdkomst: { title: "Ny eller endret adkomst", trueText: "Ja", falseText: "Nei" },
        adkomstVegtype: { title: "Vegtype" },
        adkomstErTillatelseGitt: { title: "Er tillatelse gitt", trueText: "Ja", falseText: "Nei", defaultText: "Ikke oppgitt" }
    },
    resourceValues: {
        data: {
            erNyEllerEndretAdkomst: true,
            vegtype: { kode: [{ kodebeskrivelse: "Kommunal veg" }] },
            erTillatelseGittKommunalVeg: false
        }
    }
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
        expect(attributes(renderers.renderHeaderElement("Adkomst"))).toMatchObject({
            tagName: "custom-header-text",
            size: "h3",
            resourceValues: { title: "Adkomst" }
        });
        expect(attributes(renderers.renderHeaderElement("Adkomst", "h2")).size).toBe("h2");
    });
});

describe("whether the access is new or changed", () => {
    it("turns the flag into words", () => {
        expect(attributes(renderers.renderErNyEllerEndretAdkomstElement(component))).toMatchObject({
            tagName: "custom-field-boolean-text",
            hideIfEmpty: "true",
            resourceBindings: { title: "Ny eller endret adkomst", trueText: "Ja", falseText: "Nei" },
            resourceValues: { data: true }
        });
    });

    it("says nothing at all when the question went unanswered", () => {
        expect(attributes(renderers.renderErNyEllerEndretAdkomstElement(component)).resourceBindings.defaultText).toBe("");
        expect(attributes(renderers.renderErNyEllerEndretAdkomstElement({ resourceValues: { data: {} } })).resourceValues).toBeNull();
    });
});

describe("the road types and their permissions", () => {
    it("hands over the whole access object rather than a list", () => {
        // The permissions are spread across the object, one flag per road type, and the receiving component is
        // what gathers them into a list. Handing over a slice of it would leave the rest behind.
        expect(attributes(renderers.renderVegtypeTillatelseElement(component))).toMatchObject({
            tagName: "custom-grouplist-vegtype-tillatelse",
            hideIfEmpty: "true",
            wrapped: false,
            resourceValues: { data: component.resourceValues.data }
        });
    });

    it("drops the adkomst prefix from the two bindings the list expects to find", () => {
        // Its own bindings are prefixed because they sit beside those of the other connections, and the list
        // below knows them only by their short names.
        expect(attributes(renderers.renderVegtypeTillatelseElement(component)).resourceBindings).toEqual({
            vegtype: { title: "Vegtype" },
            erTillatelseGitt: { title: "Er tillatelse gitt", trueText: "Ja", falseText: "Nei", defaultText: "Ikke oppgitt" }
        });
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
    const fromComponent: Record<string, (component?: unknown) => HTMLElement> = Object.fromEntries(
        Object.entries(renderers).filter(([name]) => name !== "renderHeaderElement")
    ) as Record<string, (component?: unknown) => HTMLElement>;

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
        expect(attributes(renderers.renderHeaderElement("Adkomst")).isChildComponent).toBe("true");
    });
});
