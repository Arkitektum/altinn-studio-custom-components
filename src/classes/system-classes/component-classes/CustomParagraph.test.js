import CustomParagraph from "./CustomParagraph";
import { hasValue } from "../../../functions/helpers.js";

// Mock CustomComponent since it's a superclass
jest.mock("../CustomComponent.js", () => {
    return class {};
});

// Mock hasValue helper
jest.mock("../../../functions/helpers.js", () => ({
    hasValue: jest.fn()
}));

describe("CustomParagraph", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should set isEmpty to false if resourceValues.title has value", () => {
        hasValue.mockReturnValue(true);
        const props = { resourceValues: { title: "Hello" } };
        const paragraph = new CustomParagraph(props);
        expect(paragraph.isEmpty).toBe(false);
        expect(paragraph.resourceValues).toEqual(props.resourceValues);
        expect(hasValue).toHaveBeenCalledWith("Hello");
    });

    it("should set isEmpty to true if resourceValues.title is empty", () => {
        hasValue.mockReturnValue(false);
        const props = { resourceValues: { title: "" } };
        const paragraph = new CustomParagraph(props);
        expect(paragraph.isEmpty).toBe(true);
        expect(paragraph.resourceValues).toEqual(props.resourceValues);
        expect(hasValue).toHaveBeenCalledWith("");
    });

    it("should set isEmpty to true if resourceValues is undefined", () => {
        hasValue.mockReturnValue(false);
        const props = {};
        const paragraph = new CustomParagraph(props);
        expect(paragraph.isEmpty).toBe(true);
        expect(paragraph.resourceValues).toBeUndefined();
        expect(hasValue).toHaveBeenCalledWith(undefined);
    });

    it("hasContent should return true if hasValue returns true", () => {
        hasValue.mockReturnValue(true);
        const props = { resourceValues: { title: "Test" } };
        const paragraph = new CustomParagraph({});
        expect(paragraph.hasContent(props)).toBe(true);
        expect(hasValue).toHaveBeenCalledWith("Test");
    });

    it("hasContent should return false if hasValue returns false", () => {
        hasValue.mockReturnValue(false);
        const props = { resourceValues: { title: "" } };
        const paragraph = new CustomParagraph({});
        expect(paragraph.hasContent(props)).toBe(false);
        expect(hasValue).toHaveBeenCalledWith("");
    });
});
