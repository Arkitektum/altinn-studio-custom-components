import CustomGroupSjekklistekrav from "./CustomGroupSjekklistekrav";
import {
    getComponentDataValue,
    getTextResourceFromResourceBinding,
    getTextResources,
    hasValue
} from "../../../functions/helpers.js";
import { hasMissingTextResources, hasValidationMessages } from "../../../functions/validations.js";
import Sjekklistekrav from "../../data-classes/Sjekklistekrav.js";

// Mocks
jest.mock("../CustomComponent.js", () => {
    return class {};
});
jest.mock("../../data-classes/Sjekklistekrav.js", () => {
    return jest.fn().mockImplementation((data) => ({ mockData: data }));
});
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

describe("CustomGroupSjekklistekrav", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should initialize with empty data and default resource bindings", () => {
        getComponentDataValue.mockReturnValue(undefined);
        hasValue.mockReturnValue(false);
        getTextResourceFromResourceBinding.mockReturnValue("Empty Field");
        getTextResources.mockReturnValue(["res1", "res2"]);
        hasMissingTextResources.mockReturnValue([]);
        hasValidationMessages.mockReturnValue(false);

        const props = {};
        const instance = new CustomGroupSjekklistekrav(props);

        expect(instance.isEmpty).toBe(true);
        expect(instance.resourceBindings).toEqual({
            trueText: "resource.trueText.default",
            falseText: "resource.falseText.default",
            defaultText: "resource.defaultText.default",
            emptyFieldText: "resource.emptyFieldText.default"
        });
        expect(instance.resourceValues.data).toBe("Empty Field");
        expect(instance.validationMessages).toEqual([]);
        expect(instance.hasValidationMessages).toBe(false);
    });

    it("should initialize with provided resource bindings and non-empty data", () => {
        getComponentDataValue.mockReturnValue("someData");
        hasValue.mockReturnValue(true);
        getTextResourceFromResourceBinding.mockReturnValue("Should not be used");
        getTextResources.mockReturnValue(["res1", "res2"]);
        hasMissingTextResources.mockReturnValue(["missing"]);
        hasValidationMessages.mockReturnValue(true);

        const props = {
            resourceBindings: {
                trueText: "customTrue",
                falseText: "customFalse",
                defaultText: "customDefault",
                emptyFieldText: "customEmpty"
            }
        };
        const instance = new CustomGroupSjekklistekrav(props);

        expect(instance.isEmpty).toBe(false);
        expect(instance.resourceBindings).toEqual({
            trueText: "customTrue",
            falseText: "customFalse",
            defaultText: "customDefault",
            emptyFieldText: "customEmpty"
        });
        expect(instance.resourceValues.data).toEqual({ mockData: "someData" });
        expect(instance.validationMessages).toEqual(["missing"]);
        expect(instance.hasValidationMessages).toBe(true);
    });

    it("should omit emptyFieldText if hideIfEmpty is true", () => {
        getComponentDataValue.mockReturnValue(undefined);
        hasValue.mockReturnValue(false);

        const props = {
            resourceBindings: {
                trueText: "customTrue",
                falseText: "customFalse",
                defaultText: "customDefault",
                emptyFieldText: "customEmpty"
            },
            hideIfEmpty: true
        };
        const instance = new CustomGroupSjekklistekrav(props);

        expect(instance.resourceBindings).toEqual({
            trueText: "customTrue",
            falseText: "customFalse",
            defaultText: "customDefault"
        });
    });

    it("hasContent should delegate to hasValue", () => {
        hasValue.mockReturnValue(true);
        const instance = new CustomGroupSjekklistekrav({});
        expect(instance.hasContent("data")).toBe(true);
        expect(hasValue).toHaveBeenCalledWith("data");
    });

    it("getValidationMessages should call hasMissingTextResources", () => {
        getTextResources.mockReturnValue(["res1"]);
        hasMissingTextResources.mockReturnValue(["msg"]);
        const instance = new CustomGroupSjekklistekrav({});
        const result = instance.getValidationMessages({ test: "value" });
        expect(getTextResources).toHaveBeenCalled();
        expect(hasMissingTextResources).toHaveBeenCalledWith(["res1"], { test: "value" });
        expect(result).toEqual(["msg"]);
    });

    it("getValueFromFormData should return Sjekklistekrav instance", () => {
        getComponentDataValue.mockReturnValue("data");
        const instance = new CustomGroupSjekklistekrav({});
        const result = instance.getValueFromFormData({});
        expect(Sjekklistekrav).toHaveBeenCalledWith("data");
        expect(result).toEqual({ mockData: "data" });
    });

    it("getResourceBindings should set defaults if not provided", () => {
        const instance = new CustomGroupSjekklistekrav({});
        const result = instance.getResourceBindings({});
        expect(result).toEqual({
            sjekklistekrav: {
                trueText: "resource.trueText.default",
                falseText: "resource.falseText.default",
                defaultText: "resource.defaultText.default",
                emptyFieldText: "resource.emptyFieldText.default"
            }
        });
    });

    it("getResourceBindings should use provided values", () => {
        const props = {
            resourceBindings: {
                trueText: "yes",
                falseText: "no",
                defaultText: "maybe",
                emptyFieldText: "none"
            }
        };
        const instance = new CustomGroupSjekklistekrav(props);
        const result = instance.getResourceBindings(props);
        expect(result).toEqual({
            sjekklistekrav: {
                trueText: "yes",
                falseText: "no",
                defaultText: "maybe",
                emptyFieldText: "none"
            }
        });
    });

    it('getResourceBindings should omit emptyFieldText if hideIfEmpty is "true"', () => {
        const props = {
            resourceBindings: {
                trueText: "yes",
                falseText: "no",
                defaultText: "maybe",
                emptyFieldText: "none"
            },
            hideIfEmpty: "true"
        };
        const instance = new CustomGroupSjekklistekrav(props);
        const result = instance.getResourceBindings(props);
        expect(result).toEqual({
            sjekklistekrav: {
                trueText: "yes",
                falseText: "no",
                defaultText: "maybe"
            }
        });
    });
});
