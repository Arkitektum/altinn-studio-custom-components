import { escapeHtml, escapeHtmlAttribute } from "./stringHelpers";

describe("escapeHtml", () => {
    it("escapes &, < and >", () => {
        expect(escapeHtml('<img src=x> & "q"')).toBe('&lt;img src=x&gt; &amp; "q"');
    });
    it("escapes & before < and > (no double-escaping)", () => {
        expect(escapeHtml("&lt;")).toBe("&amp;lt;");
    });
    it("coerces non-string input to a string", () => {
        expect(escapeHtml(42)).toBe("42");
        expect(escapeHtml(null)).toBe("null");
    });
});

describe("escapeHtmlAttribute", () => {
    it("escapes the double quote in addition to &, < and >", () => {
        expect(escapeHtmlAttribute('a"b<c>')).toBe("a&quot;b&lt;c&gt;");
    });
});
