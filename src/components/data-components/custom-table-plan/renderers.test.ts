import { renderPlanTable } from "./renderers.ts";

import type { TableColumn } from "../../../types.ts";

/** The plans that apply, one row each. */
const component = {
    size: "h3",
    resourceBindings: {
        plan: { title: "Plan" },
        navn: { title: "Navn", emptyFieldText: "Ikke oppgitt" },
        plantype: { title: "Plantype", emptyFieldText: "-" }
    },
    resourceValues: { data: [{ navn: "Kommuneplan", plantype: { kodebeskrivelse: "Kommuneplan" } }], title: "Planer" }
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
        expect(attributes(renderPlanTable(component))).toMatchObject({
            tagName: "custom-table-data",
            size: "h3",
            hideIfEmpty: "true",
            isChildComponent: "true",
            resourceBindings: { title: "Plan" }
        });
    });

    it("hands its resource values on whole, title and all", () => {
        expect(attributes(renderPlanTable(component)).resourceValues).toEqual(component.resourceValues);
    });
});

describe("the columns", () => {
    it("draws the name and then the kind of plan", () => {
        expect(attributes(renderPlanTable(component)).columns.map((entry) => entry.dataKey)).toEqual(["navn", "plantype.kodebeskrivelse"]);
    });

    it("shows the kind of plan by its description, not its code", () => {
        expect(attributes(renderPlanTable(component)).columns[1]!.dataKey).toBe("plantype.kodebeskrivelse");
    });

    it("gives each column its own title and empty field text", () => {
        expect(attributes(renderPlanTable(component)).columns.map((entry) => entry.resourceBindings)).toEqual([
            { title: "Navn", emptyFieldText: "Ikke oppgitt" },
            { title: "Plantype", emptyFieldText: "-" }
        ]);
    });

    it("leaves both columns aligned as they come, since neither holds a number", () => {
        for (const entry of attributes(renderPlanTable(component)).columns) {
            expect({ key: entry.dataKey, style: entry.styleOverride }).toEqual({ key: entry.dataKey, style: undefined });
        }
    });
});

describe("the table with nothing to show", () => {
    it("still draws its columns, so an empty table keeps its headings", () => {
        expect(attributes(renderPlanTable({})).columns).toHaveLength(2);
    });

    it("renders without a component at all rather than throwing", () => {
        expect(renderPlanTable(undefined) !== undefined).toBe(true);
    });
});
