import { CustomElementHtmlAttributes, createCustomElement } from "@arkitektum/altinn-studio-custom-components-utils";
import { renderFeedbackListElement } from "./feedbackHelpers.ts";

jest.mock("@arkitektum/altinn-studio-custom-components-utils");

// The automock stands in for the constructor, and what the test makes it return is a stand-in it inspects
// rather than a real instance, so it is reached as a plain mock rather than through the class's own type.
const mockedHtmlAttributes = CustomElementHtmlAttributes as unknown as jest.Mock;

describe("renderFeedbackListElement", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should create CustomElementHtmlAttributes with correct params", () => {
        const validationMessages = ["Error 1", "Error 2"];
        mockedHtmlAttributes.mockImplementation((args) => args);

        jest.mocked(createCustomElement).mockReturnValue(document.createElement("div"));

        renderFeedbackListElement(validationMessages);

        expect(CustomElementHtmlAttributes).toHaveBeenCalledWith({
            isChildComponent: true,
            resourceValues: {
                data: validationMessages
            }
        });
    });

    it("should call createCustomElement with correct arguments", () => {
        const validationMessages = { field: "Required" };
        const mockHtmlAttributes = { mock: true };
        mockedHtmlAttributes.mockReturnValue(mockHtmlAttributes);

        const mockElement = document.createElement("span");
        jest.mocked(createCustomElement).mockReturnValue(mockElement);

        const result = renderFeedbackListElement(validationMessages);

        expect(createCustomElement).toHaveBeenCalledWith("custom-feedbacklist-validation-messages", mockHtmlAttributes);
        expect(result).toBe(mockElement);
    });

    it("should handle empty validationMessages", () => {
        const validationMessages: unknown[] = [];
        mockedHtmlAttributes.mockImplementation((args) => args);

        const mockElement = document.createElement("div");
        jest.mocked(createCustomElement).mockReturnValue(mockElement);

        const result = renderFeedbackListElement(validationMessages);

        expect(CustomElementHtmlAttributes).toHaveBeenCalledWith({
            isChildComponent: true,
            resourceValues: {
                data: validationMessages
            }
        });
        expect(result).toBe(mockElement);
    });
});
