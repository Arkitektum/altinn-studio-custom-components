import { getFormDataValue } from "./functions";
import { formatString } from "../../../functions/dataFormatHelpers.js";
import { getEmptyFieldText, hasValue } from "../../../functions/helpers.js";

jest.mock("../../../functions/dataFormatHelpers.js", () => ({
    formatString: jest.fn()
}));

jest.mock("../../../functions/helpers.js", () => ({
    getEmptyFieldText: jest.fn(),
    hasValue: jest.fn()
}));

describe("getFormDataValue", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should return the formatted value when formData.simpleBinding has a value and format is provided", () => {
        const component = {
            formData: { simpleBinding: "12345" },
            format: "formatString"
        };
        hasValue.mockReturnValue(true);
        formatString.mockReturnValue("formattedValue");

        const result = getFormDataValue(component);

        expect(hasValue).toHaveBeenCalledWith("12345");
        expect(formatString).toHaveBeenCalledWith("12345", "formatString");
        expect(result).toBe("formattedValue");
    });

    it("should return the simpleBinding value when formData.simpleBinding has a value and no format is provided", () => {
        const component = {
            formData: { simpleBinding: "12345" }
        };
        hasValue.mockReturnValue(true);

        const result = getFormDataValue(component);

        expect(hasValue).toHaveBeenCalledWith("12345");
        expect(result).toBe("12345");
    });

    it("should return the empty field text when formData.simpleBinding has no value", () => {
        const component = {
            formData: { simpleBinding: null },
            texts: { emptyFieldText: "No value" }
        };
        hasValue.mockReturnValue(false);
        getEmptyFieldText.mockReturnValue("No value");

        const result = getFormDataValue(component);

        expect(hasValue).toHaveBeenCalledWith(null);
        expect(getEmptyFieldText).toHaveBeenCalledWith(component);
        expect(result).toBe("No value");
    });

    it("should handle undefined component gracefully and return empty field text", () => {
        const component = undefined;
        getEmptyFieldText.mockReturnValue("No value");

        const result = getFormDataValue(component);

        expect(getEmptyFieldText).toHaveBeenCalledWith(component);
        expect(result).toBe("No value");
    });
});
