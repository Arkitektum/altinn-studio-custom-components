import { renderListElement, renderListFieldElement } from "./renderers.ts";

describe("renderListElement", () => {
    it("renders each data value as a list item", () => {
        const element = renderListElement({ resourceValues: { data: ["Første", "Andre"] } }, false);
        const items = Array.from(element.querySelectorAll("li")).map((item) => item.textContent);
        expect(items).toEqual(["Første", "Andre"]);
    });

    it("does not render HTML in a list item (XSS-safe)", () => {
        const payload = "<img src=x onerror=alert(1)>";
        const element = renderListElement({ resourceValues: { data: [payload] } }, false);
        const item = element.querySelector("li");
        // No live element was injected; the payload is shown verbatim as text.
        expect(item!.querySelector("img")).toBeNull();
        expect(item!.textContent).toBe(payload);
    });

    it("escapes HTML-like data when serialized to an HTML string", () => {
        const html = renderListElement({ resourceValues: { data: ["<script>alert(1)</script>"] } });
        expect(html).not.toContain("<script>");
        expect(html).toContain("&lt;script&gt;");
    });

    it("uses the requested list type", () => {
        const element = renderListElement({ listType: "ol", resourceValues: { data: ["Første"] } }, false);
        expect(element.tagName).toBe("OL");
    });

    it("renders an empty list when there is no data", () => {
        const element = renderListElement({}, false);
        expect(element.querySelectorAll("li")).toHaveLength(0);
    });
});

describe("renderListFieldElement", () => {
    it("does not render HTML in a list item when a title is present (XSS-safe)", () => {
        const payload = "<img src=x onerror=alert(1)>";
        const html = renderListFieldElement({ resourceValues: { title: "Tittel", data: [payload] } });
        expect(html).not.toContain("<img");
        expect(html).toContain("&lt;img");
    });
});
