import { renderChildHeaderElement, renderChildHeaderElementFromResource, renderEmptyFieldText } from "./childElements.ts";

/** The attributes a custom element carries, with the JSON-valued ones parsed back. */
function attributes(element: HTMLElement) {
    const readJson = (name: string) => (element.getAttribute(name) === null ? null : JSON.parse(element.getAttribute(name)!));
    return {
        tagName: element.tagName.toLowerCase(),
        size: element.getAttribute("size"),
        isChildComponent: element.getAttribute("ischildcomponent"),
        resourceValues: readJson("resourcevalues"),
        resourceBindings: readJson("resourcebindings")
    };
}

describe("renderChildHeaderElement", () => {
    it("renders a child header text at the level it is given, with the title as text", () => {
        expect(attributes(renderChildHeaderElement("Avløp", "h3"))).toEqual({
            tagName: "custom-header-text",
            size: "h3",
            isChildComponent: "true",
            resourceValues: { title: "Avløp" },
            resourceBindings: null
        });
    });
});

describe("renderChildHeaderElementFromResource", () => {
    it("renders the same heading with the title as a resource key for the child to look up", () => {
        expect(attributes(renderChildHeaderElementFromResource("resource.erklaeringer.title", "h2"))).toEqual({
            tagName: "custom-header-text",
            size: "h2",
            isChildComponent: "true",
            resourceValues: null,
            resourceBindings: { title: "resource.erklaeringer.title" }
        });
    });
});

describe("renderEmptyFieldText", () => {
    it("renders the empty-field text the component class put in place of the data, in a container", () => {
        const container = renderEmptyFieldText({ resourceValues: { data: "Ikke oppgitt" } });
        const paragraph = container.querySelector("custom-paragraph") as HTMLElement;

        expect(paragraph).not.toBeNull();
        expect(attributes(paragraph)).toMatchObject({ isChildComponent: "true", resourceValues: { title: "Ikke oppgitt" } });
    });
});
