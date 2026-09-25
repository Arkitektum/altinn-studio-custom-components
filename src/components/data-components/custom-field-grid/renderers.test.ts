import { renderFieldGridElement } from "./renderers.ts";

/** A grid of terms and their values, with a heading row above them. */
const component = {
    resourceValues: {
        title: "Arealdisponering",
        termHeader: "Type",
        valueHeader: "Areal",
        data: [
            { term: "Bebygd areal", valueComponent: { resourceValues: { data: "100" } } },
            { term: "Bruksareal", valueComponent: { tagName: "custom-field-adresse", resourceValues: { data: "120" } } }
        ]
    }
};

/** The text of every element carrying the given class. */
const textsOf = (element: Element, className: string) => [...element.querySelectorAll(`.${className}`)].map((node) => node.textContent);

describe("the grid", () => {
    it("is a container marked as a grid, holding a body", () => {
        const grid = renderFieldGridElement(component);

        expect(grid.classList.contains("custom-field-grid")).toBe(true);
        expect(grid.querySelector(".custom-field-grid-body")).not.toBeNull();
    });

    it("shows the title above the body when there is one", () => {
        expect(textsOf(renderFieldGridElement(component), "custom-field-grid-title")).toEqual(["Arealdisponering"]);
    });

    it("leaves the title out entirely when there is none", () => {
        expect(renderFieldGridElement({ resourceValues: { data: [] } }).querySelector(".custom-field-grid-title")).toBeNull();
    });
});

describe("the heading row", () => {
    it("draws a heading for each column", () => {
        expect(textsOf(renderFieldGridElement(component), "custom-field-grid-header")).toEqual(["Type", "Areal"]);
    });

    it("draws both headings when only one of them was given, leaving the other blank", () => {
        // The two sit side by side, so dropping one would slide the other under the wrong column.
        expect(textsOf(renderFieldGridElement({ resourceValues: { termHeader: "Type", data: [] } }), "custom-field-grid-header")).toEqual([
            "Type",
            ""
        ]);
        expect(textsOf(renderFieldGridElement({ resourceValues: { valueHeader: "Areal", data: [] } }), "custom-field-grid-header")).toEqual([
            "",
            "Areal"
        ]);
    });

    it("draws no heading row at all when neither heading was given", () => {
        expect(renderFieldGridElement({ resourceValues: { data: [] } }).querySelector(".custom-field-grid-header")).toBeNull();
    });
});

describe("the rows", () => {
    it("draws a term and a value for each row", () => {
        const grid = renderFieldGridElement(component);
        const terms = [...grid.querySelectorAll(".custom-field-grid-term:not(.custom-field-grid-header)")];

        expect(terms.map((node) => node.textContent)).toEqual(["Bebygd areal", "Bruksareal"]);
    });

    it("puts the value in an element of its own, of the kind the row asked for", () => {
        const values = [...renderFieldGridElement(component).querySelectorAll(".custom-field-grid-value:not(.custom-field-grid-header)")];

        expect(values.map((node) => (node.firstChild as HTMLElement).tagName.toLowerCase())).toEqual(["custom-field-data", "custom-field-adresse"]);
    });

    it("hands each row's own properties to the element holding its value", () => {
        const value = renderFieldGridElement(component).querySelector(".custom-field-grid-value:not(.custom-field-grid-header)");

        expect(JSON.parse((value!.firstChild as HTMLElement).getAttribute("resourcevalues")!)).toEqual({ data: "100" });
    });

    it("leaves out a row that has nothing in it", () => {
        // A row that reported itself empty would otherwise show as a term with a blank beside it.
        const data = [{ term: "Bebygd areal", valueComponent: {} }, { term: "Tomt", isEmpty: true }];
        const terms = renderFieldGridElement({ resourceValues: { data } }).querySelectorAll(".custom-field-grid-term");

        expect([...terms].map((node) => node.textContent)).toEqual(["Bebygd areal"]);
    });

    it("draws a row whose term is missing, so its value is not lost", () => {
        const data = [{ valueComponent: { resourceValues: { data: "100" } } }];
        const grid = renderFieldGridElement({ resourceValues: { data } });

        expect(grid.querySelector(".custom-field-grid-term")!.textContent).toBe("");
        expect(grid.querySelector(".custom-field-grid-value")!.firstChild).not.toBeNull();
    });
});

describe("a grid with nothing to show", () => {
    it("draws an empty body rather than nothing at all", () => {
        expect(renderFieldGridElement({}).querySelector(".custom-field-grid-body")!.children).toHaveLength(0);
    });

    it("ignores data that is not a list of rows", () => {
        expect(renderFieldGridElement({ resourceValues: { data: "ikke en liste" } }).querySelectorAll(".custom-field-grid-term")).toHaveLength(
            0
        );
    });

    it("renders without a component at all rather than throwing", () => {
        expect(renderFieldGridElement(undefined) !== undefined).toBe(true);
    });
});
