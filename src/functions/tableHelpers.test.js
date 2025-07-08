import { getTableHeaders, getTableRows } from "./tableHelpers";
import { getTextResourceFromResourceBinding, getValueFromDataKey, hasValue } from "./helpers.js";

// Mock the helper functions
jest.mock("./helpers.js", () => ({
    getTextResourceFromResourceBinding: jest.fn(),
    getValueFromDataKey: jest.fn(),
    hasValue: jest.fn()
}));

describe("getTableHeaders", () => {
    it("should return headers with resolved text and props", () => {
        getTextResourceFromResourceBinding.mockImplementation((binding) => {
            if (binding === "header1") return "Header 1";
            if (binding === "header2") return "Header 2";
            return "";
        });

        const columns = [
            { resourceBindings: { title: "header1" }, props: { align: "left" } },
            { resourceBindings: { title: "header2" }, props: { align: "right" } }
        ];

        const result = getTableHeaders(columns);

        expect(result).toEqual([
            { text: "Header 1", props: { align: "left" } },
            { text: "Header 2", props: { align: "right" } }
        ]);
        expect(getTextResourceFromResourceBinding).toHaveBeenCalledWith("header1");
        expect(getTextResourceFromResourceBinding).toHaveBeenCalledWith("header2");
    });

    it("should handle missing resourceBindings gracefully", () => {
        getTextResourceFromResourceBinding.mockReturnValue("");
        const columns = [{ props: { align: "center" } }];
        const result = getTableHeaders(columns);
        expect(result).toEqual([{ text: "", props: { align: "center" } }]);
    });
});

describe("getTableRows", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should return rows for array data with resolved cell data and emptyFieldText", () => {
        getValueFromDataKey.mockImplementation((row, key) => row[key]);
        getTextResourceFromResourceBinding.mockImplementation((binding) => {
            if (binding === "empty1") return "No data";
            return "";
        });
        hasValue.mockImplementation((val) => !!val);

        const columns = [
            {
                dataKey: "col1",
                tagName: "td",
                resourceBindings: { emptyFieldText: "empty1" }
            },
            {
                dataKey: "col2",
                tagName: "td"
            }
        ];
        const data = [
            { col1: "A", col2: "B" },
            { col1: "", col2: "D" }
        ];

        const result = getTableRows(columns, data);

        expect(result).toEqual([
            [
                {
                    resourceValues: { data: "A", emptyFieldText: "No data" },
                    hideTitle: true,
                    tagName: "td",
                    isChildComponent: true
                },
                {
                    resourceValues: { data: "B" },
                    hideTitle: true,
                    tagName: "td",
                    isChildComponent: true
                }
            ],
            [
                {
                    resourceValues: { data: "", emptyFieldText: "No data" },
                    hideTitle: true,
                    tagName: "td",
                    isChildComponent: true
                },
                {
                    resourceValues: { data: "D" },
                    hideTitle: true,
                    tagName: "td",
                    isChildComponent: true
                }
            ]
        ]);
        expect(getValueFromDataKey).toHaveBeenCalledTimes(4);
        expect(getTextResourceFromResourceBinding).toHaveBeenCalledWith("empty1");
    });

    it("should handle single object data", () => {
        getValueFromDataKey.mockImplementation((row, key) => row[key]);
        getTextResourceFromResourceBinding.mockReturnValue("");
        hasValue.mockReturnValue(false);

        const columns = [
            { dataKey: "foo", tagName: "td" },
            { dataKey: "bar", tagName: "td" }
        ];
        const data = { foo: 1, bar: 2 };

        const result = getTableRows(columns, data);

        expect(result).toEqual([
            [
                {
                    resourceValues: { data: 1 },
                    hideTitle: true,
                    tagName: "td",
                    isChildComponent: true
                },
                {
                    resourceValues: { data: 2 },
                    hideTitle: true,
                    tagName: "td",
                    isChildComponent: true
                }
            ]
        ]);
    });

    it("should not add emptyFieldText if hasValue returns false", () => {
        getValueFromDataKey.mockReturnValue("value");
        getTextResourceFromResourceBinding.mockReturnValue("");
        hasValue.mockReturnValue(false);

        const columns = [{ dataKey: "foo", tagName: "td", resourceBindings: { emptyFieldText: "empty" } }];
        const data = [{ foo: "value" }];

        const result = getTableRows(columns, data);

        expect(result[0][0].resourceValues).toEqual({ data: "value" });
    });
});
