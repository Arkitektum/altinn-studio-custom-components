import CustomFeedbackData from "./CustomFeedbackData";
import { getComponentDataValue, hasValue } from "../../../functions/helpers.js";

// Mocks
jest.mock("../../../functions/helpers.js", () => ({
    getComponentDataValue: jest.fn(),
    hasValue: jest.fn()
}));

// Dummy CustomComponent base class
class CustomComponent {
    constructor(props) {
        this.props = props;
    }
}

describe("CustomFeedbackData", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should set isEmpty to true if data has no content", () => {
        getComponentDataValue.mockReturnValue(null);
        hasValue.mockReturnValue(false);

        const props = { some: "prop" };
        const instance = new CustomFeedbackData(props);

        expect(getComponentDataValue).toHaveBeenCalledWith(props);
        expect(hasValue).toHaveBeenCalledWith(null);
        expect(instance.isEmpty).toBe(true);
        expect(instance.resourceValues).toEqual({ data: null });
    });

    it("should set isEmpty to false if data has content", () => {
        getComponentDataValue.mockReturnValue("feedback");
        hasValue.mockReturnValue(true);

        const props = { some: "prop" };
        const instance = new CustomFeedbackData(props);

        expect(getComponentDataValue).toHaveBeenCalledWith(props);
        expect(hasValue).toHaveBeenCalledWith("feedback");
        expect(instance.isEmpty).toBe(false);
        expect(instance.resourceValues).toEqual({ data: "feedback" });
    });

    it("hasContent should delegate to hasValue", () => {
        hasValue.mockReturnValue(true);
        const instance = new CustomFeedbackData({});
        expect(instance.hasContent("abc")).toBe(true);
        expect(hasValue).toHaveBeenCalledWith("abc");
    });

    it("getValueFromFormData should delegate to getComponentDataValue", () => {
        getComponentDataValue.mockReturnValue("xyz");
        const instance = new CustomFeedbackData({});
        expect(instance.getValueFromFormData({ foo: "bar" })).toBe("xyz");
        expect(getComponentDataValue).toHaveBeenCalledWith({ foo: "bar" });
    });
});
