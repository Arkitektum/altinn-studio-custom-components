import CustomParagraphTextData from "./CustomParagraphTextData.js";
import { getComponentDataValue, getComponentResourceValue, hasValue } from "../../../functions/helpers.js";
import { formatString } from "../../../functions/dataFormatHelpers.js";

// Mock dependencies
jest.mock("../../../functions/helpers.js", () => ({
    getComponentDataValue: jest.fn(),
    getComponentResourceValue: jest.fn(),
    hasValue: jest.fn()
}));
jest.mock("../../../functions/dataFormatHelpers.js", () => ({
    formatString: jest.fn()
}));

// Minimal CustomComponent mock
class CustomComponent {}

describe("CustomParagraphTextData", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should set resourceValues.title to combined data when formData is present", () => {
        getComponentDataValue.mockReturnValue("myFormData");
        formatString.mockImplementation((data) => data); // no formatting
        getComponentResourceValue.mockImplementation((props, key) => {
            if (key === "body") return "BodyText";
            if (key === "emptyFieldText") return "EmptyText";
            return "";
        });
        hasValue.mockImplementation((val) => !!val);

        const props = { endSymbol: "." };
        const instance = new CustomParagraphTextData(props);

        expect(instance.isEmpty).toBe(false);
        expect(instance.resourceValues.title).toBe("BodyText myFormData.");
    });

    it("should set resourceValues.title to emptyFieldText when formData is empty", () => {
        getComponentDataValue.mockReturnValue("");
        formatString.mockReturnValue("");
        getComponentResourceValue.mockImplementation((props, key) => {
            if (key === "body") return "BodyText";
            if (key === "emptyFieldText") return "EmptyText";
            return "";
        });
        hasValue.mockImplementation((val) => !!val);

        const props = { endSymbol: "." };
        const instance = new CustomParagraphTextData(props);

        expect(instance.isEmpty).toBe(true);
        expect(instance.resourceValues.title).toBe("EmptyText");
    });

    it("should handle missing endSymbol gracefully", () => {
        getComponentDataValue.mockReturnValue("data");
        formatString.mockReturnValue("data");
        getComponentResourceValue.mockImplementation((props, key) => {
            if (key === "body") return "Body";
            if (key === "emptyFieldText") return "Empty";
            return "";
        });
        hasValue.mockImplementation((val) => !!val);

        const props = {}; // no endSymbol
        const instance = new CustomParagraphTextData(props);

        expect(instance.resourceValues.title).toBe("Body data");
    });

    it("hasContent should delegate to hasValue", () => {
        hasValue.mockReturnValue(true);
        const instance = new CustomParagraphTextData({});
        expect(instance.hasContent("abc")).toBe(true);
        expect(hasValue).toHaveBeenCalledWith("abc");
    });

    it("getTextDataCombination should combine and trim values", () => {
        const instance = new CustomParagraphTextData({});
        expect(instance.getTextDataCombination("foo", "bar", "!")).toBe("bar foo!");
        expect(instance.getTextDataCombination("", "", "")).toBe("");
    });

    it("getValueFromFormData should call getComponentDataValue and formatString", () => {
        getComponentDataValue.mockReturnValue("raw");
        formatString.mockReturnValue("formatted");
        const instance = new CustomParagraphTextData({});
        const props = { format: "upper" };
        expect(instance.getValueFromFormData(props)).toBe("formatted");
        expect(getComponentDataValue).toHaveBeenCalledWith(props);
        expect(formatString).toHaveBeenCalledWith("raw", "upper");
    });
});
