import { beautifyJson, parseJsonInput, pluralize, removeTrailingOrLeadingComma } from "./formatters.ts";

describe("removeTrailingOrLeadingComma", () => {
    it("removes leading comma", () => {
        expect(removeTrailingOrLeadingComma(",hello")).toBe("hello");
    });

    it("removes trailing comma", () => {
        expect(removeTrailingOrLeadingComma("hello,")).toBe("hello");
    });

    it("removes both leading and trailing commas", () => {
        expect(removeTrailingOrLeadingComma(",hello,")).toBe("hello");
    });

    it("does not remove commas in the middle", () => {
        expect(removeTrailingOrLeadingComma("hel,lo")).toBe("hel,lo");
    });

    it("returns empty string if only comma", () => {
        expect(removeTrailingOrLeadingComma(",")).toBe("");
    });

    it("returns string unchanged if no leading or trailing comma", () => {
        expect(removeTrailingOrLeadingComma("hello")).toBe("hello");
    });
});

describe("beautifyJson", () => {
    it("beautifies a minified JSON string", () => {
        const minified = '{"a":1,"b":2}';
        expect(beautifyJson(minified)).toBe(
            `{
  "a": 1,
  "b": 2
}`
        );
    });

    it("removes leading/trailing commas before beautifying", () => {
        const ugly = ',{"a":1,"b":2},';
        expect(beautifyJson(ugly)).toBe(
            `{
  "a": 1,
  "b": 2
}`
        );
    });

    it("throws on invalid JSON", () => {
        expect(() => beautifyJson("not json")).toThrow();
    });
});

describe("parseJsonInput", () => {
    it("returns the parsed value and no error for valid JSON", () => {
        expect(parseJsonInput('{"a":1}')).toEqual({ value: { a: 1 } });
    });

    it("removes leading/trailing commas before parsing", () => {
        expect(parseJsonInput(',{"a":1},')).toEqual({ value: { a: 1 } });
    });

    it("returns the parser's message and no value for invalid JSON", () => {
        const result = parseJsonInput('{"a":1');
        expect(result.value).toBeUndefined();
        expect(typeof result.error).toBe("string");
        expect(result.error!.length > 0).toBe(true);
    });
});

describe("pluralize", () => {
    it("gives the singular for exactly one, and the plural for any other count", () => {
        expect(pluralize(1, "form")).toBe("form");
        expect(pluralize(0, "form")).toBe("forms");
        expect(pluralize(2, "form")).toBe("forms");
    });
    it("takes a plural that is not the singular with an s", () => {
        expect(pluralize(1, "value is", "values are")).toBe("value is");
        expect(pluralize(3, "value is", "values are")).toBe("values are");
    });
});
