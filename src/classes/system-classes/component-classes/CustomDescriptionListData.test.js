import CustomDescriptionListData from "./CustomDescriptionListData";
import { getComponentDataValue, getComponentResourceValue, hasValue } from "../../../functions/helpers.js";

// Mock dependencies
jest.mock("../../../functions/helpers.js", () => ({
    getComponentDataValue: jest.fn(),
    getComponentResourceValue: jest.fn(),
    hasValue: jest.fn()
}));

// Mock CustomComponent base class
jest.mock("../CustomComponent.js", () => ({
    __esModule: true,
    default: class CustomComponent {}
}));

describe("CustomDescriptionListData", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("constructor", () => {
        it("should set isEmpty and resourceValues when data is present", () => {
            const props = { formData: [1, 2, 3] };
            const data = [1, 2, 3];
            getComponentDataValue.mockReturnValue(data);
            hasValue.mockImplementation((val) => Array.isArray(val) && val.length > 0);
            getComponentResourceValue.mockImplementation((p, key) => `resource_${key}`);
            getComponentResourceValue.mockImplementation((_, key) => `resource_${key}`);
            const instance = new CustomDescriptionListData(props);

            expect(instance.isEmpty).toBe(false);
            expect(instance.resourceValues).toEqual({
                title: "resource_title",
                data: data
            });
        });

        it("should set isEmpty true and use emptyFieldText when data is empty", () => {
            const props = { formData: [] };
            const data = [];
            getComponentDataValue.mockReturnValue(data);
            hasValue.mockReturnValue(false);
            getComponentResourceValue.mockImplementation((p, key) => `resource_${key}`);

            const instance = new CustomDescriptionListData(props);

            expect(instance.isEmpty).toBe(true);
            expect(instance.resourceValues).toEqual({
                title: "resource_title",
                data: "resource_emptyFieldText"
            });
        });

        it("should not set title if hideTitle is true", () => {
            const props = { formData: [1], hideTitle: true };
            getComponentDataValue.mockReturnValue([1]);
            hasValue.mockReturnValue(true);
            getComponentResourceValue.mockImplementation((p, key) => `resource_${key}`);

            const instance = new CustomDescriptionListData(props);

            expect(instance.resourceValues.title).toBe(false);
        });
    });

    describe("hasContent", () => {
        it("should delegate to hasValue", () => {
            const instance = new CustomDescriptionListData({});
            hasValue.mockReturnValue(true);
            expect(instance.hasContent("abc")).toBe(true);
            expect(hasValue).toHaveBeenCalledWith("abc");
        });
    });

    describe("getDescriptionListItemsFromKeys", () => {
        it("should transform items using keys", () => {
            const instance = new CustomDescriptionListData({});
            const items = [
                { a: { data: "term1" }, b: { data: "desc1" } },
                { a: { data: "term2" }, b: { data: "desc2" } }
            ];
            const result = instance.getDescriptionListItemsFromKeys(items, "a", "b");
            expect(result).toEqual([
                { term: "term1", description: "desc1" },
                { term: "term2", description: "desc2" }
            ]);
        });

        it("should return empty array if items is not array", () => {
            const instance = new CustomDescriptionListData({});
            expect(instance.getDescriptionListItemsFromKeys(null, "a", "b")).toEqual([]);
            expect(instance.getDescriptionListItemsFromKeys([], "a", "b")).toEqual([]);
        });

        it("should handle missing keys gracefully", () => {
            const instance = new CustomDescriptionListData({});
            const items = [{}, { a: { data: "term" } }];
            const result = instance.getDescriptionListItemsFromKeys(items, "a", "b");
            expect(result).toEqual([
                { term: undefined, description: undefined },
                { term: "term", description: undefined }
            ]);
        });
    });

    describe("getValueFromFormData", () => {
        it("should return description list items if itemTermKey or itemDescriptionKey is present", () => {
            const instance = new CustomDescriptionListData({});
            const props = {
                formData: [{ foo: { data: "bar" }, baz: { data: "qux" } }],
                itemTermKey: "foo",
                itemDescriptionKey: "baz"
            };
            getComponentDataValue.mockReturnValue(props.formData);
            hasValue.mockImplementation((val) => !!val);

            const spy = jest.spyOn(instance, "getDescriptionListItemsFromKeys");
            const result = instance.getValueFromFormData(props);

            expect(spy).toHaveBeenCalledWith(props.formData, "foo", "baz");
            expect(result).toEqual([{ term: "bar", description: "qux" }]);
        });

        it("should return raw data if no keys are present", () => {
            const instance = new CustomDescriptionListData({});
            const props = { formData: [1, 2, 3] };
            getComponentDataValue.mockReturnValue(props.formData);
            hasValue.mockReturnValue(false);

            const result = instance.getValueFromFormData(props);
            expect(result).toEqual([1, 2, 3]);
        });
    });
});
