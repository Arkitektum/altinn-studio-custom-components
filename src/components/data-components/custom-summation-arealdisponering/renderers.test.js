import * as renderers from "./renderers.js";

/** One of the two summations, as the component class has already assembled it. */
const summation = (title, label) => ({
    resourceValues: { title, data: [{ label, value: 500 }] },
    resourceBindings: { title: `binding for ${title}` }
});

/** The area accounting, holding a summation for the plot and one for what is built on it. */
const component = {
    resourceValues: {
        data: {
            tomtearealet: summation("Tomtearealet", "Grunnareal"),
            bebyggelsen: summation("Bebyggelsen", "Bebygd areal")
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
        resourceValues: readJson("resourcevalues")
    };
}

/** The titles of the summations drawn, in the order they appear. */
const titlesFor = (data) => {
    const container = renderers.renderSummationArealdisponering({ resourceValues: { data } });
    return [...container.children].map((child) => JSON.parse(child.firstChild.firstChild.getAttribute("resourcevalues")).title);
};

describe("the header", () => {
    it("takes the title it is given and sits at h2 unless a level is asked for", () => {
        expect(attributes(renderers.renderHeaderElement("Arealdisponering"))).toMatchObject({
            tagName: "custom-header-text",
            size: "h2",
            resourceValues: { title: "Arealdisponering" }
        });
        expect(attributes(renderers.renderHeaderElement("Arealdisponering", "h3")).size).toBe("h3");
    });
});

describe("the two summations", () => {
    it("puts the plot before what is built on it", () => {
        // The plot is the ground the rest is measured against, so it is read first whichever order the data holds.
        expect(titlesFor(component.resourceValues.data)).toEqual(["Tomtearealet", "Bebyggelsen"]);
    });

    it("draws each as a summation of its own, at h3 and hidden when empty", () => {
        const container = renderers.renderSummationArealdisponering(component);

        for (const child of container.children) {
            expect(attributes(child)).toMatchObject({
                tagName: "custom-summation-data",
                size: "h3",
                hideIfEmpty: "true",
                isChildComponent: "true"
            });
        }
    });

    it("gives each summation its own figures and bindings", () => {
        const container = renderers.renderSummationArealdisponering(component);

        expect(attributes(container.children[0])).toMatchObject({
            resourceValues: { title: "Tomtearealet", data: [{ label: "Grunnareal", value: 500 }] },
            resourceBindings: { title: "binding for Tomtearealet" }
        });
        expect(attributes(container.children[1]).resourceValues.title).toBe("Bebyggelsen");
    });
});

describe("when only one of the two was filled in", () => {
    it("draws the plot alone", () => {
        expect(titlesFor({ tomtearealet: summation("Tomtearealet", "Grunnareal") })).toEqual(["Tomtearealet"]);
    });

    it("draws what is built alone", () => {
        expect(titlesFor({ bebyggelsen: summation("Bebyggelsen", "Bebygd areal") })).toEqual(["Bebyggelsen"]);
    });
});

describe("when neither was filled in", () => {
    it("draws nothing at all rather than an empty container", () => {
        // An empty container would still take up the space its margins ask for.
        expect(renderers.renderSummationArealdisponering({ resourceValues: { data: {} } })).toBeNull();
        expect(renderers.renderSummationArealdisponering({})).toBeNull();
        expect(renderers.renderSummationArealdisponering(undefined)).toBeNull();
    });
});

describe("the empty field text", () => {
    it("renders whatever it was handed as the paragraph's own title", () => {
        expect(attributes(renderers.renderEmptyFieldText({ resourceValues: { data: "Ingen arealer" } }))).toMatchObject({
            tagName: "custom-paragraph",
            isChildComponent: "true",
            resourceValues: { title: "Ingen arealer" }
        });
    });
});
