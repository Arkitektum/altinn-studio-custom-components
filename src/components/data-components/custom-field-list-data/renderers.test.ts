import { renderListFieldElement } from "./renderers.ts";

/** A list of values, each already carrying its own resource values. */
const component = { resourceValues: { data: [{ data: "Personheis" }, { data: "Vareheis", title: "Løfteinnretning" }] } };

/** The custom elements drawn, unwrapped from the container each sits in. */
const elements = (rendered: HTMLElement) => [...rendered.children].map((child) => (child.firstChild as HTMLElement).firstChild as HTMLElement);

describe("the list", () => {
    it("draws one field per item", () => {
        expect(elements(renderListFieldElement(component))).toHaveLength(2);
    });

    it("draws each item as a data field", () => {
        for (const element of elements(renderListFieldElement(component))) {
            expect(element!.tagName.toLowerCase()).toBe("custom-field-data");
        }
    });

    it("hands each item across as that field's resource values", () => {
        // An item is already a set of resource values, so it goes across whole rather than being wrapped in data.
        const [first, second] = elements(renderListFieldElement(component));

        expect(JSON.parse(first!.getAttribute("resourcevalues")!)).toEqual({ data: "Personheis" });
        expect(JSON.parse(second!.getAttribute("resourcevalues")!)).toEqual({ data: "Vareheis", title: "Løfteinnretning" });
    });

    it("marks every field as a child component", () => {
        for (const element of elements(renderListFieldElement(component))) {
            expect(element!.getAttribute("ischildcomponent")).toBe("true");
        }
    });

    it("keeps the items in the order they arrived", () => {
        const values = elements(renderListFieldElement(component)).map((element) => JSON.parse(element!.getAttribute("resourcevalues")!).data);

        expect(values).toEqual(["Personheis", "Vareheis"]);
    });
});

describe("a list with nothing in it", () => {
    it("draws an empty container for an empty list", () => {
        expect(renderListFieldElement({ resourceValues: { data: [] } }).children).toHaveLength(0);
    });

    it("draws an empty container when there is no data, and when there is no component", () => {
        expect(renderListFieldElement({}).children).toHaveLength(0);
        expect(renderListFieldElement(undefined).children).toHaveLength(0);
    });
});
