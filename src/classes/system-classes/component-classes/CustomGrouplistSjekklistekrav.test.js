import CustomGrouplistSjekklistekrav from "./CustomGrouplistSjekklistekrav.js";
import {
    getComponentDataValue,
    getTextResourceFromResourceBinding,
    getTextResources,
    hasValue
} from "../../../functions/helpers.js";
import { hasMissingTextResources, hasValidationMessages } from "../../../functions/validations.js";

// Mock dependencies
jest.mock("../../../functions/helpers.js", () => ({
    getComponentDataValue: jest.fn(),
    getTextResourceFromResourceBinding: jest.fn(),
    getTextResources: jest.fn(),
    hasValue: jest.fn()
}));
jest.mock("../../../functions/validations.js", () => ({
    hasMissingTextResources: jest.fn(),
    hasValidationMessages: jest.fn()
}));

describe("CustomGrouplistSjekklistekrav", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("constructor", () => {
        it("should set isEmpty, validationMessages, hasValidationMessages, resourceBindings, and resourceValues correctly when data is present", () => {
            const props = {
                formData: { value: "some data" },
                resourceBindings: {
                    trueText: "trueTextKey",
                    falseText: "falseTextKey",
                    defaultText: "defaultTextKey",
                    title: "titleKey",
                    emptyFieldText: "emptyFieldTextKey"
                }
            };

            const dataValue = "some data";
            getComponentDataValue.mockReturnValue(dataValue);
            hasValue.mockReturnValue(true);
            getTextResources.mockReturnValue(["res1", "res2"]);
            hasMissingTextResources.mockReturnValue([]);
            hasValidationMessages.mockReturnValue(false);
            getTextResourceFromResourceBinding.mockImplementation((key) => `text-for-${key}`);

            const instance = new CustomGrouplistSjekklistekrav(props);

            expect(instance.isEmpty).toBe(false);
            expect(instance.validationMessages).toEqual([]);
            expect(instance.hasValidationMessages).toBe(false);
            expect(instance.resourceBindings).toEqual({
                trueText: "trueTextKey",
                falseText: "falseTextKey",
                defaultText: "defaultTextKey",
                title: "titleKey",
                emptyFieldText: "emptyFieldTextKey"
            });
            expect(instance.resourceValues).toEqual({
                title: "text-for-titleKey",
                data: dataValue
            });
        });

        it("should set isEmpty true and use emptyFieldText when data is empty", () => {
            const props = {
                formData: {},
                resourceBindings: {
                    emptyFieldText: "emptyFieldTextKey"
                }
            };

            getComponentDataValue.mockReturnValue(undefined);
            hasValue.mockReturnValue(false);
            getTextResources.mockReturnValue([]);
            hasMissingTextResources.mockReturnValue(["missing"]);
            hasValidationMessages.mockReturnValue(true);
            getTextResourceFromResourceBinding.mockImplementation((key) => `text-for-${key}`);

            const instance = new CustomGrouplistSjekklistekrav(props);

            expect(instance.isEmpty).toBe(true);
            expect(instance.validationMessages).toEqual(["missing"]);
            expect(instance.hasValidationMessages).toBe(true);
            expect(instance.resourceValues.data).toBe("text-for-emptyFieldTextKey");
        });
    });

    describe("hasContent", () => {
        it("should return true if hasValue returns true", () => {
            hasValue.mockReturnValue(true);
            const instance = Object.create(CustomGrouplistSjekklistekrav.prototype);
            expect(instance.hasContent("abc")).toBe(true);
        });

        it("should return false if hasValue returns false", () => {
            hasValue.mockReturnValue(false);
            const instance = Object.create(CustomGrouplistSjekklistekrav.prototype);
            expect(instance.hasContent(null)).toBe(false);
        });
    });

    describe("getValidationMessages", () => {
        it("should call hasMissingTextResources with textResources and resourceBindings", () => {
            const textResources = ["a", "b"];
            getTextResources.mockReturnValue(textResources);
            hasMissingTextResources.mockReturnValue(["missing"]);
            const instance = Object.create(CustomGrouplistSjekklistekrav.prototype);
            const result = instance.getValidationMessages({ foo: "bar" });
            expect(getTextResources).toHaveBeenCalled();
            expect(hasMissingTextResources).toHaveBeenCalledWith(textResources, { foo: "bar" });
            expect(result).toEqual(["missing"]);
        });
    });

    describe("getValueFromFormData", () => {
        it("should call getComponentDataValue with props", () => {
            const props = { formData: { value: 1 } };
            getComponentDataValue.mockReturnValue("value1");
            const instance = Object.create(CustomGrouplistSjekklistekrav.prototype);
            expect(instance.getValueFromFormData(props)).toBe("value1");
            expect(getComponentDataValue).toHaveBeenCalledWith(props);
        });
    });

    describe("getResourceBindings", () => {
        it("should return default resource bindings if none provided", () => {
            const props = {};
            const instance = Object.create(CustomGrouplistSjekklistekrav.prototype);
            const result = instance.getResourceBindings(props);
            expect(result).toEqual({
                sjekklistekrav: {
                    trueText: "resource.trueText.default",
                    falseText: "resource.falseText.default",
                    defaultText: "resource.defaultText.default",
                    title: "resource.krav.sjekklistekrav.title",
                    emptyFieldText: "resource.emptyFieldText.default"
                }
            });
        });

        it("should use provided resourceBindings and respect hideTitle/hideIfEmpty", () => {
            const props = {
                resourceBindings: {
                    trueText: "t",
                    falseText: "f",
                    defaultText: "d",
                    title: "myTitle",
                    emptyFieldText: "myEmpty"
                },
                hideTitle: true,
                hideIfEmpty: "true"
            };
            const instance = Object.create(CustomGrouplistSjekklistekrav.prototype);
            const result = instance.getResourceBindings(props);
            expect(result).toEqual({
                sjekklistekrav: {
                    trueText: "t",
                    falseText: "f",
                    defaultText: "d"
                }
            });
        });
    });
});
