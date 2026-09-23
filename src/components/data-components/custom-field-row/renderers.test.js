import { renderFieldRowElement } from "./renderers.js";

/** A row of cells, with a title above them. */
const component = {
    resourceValues: {
        title: "Arealer",
        data: [
            { resourceValues: { data: "100" }, styleOverride: { textAlign: "right" } },
            { tagName: "custom-field-adresse", resourceValues: { data: "Storgata 1" } }
        ]
    }
};

describe("the row", () => {
    it("is a container marked as a row, holding the cells", () => {
        const row = renderFieldRowElement(component);

        expect(row.classList.contains("custom-field-row")).toBe(true);
        expect(row.querySelector(".custom-field-row-cells")).not.toBeNull();
    });

    it("shows the title above the cells when there is one, and leaves it out when there is none", () => {
        expect(renderFieldRowElement(component).querySelector(".custom-field-row-title").textContent).toBe("Arealer");
        expect(renderFieldRowElement({ resourceValues: { data: [] } }).querySelector(".custom-field-row-title")).toBeNull();
    });
});

describe("the cells", () => {
    it("draws one cell per entry", () => {
        expect(renderFieldRowElement(component).querySelectorAll(".custom-field-row-cell")).toHaveLength(2);
    });

    it("puts each value in the kind of element its entry asked for", () => {
        const cells = [...renderFieldRowElement(component).querySelectorAll(".custom-field-row-cell")];

        expect(cells.map((cell) => cell.firstChild.tagName.toLowerCase())).toEqual(["custom-field-data", "custom-field-adresse"]);
    });

    it("styles the cell itself rather than the element inside it", () => {
        // The alignment has to apply to the whole cell, otherwise only the text moves and the cell stays put.
        const cell = renderFieldRowElement(component).querySelector(".custom-field-row-cell");

        expect(cell.style.textAlign).toBe("right");
    });

    it("hands each entry's own properties to the element inside its cell", () => {
        const cell = renderFieldRowElement(component).querySelector(".custom-field-row-cell");

        expect(JSON.parse(cell.firstChild.getAttribute("resourcevalues"))).toEqual({ data: "100" });
    });
});

describe("a row with nothing to show", () => {
    it("draws an empty cell container rather than nothing at all", () => {
        expect(renderFieldRowElement({}).querySelector(".custom-field-row-cells").children).toHaveLength(0);
    });

    it("ignores data that is not a list of cells", () => {
        expect(renderFieldRowElement({ resourceValues: { data: "ikke en liste" } }).querySelectorAll(".custom-field-row-cell")).toHaveLength(
            0
        );
    });

    it("renders without a component at all rather than throwing", () => {
        expect(renderFieldRowElement(undefined) !== undefined).toBe(true);
    });
});
