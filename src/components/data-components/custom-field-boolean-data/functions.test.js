import { getBooleanData } from "./functions";
import { validateFormData } from "../../../functions/helpers.js";

jest.mock("../../../functions/helpers.js", () => ({
    validateFormData: jest.fn()
}));

describe("getBooleanData", () => {
    afterEach(() => {
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

        const result = getBooleanData(component);

        expect(validateFormData).toHaveBeenCalledWith(
            {
                trueData: "True Value",
                falseData: "False Value",
                defaultData: "Default Value"
            },
            ["trueData", "falseData", "defaultData"],
            "test-component"
        );
        expect(result).toBe("True Value");
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

        const result = getBooleanData(component);

        expect(validateFormData).toHaveBeenCalledWith(
            {
                trueData: "True Value",
                falseData: "False Value",
                defaultData: "Default Value"
            },
            ["trueData", "falseData", "defaultData"],
            "test-component"
        );
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

        const result = getBooleanData(component);

        expect(validateFormData).toHaveBeenCalledWith(
            {
                trueData: "True Value",
                falseData: "False Value",
                defaultData: "Default Value"
            },
            ["trueData", "falseData", "defaultData"],
            "test-component"
        );
        expect(result).toBe("Default Value");
    });

    it("should use default component name if id is not provided", () => {
        const component = {
            formData: {
                simpleBinding: true,
                trueData: "True Value",
                falseData: "False Value",
                defaultData: "Default Value"
            }
        };

        const result = getBooleanData(component);

        expect(validateFormData).toHaveBeenCalledWith(
            {
                trueData: "True Value",
                falseData: "False Value",
                defaultData: "Default Value"
            },
            ["trueData", "falseData", "defaultData"],
            "custom-field-boolean-text"
        );
        expect(result).toBe("True Value");
    });
});
