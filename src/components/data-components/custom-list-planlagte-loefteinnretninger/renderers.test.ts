import { renderPlanlagteLoefteinnretningerList } from "./renderers.ts";

/** A list component holding everything a list can carry, plus things that are none of the element's business. */
const component = {
    size: "h3",
    hideIfEmpty: true,
    isChildComponent: true,
    format: "date",
    enableLinks: true,
    resourceBindings: { title: "Tittel" },
    resourceValues: { data: ["Personheis", "Vareheis"] },
    isEmpty: false,
    validationMessages: ["noe gikk galt"]
};

/** The names of the attributes the rendered element carries, leaving out the tag name it is given for free. */
const attributeNames = (element: Element) =>
    [...element.attributes]
        .map((attribute) => attribute.name)
        .filter((name) => name !== "tagname")
        .sort();

describe("the lifting equipment list adapter", () => {
    it("renders a list", () => {
        expect(renderPlanlagteLoefteinnretningerList(component).tagName.toLowerCase()).toBe("custom-list");
    });

    it("passes the component's own properties across as attributes", () => {
        expect(attributeNames(renderPlanlagteLoefteinnretningerList(component))).toEqual([
            "enablelinks",
            "format",
            "hideifempty",
            "ischildcomponent",
            "resourcebindings",
            "resourcevalues",
            "size"
        ]);
    });

    it("leaves behind the parts of the component that are not attributes", () => {
        // A component carries working state as well as what it looks like, and only the latter belongs on the element.
        expect(attributeNames(renderPlanlagteLoefteinnretningerList(component))).not.toContain("isempty");
        expect(attributeNames(renderPlanlagteLoefteinnretningerList(component))).not.toContain("validationmessages");
    });

    it("hands the planned equipment across untouched", () => {
        const element = renderPlanlagteLoefteinnretningerList(component);

        expect(JSON.parse(element.getAttribute("resourcevalues")!)).toEqual(component.resourceValues);
    });

    it("renders a bare element for a component with nothing on it, and for no component at all", () => {
        expect(attributeNames(renderPlanlagteLoefteinnretningerList({}))).toEqual([]);
        expect(attributeNames(renderPlanlagteLoefteinnretningerList(undefined))).toEqual([]);
    });
});
