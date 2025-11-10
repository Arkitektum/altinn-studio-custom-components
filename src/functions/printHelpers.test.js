import { setPageOrientation } from "./printHelpers";

describe("setPageOrientation", () => {
    beforeEach(() => {
        // Remove any previously injected style elements
        document.head.querySelectorAll("style").forEach((style) => style.remove());
    });

    it("should inject a style element with the correct @page rule for portrait", () => {
        setPageOrientation("portrait");
        const styleElements = Array.from(document.head.querySelectorAll("style"));
        const found = styleElements.some(
            (style) =>
                style.textContent.includes("@page") && style.textContent.includes("size: A4 portrait !important;")
        );
        expect(found).toBe(true);
    });

    it("should inject a style element with the correct @page rule for landscape", () => {
        setPageOrientation("landscape");
        const styleElements = Array.from(document.head.querySelectorAll("style"));
        const found = styleElements.some(
            (style) =>
                style.textContent.includes("@page") && style.textContent.includes("size: A4 landscape !important;")
        );
        expect(found).toBe(true);
    });

    it("should append the style element to document.head", () => {
        setPageOrientation("portrait");
        const styleElements = Array.from(document.head.querySelectorAll("style"));
        expect(styleElements.length).toBeGreaterThan(0);
    });
});
