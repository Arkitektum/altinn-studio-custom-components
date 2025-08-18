import CustomParagraphTextData from "./CustomParagraphTextData";
import { getComponentDataValue, getComponentResourceValue, hasValue } from "../../../functions/helpers.js";
import { formatString } from "../../../functions/dataFormatHelpers.js";

// Mocks
jest.mock("../../../functions/helpers.js", () => ({
    getComponentDataValue: jest.fn(),
    getComponentResourceValue: jest.fn(),
    hasValue: jest.fn()
}));
jest.mock("../../../functions/dataFormatHelpers.js", () => ({
    formatString: jest.fn()
}));

// Dummy parent class
class CustomComponent {}

describe("CustomParagraphTextData", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should set isEmpty to true and use emptyFieldText when formData is empty", () => {
        getComponentDataValue.mockReturnValue("");
        formatString.mockReturnValue("");
        getComponentResourceValue.mockImplementation((props, key) => {
            if (key === "body") return "Body text";
            if (key === "emptyFieldText") return "No content";
            return "";
        });
        hasValue.mockReturnValue(false);

        const props = { format: undefined };
        const instance = new CustomParagraphTextData(props);

        expect(instance.isEmpty).toBe(true);
        expect(instance.resourceValues.title).toBe("No content");
    });

    it("should set isEmpty to false and combine body and formData when formData has value", () => {
        getComponentDataValue.mockReturnValue("Some data");
        formatString.mockReturnValue("Some data");
        getComponentResourceValue.mockImplementation((props, key) => {
            if (key === "body") return "Body text";
            if (key === "emptyFieldText") return "No content";
            return "";
        });
        hasValue.mockReturnValue(true);

        const props = { format: undefined };
        const instance = new CustomParagraphTextData(props);

        expect(instance.isEmpty).toBe(false);
        expect(instance.resourceValues.title).toBe("Body text Some data.");
    });

    it("hasContent returns true if hasValue returns true", () => {
        hasValue.mockReturnValue(true);
        const instance = new CustomParagraphTextData({});
        expect(instance.hasContent("abc")).toBe(true);
    });

    it("hasContent returns false if hasValue returns false", () => {
        hasValue.mockReturnValue(false);
        const instance = new CustomParagraphTextData({});
        expect(instance.hasContent("")).toBe(false);
    });

    it("getTextDataCombination returns combined string with period", () => {
        const instance = new CustomParagraphTextData({});
        expect(instance.getTextDataCombination("foo", "bar")).toBe("bar foo.");
    });

    it("getTextDataCombination returns empty string if both inputs are empty", () => {
        const instance = new CustomParagraphTextData({});
        expect(instance.getTextDataCombination("", "")).toBe("");
    });

    it("getValueFromFormData returns formatted string from helpers", () => {
        getComponentDataValue.mockReturnValue("raw");
        formatString.mockReturnValue("formatted");
        const instance = new CustomParagraphTextData({});
        expect(instance.getValueFromFormData({ format: "upper" })).toBe("formatted");
        expect(getComponentDataValue).toHaveBeenCalled();
        expect(formatString).toHaveBeenCalledWith("raw", "upper");
    });
});
