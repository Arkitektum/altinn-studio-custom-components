import CustomFeedback from "./CustomFeedback";
import { getComponentDataValue, hasValue } from "../../../functions/helpers.js";

// Mock dependencies
jest.mock("../../../functions/helpers.js", () => ({
    getComponentDataValue: jest.fn(),
    hasValue: jest.fn()
}));

describe("CustomFeedback", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should initialize with data from getComponentDataValue and set isEmpty correctly when data has value", () => {
        const props = { some: "prop" };
        getComponentDataValue.mockReturnValue("feedback");
        hasValue.mockReturnValue(true);

        const feedback = new CustomFeedback(props);

        expect(getComponentDataValue).toHaveBeenCalledWith(props);
        expect(hasValue).toHaveBeenCalledWith("feedback");
        expect(feedback.isEmpty).toBe(false);
        expect(feedback.resourceValues).toEqual({ data: "feedback" });
    });

    it("should set isEmpty to true when data does not have value", () => {
        const props = { some: "prop" };
        getComponentDataValue.mockReturnValue("");
        hasValue.mockReturnValue(false);

        const feedback = new CustomFeedback(props);

        expect(feedback.isEmpty).toBe(true);
        expect(feedback.resourceValues).toEqual({ data: "" });
    });

    it("hasContent should delegate to hasValue", () => {
        hasValue.mockReturnValue(true);
        const feedback = new CustomFeedback({});
        expect(feedback.hasContent("abc")).toBe(true);
        expect(hasValue).toHaveBeenCalledWith("abc");
    });

    it("getValueFromFormData should delegate to getComponentDataValue", () => {
        getComponentDataValue.mockReturnValue("xyz");
        const feedback = new CustomFeedback({});
        expect(feedback.getValueFromFormData({ foo: "bar" })).toBe("xyz");
        expect(getComponentDataValue).toHaveBeenCalledWith({ foo: "bar" });
    });
});
