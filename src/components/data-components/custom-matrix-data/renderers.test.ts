import { renderMatrixElement } from "./renderers.ts";

/** A matrix component holding everything a matrix can carry, plus things that are none of the element's business. */
const component = {
    size: "h3",
    hideIfEmpty: true,
    isChildComponent: true,
    format: "date",
    enableLinks: true,
    tableColumns: [{ dataKey: "navn" }],
    resourceBindings: { title: "Tittel" },
    resourceValues: { data: [{ navn: "Kari" }] },
    isEmpty: false,
    validationMessages: ["noe gikk galt"]
};

/** The names of the attributes the rendered element carries, leaving out the tag name it is given for free. */
const attributeNames = (element: Element) =>
    [...element.attributes]
        .map((attribute) => attribute.name)
        .filter((name) => name !== "tagname")
        .sort();

describe("the matrix adapter", () => {
    it("renders a matrix", () => {
        expect(renderMatrixElement(component).tagName.toLowerCase()).toBe("custom-matrix");
    });

    it("passes the component's own properties across as attributes", () => {
        expect(attributeNames(renderMatrixElement(component))).toEqual([
            "enablelinks",
            "format",
            "hideifempty",
            "ischildcomponent",
            "resourcebindings",
            "resourcevalues",
            "size",
            "tablecolumns"
        ]);
    });

    it("leaves behind the parts of the component that are not attributes", () => {
        // A component carries working state as well as what it looks like, and only the latter belongs on the element.
        expect(attributeNames(renderMatrixElement(component))).not.toContain("isempty");
        expect(attributeNames(renderMatrixElement(component))).not.toContain("validationmessages");
    });

    it("hands the columns and the data across untouched", () => {
        const element = renderMatrixElement(component);

        expect(JSON.parse(element.getAttribute("tablecolumns")!)).toEqual(component.tableColumns);
        expect(JSON.parse(element.getAttribute("resourcevalues")!)).toEqual(component.resourceValues);
    });

    it("renders a bare element for a component with nothing on it, and for no component at all", () => {
        expect(attributeNames(renderMatrixElement({}))).toEqual([]);
        expect(attributeNames(renderMatrixElement(undefined))).toEqual([]);
    });
});
