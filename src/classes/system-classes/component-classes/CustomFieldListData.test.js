import CustomFieldListData from "./CustomFieldListData";
import { getComponentDataValue, hasValue } from "../../../functions/helpers.js";

// Mocks for dependencies
jest.mock("../../../functions/helpers.js", () => ({
    getComponentDataValue: jest.fn((props) => props.data),
    hasValue: jest.fn((val) => {
        if (Array.isArray(val)) return val.length > 0;
        return val !== undefined && val !== null && val !== "";
    })
}));

describe("CustomFieldListData", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("constructor", () => {
        it("should set isEmpty to true if data is empty", () => {
            getComponentDataValue.mockReturnValue([]);
            const instance = new CustomFieldListData({ data: [], dataItemKey: "id", dataTitleItemKey: "name" });
            expect(instance.isEmpty).toBe(true);
            expect(instance.resourceValues).toBeUndefined();
        });

        it("should set resourceValues if data is a non-empty array", () => {
            const data = [{ id: 1, name: "A" }];
            getComponentDataValue.mockReturnValue(data);
            const instance = new CustomFieldListData({ data, dataItemKey: "id", dataTitleItemKey: "name" });
            expect(instance.isEmpty).toBe(false);
            expect(instance.resourceValues).toEqual({ data: [{ title: "A", data: 1 }] });
        });
    });

    describe("hasContent", () => {
        it("should return true for non-empty values", () => {
            const instance = new CustomFieldListData({});
            expect(instance.hasContent("abc")).toBe(true);
            expect(instance.hasContent([1])).toBe(true);
            expect(instance.hasContent(0)).toBe(true);
        });

        it("should return false for empty values", () => {
            const instance = new CustomFieldListData({});
            expect(instance.hasContent("")).toBe(false);
            expect(instance.hasContent(null)).toBe(false);
            expect(instance.hasContent(undefined)).toBe(false);
            expect(instance.hasContent([])).toBe(false);
        });
    });

    describe("getListItemsFromKey", () => {
        it("should extract values using a simple key", () => {
            const instance = new CustomFieldListData({});
            const items = [{ id: 1 }, { id: 2 }];
            expect(instance.getListItemsFromKey(items, "id")).toEqual([1, 2]);
        });

        it("should extract nested values using dot notation", () => {
            const instance = new CustomFieldListData({});
            const items = [{ user: { name: "A" } }, { user: { name: "B" } }];
            expect(instance.getListItemsFromKey(items, "user.name")).toEqual(["A", "B"]);
        });

        it("should return empty array if items is not an array or empty", () => {
            const instance = new CustomFieldListData({});
            expect(instance.getListItemsFromKey(null, "id")).toEqual([]);
            expect(instance.getListItemsFromKey([], "id")).toEqual([]);
        });

        it("should return undefined for missing nested keys", () => {
            const instance = new CustomFieldListData({});
            const items = [{ user: {} }, {}];
            expect(instance.getListItemsFromKey(items, "user.name")).toEqual([undefined, undefined]);
        });
    });

    describe("getValueFromFormData", () => {
        it("should return array of {title, data} when both keys are present", () => {
            const instance = new CustomFieldListData({});
            const props = {
                data: [
                    { id: 1, name: "A" },
                    { id: 2, name: "B" }
                ],
                dataItemKey: "id",
                dataTitleItemKey: "name"
            };
            getComponentDataValue.mockReturnValue(props.data);
            hasValue.mockImplementation((val) => !!val);
            jest.spyOn(instance, "hasContent").mockImplementation((val) => !!val);

            const result = instance.getValueFromFormData(props);
            expect(result).toEqual([
                { title: "A", data: 1 },
                { title: "B", data: 2 }
            ]);
        });

        it("should return undefined if keys are missing", () => {
            const instance = new CustomFieldListData({});
            const props = { data: [{ id: 1 }], dataItemKey: "", dataTitleItemKey: "" };
            getComponentDataValue.mockReturnValue(props.data);
            hasValue.mockReturnValue(false);
            jest.spyOn(instance, "hasContent").mockReturnValue(false);

            const result = instance.getValueFromFormData(props);
            expect(result).toBeUndefined();
        });

        it("should handle different lengths of titles and items", () => {
            const instance = new CustomFieldListData({});
            const props = {
                data: [
                    { id: 1, name: "A" },
                    { id: 2, name: "B" },
                    { id: 3, name: "C" }
                ],
                dataItemKey: "id",
                dataTitleItemKey: "name"
            };
            getComponentDataValue.mockReturnValue(props.data);
            hasValue.mockImplementation((val) => !!val);
            jest.spyOn(instance, "hasContent").mockImplementation((val) => !!val);

            // Simulate getListItemsFromKey returning different lengths
            jest.spyOn(instance, "getListItemsFromKey")
                .mockImplementationOnce(() => ["A", "B"]) // titles
                .mockImplementationOnce(() => [1, 2, 3]); // items

            const result = instance.getValueFromFormData(props);
            expect(result).toEqual([
                { title: "A", data: 1 },
                { title: "B", data: 2 }
            ]);
        });
    });
});
