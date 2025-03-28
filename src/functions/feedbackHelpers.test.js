import { renderFeedbackListElement } from "./feedbackHelpers.js";

// Ensure jsdom environment is used for DOM-related tests
import { JSDOM } from "jsdom";
const { window } = new JSDOM();
global.document = window.document;
global.window = window;
import CustomElementHtmlAttributes from "../classes/system-classes/CustomElementHtmlAttributes.js";
import { createCustomElement } from "./helpers.js";

jest.mock("../classes/system-classes/CustomElementHtmlAttributes.js");
jest.mock("./helpers.js");

describe("renderFeedbackListElement", () => {
    it("should create a CustomElementHtmlAttributes instance with the correct data", () => {
        const validationMessages = {
            error: ["Error 1", "Error 2"],
            warning: ["Warning 1", "Warning 2"],
            info: ["Info 1", "Info 2"],
            success: ["Success 1", "Success 2"],
            default: ["Default 1", "Default 2"]
        };
        renderFeedbackListElement(validationMessages);

        expect(CustomElementHtmlAttributes).toHaveBeenCalledWith({
            formData: { data: validationMessages }
        });
    });

    it("should call createCustomElement with the correct arguments", () => {
        const validationMessages = {
            error: ["Error 1", "Error 2"],
            warning: ["Warning 1", "Warning 2"],
            info: ["Info 1", "Info 2"],
            success: ["Success 1", "Success 2"],
            default: ["Default 1", "Default 2"]
        };
        const mockHtmlAttributes = {};
        CustomElementHtmlAttributes.mockImplementation(() => mockHtmlAttributes);

        renderFeedbackListElement(validationMessages);

        expect(createCustomElement).toHaveBeenCalledWith("custom-feedbacklist-validation-messages", mockHtmlAttributes);
    });

    it("should return the element created by createCustomElement", () => {
        const validationMessages = {
            error: ["Error 1", "Error 2"],
            warning: ["Warning 1", "Warning 2"],
            info: ["Info 1", "Info 2"],
            success: ["Success 1", "Success 2"],
            default: ["Default 1", "Default 2"]
        };
        const mockElement = document.createElement("div");
        createCustomElement.mockReturnValue(mockElement);

        const result = renderFeedbackListElement(validationMessages);

        expect(result).toBe(mockElement);
    });
});
