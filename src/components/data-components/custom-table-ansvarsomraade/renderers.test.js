import { renderAnsvarsomraadeTable } from "./renderers.js";

/** The areas of responsibility, one row each. */
const component = {
    size: "h4",
    resourceBindings: {
        ansvarsfordeling: { title: "Ansvarsfordeling", emptyFieldText: "Ingen ansvarsområder" },
        tiltaksklasse: { title: "Tiltaksklasse", emptyFieldText: "-" },
        ansvarsomraade: { title: "Ansvarsområde", emptyFieldText: "-" },
        foretak: { title: "Foretak", emptyFieldText: "-" },
        planlagteSamsvarKontrollErklaeringer: { title: "Planlagte erklæringer", emptyFieldText: "Ingen" },
        ansvarsomraadeStatus: { title: "Status", emptyFieldText: "-" }
    },
    resourceValues: { data: [{ ansvarsomraade: "Bæresystem" }], title: "Ansvar" }
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
        hideTitle: read("hidetitle"),
        columns: readJson("tablecolumns"),
        resourceBindings: readJson("resourcebindings"),
        resourceValues: readJson("resourcevalues")
    };
}

/** The column with the given data key. */
const column = (dataKey) => attributes(renderAnsvarsomraadeTable(component)).columns.find((entry) => entry.dataKey === dataKey);

describe("the table itself", () => {
    it("is a data table titled by the responsibility split, keeping its title on show", () => {
        expect(attributes(renderAnsvarsomraadeTable(component))).toMatchObject({
            tagName: "custom-table-data",
            size: "h4",
            hideIfEmpty: "true",
            hideTitle: null,
            resourceBindings: { title: "Ansvarsfordeling", emptyFieldText: "Ingen ansvarsområder" }
        });
    });

    it("hands its resource values on whole", () => {
        expect(attributes(renderAnsvarsomraadeTable(component)).resourceValues).toEqual(component.resourceValues);
    });
});

describe("the columns", () => {
    it("draws the class, the area, the company, the planned declarations and the status", () => {
        expect(attributes(renderAnsvarsomraadeTable(component)).columns.map((entry) => entry.dataKey)).toEqual([
            "tiltaksklasse.kodebeskrivelse",
            "ansvarsomraade",
            "foretak",
            "planlagteSamsvarKontrollErklaeringerList.resourceValues.data",
            "ansvarsomraadeStatus.kodebeskrivelse"
        ]);
    });

    it("right-aligns the class, which is a number, and leaves the rest as they come", () => {
        expect(column("tiltaksklasse.kodebeskrivelse").styleOverride).toEqual({ textAlign: "right" });
        expect(column("ansvarsomraade").styleOverride).toBeUndefined();
    });

    it("gives the company its own element, since a company is named rather than written out", () => {
        expect(column("foretak").tagName).toBe("custom-field-part-navn");
    });

    it("shows the planned declarations as a list of terms and their signing dates", () => {
        // The list arrives already built by a component of its own, which is why the key reaches through
        // another set of resource values to get at it.
        expect(column("planlagteSamsvarKontrollErklaeringerList.resourceValues.data")).toMatchObject({
            tagName: "custom-description-list-data",
            itemTermKey: "title",
            itemDescriptionKey: "signingDate",
            styleOverride: { width: "284px" }
        });
    });

    it("shows the class and the status by their descriptions, not their codes", () => {
        expect(column("tiltaksklasse.kodebeskrivelse").resourceBindings.title).toBe("Tiltaksklasse");
        expect(column("ansvarsomraadeStatus.kodebeskrivelse").resourceBindings.title).toBe("Status");
    });
});

describe("the table with nothing to show", () => {
    it("still draws its five columns, so an empty table keeps its headings", () => {
        expect(attributes(renderAnsvarsomraadeTable({})).columns).toHaveLength(5);
    });

    it("renders without a component at all rather than throwing", () => {
        expect(renderAnsvarsomraadeTable(undefined) !== undefined).toBe(true);
    });
});
