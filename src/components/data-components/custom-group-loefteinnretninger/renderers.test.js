import * as renderers from "./renderers.js";

/** The two questions this group asks, each a yes or a no. */
const booleanFields = [
    ["renderErLoefteinnretningIBygningElement", "erLoefteinnretningIBygning", true],
    ["renderPlanleggesLoefteinnretningIBygningElement", "planleggesLoefteinnretningIBygning", false]
];

/** The lifting equipment in the building. */
const component = {
    resourceBindings: {
        ...Object.fromEntries(booleanFields.map(([, key]) => [key, { title: key, trueText: "Ja", falseText: "Nei" }])),
        planlagteLoefteinnretninger: { title: "Planlagte løfteinnretninger", emptyFieldText: "Ingen planlagte" }
    },
    resourceValues: {
        data: {
            ...Object.fromEntries(booleanFields.map(([, key, value]) => [key, value])),
            planlagteLoefteinnretninger: ["Personheis", "Vareheis"]
        }
    }
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
    it("takes the title it is given and sits at h2 unless a level is asked for", () => {
        expect(attributes(renderers.renderHeaderElement("Løfteinnretninger"))).toMatchObject({
            tagName: "custom-header-text",
            size: "h2",
            resourceValues: { title: "Løfteinnretninger" }
        });
        expect(attributes(renderers.renderHeaderElement("Løfteinnretninger", "h3")).size).toBe("h3");
    });
});

describe("the two yes or no questions", () => {
    it.each(booleanFields)("%s reads %s and turns it into words", (name, key, value) => {
        expect(attributes(renderers[name](component))).toMatchObject({
            tagName: "custom-field-boolean-text",
            hideIfEmpty: "true",
            resourceBindings: { title: key, trueText: "Ja", falseText: "Nei" },
            resourceValues: { data: value }
        });
    });

    it.each(booleanFields)("%s says nothing at all when the question went unanswered", (name) => {
        // The empty default keeps the shared "not given" wording away, so an unanswered question reads as absent.
        expect(attributes(renderers[name](component)).resourceBindings.defaultText).toBe("");
        expect(attributes(renderers[name]({ resourceValues: { data: {} } })).resourceValues).toBeNull();
    });

    it("keeps the two apart, since equipment may be there already and more may be planned", () => {
        expect(attributes(renderers.renderErLoefteinnretningIBygningElement(component)).resourceValues).toEqual({ data: true });
        expect(attributes(renderers.renderPlanleggesLoefteinnretningIBygningElement(component)).resourceValues).toEqual({ data: false });
    });
});

describe("the planned equipment", () => {
    it("hands over the whole group rather than the list inside it", () => {
        // The receiving component picks out the list it needs, so handing over a slice would leave the rest behind.
        expect(attributes(renderers.renderPlanlagteLoefteinnretningerElement(component))).toMatchObject({
            tagName: "custom-list-planlagte-loefteinnretninger",
            hideIfEmpty: "true",
            resourceValues: { data: component.resourceValues.data }
        });
    });

    it("carries the list's own title and the text for when there is nothing planned", () => {
        expect(attributes(renderers.renderPlanlagteLoefteinnretningerElement(component)).resourceBindings).toEqual({
            title: "Planlagte løfteinnretninger",
            emptyFieldText: "Ingen planlagte"
        });
    });
});

describe("the empty field text", () => {
    it("renders whatever it was handed as the paragraph's own title", () => {
        expect(attributes(renderers.renderEmptyFieldText({ resourceValues: { data: "Ingen løfteinnretninger" } }))).toMatchObject({
            tagName: "custom-paragraph",
            wrapped: true,
            resourceValues: { title: "Ingen løfteinnretninger" }
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
        expect(attributes(renderers.renderHeaderElement("Løfteinnretninger")).isChildComponent).toBe("true");
    });
});
