import CustomGroupVegtypeTillatelse from "./CustomGroupVegtypeTillatelse";
import { getComponentDataValue, getTextResourceFromResourceBinding, hasValue } from "../../../functions/helpers.js";
import { hasMissingTextResources, hasValidationMessages } from "../../../functions/validations.js";

// Mock dependencies
jest.mock("../CustomComponent.js", () => {
    return jest.fn().mockImplementation(() => {});
});
jest.mock("../../../functions/helpers.js", () => ({
    getComponentDataValue: jest.fn(),
    getTextResourceFromResourceBinding: jest.fn(),
    hasValue: jest.fn()
}));
jest.mock("../../../functions/validations.js", () => ({
    hasMissingTextResources: jest.fn(),
    hasValidationMessages: jest.fn()
}));

describe("CustomGroupVegtypeTillatelse", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should set isEmpty to true if data has no value", () => {
        getComponentDataValue.mockReturnValue(undefined);
        hasValue.mockReturnValue(false);
        hasMissingTextResources.mockReturnValue([]);
        hasValidationMessages.mockReturnValue(false);
        getTextResourceFromResourceBinding.mockReturnValue("Empty");

        const instance = new CustomGroupVegtypeTillatelse({});
        expect(instance.isEmpty).toBe(true);
        expect(instance.resourceValues.data).toBe("Empty");
    });

    it("should set isEmpty to false if data has value", () => {
        getComponentDataValue.mockReturnValue("some data");
        hasValue.mockReturnValue(true);
        hasMissingTextResources.mockReturnValue([]);
        hasValidationMessages.mockReturnValue(false);

        const instance = new CustomGroupVegtypeTillatelse({});
        expect(instance.isEmpty).toBe(false);
        expect(instance.resourceValues.data).toBe("some data");
    });

    it("should use custom resourceBindings if provided", () => {
        getComponentDataValue.mockReturnValue("data");
        hasValue.mockReturnValue(true);
        hasMissingTextResources.mockReturnValue([]);
        hasValidationMessages.mockReturnValue(false);

        const props = {
            resourceBindings: {
                vegtype: { title: "custom.vegtype.title" },
                erTillatelseGitt: {
                    title: "custom.tillatelse.title",
                    trueText: "custom.true",
                    falseText: "custom.false",
                    defaultText: "custom.default"
                },
                emptyFieldText: "custom.empty"
            }
        };

        const instance = new CustomGroupVegtypeTillatelse(props);
        expect(instance.resourceBindings.vegtype.title).toBe("custom.vegtype.title");
        expect(instance.resourceBindings.erTillatelseGitt.title).toBe("custom.tillatelse.title");
        expect(instance.resourceBindings.erTillatelseGitt.trueText).toBe("custom.true");
        expect(instance.resourceBindings.erTillatelseGitt.falseText).toBe("custom.false");
        expect(instance.resourceBindings.erTillatelseGitt.defaultText).toBe("custom.default");
        expect(instance.resourceBindings.vegtypeTillatelse.emptyFieldText).toBe("custom.empty");
    });

    it("should use default resourceBindings if not provided", () => {
        getComponentDataValue.mockReturnValue("data");
        hasValue.mockReturnValue(true);
        hasMissingTextResources.mockReturnValue([]);
        hasValidationMessages.mockReturnValue(false);

        const instance = new CustomGroupVegtypeTillatelse({});
        expect(instance.resourceBindings.vegtype.title).toBe("resource.rammebetingelser.adkomst.vegtype.title");
        expect(instance.resourceBindings.erTillatelseGitt.title).toBe("resource.rammebetingelser.adkomst.erTillatelseGitt.title");
        expect(instance.resourceBindings.erTillatelseGitt.trueText).toBe("resource.trueText.default");
        expect(instance.resourceBindings.erTillatelseGitt.falseText).toBe("resource.falseText.default");
        expect(instance.resourceBindings.erTillatelseGitt.defaultText).toBe("resource.emptyFieldText.default");
        expect(instance.resourceBindings.vegtypeTillatelse.emptyFieldText).toBe("resource.emptyFieldText.default");
    });

    it("should omit vegtypeTillatelse if hideIfEmpty is true", () => {
        getComponentDataValue.mockReturnValue("data");
        hasValue.mockReturnValue(true);
        hasMissingTextResources.mockReturnValue([]);
        hasValidationMessages.mockReturnValue(false);

        const props = { hideIfEmpty: true };
        const instance = new CustomGroupVegtypeTillatelse(props);
        expect(instance.resourceBindings.vegtypeTillatelse).toBeUndefined();
    });

    it('should omit vegtypeTillatelse if hideIfEmpty is "true" (string)', () => {
        getComponentDataValue.mockReturnValue("data");
        hasValue.mockReturnValue(true);
        hasMissingTextResources.mockReturnValue([]);
        hasValidationMessages.mockReturnValue(false);

        const props = { hideIfEmpty: "true" };
        const instance = new CustomGroupVegtypeTillatelse(props);
        expect(instance.resourceBindings.vegtypeTillatelse).toBeUndefined();
    });

    it("hasContent should delegate to hasValue", () => {
        hasValue.mockReturnValue(true);
        const instance = new CustomGroupVegtypeTillatelse({});
        expect(instance.hasContent("abc")).toBe(true);
        expect(hasValue).toHaveBeenCalledWith("abc");
    });

    it("getValidationMessages should delegate to hasMissingTextResources", () => {
        hasMissingTextResources.mockReturnValue(["missing"]);
        const instance = new CustomGroupVegtypeTillatelse({});
        expect(instance.getValidationMessages({})).toEqual(["missing"]);
        expect(hasMissingTextResources).toHaveBeenCalled();
    });

    it("getValueFromFormData should delegate to getComponentDataValue", () => {
        getComponentDataValue.mockReturnValue("value");
        const instance = new CustomGroupVegtypeTillatelse({});
        expect(instance.getValueFromFormData({})).toBe("value");
        expect(getComponentDataValue).toHaveBeenCalled();
    });

    it("should set validationMessages and hasValidationMessages correctly", () => {
        getComponentDataValue.mockReturnValue("data");
        hasValue.mockReturnValue(true);
        hasMissingTextResources.mockReturnValue(["missing"]);
        hasValidationMessages.mockReturnValue(true);

        const instance = new CustomGroupVegtypeTillatelse({});
        expect(instance.validationMessages).toEqual(["missing"]);
        expect(instance.hasValidationMessages).toBe(true);
    });
});
