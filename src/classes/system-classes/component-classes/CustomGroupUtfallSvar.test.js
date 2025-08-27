import CustomGroupUtfallSvar from "./CustomGroupUtfallSvar";
import UtfallSvar from "../../data-classes/UtfallSvar";
import CustomComponent from "../CustomComponent";
import { getComponentDataValue, getTextResourceFromResourceBinding, getTextResources, hasValue } from "../../../functions/helpers";
import { hasMissingTextResources, hasValidationMessages } from "../../../functions/validations";

// Mocks for helpers and validations
jest.mock("../../../functions/helpers", () => ({
    getComponentDataValue: jest.fn(),
    getTextResourceFromResourceBinding: jest.fn(),
    getTextResources: jest.fn(),
    hasValue: jest.fn()
}));
jest.mock("../../../functions/validations", () => ({
    hasMissingTextResources: jest.fn(),
    hasValidationMessages: jest.fn()
}));

describe("CustomGroupUtfallSvar", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should extend CustomComponent", () => {
        const instance = new CustomGroupUtfallSvar({});
        expect(instance instanceof CustomComponent).toBe(true);
    });

    it("should set isEmpty to true if hasContent returns false", () => {
        hasValue.mockReturnValue(false);
        getComponentDataValue.mockReturnValue("someData");
        getTextResourceFromResourceBinding.mockReturnValue("emptyText");
        hasMissingTextResources.mockReturnValue(false);
        hasValidationMessages.mockReturnValue(false);

        const props = {};
        const instance = new CustomGroupUtfallSvar(props);

        expect(instance.isEmpty).toBe(true);
        expect(instance.resourceValues.data).toBe("emptyText");
    });

    it("should set isEmpty to false if hasContent returns true", () => {
        hasValue.mockReturnValue(true);
        getComponentDataValue.mockReturnValue("someData");
        hasMissingTextResources.mockReturnValue(false);
        hasValidationMessages.mockReturnValue(false);

        const props = {};
        const instance = new CustomGroupUtfallSvar(props);

        expect(instance.isEmpty).toBe(false);
        expect(instance.resourceValues.data).toBeInstanceOf(UtfallSvar);
    });

    it("should set hasValidationMessages based on hasValidationMessages helper", () => {
        hasValue.mockReturnValue(true);
        getComponentDataValue.mockReturnValue("someData");
        hasMissingTextResources.mockReturnValue("validationMessages");
        hasValidationMessages.mockReturnValue(true);

        const props = {};
        const instance = new CustomGroupUtfallSvar(props);

        expect(instance.hasValidationMessages).toBe(true);
        expect(instance.validationMessages).toBe("validationMessages");
    });

    it("should use custom emptyFieldText from props.resourceBindings", () => {
        hasValue.mockReturnValue(false);
        getComponentDataValue.mockReturnValue("someData");
        getTextResourceFromResourceBinding.mockReturnValue("customEmptyText");
        hasMissingTextResources.mockReturnValue(false);
        hasValidationMessages.mockReturnValue(false);

        const props = {
            resourceBindings: {
                emptyFieldText: "custom.empty.text"
            }
        };
        const instance = new CustomGroupUtfallSvar(props);

        expect(instance.resourceBindings.emptyFieldText).toBe("custom.empty.text");
        expect(instance.resourceValues.data).toBe("customEmptyText");
    });

    it("should not set emptyFieldText if hideIfEmpty is true", () => {
        hasValue.mockReturnValue(true);
        getComponentDataValue.mockReturnValue("someData");
        hasMissingTextResources.mockReturnValue(false);
        hasValidationMessages.mockReturnValue(false);

        const props = {
            hideIfEmpty: true
        };
        const instance = new CustomGroupUtfallSvar(props);

        expect(instance.resourceBindings.emptyFieldText).toBeUndefined();
    });

    it("getResourceBindings should return default bindings and emptyFieldText if hideIfEmpty is not true", () => {
        const instance = new CustomGroupUtfallSvar({});
        const bindings = instance.getResourceBindings({});
        expect(bindings.utfallSvar["status.title"]).toBeDefined();
        expect(bindings.utfallSvar.emptyFieldText).toBe("resource.emptyFieldText.default");
    });

    it("getResourceBindings should not include emptyFieldText if hideIfEmpty is true", () => {
        const instance = new CustomGroupUtfallSvar({});
        const bindings = instance.getResourceBindings({ hideIfEmpty: true });
        expect(bindings.utfallSvar.emptyFieldText).toBeUndefined();
    });

    it("hasContent should delegate to hasValue", () => {
        hasValue.mockReturnValue(true);
        const instance = new CustomGroupUtfallSvar({});
        expect(instance.hasContent("data")).toBe(true);
        expect(hasValue).toHaveBeenCalledWith("data");
    });

    it("getValidationMessages should call hasMissingTextResources with textResources and resourceBindings", () => {
        getTextResources.mockReturnValue("resources");
        hasMissingTextResources.mockReturnValue("missing");
        const instance = new CustomGroupUtfallSvar({});
        const result = instance.getValidationMessages("bindings");
        expect(getTextResources).toHaveBeenCalled();
        expect(hasMissingTextResources).toHaveBeenCalledWith("resources", "bindings");
        expect(result).toBe("missing");
    });

    it("getValueFromFormData should return UtfallSvar instance", () => {
        getComponentDataValue.mockReturnValue("data");
        const instance = new CustomGroupUtfallSvar({});
        const result = instance.getValueFromFormData({});
        expect(result).toBeInstanceOf(UtfallSvar);
    });
});
