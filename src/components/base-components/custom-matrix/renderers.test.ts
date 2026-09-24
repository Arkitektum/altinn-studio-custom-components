import { renderHeaderElement, renderMatrixElement } from "./renderers.ts";

/** A matrix with a corner, two columns and two rows. */
const matrixData = () => ({
    matrixHeaders: [{ text: "" }, { text: "Bebygd areal" }, { text: "Bruksareal" }],
    matrixRows: [
        [{ resourceValues: { data: "Eksisterende" } }, { resourceValues: { data: "100" } }, { resourceValues: { data: "120" } }],
        [{ resourceValues: { data: "Nytt" } }, { resourceValues: { data: "50" } }, { resourceValues: { data: "60" } }]
    ]
});

/** The matrix component holding that data. */
const component = () => ({ size: "h3", resourceValues: { title: "Arealer", data: matrixData() } });

describe("the caption", () => {
    it("is drawn from the title, and marks the matrix as having one", () => {
        const matrix = renderMatrixElement(component());

        expect((matrix.querySelector("caption")!.firstChild as HTMLElement).tagName.toLowerCase()).toBe("custom-header");
        expect(matrix.classList.contains("has-caption")).toBe(true);
    });

    it("is left out when there is no title, and when the title is to be hidden", () => {
        expect(renderMatrixElement({ resourceValues: { data: matrixData() } }).querySelector("caption")).toBeNull();
        expect(renderMatrixElement({ ...component(), hideTitle: true }).querySelector("caption")).toBeNull();
    });
});

describe("the column headings", () => {
    it("draws one heading cell per column, scoped to its column", () => {
        const headers = [...renderMatrixElement(component()).querySelectorAll("thead th")];

        expect(headers.map((th) => th.textContent)).toEqual(["", "Bebygd areal", "Bruksareal"]);
        expect(headers.map((th) => th.getAttribute("scope"))).toEqual(["col", "col", "col"]);
    });

    it("leaves the corner heading empty, since it labels the row headings below it", () => {
        expect(renderMatrixElement(component()).querySelector("thead th")!.textContent).toBe("");
    });
});

describe("the rows", () => {
    it("makes the first cell of each row a heading for that row", () => {
        const rows = [...renderMatrixElement(component()).querySelectorAll("tbody tr")];

        for (const row of rows) {
            const heading = row.firstChild as HTMLElement;
            expect({ tagName: heading.tagName, scope: heading.getAttribute("scope") }).toEqual({ tagName: "TH", scope: "row" });
        }
    });

    it("draws the rest of the row as ordinary cells", () => {
        const row = renderMatrixElement(component()).querySelector("tbody tr");

        expect([...row!.children].map((cell) => cell.tagName)).toEqual(["TH", "TD", "TD"]);
    });

    it("sets the row heading in bold, and leaves the cells beside it alone", () => {
        const row = renderMatrixElement(component()).querySelector("tbody tr");
        const styleOf = (cell: Element) => JSON.parse((cell.firstChild as HTMLElement).getAttribute("styleoverride") ?? "null");

        expect(styleOf(row!.children[0]!)).toEqual({ fontWeight: "var(--font-weight-bold)" });
        expect(styleOf(row!.children[1]!)).toBeNull();
    });

    it("keeps a row heading's own styling alongside the bold it adds", () => {
        const data = matrixData();
        (data.matrixRows[0]![0] as { styleOverride?: Record<string, string> }).styleOverride = { textAlign: "right" };
        const row = renderMatrixElement({ resourceValues: { data } }).querySelector("tbody tr");

        expect(JSON.parse((row!.firstChild!.firstChild as HTMLElement).getAttribute("styleoverride")!)).toEqual({
            textAlign: "right",
            fontWeight: "var(--font-weight-bold)"
        });
    });

    it("draws an empty row rather than skipping it", () => {
        const data = { ...matrixData(), matrixRows: [[]] };

        expect(renderMatrixElement({ resourceValues: { data } }).querySelectorAll("tbody tr")).toHaveLength(1);
    });
});

describe("a matrix with nothing to show", () => {
    /** The matrix drawn for data that will not fill it. */
    const emptyMatrix = (data: unknown) => renderMatrixElement({ resourceValues: { data, emptyFieldText: "Ingen arealer" }, isEmpty: true });

    it("shows the empty field text instead of headings and rows", () => {
        expect(emptyMatrix({ matrixHeaders: [], matrixRows: [] }).textContent).toBe("Ingen arealer");
        expect(emptyMatrix({ matrixHeaders: [], matrixRows: [] }).querySelector("thead")).toBeNull();
    });

    it("needs both headings and rows before it draws a matrix proper", () => {
        expect(emptyMatrix({ matrixHeaders: [{ text: "Areal" }], matrixRows: [] }).querySelector("thead")).toBeNull();
        expect(emptyMatrix({ matrixHeaders: [], matrixRows: [[{}]] }).querySelector("thead")).toBeNull();
    });

    it("draws an empty matrix rather than a stray row when there is no text to show either", () => {
        expect(renderMatrixElement({ resourceValues: { data: {} } }).children).toHaveLength(0);
    });
});

describe("the matrix's own styling", () => {
    it("applies whatever the component asked for", () => {
        expect(renderMatrixElement({ ...component(), styleOverride: { marginTop: "10px" } }).style.marginTop).toBe("10px");
    });
});

describe("the header element on its own", () => {
    it("renders a header for a title, and nothing at all without one", () => {
        expect(renderHeaderElement("Arealer", "h2")!.tagName.toLowerCase()).toBe("custom-header");
        expect(renderHeaderElement(undefined as unknown as string, "h2")).toBeUndefined();
    });
});
