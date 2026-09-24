import * as renderers from "./renderers.ts";
import type { TableColumn } from "../../../types.ts";

/** The exemptions applied for, listed and counted. */
const component = {
    resourceBindings: {
        count: { title: "Antall dispensasjoner", emptyFieldText: "Ingen" },
        dispensasjon: {
            rowNumberTitle: "Nr",
            dispensasjonKategori: "Kategori",
            dispensasjonTittel: "Tittel",
            bestemmelserType: "Bestemmelsestype",
            emptyFieldText: "-"
        }
    },
    resourceValues: {
        data: {
            dispensasjon: [
                { dispensasjonKategori: { kodebeskrivelse: "Plan" }, dispensasjonTittel: { kodebeskrivelse: "Byggegrense" } },
                { dispensasjonKategori: { kodebeskrivelse: "Lov" } }
            ]
        }
    }
};

/** The custom element a renderer produced, unwrapped from the container when it added one. */
const element = (rendered: HTMLElement): HTMLElement =>
    rendered.tagName === "DIV" ? ((rendered.firstChild as HTMLElement).firstChild as HTMLElement) : rendered;

/** The attributes a custom element carries, with the JSON-valued ones parsed back. */
function attributes(rendered: HTMLElement) {
    const target = element(rendered);
    const read = (name: string) => target.getAttribute(name);
    const readJson = (name: string) => (read(name) === null ? null : JSON.parse(read(name)!));
    return {
        tagName: target.tagName.toLowerCase(),
        size: read("size"),
        isChildComponent: read("ischildcomponent"),
        hideIfEmpty: read("hideifempty"),
        showRowNumbers: read("showrownumbers"),
        columns: readJson("tablecolumns") as TableColumn[],
        resourceBindings: readJson("resourcebindings"),
        resourceValues: readJson("resourcevalues"),
        wrapped: rendered.tagName === "DIV"
    };
}

describe("the header", () => {
    it("takes the title it is given and sits at h2 unless a level is asked for", () => {
        expect(attributes(renderers.renderHeaderElement("Dispensasjoner"))).toMatchObject({
            tagName: "custom-header-text",
            size: "h2",
            resourceValues: { title: "Dispensasjoner" }
        });
        expect(attributes(renderers.renderHeaderElement("Dispensasjoner", "h3")).size).toBe("h3");
    });
});

describe("the count", () => {
    it("hands the exemptions to the element that counts them, rather than a number", () => {
        // The element does the counting, so it needs the list itself.
        expect(attributes(renderers.renderDispensasjonCount(component))).toMatchObject({
            tagName: "custom-field-count-data",
            hideIfEmpty: "true",
            resourceBindings: { title: "Antall dispensasjoner", emptyFieldText: "Ingen" },
            resourceValues: { data: component.resourceValues.data.dispensasjon }
        });
    });
});

describe("the table", () => {
    it("lists the exemptions themselves, not the group holding them", () => {
        expect(attributes(renderers.renderDispensasjonTable(component))).toMatchObject({
            tagName: "custom-table-data",
            hideIfEmpty: "true",
            wrapped: false,
            resourceValues: { data: component.resourceValues.data.dispensasjon }
        });
    });

    it("numbers the rows, and titles the number column", () => {
        // An exemption is referred to by its number in the covering letter, so the rows have to be numbered.
        expect(attributes(renderers.renderDispensasjonTable(component))).toMatchObject({
            showRowNumbers: "true",
            resourceBindings: { rowNumberTitle: "Nr" }
        });
    });

    it("draws the category, the title and the kind of provision", () => {
        expect(attributes(renderers.renderDispensasjonTable(component)).columns.map((entry) => entry.dataKey)).toEqual([
            "dispensasjonKategori.kodebeskrivelse",
            "dispensasjonTittel.kodebeskrivelse",
            "bestemmelserType.kodebeskrivelse"
        ]);
    });

    it("takes each column's title from the exemption bindings rather than a binding of its own", () => {
        // The three titles sit together under dispensasjon, so they are read by name rather than through a title
        // property the way most bindings are.
        const columns = attributes(renderers.renderDispensasjonTable(component)).columns as TableColumn[];

        expect(columns.map((entry) => entry.resourceBindings!.title)).toEqual([
            "Kategori",
            "Tittel",
            "Bestemmelsestype"
        ]);
    });

    it("gives every column the same text for an empty cell", () => {
        for (const entry of attributes(renderers.renderDispensasjonTable(component)).columns) {
            expect({ key: entry.dataKey, text: entry.resourceBindings!.emptyFieldText }).toEqual({ key: entry.dataKey, text: "-" });
        }
    });

    it("shows all three by their descriptions, not their codes", () => {
        for (const entry of attributes(renderers.renderDispensasjonTable(component)).columns) {
            expect({ key: entry.dataKey, ends: entry.dataKey!.endsWith(".kodebeskrivelse") }).toEqual({ key: entry.dataKey, ends: true });
        }
    });
});

describe("the empty field text", () => {
    it("renders whatever it was handed as the paragraph's own title", () => {
        expect(attributes(renderers.renderEmptyFieldText({ resourceValues: { data: "Ingen dispensasjoner" } }))).toMatchObject({
            tagName: "custom-paragraph",
            wrapped: true,
            resourceValues: { title: "Ingen dispensasjoner" }
        });
    });
});

describe("every renderer", () => {
    const fromComponent: Record<string, (component?: unknown) => HTMLElement> = Object.fromEntries(
        Object.entries(renderers).filter(([name]) => name !== "renderHeaderElement")
    ) as Record<string, (component?: unknown) => HTMLElement>;

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

    it("still draws the table's three columns when there is nothing to list", () => {
        expect(attributes(renderers.renderDispensasjonTable({})).columns).toHaveLength(3);
    });

    it("marks everything it renders as a child component", () => {
        for (const [name, render] of Object.entries(fromComponent)) {
            expect({ name, isChild: attributes(render(component)).isChildComponent }).toEqual({ name, isChild: "true" });
        }
        expect(attributes(renderers.renderHeaderElement("Dispensasjoner")).isChildComponent).toBe("true");
    });
});
