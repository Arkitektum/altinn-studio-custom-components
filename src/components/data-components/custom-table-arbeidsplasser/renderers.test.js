import { renderArbeidsplasserTable } from "./renderers.js";

/** The workplaces affected, each already reduced to a label and a value. */
const component = {
    size: "h1",
    resourceBindings: {
        arbeidsplasser: { title: "Arbeidsplasser" },
        arbeidsplasserKey: { title: "Type arbeidsplass" },
        beroertAvTiltaket: { title: "Berørt av tiltaket" }
    },
    resourceValues: { data: [{ title: "Faste arbeidsplasser", value: "Ja" }], title: "Arbeidsplasser" }
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
        expect(attributes(renderArbeidsplasserTable(component))).toMatchObject({
            tagName: "custom-table-data",
            hideIfEmpty: "true",
            isChildComponent: "true",
            resourceBindings: { title: "Arbeidsplasser" }
        });
    });

    it("always sits at h3, whatever level the component was given", () => {
        expect(attributes(renderArbeidsplasserTable(component)).size).toBe("h3");
        expect(attributes(renderArbeidsplasserTable({ ...component, size: "h5" })).size).toBe("h3");
    });

    it("hands its resource values on whole", () => {
        expect(attributes(renderArbeidsplasserTable(component)).resourceValues).toEqual(component.resourceValues);
    });
});

describe("the columns", () => {
    it("draws the kind of workplace and then whether it is affected", () => {
        // The rows arrive already reduced to a label and a value, so the columns read those two rather than
        // any field named after a workplace.
        expect(attributes(renderArbeidsplasserTable(component)).columns.map((entry) => entry.dataKey)).toEqual(["title", "value"]);
    });

    it("titles the two columns from two different bindings", () => {
        expect(attributes(renderArbeidsplasserTable(component)).columns.map((entry) => entry.resourceBindings.title)).toEqual([
            "Type arbeidsplass",
            "Berørt av tiltaket"
        ]);
    });

    it("reads both as plain fields", () => {
        for (const entry of attributes(renderArbeidsplasserTable(component)).columns) {
            expect({ key: entry.dataKey, tagName: entry.tagName }).toEqual({ key: entry.dataKey, tagName: "custom-field-data" });
        }
    });
});

describe("the table with nothing to show", () => {
    it("still draws its two columns, so an empty table keeps its headings", () => {
        expect(attributes(renderArbeidsplasserTable({})).columns).toHaveLength(2);
    });

    it("renders without a component at all rather than throwing", () => {
        expect(renderArbeidsplasserTable(undefined) !== undefined).toBe(true);
    });
});
