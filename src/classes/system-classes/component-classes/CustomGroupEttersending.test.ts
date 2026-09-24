import type { ComponentProps } from "../../../types.ts";

import { getTextResourceFromResourceBinding, getTextResources, hasValue } from "@arkitektum/altinn-studio-custom-components-utils";
import CustomGroupEttersending from "./CustomGroupEttersending.ts";
import Ettersending from "../../data-classes/Ettersending.ts";

// Mock dependencies
jest.mock("../../../functions/helpers", () => ({
    getComponentDataValue: jest.fn()
}));
jest.mock("../../../functions/validations", () => ({
    hasMissingTextResources: jest.fn(),
    hasValidationMessages: jest.fn()
}));
jest.mock("../../data-classes/Ettersending");
jest.mock("@arkitektum/altinn-studio-custom-components-utils", () => ({
    hasValue: jest.fn(),
    getTextResourceFromResourceBinding: jest.fn(),
    getTextResources: jest.fn()
}));

const { getComponentDataValue } = require("../../../functions/helpers");
const { hasMissingTextResources, hasValidationMessages } = require("../../../functions/validations");

describe("CustomGroupEttersending", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (Ettersending as unknown as jest.Mock).mockImplementation((data) => ({ mockData: data }));
    });

    describe("constructor", () => {
        it("should set isEmpty, validationMessages, hasValidationMessages, resourceBindings, and resourceValues when data is empty", () => {
            const props = { formData: "test", resourceBindings: {} };
            getComponentDataValue.mockReturnValue("componentData");
            (hasValue as unknown as jest.Mock).mockReturnValue(false);
            (getTextResourceFromResourceBinding as unknown as jest.Mock).mockReturnValue("emptyText");
            (getTextResources as unknown as jest.Mock).mockReturnValue(["resource1"]);
            hasMissingTextResources.mockReturnValue(["missing"]);
            hasValidationMessages.mockReturnValue(true);

            const instance = new CustomGroupEttersending(props as unknown as ComponentProps);

            expect(instance.isEmpty).toBe(true);
            expect(instance.validationMessages).toEqual(["missing"]);
            expect(instance.hasValidationMessages).toBe(true);
            expect(instance.resourceBindings?.ettersending).toHaveProperty("emptyFieldText");
            expect(instance.resourceValues.data).toBe("emptyText");
        });

        it("should set resourceValues.data to Ettersending instance when data is not empty", () => {
            const props = { formData: "test", resourceBindings: {} };
            getComponentDataValue.mockReturnValue("componentData");
            (hasValue as unknown as jest.Mock).mockReturnValue(true);
            (getTextResourceFromResourceBinding as unknown as jest.Mock).mockReturnValue("emptyText");
            (getTextResources as unknown as jest.Mock).mockReturnValue(["resource1"]);
            hasMissingTextResources.mockReturnValue([]);
            hasValidationMessages.mockReturnValue(false);

            const instance = new CustomGroupEttersending(props as unknown as ComponentProps);

            expect(instance.isEmpty).toBe(false);
            expect(instance.resourceValues.data).toEqual({ mockData: "componentData" });
        });
    });

    describe("hasContent", () => {
        it("should return result of hasValue", () => {
            (hasValue as unknown as jest.Mock).mockReturnValue(true);
            const instance = new CustomGroupEttersending({});
            expect(instance.hasContent("data")).toBe(true);

            (hasValue as unknown as jest.Mock).mockReturnValue(false);
            expect(instance.hasContent("")).toBe(false);
        });
    });

    describe("getValidationMessages", () => {
        it("should call getTextResources and hasMissingTextResources", () => {
            (getTextResources as unknown as jest.Mock).mockReturnValue(["resource1"]);
            hasMissingTextResources.mockReturnValue(["missing"]);
            const instance = new CustomGroupEttersending({});
            const result = instance.getValidationMessages({ ettersending: {} });
            expect(hasMissingTextResources).toHaveBeenCalledWith({ ettersending: {} });
            expect(result).toEqual(["missing"]);
        });
    });

    describe("getValueFromFormData", () => {
        it("should return Ettersending instance with component data value", () => {
            getComponentDataValue.mockReturnValue("componentData");
            const instance = new CustomGroupEttersending({});
            const result = instance.getValueFromFormData({});
            expect(Ettersending).toHaveBeenCalledWith("componentData");
            expect(result).toEqual({ mockData: "componentData" });
        });
    });

    describe("getResourceBindings", () => {
        it('should include emptyFieldText if hideIfEmpty is not true or "true"', () => {
            const instance = new CustomGroupEttersending({});
            const result = instance.getResourceBindings({});
            expect(result.ettersending!.emptyFieldText).toBe("resource.emptyFieldText.default");
        });

        it("should use custom emptyFieldText if provided", () => {
            const instance = new CustomGroupEttersending({});
            const result = instance.getResourceBindings({
                resourceBindings: { emptyFieldText: "custom.text" }
            });
            expect(result.ettersending!.emptyFieldText).toBe("custom.text");
        });

        it("should not include emptyFieldText if hideIfEmpty is true", () => {
            const instance = new CustomGroupEttersending({});
            const result = instance.getResourceBindings({ hideIfEmpty: true });
            expect(result.ettersending!.emptyFieldText).toBeUndefined();
        });

        it('should not include emptyFieldText if hideIfEmpty is "true"', () => {
            const instance = new CustomGroupEttersending({});
            const result = instance.getResourceBindings({ hideIfEmpty: "true" });
            expect(result.ettersending!.emptyFieldText).toBeUndefined();
        });
    });
});
