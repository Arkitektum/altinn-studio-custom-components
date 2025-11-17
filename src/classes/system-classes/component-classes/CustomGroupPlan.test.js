import CustomGroupPlan from "./CustomGroupPlan";
import CustomComponent from "../CustomComponent.js";
import Plan from "../../data-classes/Plan.js";

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

const {
    getComponentDataValue,
    getTextResourceFromResourceBinding,
    getTextResources,
    hasValue
} = require("../../../functions/helpers.js");
const { hasMissingTextResources, hasValidationMessages } = require("../../../functions/validations.js");

describe("CustomGroupPlan", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should extend CustomComponent", () => {
        const instance = new CustomGroupPlan({});
        expect(instance instanceof CustomComponent).toBe(true);
    });

    it("should set isEmpty to true if hasContent returns false", () => {
        hasValue.mockReturnValue(false);
        getComponentDataValue.mockReturnValue({});
        getTextResourceFromResourceBinding.mockReturnValue("Empty");
        hasMissingTextResources.mockReturnValue([]);
        hasValidationMessages.mockReturnValue(false);

        const props = {};
        const instance = new CustomGroupPlan(props);

        expect(instance.isEmpty).toBe(true);
        expect(instance.resourceValues.data).toBe("Empty");
    });

    it("should set isEmpty to false if hasContent returns true", () => {
        hasValue.mockReturnValue(true);
        getComponentDataValue.mockReturnValue({ foo: "bar" });
        hasMissingTextResources.mockReturnValue([]);
        hasValidationMessages.mockReturnValue(false);

        const props = {};
        const instance = new CustomGroupPlan(props);

        expect(instance.isEmpty).toBe(false);
        expect(instance.resourceValues.data).toBeInstanceOf(Plan);
    });

    it("should set validationMessages and hasValidationMessages", () => {
        hasValue.mockReturnValue(true);
        getComponentDataValue.mockReturnValue({ foo: "bar" });
        hasMissingTextResources.mockReturnValue(["Missing resource"]);
        hasValidationMessages.mockReturnValue(true);

        const props = {};
        const instance = new CustomGroupPlan(props);

        expect(instance.validationMessages).toEqual(["Missing resource"]);
        expect(instance.hasValidationMessages).toBe(true);
    });

    it("should use default resource bindings if not provided", () => {
        hasValue.mockReturnValue(true);
        getComponentDataValue.mockReturnValue({});
        hasMissingTextResources.mockReturnValue([]);
        hasValidationMessages.mockReturnValue(false);

        const props = {};
        const instance = new CustomGroupPlan(props);

        expect(instance.resourceBindings.navn.title).toBe("resource.planer.andrePlaner.plan.navn.title");
        expect(instance.resourceBindings.plantype.title).toBe("resource.planer.andrePlaner.plan.plantype.title");
        expect(instance.resourceBindings.plan.emptyFieldText).toBe("resource.emptyFieldText.default");
    });

    it("should override resource bindings if provided in props", () => {
        hasValue.mockReturnValue(true);
        getComponentDataValue.mockReturnValue({});
        hasMissingTextResources.mockReturnValue([]);
        hasValidationMessages.mockReturnValue(false);

        const props = {
            resourceBindings: {
                navn: { title: "Custom Navn" },
                plantype: { title: "Custom Plantype" },
                emptyFieldText: "Custom Empty Text"
            }
        };
        const instance = new CustomGroupPlan(props);

        expect(instance.resourceBindings.navn.title).toBe("Custom Navn");
        expect(instance.resourceBindings.plantype.title).toBe("Custom Plantype");
        expect(instance.resourceBindings.plan.emptyFieldText).toBe("Custom Empty Text");
    });

    it("should not include plan resource binding if hideIfEmpty is true", () => {
        hasValue.mockReturnValue(true);
        getComponentDataValue.mockReturnValue({});
        hasMissingTextResources.mockReturnValue([]);
        hasValidationMessages.mockReturnValue(false);

        const props = {
            hideIfEmpty: true
        };
        const instance = new CustomGroupPlan(props);

        expect(instance.resourceBindings.plan).toBeUndefined();
    });

    it('getResourceBindings should handle hideIfEmpty as string "true"', () => {
        const instance = new CustomGroupPlan({ hideIfEmpty: "true" });
        expect(instance.resourceBindings.plan).toBeUndefined();
    });

    it("getValueFromFormData should return Plan instance", () => {
        getComponentDataValue.mockReturnValue({ foo: "bar" });
        const instance = new CustomGroupPlan({});
        const plan = instance.getValueFromFormData({});
        expect(plan).toBeInstanceOf(Plan);
    });

    it("hasContent should call hasValue", () => {
        hasValue.mockReturnValue(true);
        const instance = new CustomGroupPlan({});
        const result = instance.hasContent("data");
        expect(hasValue).toHaveBeenCalledWith("data");
        expect(result).toBe(true);
    });

    it("getValidationMessages should call hasMissingTextResources", () => {
        getTextResources.mockReturnValue(["resource1", "resource2"]);
        hasMissingTextResources.mockReturnValue(["Missing"]);
        const instance = new CustomGroupPlan({});
        const result = instance.getValidationMessages({ foo: "bar" });
        expect(getTextResources).toHaveBeenCalled();
        expect(hasMissingTextResources).toHaveBeenCalledWith(["resource1", "resource2"], { foo: "bar" });
        expect(result).toEqual(["Missing"]);
    });
});
