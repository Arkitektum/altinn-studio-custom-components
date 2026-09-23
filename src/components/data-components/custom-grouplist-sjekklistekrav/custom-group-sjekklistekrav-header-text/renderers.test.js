import * as renderers from "./renderers.js";

/** The two column headings, which arrive as data rather than as bindings by the time they reach here. */
const component = {
    enableLinks: true,
    resourceValues: { data: { sjekklistepunkt: "Sjekklistepunkt", sjekklistepunktsvar: "Svar" } }
};

/** The custom element a renderer produced, unwrapped from the container it sits in. */
const element = (rendered) => (rendered.tagName === "DIV" ? rendered.firstChild.firstChild : rendered);

/** The attributes a custom element carries, with the JSON-valued ones parsed back. */
function attributes(rendered) {
    const target = element(rendered);
    const read = (name) => target.getAttribute(name);
    const readJson = (name) => (read(name) === null ? null : JSON.parse(read(name)));
    return {
        tagName: target.tagName.toLowerCase(),
        isChildComponent: read("ischildcomponent"),
        hideIfEmpty: read("hideifempty"),
        hideTitle: read("hidetitle"),
        enableLinks: read("enablelinks"),
        grid: readJson("grid"),
        resourceValues: readJson("resourcevalues")
    };
}

describe("the two headings", () => {
    it("renders each heading as a title with no value under it", () => {
        // These are column headings, so there is nothing to show but the words themselves.
        expect(attributes(renderers.renderSjekklistepunkTextHeader(component))).toMatchObject({
            tagName: "custom-field",
            resourceValues: { title: "Sjekklistepunkt" }
        });
        expect(attributes(renderers.renderSjekklistepunkValueHeader(component)).resourceValues).toEqual({ title: "Svar" });
    });

    it("splits the row eleven to one, matching the requirements below", () => {
        // The headings have to line up with the rows they label, so the split is the same on both.
        expect(attributes(renderers.renderSjekklistepunkTextHeader(component)).grid).toEqual({ xs: 11 });
        expect(attributes(renderers.renderSjekklistepunkValueHeader(component)).grid).toEqual({ xs: 1 });
    });

    it("keeps both headings on the page whether or not there is anything under them", () => {
        expect(attributes(renderers.renderSjekklistepunkTextHeader(component)).hideIfEmpty).toBeNull();
        expect(attributes(renderers.renderSjekklistepunkValueHeader(component)).hideIfEmpty).toBeNull();
        expect(attributes(renderers.renderSjekklistepunkTextHeader(component)).hideTitle).toBeNull();
    });
});

describe("the heading row", () => {
    it("lays the two headings out on one row, in the order they label", () => {
        const row = renderers.renderSjekklistepunkHeader(component);
        const titles = [...row.children].map((child) => JSON.parse(child.firstChild.firstChild.getAttribute("resourcevalues")).title);

        expect(row.style.display).toBe("flex");
        expect(titles).toEqual(["Sjekklistepunkt", "Svar"]);
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

    it("marks both headings as child components", () => {
        expect(attributes(renderers.renderSjekklistepunkTextHeader(component)).isChildComponent).toBe("true");
        expect(attributes(renderers.renderSjekklistepunkValueHeader(component)).isChildComponent).toBe("true");
    });
});
