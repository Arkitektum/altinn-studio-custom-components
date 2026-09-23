import { renderOmraaderisikoTable } from "./renderers.js";

/** The risks that apply to the area, one row each. */
const component = {
    resourceBindings: {
        omraaderisiko: { title: "Områderisiko" },
        risikotype: { title: "Risikotype", emptyFieldText: "-" },
        sikkerhetsklasse: { title: "Sikkerhetsklasse", emptyFieldText: "-" }
    },
    resourceValues: { data: [{ risikotype: { kodebeskrivelse: "Flom" } }], title: "Risiko" }
};

/** The attributes the table carries, with the JSON-valued ones parsed back. */
function attributes(element) {
    const read = (name) => element.getAttribute(name);
    const readJson = (name) => (read(name) === null ? null : JSON.parse(read(name)));
    return {
        tagName: element.tagName.toLowerCase(),
        size: read("size"),
        isChildComponent: read("ischildcomponent"),
        hideIfEmpty: read("hideifempty"),
        columns: readJson("tablecolumns"),
        resourceBindings: readJson("resourcebindings"),
        resourceValues: readJson("resourcevalues")
    };
}

describe("the table itself", () => {
    it("is a data table titled by its own binding", () => {
        expect(attributes(renderOmraaderisikoTable(component))).toMatchObject({
            tagName: "custom-table-data",
            hideIfEmpty: "true",
            isChildComponent: "true",
            resourceBindings: { title: "Områderisiko" }
        });
    });

    it("sits at h2 unless the component asks for another level", () => {
        expect(attributes(renderOmraaderisikoTable(component)).size).toBe("h2");
        expect(attributes(renderOmraaderisikoTable({ ...component, size: "h4" })).size).toBe("h4");
    });

    it("takes only the data across, leaving the component's own title behind", () => {
        // Unlike the property tables, which hand their resource values on whole, this one titles itself from
        // its binding and so has no use for a title that came with the data.
        expect(attributes(renderOmraaderisikoTable(component)).resourceValues).toEqual({ data: component.resourceValues.data });
    });
});

describe("the columns", () => {
    it("draws the kind of risk and then its safety class", () => {
        expect(attributes(renderOmraaderisikoTable(component)).columns.map((entry) => entry.dataKey)).toEqual([
            "risikotype.kodebeskrivelse",
            "sikkerhetsklasse.kodebeskrivelse"
        ]);
    });

    it("shows both by their descriptions, not their codes", () => {
        for (const entry of attributes(renderOmraaderisikoTable(component)).columns) {
            expect({ key: entry.dataKey, ends: entry.dataKey.endsWith(".kodebeskrivelse") }).toEqual({ key: entry.dataKey, ends: true });
        }
    });

    it("gives each column its own title and empty field text", () => {
        expect(attributes(renderOmraaderisikoTable(component)).columns.map((entry) => entry.resourceBindings)).toEqual([
            { title: "Risikotype", emptyFieldText: "-" },
            { title: "Sikkerhetsklasse", emptyFieldText: "-" }
        ]);
    });
});

describe("the table with nothing to show", () => {
    it("still draws its columns, so an empty table keeps its headings", () => {
        expect(attributes(renderOmraaderisikoTable({})).columns).toHaveLength(2);
    });

    it("renders without a component at all rather than throwing", () => {
        expect(renderOmraaderisikoTable(undefined) !== undefined).toBe(true);
    });
});
