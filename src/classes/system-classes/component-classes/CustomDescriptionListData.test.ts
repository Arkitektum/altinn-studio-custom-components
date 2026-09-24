import type { ComponentProps } from "../../../types.ts";

import { getComponentDataValue, getComponentResourceValue } from "../../../functions/helpers.ts";
import CustomDescriptionListData from "./CustomDescriptionListData.ts";
import { hasValue } from "@arkitektum/altinn-studio-custom-components-utils";

// Mock dependencies
jest.mock("../../../functions/helpers.ts", () => ({
    getComponentDataValue: jest.fn(),
    getComponentResourceValue: jest.fn()
}));

jest.mock("@arkitektum/altinn-studio-custom-components-utils", () => ({
    hasValue: jest.fn()
}));

// Mock CustomComponent base class
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

describe("CustomDescriptionListData", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("constructor", () => {
        it("should set isEmpty and resourceValues when data is present", () => {
            const props = { formData: [1, 2, 3] } as unknown as ComponentProps;
            const data = [1, 2, 3];
            (getComponentDataValue as unknown as jest.Mock).mockReturnValue(data);
            (hasValue as unknown as jest.Mock).mockImplementation((val) => Array.isArray(val) && val.length > 0);
            (getComponentResourceValue as unknown as jest.Mock).mockImplementation((p, key) => `resource_${key}`);
            (getComponentResourceValue as unknown as jest.Mock).mockImplementation((_, key) => `resource_${key}`);
            const instance = new CustomDescriptionListData(props);

            expect(instance.isEmpty).toBe(false);
            expect(instance.resourceValues).toEqual({
                title: "resource_title",
                data: data
            });
        });

        it("should set isEmpty true and use emptyFieldText when data is empty", () => {
            const props = { formData: [] } as unknown as ComponentProps;
            const data: unknown[] = [];
            (getComponentDataValue as unknown as jest.Mock).mockReturnValue(data);
            (hasValue as unknown as jest.Mock).mockReturnValue(false);
            (getComponentResourceValue as unknown as jest.Mock).mockImplementation((p, key) => `resource_${key}`);

            const instance = new CustomDescriptionListData(props);

            expect(instance.isEmpty).toBe(true);
            expect(instance.resourceValues).toEqual({
                title: "resource_title",
                data: "resource_emptyFieldText"
            });
        });

        it("should not set title if hideTitle is true", () => {
            const props = { formData: [1], hideTitle: true } as unknown as ComponentProps;
            (getComponentDataValue as unknown as jest.Mock).mockReturnValue([1]);
            (hasValue as unknown as jest.Mock).mockReturnValue(true);
            (getComponentResourceValue as unknown as jest.Mock).mockImplementation((p, key) => `resource_${key}`);

            const instance = new CustomDescriptionListData(props);

            expect(instance.resourceValues.title).toBe(false);
        });
    });

    describe("hasContent", () => {
        it("should delegate to hasValue", () => {
            const instance = new CustomDescriptionListData({});
            (hasValue as unknown as jest.Mock).mockReturnValue(true);
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
            } as unknown as ComponentProps;
            (getComponentDataValue as unknown as jest.Mock).mockReturnValue(props.formData);
            (hasValue as unknown as jest.Mock).mockImplementation((val) => !!val);

            const spy = jest.spyOn(instance, "getDescriptionListItemsFromKeys");
            const result = instance.getValueFromFormData(props);

            expect(spy).toHaveBeenCalledWith(props.formData, "foo", "baz");
            expect(result).toEqual([{ term: "bar", description: "qux" }]);
        });

        it("should return raw data if no keys are present", () => {
            const instance = new CustomDescriptionListData({});
            const props = { formData: [1, 2, 3] } as unknown as ComponentProps;
            (getComponentDataValue as unknown as jest.Mock).mockReturnValue(props.formData);
            (hasValue as unknown as jest.Mock).mockReturnValue(false);

            const result = instance.getValueFromFormData(props);
            expect(result).toEqual([1, 2, 3]);
        });
    });
});
