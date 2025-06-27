import { getTableHeaders, getTableRows } from "./tableHelpers";
import { getTextResourceFromResourceBinding, getValueFromDataKey, hasValue } from "./helpers.js";

// Mock the helper functions
jest.mock("./helpers.js", () => ({
    getTextResourceFromResourceBinding: jest.fn(),
    getValueFromDataKey: jest.fn(),
    hasValue: jest.fn()
}));

describe("getTableHeaders", () => {
    it("should map columns to header objects with resolved text", () => {
        const tableColumns = [
            {
                textResourceBindings: { title: "header1" },
                props: { width: "100px" }
            },
            {
                textResourceBindings: { title: "header2" },
                props: { width: "200px" }
            }
        ];
        const textResources = [
            { id: "header1", value: "Header 1" },
            { id: "header2", value: "Header 2" }
        ];

        getTextResourceFromResourceBinding.mockImplementation((resources, key) => resources.find((r) => r.id === key)?.value);

        const result = getTableHeaders(tableColumns, textResources);

        expect(result).toEqual([
            { text: "Header 1", props: { width: "100px" } },
            { text: "Header 2", props: { width: "200px" } }
        ]);
        expect(getTextResourceFromResourceBinding).toHaveBeenCalledTimes(2);
    });

    it("should handle missing textResourceBindings gracefully", () => {
        const tableColumns = [{ props: { width: "100px" } }];
        const textResources = [];

        getTextResourceFromResourceBinding.mockReturnValue(undefined);

        const result = getTableHeaders(tableColumns, textResources);

        expect(result).toEqual([{ text: undefined, props: { width: "100px" } }]);
    });
});

describe("getTableRows", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should generate rows for array data with simpleBinding", () => {
        const tableColumns = [
            {
                dataKey: "name",
                props: { width: 100 },
                tagName: "td",
                textResourceBindings: { emptyFieldText: "emptyName" }
            },
            {
                dataKey: "age",
                props: { width: 50 },
                tagName: "td",
                textResourceBindings: { emptyFieldText: "emptyAge" }
            }
        ];
        const textResources = [
            { id: "emptyName", value: "No Name" },
            { id: "emptyAge", value: "No Age" }
        ];
        const data = [
            { name: "Alice", age: 30 },
            { name: "Bob", age: 0 }
        ];

        getValueFromDataKey.mockImplementation((row, key) => row[key]);
        getTextResourceFromResourceBinding.mockImplementation((resources, key) => resources.find((r) => r.id === key)?.value);
        hasValue.mockImplementation((val) => !!val || val === 0);

        const result = getTableRows(tableColumns, textResources, data);

        expect(result).toEqual([
            [
                {
                    width: 100,
                    formData: { simpleBinding: "Alice" },
                    hideTitle: true,
                    tagName: "td",
                    texts: { emptyFieldText: "No Name" }
                },
                {
                    width: 50,
                    formData: { simpleBinding: 30 },
                    hideTitle: true,
                    tagName: "td",
                    texts: { emptyFieldText: "No Age" }
                }
            ],
            [
                {
                    width: 100,
                    formData: { simpleBinding: "Bob" },
                    hideTitle: true,
                    tagName: "td",
                    texts: { emptyFieldText: "No Name" }
                },
                {
                    width: 50,
                    formData: { simpleBinding: 0 },
                    hideTitle: true,
                    tagName: "td",
                    texts: { emptyFieldText: "No Age" }
                }
            ]
        ]);
    });

    it("should handle single object data", () => {
        const tableColumns = [{ dataKey: "foo", props: {}, tagName: "td", textResourceBindings: {} }];
        const textResources = [];
        const data = { foo: "bar" };

        getValueFromDataKey.mockReturnValue("bar");
        getTextResourceFromResourceBinding.mockReturnValue(undefined);
        hasValue.mockReturnValue(false);

        const result = getTableRows(tableColumns, textResources, data);

        expect(result).toEqual([
            [
                {
                    formData: { simpleBinding: "bar" },
                    hideTitle: true,
                    tagName: "td"
                }
            ]
        ]);
    });

    it('should use "data" property for non-string/number cellData', () => {
        const tableColumns = [{ dataKey: "obj", props: {}, tagName: "td", textResourceBindings: {} }];
        const textResources = [];
        const data = [{ obj: { nested: 1 } }];

        getValueFromDataKey.mockReturnValue({ nested: 1 });
        getTextResourceFromResourceBinding.mockReturnValue(undefined);
        hasValue.mockReturnValue(false);

        const result = getTableRows(tableColumns, textResources, data);

        expect(result).toEqual([
            [
                {
                    formData: { data: { nested: 1 } },
                    hideTitle: true,
                    tagName: "td"
                }
            ]
        ]);
    });

    it("should not add texts if emptyFieldText is not present", () => {
        const tableColumns = [{ dataKey: "foo", props: {}, tagName: "td", textResourceBindings: {} }];
        const textResources = [];
        const data = [{ foo: "bar" }];

        getValueFromDataKey.mockReturnValue("bar");
        getTextResourceFromResourceBinding.mockReturnValue(undefined);
        hasValue.mockReturnValue(false);

        const result = getTableRows(tableColumns, textResources, data);

        expect(result[0][0].texts).toBeUndefined();
    });
});
