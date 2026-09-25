import { renderPartTable } from "./renderers.ts";

import type { TableColumn } from "../../../types.ts";

/** The party responsible, as the plan shows them. */
const component = {
    size: "h3",
    resourceBindings: {
        part: { title: "Ansvarlig søker" },
        navn: { title: "Navn", emptyFieldText: "Ikke oppgitt" },
        organisasjonsnummer: { title: "Organisasjonsnummer", emptyFieldText: "Ikke oppgitt" },
        tiltaksklasse: { title: "Tiltaksklasse", emptyFieldText: "Ikke oppgitt" }
    },
    resourceValues: { data: { navn: "Firma AS", organisasjonsnummer: "912345678", tiltaksklasse: "2" } }
};

/** The attributes the table carries, with the JSON-valued ones parsed back. */
function attributes(element: HTMLElement) {
    const read = (name: string) => element.getAttribute(name);
    const readJson = (name: string) => (read(name) === null ? null : JSON.parse(read(name)!));
    return {
        tagName: element.tagName.toLowerCase(),
        size: read("size"),
        isChildComponent: read("ischildcomponent"),
        hideIfEmpty: read("hideifempty"),
        columns: readJson("tablecolumns") as TableColumn[],
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
            resourceBindings: { title: "Ansvarlig søker" }
        });
    });

    it("hands its resource values on whole", () => {
        expect(attributes(renderPartTable(component)).resourceValues).toEqual(component.resourceValues);
    });
});

describe("the columns", () => {
    it("draws the name, the organisation number and the class", () => {
        expect(attributes(renderPartTable(component)).columns.map((entry) => entry.dataKey)).toEqual([
            "navn",
            "organisasjonsnummer",
            "tiltaksklasse"
        ]);
    });

    it("reads all three as plain fields, unlike the party table this one resembles", () => {
        // The plan shows a company by the name it registered, so there is nothing here for the name element to
        // work out, and every column points straight at its value.
        for (const entry of attributes(renderPartTable(component)).columns) {
            expect({ key: entry.dataKey, tagName: entry.tagName }).toEqual({ key: entry.dataKey, tagName: "custom-field-data" });
        }
    });

    it("gives each column its own title and empty field text", () => {
        expect(attributes(renderPartTable(component)).columns.map((entry) => entry.resourceBindings)).toEqual([
            { title: "Navn", emptyFieldText: "Ikke oppgitt" },
            { title: "Organisasjonsnummer", emptyFieldText: "Ikke oppgitt" },
            { title: "Tiltaksklasse", emptyFieldText: "Ikke oppgitt" }
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
