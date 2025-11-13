import { getTableHeaders, getTableRows } from "./tableHelpers";
import { getTextResourceFromResourceBinding, getValueFromDataKey, hasValue } from "./helpers.js";

// Mock the helper functions
jest.mock("./helpers.js", () => ({
    getTextResourceFromResourceBinding: jest.fn(),
    getValueFromDataKey: jest.fn(),
    hasValue: jest.fn()
}));

describe("getTableHeaders", () => {
    it("should return headers with resolved text and styleOverride", () => {
        getTextResourceFromResourceBinding.mockImplementation((binding) => `text-for-${binding}`);

        const columns = [
            {
                resourceBindings: { title: "col1" },
                styleOverride: { align: "left" }
            },
            {
                resourceBindings: { title: "col2" },
                styleOverride: { align: "right" }
            }
        ];

        const result = getTableHeaders(columns);

        expect(result).toEqual([
            { text: "text-for-col1", styleOverride: { align: "left" } },
            { text: "text-for-col2", styleOverride: { align: "right" } }
        ]);
        expect(getTextResourceFromResourceBinding).toHaveBeenCalledWith("col1");
        expect(getTextResourceFromResourceBinding).toHaveBeenCalledWith("col2");
    });

    it("should handle missing resourceBindings gracefully", () => {
        getTextResourceFromResourceBinding.mockReturnValue(undefined);

        const columns = [{ styleOverride: { align: "left" } }];

        const result = getTableHeaders(columns);

        expect(result).toEqual([{ text: undefined, styleOverride: { align: "left" } }]);
    });
});

describe("getTableRows", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should generate rows for array data", () => {
        getValueFromDataKey.mockImplementation((row, key) => row[key]);
        getTextResourceFromResourceBinding.mockImplementation((binding) => `empty-${binding}`);
        hasValue.mockImplementation((val) => !!val);

        const columns = [
            {
                dataKey: "name",
                resourceBindings: { emptyFieldText: "emptyName" },
                tagName: "td"
            },
            {
                dataKey: "age",
                resourceBindings: { emptyFieldText: "emptyAge" },
                tagName: "td"
            }
        ];

        const data = [
            { name: "Alice", age: 30 },
            { name: "Bob", age: 0 }
        ];

        const result = getTableRows(columns, data);

        expect(result).toEqual([
            [
                {
                    resourceBindings: { emptyFieldText: "emptyName" },
                    resourceValues: { data: "Alice", emptyFieldText: "empty-emptyName" },
                    hideTitle: true,
                    tagName: "td",
                    isChildComponent: true
                },
                {
                    resourceBindings: { emptyFieldText: "emptyAge" },
                    resourceValues: { data: 30, emptyFieldText: "empty-emptyAge" },
                    hideTitle: true,
                    tagName: "td",
                    isChildComponent: true
                }
            ],
            [
                {
                    resourceBindings: { emptyFieldText: "emptyName" },
                    resourceValues: { data: "Bob", emptyFieldText: "empty-emptyName" },
                    hideTitle: true,
                    tagName: "td",
                    isChildComponent: true
                },
                {
                    resourceBindings: { emptyFieldText: "emptyAge" },
                    resourceValues: { data: 0, emptyFieldText: "empty-emptyAge" },
                    hideTitle: true,
                    tagName: "td",
                    isChildComponent: true
                }
            ]
        ]);
    });

    it("should handle single object data", () => {
        getValueFromDataKey.mockImplementation((row, key) => row[key]);
        getTextResourceFromResourceBinding.mockReturnValue(undefined);
        hasValue.mockReturnValue(false);

        const columns = [{ dataKey: "foo", resourceBindings: {}, tagName: "td" }];
        const data = { foo: "bar" };

        const result = getTableRows(columns, data);

        expect(result).toEqual([
            [
                {
                    resourceBindings: {},
                    resourceValues: { data: "bar" },
                    hideTitle: true,
                    tagName: "td",
                    isChildComponent: true
                }
            ]
        ]);
    });

    it("should not add emptyFieldText if hasValue returns false", () => {
        getValueFromDataKey.mockReturnValue("baz");
        getTextResourceFromResourceBinding.mockReturnValue("");
        hasValue.mockReturnValue(false);

        const columns = [{ dataKey: "foo", resourceBindings: { emptyFieldText: "emptyFoo" }, tagName: "td" }];
        const data = [{ foo: "baz" }];

        const result = getTableRows(columns, data);

        expect(result[0][0].resourceValues).toEqual({ data: "baz" });
    });
});
