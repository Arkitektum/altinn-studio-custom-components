import { renderFeedbackListElement } from "./renderers";

describe("renderFeedbackListElement", () => {
    it("renders the title and one feedback element per message", () => {
        const html = renderFeedbackListElement("Tilbakemeldinger", ["Første", "Andre"], "error");
        expect(html).toContain("Tilbakemeldinger");
        expect(html.match(/<custom-feedback-data/g)).toHaveLength(2);
    });

    it("does not render HTML in the title (XSS-safe)", () => {
        const payload = "<img src=x onerror=alert(1)>";
        const html = renderFeedbackListElement(payload, [], "error");
        expect(html).not.toContain("<img");
        expect(html).toContain("&lt;img");
    });

    it("escapes HTML-like data when serialized to an HTML string", () => {
        const html = renderFeedbackListElement("<script>alert(1)</script>", [], "error");
        expect(html).not.toContain("<script>");
        expect(html).toContain("&lt;script&gt;");
    });

    it("renders an empty list when there are no messages", () => {
        const html = renderFeedbackListElement("Tilbakemeldinger", [], "error");
        expect(html).not.toContain("<custom-feedback-data");
    });
});
