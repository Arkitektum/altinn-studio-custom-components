import CustomFieldBooleanText from "./CustomFieldBooleanText";

// Mocks for helper functions and parent class
jest.mock("../../../functions/helpers.js", () => ({
    getComponentBooleanTextValues: jest.fn(),
    getComponentDataValue: jest.fn(),
    getComponentResourceValue: jest.fn(),
    hasValue: jest.fn(),
    validateTexts: jest.fn()
}));

const {
    getComponentBooleanTextValues,
    getComponentDataValue,
    getComponentResourceValue,
    hasValue,
    validateTexts
} = require("../../../functions/helpers.js");

describe("CustomFieldBooleanText", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Default mock implementations
        getComponentResourceValue.mockImplementation((props, key) => props.resources?.[key]);
        validateTexts.mockImplementation(() => {});
    });

    it("should set resourceValues with trueText when condition is true", () => {
        getComponentDataValue.mockReturnValue(true);
        getComponentBooleanTextValues.mockReturnValue({ trueText: "Yes", falseText: "No", defaultText: "Maybe" });
        hasValue.mockReturnValue(true);

        const props = {
            id: "test-id",
            formData: { test: true },
            resources: { title: "Title", emptyFieldText: "Empty" }
        };
        const instance = new CustomFieldBooleanText(props);

        expect(instance.isEmpty).toBe(false);
        expect(instance.resourceValues.title).toBe("Title");
        expect(instance.resourceValues.data).toBe("Yes");
    });

    it("should set resourceValues with falseText when condition is false", () => {
        getComponentDataValue.mockReturnValue(false);
        getComponentBooleanTextValues.mockReturnValue({ trueText: "Yes", falseText: "No", defaultText: "Maybe" });
        hasValue.mockReturnValue(true);

        const props = {
            id: "test-id",
            formData: { test: false },
            resources: { title: "Title", emptyFieldText: "Empty" }
        };
        const instance = new CustomFieldBooleanText(props);

        expect(instance.isEmpty).toBe(false);
        expect(instance.resourceValues.data).toBe("No");
    });

    it("should use fallback texts if booleanTextValues are missing", () => {
        getComponentDataValue.mockReturnValue(true);
        getComponentBooleanTextValues.mockReturnValue({});
        hasValue.mockReturnValue(true);

        const props = {
            id: "test-id",
            formData: { test: true },
            resources: { title: "Title", emptyFieldText: "Empty" }
        };
        const instance = new CustomFieldBooleanText(props);

        expect(instance.resourceValues.data).toBe("Ja");
    });

    it("should use defaultText when condition is neither true nor false", () => {
        getComponentDataValue.mockReturnValue(undefined);
        getComponentBooleanTextValues.mockReturnValue({ trueText: "Yes", falseText: "No", defaultText: "Maybe" });
        hasValue.mockReturnValue(true);

        const props = {
            id: "test-id",
            formData: { test: undefined },
            resources: { title: "Title", emptyFieldText: "Empty" }
        };
        const instance = new CustomFieldBooleanText(props);

        expect(instance.resourceValues.data).toBe("Maybe");
    });

    it("should use fallback defaultText if booleanTextValues.defaultText is missing", () => {
        getComponentDataValue.mockReturnValue(undefined);
        getComponentBooleanTextValues.mockReturnValue({});
        hasValue.mockReturnValue(true);

        const props = {
            id: "test-id",
            formData: { test: undefined },
            resources: { title: "Title", emptyFieldText: "Empty" }
        };
        const instance = new CustomFieldBooleanText(props);

        expect(instance.resourceValues.data).toBe("");
    });

    it("should set isEmpty and use emptyFieldText when hasContent returns false", () => {
        getComponentDataValue.mockReturnValue(undefined);
        getComponentBooleanTextValues.mockReturnValue({});
        hasValue.mockReturnValue(false);

        const props = {
            id: "test-id",
            formData: {},
            resources: { title: "Title", emptyFieldText: "Empty" }
        };
        const instance = new CustomFieldBooleanText(props);

        expect(instance.isEmpty).toBe(true);
        expect(instance.resourceValues.data).toBe("Empty");
    });

    it("hasContent should delegate to hasValue", () => {
        hasValue.mockReturnValue(true);
        const instance = new CustomFieldBooleanText({ resources: {} });
        expect(instance.hasContent("data")).toBe(true);
        expect(hasValue).toHaveBeenCalledWith("data");
    });

    it("should throw error if validateTexts throws", () => {
        validateTexts.mockImplementation(() => {
            throw new Error("Invalid texts");
        });
        getComponentDataValue.mockReturnValue(true);
        getComponentBooleanTextValues.mockReturnValue({});

        const props = {
            id: "test-id",
            formData: {},
            resources: {}
        };
        expect(() => new CustomFieldBooleanText(props)).toThrow("Invalid texts");
    });
});
