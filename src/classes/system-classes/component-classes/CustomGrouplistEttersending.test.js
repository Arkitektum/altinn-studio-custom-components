import CustomGrouplistEttersending from "./CustomGrouplistEttersending";
import { getComponentDataValue, getTextResourceFromResourceBinding, getTextResources, hasValue } from "../../../functions/helpers.js";
import { hasMissingTextResources, hasValidationMessages } from "../../../functions/validations.js";

// Mocks for global functions and dependencies
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

describe("CustomGrouplistEttersending", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should set isEmpty to true when data is empty", () => {
        getComponentDataValue.mockReturnValue(undefined);
        hasValue.mockReturnValue(false);
        getTextResourceFromResourceBinding.mockReturnValue("Empty text");
        hasMissingTextResources.mockReturnValue([]);
        hasValidationMessages.mockReturnValue(false);

        const props = {};
        const instance = new CustomGrouplistEttersending(props);

        expect(instance.isEmpty).toBe(true);
        expect(instance.resourceValues.data).toBe("Empty text");
    });

    it("should set isEmpty to false when data has value", () => {
        getComponentDataValue.mockReturnValue("Some data");
        hasValue.mockReturnValue(true);
        hasMissingTextResources.mockReturnValue([]);
        hasValidationMessages.mockReturnValue(false);

        const props = {};
        const instance = new CustomGrouplistEttersending(props);

        expect(instance.isEmpty).toBe(false);
        expect(instance.resourceValues.data).toBe("Some data");
    });

    it("should set validationMessages and hasValidationMessages correctly", () => {
        getComponentDataValue.mockReturnValue("Some data");
        hasValue.mockReturnValue(true);
        hasMissingTextResources.mockReturnValue(["Missing resource"]);
        hasValidationMessages.mockReturnValue(true);

        const props = {};
        const instance = new CustomGrouplistEttersending(props);

        expect(instance.validationMessages).toEqual(["Missing resource"]);
        expect(instance.hasValidationMessages).toBe(true);
    });

    it("getResourceBindings should use default values when not overridden", () => {
        const instance = new CustomGrouplistEttersending({});
        const bindings = instance.getResourceBindings({});
        expect(bindings.ettersendinger.title).toBe("resource.ettersendinger.title");
        expect(bindings.ettersendinger.emptyFieldText).toBe("resource.emptyFieldText.default");
    });

    it("getResourceBindings should use custom resourceBindings when provided", () => {
        const props = {
            resourceBindings: {
                title: "custom.title",
                emptyFieldText: "custom.emptyFieldText"
            }
        };
        const instance = new CustomGrouplistEttersending(props);
        const bindings = instance.getResourceBindings(props);
        expect(bindings.ettersendinger.title).toBe("custom.title");
        expect(bindings.ettersendinger.emptyFieldText).toBe("custom.emptyFieldText");
    });

    it("getResourceBindings should hide title if hideTitle is true", () => {
        const props = { hideTitle: true };
        const instance = new CustomGrouplistEttersending(props);
        const bindings = instance.getResourceBindings(props);
        expect(bindings.ettersendinger.title).toBeUndefined();
    });

    it("getResourceBindings should hide emptyFieldText if hideIfEmpty is true", () => {
        const props = { hideIfEmpty: true };
        const instance = new CustomGrouplistEttersending(props);
        const bindings = instance.getResourceBindings(props);
        expect(bindings.ettersendinger.emptyFieldText).toBeUndefined();
    });

    it("hasContent should delegate to hasValue", () => {
        const instance = new CustomGrouplistEttersending({});
        hasValue.mockReturnValue(true);
        expect(instance.hasContent("data")).toBe(true);
        hasValue.mockReturnValue(false);
        expect(instance.hasContent("")).toBe(false);
    });

    it("getValidationMessages should delegate to hasMissingTextResources", () => {
        getTextResources.mockReturnValue(["resource1", "resource2"]);
        hasMissingTextResources.mockReturnValue(["missing"]);
        const instance = new CustomGrouplistEttersending({});
        const result = instance.getValidationMessages({ ettersendinger: {} });
        expect(result).toEqual(["missing"]);
        expect(hasMissingTextResources).toHaveBeenCalled();
    });

    it("getValueFromFormData should delegate to getComponentDataValue", () => {
        getComponentDataValue.mockReturnValue("value");
        const instance = new CustomGrouplistEttersending({});
        expect(instance.getValueFromFormData({})).toBe("value");
        expect(getComponentDataValue).toHaveBeenCalled();
    });
});
