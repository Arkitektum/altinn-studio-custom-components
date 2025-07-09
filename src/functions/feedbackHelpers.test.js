import { renderFeedbackListElement } from "./feedbackHelpers";
import CustomElementHtmlAttributes from "../classes/system-classes/CustomElementHtmlAttributes";
import { createCustomElement } from "./helpers";

jest.mock("../classes/system-classes/CustomElementHtmlAttributes");
jest.mock("./helpers");

describe("renderFeedbackListElement", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should create CustomElementHtmlAttributes with correct params", () => {
        const validationMessages = ["Error 1", "Error 2"];
        CustomElementHtmlAttributes.mockImplementation((args) => args);

        createCustomElement.mockReturnValue(document.createElement("div"));

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
        CustomElementHtmlAttributes.mockReturnValue(mockHtmlAttributes);

        const mockElement = document.createElement("span");
        createCustomElement.mockReturnValue(mockElement);

        const result = renderFeedbackListElement(validationMessages);

        expect(createCustomElement).toHaveBeenCalledWith("custom-feedbacklist-validation-messages", mockHtmlAttributes);
        expect(result).toBe(mockElement);
    });

    it("should handle empty validationMessages", () => {
        const validationMessages = [];
        CustomElementHtmlAttributes.mockImplementation((args) => args);

        const mockElement = document.createElement("div");
        createCustomElement.mockReturnValue(mockElement);

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
