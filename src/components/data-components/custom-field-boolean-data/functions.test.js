import { getBooleanData, getFormDataValue } from "./functions";
import { getEmptyFieldText, hasValue, validateFormData } from "../../../functions/helpers.js";

jest.mock("../../../functions/helpers.js");

describe("getBooleanData", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should return trueData when condition is true", () => {
        const component = {
            id: "test-component",
            formData: {
                simpleBinding: true,
                trueData: "True Value",
                falseData: "False Value",
                defaultData: "Default Value"
            }
        };
        validateFormData.mockImplementation(() => {});
        const result = getBooleanData(component);
        expect(result).toBe("True Value");
        expect(validateFormData).toHaveBeenCalledWith(
            {
                trueData: "True Value",
                falseData: "False Value",
                defaultData: "Default Value"
            },
            ["trueData", "falseData", "defaultData"],
            "test-component"
        );
    });

    it("should return falseData when condition is false", () => {
        const component = {
            id: "test-component",
            formData: {
                simpleBinding: false,
                trueData: "True Value",
                falseData: "False Value",
                defaultData: "Default Value"
            }
        };
        validateFormData.mockImplementation(() => {});
        const result = getBooleanData(component);
        expect(result).toBe("False Value");
    });

    it("should return defaultData when condition is neither true nor false", () => {
        const component = {
            id: "test-component",
            formData: {
                simpleBinding: null,
                trueData: "True Value",
                falseData: "False Value",
                defaultData: "Default Value"
            }
        };
        validateFormData.mockImplementation(() => {});
        const result = getBooleanData(component);
        expect(result).toBe("Default Value");
    });

    it("should throw an error if form data validation fails", () => {
        const component = {
            id: "test-component",
            formData: {
                simpleBinding: true,
                trueData: "True Value",
                falseData: "False Value",
                defaultData: "Default Value"
            }
        };
        validateFormData.mockImplementation(() => {
            throw new Error("Validation failed");
        });
        expect(() => getBooleanData(component)).toThrow("Validation failed");
    });
});

describe("getFormDataValue", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should return resultData if it has a value", () => {
        const component = { id: "test-component" };
        const resultData = "Some Value";
        hasValue.mockReturnValue(true);
        const result = getFormDataValue(component, resultData);
        expect(result).toBe("Some Value");
        expect(hasValue).toHaveBeenCalledWith(resultData);
    });

    it("should return empty field text if resultData has no value", () => {
        const component = { id: "test-component" };
        const resultData = null;
        hasValue.mockReturnValue(false);
        getEmptyFieldText.mockReturnValue("Empty Field");
        const result = getFormDataValue(component, resultData);
        expect(result).toBe("Empty Field");
        expect(getEmptyFieldText).toHaveBeenCalledWith(component);
    });
});
