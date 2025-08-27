import CustomFeedbacklistValidationMessages from "./CustomFeedbacklistValidationMessages";
import CustomComponent from "../CustomComponent";
import ValidationMessages from "../ValidationMessages";
import * as helpers from "../../../functions/helpers";

jest.mock("../../../functions/helpers", () => ({
    getComponentDataValue: jest.fn(),
    hasValue: jest.fn()
}));

jest.mock("../ValidationMessages");

describe("CustomFeedbacklistValidationMessages", () => {
    const mockProps = { some: "prop" };
    const mockData = { field: "value" };
    const mockValidationMessagesInstance = { messages: ["msg1", "msg2"] };

    beforeEach(() => {
        helpers.getComponentDataValue.mockClear();
        helpers.hasValue.mockClear();
        ValidationMessages.mockClear();
    });

    it("should extend CustomComponent", () => {
        const instance = new CustomFeedbacklistValidationMessages(mockProps);
        expect(instance instanceof CustomComponent).toBe(true);
    });

    it("should initialize isEmpty and resourceValues correctly when data has content", () => {
        helpers.getComponentDataValue.mockReturnValue(mockData);
        helpers.hasValue.mockReturnValue(true);
        ValidationMessages.mockImplementation((data) => {
            expect(data).toBe(mockData);
            return mockValidationMessagesInstance;
        });

        const instance = new CustomFeedbacklistValidationMessages(mockProps);

        expect(instance.isEmpty).toBe(false);
        expect(instance.resourceValues.data).toBe(mockValidationMessagesInstance);
    });

    it("should set isEmpty to true when data has no content", () => {
        helpers.getComponentDataValue.mockReturnValue(null);
        helpers.hasValue.mockReturnValue(false);
        ValidationMessages.mockImplementation((data) => {
            expect(data).toBe(null);
            return mockValidationMessagesInstance;
        });

        const instance = new CustomFeedbacklistValidationMessages(mockProps);

        expect(instance.isEmpty).toBe(true);
        expect(instance.resourceValues.data).toBe(mockValidationMessagesInstance);
    });

    describe("hasContent", () => {
        it("should call hasValue with the provided data", () => {
            helpers.hasValue.mockReturnValue(true);
            const instance = new CustomFeedbacklistValidationMessages(mockProps);
            const result = instance.hasContent("test");
            expect(helpers.hasValue).toHaveBeenCalledWith("test");
            expect(result).toBe(true);
        });
    });

    describe("getValueFromFormData", () => {
        it("should call getComponentDataValue and return ValidationMessages instance", () => {
            helpers.getComponentDataValue.mockReturnValue(mockData);
            ValidationMessages.mockImplementation((data) => {
                expect(data).toBe(mockData);
                return mockValidationMessagesInstance;
            });

            const instance = new CustomFeedbacklistValidationMessages(mockProps);
            const result = instance.getValueFromFormData(mockProps);
            expect(helpers.getComponentDataValue).toHaveBeenCalledWith(mockProps);
            expect(result).toBe(mockValidationMessagesInstance);
        });
    });
});
