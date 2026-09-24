import { renderEiendomTable } from "./renderers.ts";

import type { TableColumn } from "../../../types.ts";

/** The seven columns this table draws, in the order it draws them. */
const columnKeys = [
    "adresse",
    "eiendomsidentifikasjon.gaardsnummer",
    "eiendomsidentifikasjon.bruksnummer",
    "eiendomsidentifikasjon.seksjonsnummer",
    "eiendomsidentifikasjon.festenummer",
    "bolignummer",
    "bygningsnummer"
];

/** The properties of one neighbour, with a binding for the table and one for each column. */
const component = {
    size: "h3",
    resourceBindings: {
        eiendomByggested: { title: "Eiendom/byggested" },
        adresse: { title: "Adresse", emptyFieldText: "Ikke oppgitt" },
        eiendomsidentifikasjonGaardsnummer: { title: "Gårdsnummer", emptyFieldText: "-" },
        eiendomsidentifikasjonBruksnummer: { title: "Bruksnummer", emptyFieldText: "-" },
        eiendomsidentifikasjonSeksjonsnummer: { title: "Seksjonsnummer", emptyFieldText: "-" },
        eiendomsidentifikasjonFestenummer: { title: "Festenummer", emptyFieldText: "-" },
        bolignummer: { title: "Bolignummer", emptyFieldText: "-" },
        bygningsnummer: { title: "Bygningsnummer", emptyFieldText: "-" }
    },
    resourceValues: { data: [{ adresse: "Storgata 3" }], title: "Eiendom" }
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

/** The column with the given data key. */
const column = (rendered: HTMLElement, dataKey: string) => attributes(rendered).columns.find((entry) => entry.dataKey === dataKey);

describe("the table itself", () => {
    it("is a data table that takes its heading level from the component", () => {
        expect(attributes(renderEiendomTable(component))).toMatchObject({
            tagName: "custom-table-data",
            size: "h3",
            hideIfEmpty: "true",
            isChildComponent: "true",
            resourceBindings: { title: "Eiendom/byggested" }
        });
    });

    it("hands its resource values on whole, title and all", () => {
        expect(attributes(renderEiendomTable(component)).resourceValues).toEqual(component.resourceValues);
    });
});

describe("the columns", () => {
    it("draws the address first, then the identifiers, then the building numbers", () => {
        expect(attributes(renderEiendomTable(component)).columns.map((entry) => entry.dataKey)).toEqual(columnKeys);
    });

    it("gives the address its own element, since an address is more than one line", () => {
        expect(column(renderEiendomTable(component), "adresse")).toMatchObject({
            tagName: "custom-field-adresse",
            resourceBindings: { title: "Adresse", emptyFieldText: "Ikke oppgitt" }
        });
    });

    it("right-aligns every column but the address, since the rest are numbers", () => {
        for (const dataKey of columnKeys.slice(1)) {
            expect({ dataKey, align: column(renderEiendomTable(component), dataKey)!.styleOverride }).toEqual({
                dataKey,
                align: { textAlign: "right" }
            });
        }
    });

    it("reads the cadastral numbers out of the identification object", () => {
        // They are nested under eiendomsidentifikasjon in the data, which the dotted key is what reaches into.
        expect(columnKeys.filter((key) => key.startsWith("eiendomsidentifikasjon."))).toHaveLength(4);
        expect(column(renderEiendomTable(component), "eiendomsidentifikasjon.gaardsnummer")!.resourceBindings!.title).toBe("Gårdsnummer");
    });

    it("carries each column's own empty field text, so a blank cell says what is missing", () => {
        for (const dataKey of columnKeys.slice(1)) {
            expect({ dataKey, text: column(renderEiendomTable(component), dataKey)!.resourceBindings!.emptyFieldText }).toEqual({
                dataKey,
                text: "-"
            });
        }
    });
});

describe("the address column on a landscape page", () => {
    // The width is read at render time from a global the print setup sets, so a table drawn for a landscape
    // page gives the address more room than the same table drawn for a portrait one.
    const widthWhenOriented = (orientation?: string) => {
        const before = globalThis.pageOrientation;
        globalThis.pageOrientation = orientation;
        const width = column(renderEiendomTable(component), "adresse")!.styleOverride!.width;
        globalThis.pageOrientation = before;
        return width;
    };

    it("is wider in landscape than in portrait", () => {
        expect(widthWhenOriented("landscape")).toBe("200px");
        expect(widthWhenOriented("portrait")).toBe("116px");
    });

    it("falls back to the portrait width when no orientation was set", () => {
        expect(widthWhenOriented(undefined)).toBe("116px");
    });
});

describe("the table with nothing to show", () => {
    it("still draws its columns, so an empty table keeps its headings", () => {
        expect(attributes(renderEiendomTable({})).columns.map((entry) => entry.dataKey)).toEqual(columnKeys);
    });

    it("renders without a component at all rather than throwing", () => {
        expect(renderEiendomTable(undefined) !== undefined).toBe(true);
    });
});
