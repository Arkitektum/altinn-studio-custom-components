import { renderListElement, renderListFieldElement } from "./renderers";

describe("renderListElement", () => {
    it("renders a term and description for each item", () => {
        const element = renderListElement([{ term: "Gnr", description: "42" }], {}, false);
        expect(element.querySelector("dt").textContent).toBe("Gnr");
        expect(element.querySelector("dd").textContent).toBe("42");
    });

    it("does not render HTML in a term or description (XSS-safe)", () => {
        const payload = "<img src=x onerror=alert(1)>";
        const element = renderListElement([{ term: payload, description: payload }], {}, false);
        const term = element.querySelector("dt");
        const description = element.querySelector("dd");
        // No live element was injected; the payload is shown verbatim as text.
        expect(term.querySelector("img")).toBeNull();
        expect(description.querySelector("img")).toBeNull();
        expect(term.textContent).toBe(payload);
        expect(description.textContent).toBe(payload);
    });

    it("escapes HTML-like data when serialized to an HTML string", () => {
        const html = renderListElement([{ term: "<script>alert(1)</script>", description: "ok" }], {});
        expect(html).not.toContain("<script>");
        expect(html).toContain("&lt;script&gt;");
    });

    it("renders an empty list when there are no items", () => {
        const element = renderListElement([], {}, false);
        expect(element.querySelectorAll("dt")).toHaveLength(0);
    });
});

describe("renderListFieldElement", () => {
    it("does not render HTML in an item when a title is present (XSS-safe)", () => {
        const payload = "<img src=x onerror=alert(1)>";
        const html = renderListFieldElement("Tittel", [{ term: payload, description: payload }]);
        expect(html).not.toContain("<img");
        expect(html).toContain("&lt;img");
    });
});
