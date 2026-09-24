import type { ComponentProps } from "../../../types.ts";

import { getComponentDataValue, getComponentResourceValue } from "../../../functions/helpers.ts";
import CustomListData from "./CustomListData.ts";
import { hasValue } from "@arkitektum/altinn-studio-custom-components-utils";

// Mocks
jest.mock("../CustomComponent.ts", () => {
    const { hasValue } = require("@arkitektum/altinn-studio-custom-components-utils");
    const { hasMissingTextResources } = require("../../../functions/validations.ts");
    return class {
        hasContent(data: unknown) {
            return hasValue(data);
        }
        getValidationMessages(resourceBindings: unknown) {
            return hasMissingTextResources(resourceBindings);
        }
    };
});
jest.mock("../../../functions/helpers.ts", () => ({
    getComponentDataValue: jest.fn(),
    getComponentResourceValue: jest.fn()
}));
jest.mock("@arkitektum/altinn-studio-custom-components-utils", () => ({
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
            (getComponentDataValue as unknown as jest.Mock).mockReturnValue(data);
            (hasValue as unknown as jest.Mock).mockImplementation((val) => (Array.isArray(val) ? val.length > 0 : !!val));
            (getComponentResourceValue as unknown as jest.Mock).mockImplementation((p, key) => (key === "title" ? "MyTitle" : "NotEmptyText"));

            const instance = new CustomListData(props as unknown as ComponentProps);

            expect(instance.isEmpty).toBe(false);
            expect(instance.resourceValues.title).toBe("MyTitle");
            expect(instance.resourceValues.data).toBe(data);
        });

        it("sets isEmpty and resourceValues when data is empty", () => {
            const props = { title: "Title" };
            const data: unknown[] = [];
            (getComponentDataValue as unknown as jest.Mock).mockReturnValue(data);
            (hasValue as unknown as jest.Mock).mockReturnValue(false);
            (getComponentResourceValue as unknown as jest.Mock).mockImplementation((p, key) => (key === "title" ? "MyTitle" : "EmptyText"));

            const instance = new CustomListData(props as unknown as ComponentProps);

            expect(instance.isEmpty).toBe(true);
            expect(instance.resourceValues.title).toBe("MyTitle");
            expect(instance.resourceValues.data).toBe("EmptyText");
        });
    });

    describe("hasContent", () => {
        it("returns true if hasValue returns true", () => {
            (hasValue as unknown as jest.Mock).mockReturnValue(true);
            const instance = new CustomListData({});
            expect(instance.hasContent("something")).toBe(true);
        });

        it("returns false if hasValue returns false", () => {
            (hasValue as unknown as jest.Mock).mockReturnValue(false);
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
            (getComponentDataValue as unknown as jest.Mock).mockReturnValue(data);
            (hasValue as unknown as jest.Mock).mockImplementation((val) => !!val);

            const instance = new CustomListData({});
            const result = instance.getValueFromFormData(props) as unknown[];
            expect(result).toEqual([1, 2]);
        });

        it("returns data if itemKey is not present or hasValue returns false", () => {
            const props = {};
            const data = [1, 2, 3];
            (getComponentDataValue as unknown as jest.Mock).mockReturnValue(data);
            (hasValue as unknown as jest.Mock).mockReturnValue(false);

            const instance = new CustomListData({});
            const result = instance.getValueFromFormData(props) as unknown[];
            expect(result).toBe(data);
        });
    });
});
