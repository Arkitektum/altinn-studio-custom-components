import {
    getTextResourceFromResourceBinding,
    getTextResourcesFromResourceBindings,
    hasValue
} from "@arkitektum/altinn-studio-custom-components-utils";
import CustomComponent from "../CustomComponent.ts";
import CustomSummationData from "./CustomSummationData.ts";
import { getComponentDataValue } from "../../../functions/helpers.ts";

// Mock dependencies
jest.mock("../../../functions/helpers.ts", () => ({
    getComponentDataValue: jest.fn()
}));
jest.mock("@arkitektum/altinn-studio-custom-components-utils", () => ({
    hasValue: jest.fn(),
    getTextResourcesFromResourceBindings: jest.fn(),
    getTextResourceFromResourceBinding: jest.fn()
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

describe("CustomSummationData", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("constructor", () => {
        it("should set isEmpty and resourceValues when data is present", () => {
            const props = {
                resourceBindings: {
                    title: "titleKey",
                    emptyFieldText: "emptyKey"
                }
            };
            const data = [{ resourceValues: { foo: "bar" } }];
            const dataWithResources = [{ resourceValues: { foo: "bar", extra: "baz" } }];

            (getComponentDataValue as unknown as jest.Mock).mockReturnValue(data);
            (getTextResourceFromResourceBinding as unknown as jest.Mock).mockImplementation((key) => `resource:${key}`);
            (getTextResourcesFromResourceBindings as unknown as jest.Mock).mockReturnValue({ extra: "baz" });
            (hasValue as unknown as jest.Mock).mockImplementation((val) => Array.isArray(val) && val.length > 0);

            // Patch prototype to avoid calling super()
            Object.setPrototypeOf(CustomSummationData.prototype, CustomComponent.prototype);

            const instance = new CustomSummationData(props);

            expect(instance.isEmpty).toBe(false);
            expect(instance.resourceValues.title).toBe("resource:titleKey");
            expect(instance.resourceValues.data).toEqual(dataWithResources);
        });

        it("should set isEmpty true and resourceValues.data to emptyFieldText when data is empty", () => {
            const props = {
                resourceBindings: {
                    title: "titleKey",
                    emptyFieldText: "emptyKey"
                }
            };
            (getComponentDataValue as unknown as jest.Mock).mockReturnValue([]);
            (getTextResourceFromResourceBinding as unknown as jest.Mock).mockImplementation((key) => `resource:${key}`);
            (hasValue as unknown as jest.Mock).mockReturnValue(false);

            Object.setPrototypeOf(CustomSummationData.prototype, CustomComponent.prototype);

            const instance = new CustomSummationData(props);

            expect(instance.isEmpty).toBe(true);
            expect(instance.resourceValues.title).toBe("resource:titleKey");
            expect(instance.resourceValues.data).toBe("resource:emptyKey");
        });
    });

    describe("getResourcesForDataItems", () => {
        it("should return empty array if items is not an array", () => {
            const instance = Object.create(CustomSummationData.prototype);
            expect(instance.getResourcesForDataItems(null)).toEqual([]);
            expect(instance.getResourcesForDataItems(undefined)).toEqual([]);
            expect(instance.getResourcesForDataItems({})).toEqual([]);
        });

        it("should merge resourceValues and resourceBindings for each item", () => {
            const items = [
                {
                    resourceValues: { foo: "bar" },
                    resourceBindings: { a: "A" }
                },
                {
                    resourceValues: { baz: "qux" },
                    resourceBindings: { b: "B" }
                }
            ];
            (getTextResourcesFromResourceBindings as unknown as jest.Mock).mockImplementation((bindings) => {
                if (bindings && bindings.a) return { a: "A-value" };
                if (bindings && bindings.b) return { b: "B-value" };
                return {};
            });

            const instance = Object.create(CustomSummationData.prototype);
            const result = instance.getResourcesForDataItems(items);

            expect(result).toEqual([{ resourceValues: { foo: "bar", a: "A-value" } }, { resourceValues: { baz: "qux", b: "B-value" } }]);
        });

        it("should handle an item without resourceBindings", () => {
            // resourceBindings is optional, so a row straight from the data model may not carry any.
            (getTextResourcesFromResourceBindings as unknown as jest.Mock).mockReturnValue({});

            const instance = Object.create(CustomSummationData.prototype);
            const result = instance.getResourcesForDataItems([{ resourceValues: { foo: "bar" } }]);

            expect(result).toEqual([{ resourceValues: { foo: "bar" } }]);
        });

        it("should handle a null item", () => {
            (getTextResourcesFromResourceBindings as unknown as jest.Mock).mockReturnValue({});

            const instance = Object.create(CustomSummationData.prototype);
            const result = instance.getResourcesForDataItems([null, { resourceValues: { foo: "bar" } }]);

            expect(result).toEqual([{ resourceValues: {} }, { resourceValues: { foo: "bar" } }]);
        });
    });

    describe("getValueFromFormData", () => {
        it("should return data with resources if hasValue returns true", () => {
            const props = {};
            const data = [{ resourceValues: { foo: "bar" } }];
            const dataWithResources = [{ resourceValues: { foo: "bar", extra: "baz" } }];

            (getComponentDataValue as unknown as jest.Mock).mockReturnValue(data);
            (hasValue as unknown as jest.Mock).mockReturnValue(true);

            const instance = Object.create(CustomSummationData.prototype);
            jest.spyOn(instance, "getResourcesForDataItems").mockReturnValue(dataWithResources);

            const result = instance.getValueFromFormData(props) as unknown[];
            expect(result).toBe(dataWithResources);
        });

        it("should return empty array if hasValue returns false", () => {
            const props = {};
            (getComponentDataValue as unknown as jest.Mock).mockReturnValue([]);
            (hasValue as unknown as jest.Mock).mockReturnValue(false);

            const instance = Object.create(CustomSummationData.prototype);
            jest.spyOn(instance, "getResourcesForDataItems").mockReturnValue([]);

            const result = instance.getValueFromFormData(props) as unknown[];
            expect(result).toEqual([]);
        });
    });

    describe("hasContent", () => {
        it("should delegate to hasValue", () => {
            const instance = Object.create(CustomSummationData.prototype);
            (hasValue as unknown as jest.Mock).mockReturnValue(true);
            expect(instance.hasContent([1, 2, 3])).toBe(true);

            (hasValue as unknown as jest.Mock).mockReturnValue(false);
            expect(instance.hasContent([])).toBe(false);
        });
    });
});
