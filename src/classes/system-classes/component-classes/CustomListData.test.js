import CustomListData from "./CustomListData";
import { getComponentDataValue, getComponentResourceValue, hasValue } from "../../../functions/helpers.js";

// Mocks
jest.mock("../CustomComponent.js", () => {
    return class {};
});
jest.mock("../../../functions/helpers.js", () => ({
    getComponentDataValue: jest.fn(),
    getComponentResourceValue: jest.fn(),
    hasValue: jest.fn()
}));

describe("CustomListData", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("constructor", () => {
        it("sets isEmpty and resourceValues when data is not empty", () => {
            const props = { title: "Title" };
            const data = ["item1", "item2"];
            getComponentDataValue.mockReturnValue(data);
            hasValue.mockImplementation((val) => (Array.isArray(val) ? val.length > 0 : !!val));
            getComponentResourceValue.mockImplementation((p, key) => (key === "title" ? "MyTitle" : "NotEmptyText"));

            const instance = new CustomListData(props);

            expect(instance.isEmpty).toBe(false);
            expect(instance.resourceValues.title).toBe("MyTitle");
            expect(instance.resourceValues.data).toBe(data);
        });

        it("sets isEmpty and resourceValues when data is empty", () => {
            const props = { title: "Title" };
            const data = [];
            getComponentDataValue.mockReturnValue(data);
            hasValue.mockReturnValue(false);
            getComponentResourceValue.mockImplementation((p, key) => (key === "title" ? "MyTitle" : "EmptyText"));

            const instance = new CustomListData(props);

            expect(instance.isEmpty).toBe(true);
            expect(instance.resourceValues.title).toBe("MyTitle");
            expect(instance.resourceValues.data).toBe("EmptyText");
        });
    });

    describe("hasContent", () => {
        it("returns true if hasValue returns true", () => {
            hasValue.mockReturnValue(true);
            const instance = new CustomListData({});
            expect(instance.hasContent("something")).toBe(true);
        });

        it("returns false if hasValue returns false", () => {
            hasValue.mockReturnValue(false);
            const instance = new CustomListData({});
            expect(instance.hasContent(null)).toBe(false);
        });
    });

    describe("getListItemsFromKey", () => {
        it("returns array of values for given key", () => {
            const items = [{ a: 1 }, { a: 2 }, { a: 3 }];
            const instance = new CustomListData({});
            expect(instance.getListItemsFromKey(items, "a")).toEqual([1, 2, 3]);
        });

        it("returns empty array if items is not array", () => {
            const instance = new CustomListData({});
            expect(instance.getListItemsFromKey(null, "a")).toEqual([]);
        });

        it("returns empty array if items is empty array", () => {
            const instance = new CustomListData({});
            expect(instance.getListItemsFromKey([], "a")).toEqual([]);
        });

        it("returns undefined for missing key", () => {
            const items = [{ b: 1 }];
            const instance = new CustomListData({});
            expect(instance.getListItemsFromKey(items, "a")).toEqual([undefined]);
        });
    });

    describe("getValueFromFormData", () => {
        it("returns list items from key if itemKey is present and hasValue returns true", () => {
            const props = { itemKey: "foo" };
            const data = [{ foo: 1 }, { foo: 2 }];
            getComponentDataValue.mockReturnValue(data);
            hasValue.mockImplementation((val) => !!val);

            const instance = new CustomListData({});
            const result = instance.getValueFromFormData(props);
            expect(result).toEqual([1, 2]);
        });

        it("returns data if itemKey is not present or hasValue returns false", () => {
            const props = {};
            const data = [1, 2, 3];
            getComponentDataValue.mockReturnValue(data);
            hasValue.mockReturnValue(false);

            const instance = new CustomListData({});
            const result = instance.getValueFromFormData(props);
            expect(result).toBe(data);
        });
    });
});
