import type { ComponentProps } from "../../../types.ts";

import * as helpers from "../../../functions/helpers.ts";
import CustomComponent from "../CustomComponent.ts";
import CustomFeedbacklistValidationMessages from "./CustomFeedbacklistValidationMessages.ts";
import ValidationMessages from "../ValidationMessages.ts";
import { hasValue } from "@arkitektum/altinn-studio-custom-components-utils";

jest.mock("../../../functions/helpers", () => ({
    getComponentDataValue: jest.fn()
}));
jest.mock("@arkitektum/altinn-studio-custom-components-utils", () => ({
    hasValue: jest.fn()
}));

jest.mock("../ValidationMessages");

describe("CustomFeedbacklistValidationMessages", () => {
    const mockProps = { some: "prop" } as unknown as ComponentProps;
    const mockData = { field: "value" };
    const mockValidationMessagesInstance = { messages: ["msg1", "msg2"] };

    beforeEach(() => {
        (helpers.getComponentDataValue as unknown as jest.Mock).mockClear();
        (hasValue as unknown as jest.Mock).mockClear();
        (ValidationMessages as unknown as jest.Mock).mockClear();
    });

    it("should extend CustomComponent", () => {
        const instance = new CustomFeedbacklistValidationMessages(mockProps);
        expect(instance instanceof CustomComponent).toBe(true);
    });

    it("should initialize isEmpty and resourceValues correctly when data has content", () => {
        (helpers.getComponentDataValue as unknown as jest.Mock).mockReturnValue(mockData);
        (hasValue as unknown as jest.Mock).mockReturnValue(true);
        (ValidationMessages as unknown as jest.Mock).mockImplementation((data) => {
            expect(data).toBe(mockData);
            return mockValidationMessagesInstance;
        });

        const instance = new CustomFeedbacklistValidationMessages(mockProps);

        expect(instance.isEmpty).toBe(false);
        expect(instance.resourceValues.data).toBe(mockValidationMessagesInstance);
    });

    it("should set isEmpty to true when data has no content", () => {
        (helpers.getComponentDataValue as unknown as jest.Mock).mockReturnValue(null);
        (hasValue as unknown as jest.Mock).mockReturnValue(false);
        (ValidationMessages as unknown as jest.Mock).mockImplementation((data) => {
            expect(data).toBe(null);
            return mockValidationMessagesInstance;
        });

        const instance = new CustomFeedbacklistValidationMessages(mockProps);

        expect(instance.isEmpty).toBe(true);
        expect(instance.resourceValues.data).toBe(mockValidationMessagesInstance);
    });

    describe("hasContent", () => {
        it("should call hasValue with the provided data", () => {
            (hasValue as unknown as jest.Mock).mockReturnValue(true);
            const instance = new CustomFeedbacklistValidationMessages(mockProps);
            const result = instance.hasContent("test");
            expect(hasValue).toHaveBeenCalledWith("test");
            expect(result).toBe(true);
        });
    });

    describe("getValueFromFormData", () => {
        it("should call getComponentDataValue and return ValidationMessages instance", () => {
            (helpers.getComponentDataValue as unknown as jest.Mock).mockReturnValue(mockData);
            (ValidationMessages as unknown as jest.Mock).mockImplementation((data) => {
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
