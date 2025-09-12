import CustomSummationData from "./CustomSummationData";
import {
    getComponentDataValue,
    getTextResourceFromResourceBinding,
    getTextResourcesFromResourceBindings,
    hasValue
} from "../../../functions/helpers.js";

// Mock dependencies
jest.mock("../../../functions/helpers.js", () => ({
    getComponentDataValue: jest.fn(),
    getTextResourceFromResourceBinding: jest.fn(),
    getTextResourcesFromResourceBindings: jest.fn(),
    hasValue: jest.fn()
}));

// Mock CustomComponent base class
jest.mock("../CustomComponent.js", () => {
    class CustomComponent {}
    return {
        __esModule: true,
        default: CustomComponent
    };
});
import CustomComponent from "../CustomComponent.js";

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

            getComponentDataValue.mockReturnValue(data);
            getTextResourceFromResourceBinding.mockImplementation((key) => `resource:${key}`);
            getTextResourcesFromResourceBindings.mockReturnValue({ extra: "baz" });
            hasValue.mockImplementation((val) => Array.isArray(val) && val.length > 0);

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
            getComponentDataValue.mockReturnValue([]);
            getTextResourceFromResourceBinding.mockImplementation((key) => `resource:${key}`);
            hasValue.mockReturnValue(false);

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
            getTextResourcesFromResourceBindings.mockImplementation((bindings) => {
                if (bindings && bindings.a) return { a: "A-value" };
                if (bindings && bindings.b) return { b: "B-value" };
                return {};
            });

            const instance = Object.create(CustomSummationData.prototype);
            const result = instance.getResourcesForDataItems(items);

            expect(result).toEqual([{ resourceValues: { foo: "bar", a: "A-value" } }, { resourceValues: { baz: "qux", b: "B-value" } }]);
        });
    });

    describe("getValueFromFormData", () => {
        it("should return data with resources if hasValue returns true", () => {
            const props = {};
            const data = [{ resourceValues: { foo: "bar" } }];
            const dataWithResources = [{ resourceValues: { foo: "bar", extra: "baz" } }];

            getComponentDataValue.mockReturnValue(data);
            hasValue.mockReturnValue(true);

            const instance = Object.create(CustomSummationData.prototype);
            jest.spyOn(instance, "getResourcesForDataItems").mockReturnValue(dataWithResources);

            const result = instance.getValueFromFormData(props);
            expect(result).toBe(dataWithResources);
        });

        it("should return empty array if hasValue returns false", () => {
            const props = {};
            getComponentDataValue.mockReturnValue([]);
            hasValue.mockReturnValue(false);

            const instance = Object.create(CustomSummationData.prototype);
            jest.spyOn(instance, "getResourcesForDataItems").mockReturnValue([]);

            const result = instance.getValueFromFormData(props);
            expect(result).toEqual([]);
        });
    });

    describe("hasContent", () => {
        it("should delegate to hasValue", () => {
            const instance = Object.create(CustomSummationData.prototype);
            hasValue.mockReturnValue(true);
            expect(instance.hasContent([1, 2, 3])).toBe(true);

            hasValue.mockReturnValue(false);
            expect(instance.hasContent([])).toBe(false);
        });
    });
});
