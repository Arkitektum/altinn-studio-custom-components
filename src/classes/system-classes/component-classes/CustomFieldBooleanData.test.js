import CustomFieldBooleanData from "./CustomFieldBooleanData";

// Mock dependencies
jest.mock("../../../functions/helpers.js", () => ({
    getComponentBooleanDataValues: jest.fn(),
    getComponentDataValue: jest.fn(),
    getComponentResourceValue: jest.fn(),
    hasValue: jest.fn(),
    isNumberLargerThanZero: jest.fn(),
    validateFormData: jest.fn()
}));

const {
    getComponentBooleanDataValues,
    getComponentDataValue,
    getComponentResourceValue,
    hasValue,
    isNumberLargerThanZero,
    validateFormData
} = require("../../../functions/helpers.js");

describe("CustomFieldBooleanData", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should set resourceValues.data to trueData when condition is true", () => {
        getComponentDataValue.mockReturnValue(true);
        isNumberLargerThanZero.mockReturnValue(false);
        getComponentBooleanDataValues.mockReturnValue({
            trueData: "True Value",
            falseData: "False Value",
            defaultData: "Default Value"
        });
        getComponentResourceValue.mockImplementation((props, key) => props[key]);
        hasValue.mockReturnValue(true);

        const props = { id: "test", title: "Title", emptyFieldText: "Empty" };
        const instance = new CustomFieldBooleanData(props);

        expect(instance.resourceValues.data).toBe("True Value");
        expect(instance.isEmpty).toBe(false);
    });

    it("should set resourceValues.data to falseData when condition is false", () => {
        getComponentDataValue.mockReturnValue(false);
        isNumberLargerThanZero.mockReturnValue(false);
        getComponentBooleanDataValues.mockReturnValue({
            trueData: "True Value",
            falseData: "False Value",
            defaultData: "Default Value"
        });
        getComponentResourceValue.mockImplementation((props, key) => props[key]);
        hasValue.mockReturnValue(true);

        const props = { id: "test", title: "Title", emptyFieldText: "Empty" };
        const instance = new CustomFieldBooleanData(props);

        expect(instance.resourceValues.data).toBe("False Value");
        expect(instance.isEmpty).toBe(false);
    });

    it("should set resourceValues.data to defaultData when condition is neither true nor false", () => {
        getComponentDataValue.mockReturnValue(undefined);
        isNumberLargerThanZero.mockReturnValue(false);
        getComponentBooleanDataValues.mockReturnValue({
            trueData: "True Value",
            falseData: "False Value",
            defaultData: "Default Value"
        });
        getComponentResourceValue.mockImplementation((props, key) => props[key]);
        hasValue.mockReturnValue(true);

        const props = { id: "test", title: "Title", emptyFieldText: "Empty" };
        const instance = new CustomFieldBooleanData(props);

        expect(instance.resourceValues.data).toBe("Default Value");
        expect(instance.isEmpty).toBe(false);
    });

    it("should set resourceValues.data to trueData when condition is a number larger than zero", () => {
        getComponentDataValue.mockReturnValue(5);
        isNumberLargerThanZero.mockReturnValue(true);
        getComponentBooleanDataValues.mockReturnValue({
            trueData: "True Value",
            falseData: "False Value",
            defaultData: "Default Value"
        });
        getComponentResourceValue.mockImplementation((props, key) => props[key]);
        hasValue.mockReturnValue(true);

        const props = { id: "test", title: "Title", emptyFieldText: "Empty" };
        const instance = new CustomFieldBooleanData(props);

        expect(instance.resourceValues.data).toBe("True Value");
        expect(instance.isEmpty).toBe(false);
    });

    it("should set resourceValues.data to emptyFieldText when data is empty", () => {
        getComponentDataValue.mockReturnValue(true);
        isNumberLargerThanZero.mockReturnValue(false);
        getComponentBooleanDataValues.mockReturnValue({
            trueData: "",
            falseData: "False Value",
            defaultData: "Default Value"
        });
        getComponentResourceValue.mockImplementation((props, key) => props[key]);
        hasValue.mockReturnValue(false);

        const props = { id: "test", title: "Title", emptyFieldText: "Empty" };
        const instance = new CustomFieldBooleanData(props);

        expect(instance.resourceValues.data).toBe("Empty");
        expect(instance.isEmpty).toBe(true);
    });

    it("hasContent should return result of hasValue", () => {
        hasValue.mockReturnValue(true);
        const instance = new CustomFieldBooleanData({ id: "test" });
        expect(instance.hasContent("some data")).toBe(true);

        hasValue.mockReturnValue(false);
        expect(instance.hasContent("")).toBe(false);
    });

    it("getValueFromFormData should validate form data keys", () => {
        getComponentDataValue.mockReturnValue(true);
        isNumberLargerThanZero.mockReturnValue(false);
        getComponentBooleanDataValues.mockReturnValue({
            trueData: "True Value",
            falseData: "False Value",
            defaultData: "Default Value"
        });
        getComponentResourceValue.mockImplementation((props, key) => props[key]);
        hasValue.mockReturnValue(true);

        const props = { id: "test", title: "Title", emptyFieldText: "Empty" };
        new CustomFieldBooleanData(props);

        expect(validateFormData).toHaveBeenCalledWith(
            {
                trueData: "True Value",
                falseData: "False Value",
                defaultData: "Default Value"
            },
            ["trueData", "falseData", "defaultData"],
            "test"
        );
    });
});
