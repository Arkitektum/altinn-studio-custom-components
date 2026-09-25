import { renderHeaderElement } from "./renderers";

describe("renderHeaderElement", () => {
    it("renders the title in the requested header size", () => {
        const html = renderHeaderElement({ resourceValues: { title: "En tittel" }, size: "h3" });
        expect(html).toContain("<h3>");
        expect(html).toContain("En tittel");
    });

    it("falls back to h2 for an invalid size", () => {
        const html = renderHeaderElement({ resourceValues: { title: "En tittel" }, size: "h9" });
        expect(html).toContain("<h2>");
    });

    it("does not render HTML in the title (XSS-safe)", () => {
        const payload = "<img src=x onerror=alert(1)>";
        const html = renderHeaderElement({ resourceValues: { title: payload } });
        // custom-header-text-data joins formData.dataTitle into the title, so the payload must be shown as text.
        expect(html).not.toContain("<img");
        expect(html).toContain("&lt;img");
    });

    it("escapes HTML-like data when serialized to an HTML string", () => {
        const html = renderHeaderElement({ resourceValues: { title: "<script>alert(1)</script>" } });
        expect(html).not.toContain("<script>");
        expect(html).toContain("&lt;script&gt;");
    });

    it('renders nothing rather than the string "undefined" when there is no title', () => {
        const html = renderHeaderElement({});
        expect(html).not.toContain("undefined");
    });
});
