import CustomGrouplistUtfallSvarType from "./CustomGrouplistUtfallSvarType";
import { getComponentDataValue, getComponentResourceValue, hasValue } from "../../../functions/helpers.js";
import { hasMissingTextResources } from "../../../functions/validations.js";
import UtfallSvar from "../../data-classes/UtfallSvar.js";

// Mocks
jest.mock("../CustomComponent.js", () => {
    return class {};
});
jest.mock("../../data-classes/UtfallSvar.js", () => {
    return jest.fn().mockImplementation((obj) => ({ ...obj, __isUtfallSvar: true }));
});
jest.mock("../../../functions/helpers.js", () => ({
    getComponentDataValue: jest.fn(),
    getComponentResourceValue: jest.fn(),
    getTextResources: jest.fn(),
    hasValue: jest.fn()
}));
jest.mock("../../../functions/validations.js", () => ({
    hasMissingTextResources: jest.fn()
}));

describe("CustomGrouplistUtfallSvarType", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("constructor", () => {
        it("should set isEmpty and resourceValues when data is empty", () => {
            const props = { hideTitle: false };
            getComponentDataValue.mockReturnValue([]);
            hasValue.mockReturnValue(false);
            getComponentResourceValue.mockImplementation((p, key) => `resource_${key}`);

            const instance = new CustomGrouplistUtfallSvarType(props);

            expect(instance.isEmpty).toBe(true);
            expect(instance.resourceValues.data).toBe("resource_emptyFieldText");
        });

        it("should set resourceValues.data to grouped data when not empty", () => {
            const props = { hideTitle: false };
            const groupedData = { foo: [new UtfallSvar({ utfallType: { kodeverdi: "foo" } })] };
            getComponentDataValue.mockReturnValue([
                {
                    utfallType: { kodeverdi: "foo" }
                }
            ]);
            hasValue.mockReturnValue(true);
            getComponentResourceValue.mockImplementation((p, key) => `resource_${key}`);

            const instance = new CustomGrouplistUtfallSvarType(props);

            expect(instance.isEmpty).toBe(false);
            expect(instance.resourceValues.data).toEqual(groupedData);
        });
    });

    describe("hasContent", () => {
        it("should return true if hasValue returns true", () => {
            hasValue.mockReturnValue(true);
            const instance = new CustomGrouplistUtfallSvarType({});
            expect(instance.hasContent("data")).toBe(true);
        });

        it("should return false if hasValue returns false", () => {
            hasValue.mockReturnValue(false);
            const instance = new CustomGrouplistUtfallSvarType({});
            expect(instance.hasContent(null)).toBe(false);
        });
    });

    describe("getValidationMessages", () => {
        it("should call hasMissingTextResources with textResources and resourceBindings", () => {
            const instance = new CustomGrouplistUtfallSvarType({});
            const resourceBindings = { title: "someTitle" };
            hasMissingTextResources.mockReturnValue(["missing"]);

            const result = instance.getValidationMessages(resourceBindings);

            expect(hasMissingTextResources).toHaveBeenCalledWith(resourceBindings);
            expect(result).toEqual(["missing"]);
        });
    });

    describe("getValueFromFormData", () => {
        it("should group array items by utfallType.kodeverdi", () => {
            const instance = new CustomGrouplistUtfallSvarType({});
            const array = [
                { utfallType: { kodeverdi: "A" }, foo: 1 },
                { utfallType: { kodeverdi: "B" }, foo: 2 },
                { utfallType: { kodeverdi: "A" }, foo: 3 },
                { utfallType: { kodeverdi: "" }, foo: 4 },
                { foo: 5 }
            ];
            getComponentDataValue.mockReturnValue(array);
            hasValue.mockReturnValue(true);

            const result = instance.getValueFromFormData({});

            expect(result.A.length).toBe(2);
            expect(result.B.length).toBe(1);
            expect(result.A[0].foo).toBe(1);
            expect(result.A[1].foo).toBe(3);
            expect(result.B[0].foo).toBe(2);
            expect(result).not.toHaveProperty("");
        });

        it("should return empty object if array is empty or has no value", () => {
            const instance = new CustomGrouplistUtfallSvarType({});
            getComponentDataValue.mockReturnValue([]);
            hasValue.mockReturnValue(false);

            const result = instance.getValueFromFormData({});
            expect(result).toEqual({});
        });
    });

    describe("groupArrayItemsByUtfallType", () => {
        it("should group items by utfallType.kodeverdi", () => {
            const instance = new CustomGrouplistUtfallSvarType({});
            hasValue.mockReturnValue(true);
            const array = [
                { utfallType: { kodeverdi: "X" }, bar: 1 },
                { utfallType: { kodeverdi: "Y" }, bar: 2 },
                { utfallType: { kodeverdi: "X" }, bar: 3 }
            ];
            const result = instance.groupArrayItemsByUtfallType(array);

            expect(result.X.length).toBe(2);
            expect(result.Y.length).toBe(1);
            expect(result.X[0].bar).toBe(1);
            expect(result.X[1].bar).toBe(3);
            expect(result.Y[0].bar).toBe(2);
        });

        it("should skip items without utfallType.kodeverdi", () => {
            const instance = new CustomGrouplistUtfallSvarType({});
            hasValue.mockReturnValue(true);
            const array = [{ utfallType: { kodeverdi: "" }, bar: 1 }, { bar: 2 }];
            const result = instance.groupArrayItemsByUtfallType(array);

            expect(result).toEqual({});
        });

        it("should return empty object if array is falsy", () => {
            const instance = new CustomGrouplistUtfallSvarType({});
            hasValue.mockReturnValue(false);
            const result = instance.groupArrayItemsByUtfallType(null);
            expect(result).toEqual({});
        });
    });
});
