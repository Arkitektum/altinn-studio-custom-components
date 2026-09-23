import { renderPartTable } from "./renderers.js";

/** The parties, one row each. */
const component = {
    size: "h3",
    resourceBindings: {
        part: { title: "Part" },
        navn: { title: "Navn", emptyFieldText: "Ikke oppgitt" },
        telefonnummer: { title: "Telefon", emptyFieldText: "-" },
        epost: { title: "E-post", emptyFieldText: "-" }
    },
    resourceValues: { data: { navn: "Kari Nordmann", epost: "kari@example.no" }, title: "Tiltakshaver" }
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
    it("is a data table that takes its heading level from the component", () => {
        expect(attributes(renderPartTable(component))).toMatchObject({
            tagName: "custom-table-data",
            size: "h3",
            hideIfEmpty: "true",
            isChildComponent: "true",
            resourceBindings: { title: "Part" }
        });
    });

    it("hands its resource values on whole, title and all", () => {
        expect(attributes(renderPartTable(component)).resourceValues).toEqual(component.resourceValues);
    });
});

describe("the columns", () => {
    it("draws the name, the telephone number and the email address", () => {
        expect(attributes(renderPartTable(component)).columns.map((entry) => entry.tagName)).toEqual([
            "custom-field-part-navn",
            "custom-field-telefonnummer",
            "custom-field-data"
        ]);
    });

    it("names a data key only for the email address", () => {
        // A name and a telephone number can each be spelled several ways in the data, so those two elements
        // find their own value; an email address is one field, so the column points straight at it.
        expect(attributes(renderPartTable(component)).columns.map((entry) => entry.dataKey)).toEqual([undefined, undefined, "epost"]);
    });

    it("gives each column its own title and empty field text", () => {
        expect(attributes(renderPartTable(component)).columns.map((entry) => entry.resourceBindings)).toEqual([
            { title: "Navn", emptyFieldText: "Ikke oppgitt" },
            { title: "Telefon", emptyFieldText: "-" },
            { title: "E-post", emptyFieldText: "-" }
        ]);
    });
});

describe("the table with nothing to show", () => {
    it("still draws its three columns, so an empty table keeps its headings", () => {
        expect(attributes(renderPartTable({})).columns).toHaveLength(3);
    });

    it("renders without a component at all rather than throwing", () => {
        expect(renderPartTable(undefined) !== undefined).toBe(true);
    });
});
