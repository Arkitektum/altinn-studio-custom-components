import { getBooleanText } from "./functions";
import { getComponentTexts, validateTexts } from "../../../functions/helpers.js";

jest.mock("../../../functions/helpers.js", () => ({
    getComponentTexts: jest.fn(),
    validateTexts: jest.fn()
}));

describe("getBooleanText", () => {
    const mockComponent = { id: "test-component" };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should return the trueText when data is true and trueText is defined", async () => {
        getComponentTexts.mockResolvedValue({ trueText: "Yes", falseText: "No", defaultText: "Default" });

        const result = await getBooleanText(true, mockComponent);

        expect(getComponentTexts).toHaveBeenCalledWith(mockComponent);
        expect(validateTexts).toHaveBeenCalledWith(
            { trueText: "Yes", falseText: "No", defaultText: "Default" },
            { trueText: "Ja", falseText: "Nei", defaultText: "" },
            ["trueText", "falseText", "defaultText"],
            "test-component"
        );
        expect(result).toBe("Yes");
    });

    it("should return the falseText when data is false and falseText is defined", async () => {
        getComponentTexts.mockResolvedValue({ trueText: "Yes", falseText: "No", defaultText: "Default" });

        const result = await getBooleanText(false, mockComponent);

        expect(result).toBe("No");
    });

    it("should return the defaultText when data is neither true nor false and defaultText is defined", async () => {
        getComponentTexts.mockResolvedValue({ trueText: "Yes", falseText: "No", defaultText: "Default" });

        const result = await getBooleanText(null, mockComponent);

        expect(result).toBe("Default");
    });

    it("should return the fallback trueText when data is true and trueText is not defined", async () => {
        getComponentTexts.mockResolvedValue({ falseText: "No", defaultText: "Default" });

        const result = await getBooleanText(true, mockComponent);

        expect(result).toBe("Ja");
    });

    it("should return the fallback falseText when data is false and falseText is not defined", async () => {
        getComponentTexts.mockResolvedValue({ trueText: "Yes", defaultText: "Default" });

        const result = await getBooleanText(false, mockComponent);

        expect(result).toBe("Nei");
    });

    it("should return the fallback defaultText when data is neither true nor false and defaultText is not defined", async () => {
        getComponentTexts.mockResolvedValue({ trueText: "Yes", falseText: "No" });

        const result = await getBooleanText(null, mockComponent);

        expect(result).toBe("");
    });

    it("should use the default component name when component is not provided", async () => {
        getComponentTexts.mockResolvedValue({ trueText: "Yes", falseText: "No", defaultText: "Default" });

        const result = await getBooleanText(true, null);

        expect(validateTexts).toHaveBeenCalledWith(
            { trueText: "Yes", falseText: "No", defaultText: "Default" },
            { trueText: "Ja", falseText: "Nei", defaultText: "" },
            ["trueText", "falseText", "defaultText"],
            "custom-field-boolean-text"
        );
        expect(result).toBe("Yes");
    });
});
