import { beautifyJson, parseJsonInput, removeTrailingOrLeadingComma } from "./formatters.ts";

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
