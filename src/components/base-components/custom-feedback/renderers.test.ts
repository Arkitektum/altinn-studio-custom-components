import { renderFeedbackElement } from "./renderers";

describe("renderFeedbackElement", () => {
    it("renders the feedback text with the feedback type as a class", () => {
        const html = renderFeedbackElement("Noe gikk galt", "error");
        expect(html).toContain("Noe gikk galt");
        expect(html).toContain('class="error"');
    });

    it("does not render HTML in the feedback text (XSS-safe)", () => {
        const payload = "<img src=x onerror=alert(1)>";
        const html = renderFeedbackElement(payload, "error");
        // The feedback text comes from the data model, so the payload must be shown verbatim as text.
        expect(html).not.toContain("<img");
        expect(html).toContain("&lt;img");
    });

    it("escapes HTML-like data when serialized to an HTML string", () => {
        const html = renderFeedbackElement("<script>alert(1)</script>", "error");
        expect(html).not.toContain("<script>");
        expect(html).toContain("&lt;script&gt;");
    });

    it('renders nothing rather than the string "undefined" when there is no text', () => {
        const html = renderFeedbackElement(undefined as unknown as string, "error");
        expect(html).not.toContain("undefined");
    });
});
