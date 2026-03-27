import { beautifyJson, removeTrailingOrLeadingComma } from "./formatters.js";

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
