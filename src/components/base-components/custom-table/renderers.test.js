import { renderHeaderElement, renderTableElement } from "./renderers.js";

/** A table with two columns and one row of data. */
const component = {
    size: "h3",
    resourceValues: {
        title: "Eiendommer",
        data: {
            tableHeaders: [{ text: "Adresse" }, { text: "Gårdsnummer", styleOverride: { textAlign: "right" } }],
            tableRows: [
                [
                    { tagName: "custom-field-adresse", resourceValues: { data: "Storgata 1" } },
                    { resourceValues: { data: "42" } }
                ]
            ]
        }
    }
};

/** The table's caption, if it drew one. */
const caption = (table) => table.querySelector("caption");

describe("the caption", () => {
    it("is drawn from the title, and marks the table as having one", () => {
        const table = renderTableElement(component);

        expect(caption(table).firstChild.tagName.toLowerCase()).toBe("custom-header");
        expect(table.classList.contains("has-caption")).toBe(true);
    });

    it("carries the title and the heading level into the header element", () => {
        const header = caption(renderTableElement(component)).firstChild;

        expect(JSON.parse(header.getAttribute("resourcevalues"))).toEqual({ title: "Eiendommer" });
        expect(header.getAttribute("size")).toBe("h3");
    });

    it("is left out when there is no title, and when the title is to be hidden", () => {
        expect(caption(renderTableElement({ resourceValues: { data: component.resourceValues.data } }))).toBeNull();
        expect(caption(renderTableElement({ ...component, hideTitle: true }))).toBeNull();
        expect(renderTableElement({ ...component, hideTitle: true }).classList.contains("has-caption")).toBe(false);
    });
});

describe("the column headings", () => {
    it("draws one heading cell per column, scoped to its column", () => {
        const headers = [...renderTableElement(component).querySelectorAll("thead th")];

        expect(headers.map((th) => th.textContent)).toEqual(["Adresse", "Gårdsnummer"]);
        expect(headers.map((th) => th.getAttribute("scope"))).toEqual(["col", "col"]);
    });

    it("applies a heading's own styling, so a column of numbers can be right-aligned", () => {
        const headers = [...renderTableElement(component).querySelectorAll("thead th")];

        expect(headers[1].style.textAlign).toBe("right");
        expect(headers[0].style.textAlign).toBe("");
    });
});

describe("the rows", () => {
    it("draws one cell per entry, each holding the element that entry asked for", () => {
        const cells = [...renderTableElement(component).querySelectorAll("tbody td")];

        expect(cells.map((td) => td.firstChild.tagName.toLowerCase())).toEqual(["custom-field-adresse", "custom-field-data"]);
    });

    it("falls back to a plain data field for a cell that names no element", () => {
        expect(renderTableElement(component).querySelectorAll("tbody td")[1].firstChild.tagName.toLowerCase()).toBe("custom-field-data");
    });

    it("hands each cell's own properties to the element inside it", () => {
        const cell = renderTableElement(component).querySelector("tbody td");

        expect(JSON.parse(cell.firstChild.getAttribute("resourcevalues"))).toEqual({ data: "Storgata 1" });
    });
});

describe("a table with nothing to show", () => {
    /** The table drawn for data that will not fill it, with whatever empty text the component carries. */
    const emptyTable = (data) =>
        renderTableElement({ resourceValues: { data, emptyFieldText: "Ingen eiendommer" }, resourceBindings: {}, isEmpty: true });

    it("shows the empty field text instead of a header and rows", () => {
        expect(emptyTable({ tableHeaders: [], tableRows: [] }).textContent).toBe("Ingen eiendommer");
        expect(emptyTable({ tableHeaders: [], tableRows: [] }).querySelector("thead")).toBeNull();
    });

    it("needs both headings and rows before it draws a table proper", () => {
        // Headings with no rows under them say nothing, and rows with no headings cannot be read.
        expect(emptyTable({ tableHeaders: [{ text: "Adresse" }], tableRows: [] }).querySelector("thead")).toBeNull();
        expect(emptyTable({ tableHeaders: [], tableRows: [[{}]] }).querySelector("thead")).toBeNull();
    });

    it("draws an empty table rather than a stray row when there is no text to show either", () => {
        const table = renderTableElement({ resourceValues: { data: {} } });

        expect(table.children).toHaveLength(0);
    });
});

describe("the table's own styling", () => {
    it("applies whatever the component asked for", () => {
        expect(renderTableElement({ ...component, styleOverride: { marginTop: "10px" } }).style.marginTop).toBe("10px");
    });
});

describe("the header element on its own", () => {
    it("renders a header for a title", () => {
        expect(renderHeaderElement("Eiendommer", "h2").tagName.toLowerCase()).toBe("custom-header");
    });

    it("renders nothing at all without a title, which is why the caller checks first", () => {
        expect(renderHeaderElement(undefined, "h2")).toBeUndefined();
        expect(renderHeaderElement("", "h2")).toBeUndefined();
    });
});
