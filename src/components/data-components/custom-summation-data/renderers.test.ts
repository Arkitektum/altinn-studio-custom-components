import { renderSummationData } from "./renderers.ts";

/** A summation, with the figures it adds up and the choices the component made about showing them. */
const component = {
    size: "h1",
    hideIfEmpty: true,
    hideTitle: true,
    resourceValues: { title: "Tomtearealet", data: [{ label: "Grunnareal", value: 500 }] },
    resourceBindings: { title: "Skal ikke følge med" }
};

/** The attributes the rendered element carries, with the JSON-valued ones parsed back. */
function attributes(element: HTMLElement) {
    const read = (name: string) => element.getAttribute(name);
    const readJson = (name: string) => (read(name) === null ? null : JSON.parse(read(name)!));
    return {
        tagName: element.tagName.toLowerCase(),
        size: read("size"),
        isChildComponent: read("ischildcomponent"),
        hideIfEmpty: read("hideifempty"),
        hideTitle: read("hidetitle"),
        resourceBindings: readJson("resourcebindings"),
        resourceValues: readJson("resourcevalues")
    };
}

describe("the summation", () => {
    it("always sits at h3, whatever level the component was given", () => {
        // It is one block among several under a section heading, so its level is fixed rather than inherited.
        expect(attributes(renderSummationData(component)).size).toBe("h3");
        expect(attributes(renderSummationData({ ...component, size: "h5" })).size).toBe("h3");
    });

    it("renders a summation marked as a child component", () => {
        expect(attributes(renderSummationData(component))).toMatchObject({
            tagName: "custom-summation",
            isChildComponent: "true"
        });
    });

    it("carries the figures and their title across", () => {
        expect(attributes(renderSummationData(component)).resourceValues).toEqual(component.resourceValues);
    });

    it("takes no bindings across, since the title arrives already resolved", () => {
        expect(attributes(renderSummationData(component)).resourceBindings).toBeNull();
    });

    it("passes on the component's own choices about hiding", () => {
        expect(attributes(renderSummationData(component))).toMatchObject({ hideIfEmpty: "true", hideTitle: "true" });
        expect(attributes(renderSummationData({ ...component, hideIfEmpty: false, hideTitle: false }))).toMatchObject({
            hideIfEmpty: null,
            hideTitle: null
        });
    });

    it("renders for a component with nothing on it, and for no component at all", () => {
        expect(attributes(renderSummationData({})).tagName).toBe("custom-summation");
        expect(renderSummationData(undefined) !== undefined).toBe(true);
    });
});
