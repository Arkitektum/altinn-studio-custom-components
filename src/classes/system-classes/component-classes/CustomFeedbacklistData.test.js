import CustomFeedbacklistData from "./CustomFeedbacklistData";

// Mocks
const mockGetComponentDataValue = jest.fn();
const mockHasValue = jest.fn();

// Mock dependencies
jest.mock("../../../functions/helpers.js", () => ({
    getComponentDataValue: (...args) => mockGetComponentDataValue(...args),
    hasValue: (...args) => mockHasValue(...args)
}));

// Dummy CustomComponent base class
class CustomComponent {
    constructor(props) {
        this.props = props;
    }
}

describe("CustomFeedbacklistData", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should set resourceValues.title to default if not provided", () => {
        mockGetComponentDataValue.mockReturnValue("someData");
        mockHasValue.mockReturnValue(true);

        const instance = new CustomFeedbacklistData({});
        expect(instance.resourceValues.title).toBe("Messages");
    });

    it("should set resourceValues.title from props if provided", () => {
        mockGetComponentDataValue.mockReturnValue("someData");
        mockHasValue.mockReturnValue(true);

        const instance = new CustomFeedbacklistData({ resourceValues: { title: "Custom Title" } });
        expect(instance.resourceValues.title).toBe("Custom Title");
    });

    it("should set resourceValues.data from getComponentDataValue", () => {
        mockGetComponentDataValue.mockReturnValue("feedbackData");
        mockHasValue.mockReturnValue(true);

        const instance = new CustomFeedbacklistData({});
        expect(instance.resourceValues.data).toBe("feedbackData");
    });

    it("should set isEmpty to false if hasContent returns true", () => {
        mockGetComponentDataValue.mockReturnValue("feedbackData");
        mockHasValue.mockReturnValue(true);

        const instance = new CustomFeedbacklistData({});
        expect(instance.isEmpty).toBe(false);
    });

    it("should set isEmpty to true if hasContent returns false", () => {
        mockGetComponentDataValue.mockReturnValue(null);
        mockHasValue.mockReturnValue(false);

        const instance = new CustomFeedbacklistData({});
        expect(instance.isEmpty).toBe(true);
    });

    it("hasContent should delegate to hasValue", () => {
        mockHasValue.mockReturnValue(true);
        const instance = new CustomFeedbacklistData({});
        expect(instance.hasContent("abc")).toBe(true);
        expect(mockHasValue).toHaveBeenCalledWith("abc");
    });

    it("getValueFromFormData should delegate to getComponentDataValue", () => {
        mockGetComponentDataValue.mockReturnValue("xyz");
        const instance = new CustomFeedbacklistData({});
        expect(instance.getValueFromFormData({ foo: "bar" })).toBe("xyz");
        expect(mockGetComponentDataValue).toHaveBeenCalledWith({ foo: "bar" });
    });
});
