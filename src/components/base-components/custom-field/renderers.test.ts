import { renderFieldElement } from "./renderers.ts";

describe("renderFieldElement", () => {
    it("renders a plain string value as text", () => {
        const element = renderFieldElement("", "hello world", { returnHtml: false });
        expect(element.querySelector(".field-value")!.textContent).toBe("hello world");
    });

    it("joins array values with a comma", () => {
        const element = renderFieldElement("", ["a", "b", "c"], { returnHtml: false });
        expect(element.querySelector(".field-value")!.textContent).toBe("a, b, c");
    });

    it("does not render HTML in the value when links are disabled (XSS-safe)", () => {
        const payload = "<img src=x onerror=alert(1)>";
        const element = renderFieldElement("", payload, { returnHtml: false, enableLinks: false });
        const value = element.querySelector(".field-value");
        // No live element was injected; the payload is shown verbatim as text.
        expect(value!.querySelector("img")).toBeNull();
        expect(value!.textContent).toBe(payload);
    });

    it("renders URLs as anchor elements when links are enabled", () => {
        const element = renderFieldElement("", "see http://example.com", { returnHtml: false, enableLinks: true });
        const anchor = element.querySelector(".field-value a");
        expect(anchor).not.toBeNull();
        expect(anchor!.getAttribute("href")).toBe("http://example.com");
    });

    it("does not inject markup from a malicious URL when links are enabled", () => {
        const element = renderFieldElement("", 'http://a.co/"><img src=x onerror=alert(1)>', { returnHtml: false, enableLinks: true });
        expect(element.querySelector(".field-value img")).toBeNull();
    });

    it("renders an empty value as an empty field-value element", () => {
        const element = renderFieldElement("", "", { returnHtml: false });
        expect(element.querySelector(".field-value")!.textContent).toBe("");
    });

    it("renders the title, and appends a colon when inline", () => {
        expect(renderFieldElement("Tittel", "verdi", { returnHtml: false }).querySelector(".field-title")!.textContent).toBe("Tittel");
        expect(renderFieldElement("Tittel", "verdi", { returnHtml: false, inline: true }).querySelector(".field-title")!.textContent).toBe("Tittel:");
    });

    it("links the value to its title for screen readers", () => {
        const element = renderFieldElement("Tittel", "verdi", { returnHtml: false });
        const titleId = element.querySelector(".field-title")!.id;
        expect(titleId).toBeTruthy();
        expect(element.querySelector(".field-value")!.getAttribute("aria-labelledby")).toBe(titleId);
    });

    it("does not render HTML in the title (XSS-safe)", () => {
        const payload = "<img src=x onerror=alert(1)>";
        const element = renderFieldElement(payload, "verdi", { returnHtml: false });
        expect(element.querySelector(".field-title img")).toBeNull();
        expect(element.querySelector(".field-title")!.textContent).toBe(payload);
    });

    it("serializes the title into the HTML string", () => {
        expect(renderFieldElement("Tittel", "verdi")).toContain("Tittel");
    });
});
