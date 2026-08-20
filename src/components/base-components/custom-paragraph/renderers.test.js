import { renderParagraphElement } from "./renderers";

describe("renderParagraphElement", () => {
    it("renders the title as paragraph text", () => {
        const html = renderParagraphElement({ resourceValues: { title: "En ledetekst" } });
        expect(html).toContain("En ledetekst");
    });

    it("does not render HTML in the title (XSS-safe)", () => {
        const payload = "<img src=x onerror=alert(1)>";
        const html = renderParagraphElement({ resourceValues: { title: payload } });
        expect(html).not.toContain("<img");
        expect(html).toContain("&lt;img");
    });

    it("escapes HTML-like data when serialized to an HTML string", () => {
        const html = renderParagraphElement({ resourceValues: { title: "<script>alert(1)</script>" } });
        expect(html).not.toContain("<script>");
        expect(html).toContain("&lt;script&gt;");
    });

    it('renders nothing rather than the string "undefined" when there is no title', () => {
        const html = renderParagraphElement({});
        expect(html).not.toContain("undefined");
    });
});
