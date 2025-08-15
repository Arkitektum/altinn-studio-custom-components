import CustomGroupUtfallSvarType from "./CustomGroupUtfallSvarType";
import {
    getComponentDataValue,
    getComponentResourceValue,
    getTextResourceFromResourceBinding,
    getTextResources,
    hasValue
} from "../../../functions/helpers.js";
import { hasMissingTextResources, hasValidationMessages } from "../../../functions/validations.js";

// Mocks for dependencies
jest.mock("../../../functions/helpers.js", () => ({
    getComponentDataValue: jest.fn(),
    getComponentResourceValue: jest.fn(),
    getTextResourceFromResourceBinding: jest.fn(),
    getTextResources: jest.fn(),
    hasValue: jest.fn()
}));
jest.mock("../../../functions/validations.js", () => ({
    hasMissingTextResources: jest.fn(),
    hasValidationMessages: jest.fn()
}));

describe("CustomGroupUtfallSvarType", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should set isEmpty to true if data is empty", () => {
        getComponentDataValue.mockReturnValue(null);
        hasValue.mockReturnValue(false);
        getComponentResourceValue.mockReturnValue("Empty");
        getTextResourceFromResourceBinding.mockReturnValue("Title");
        hasMissingTextResources.mockReturnValue([]);
        hasValidationMessages.mockReturnValue(false);

        const props = {
            resourceValues: { utfallType: "YES" }
        };
        const instance = new CustomGroupUtfallSvarType(props);

        expect(instance.isEmpty).toBe(true);
        expect(instance.resourceValues.data).toBe("Empty");
    });

    it("should set isEmpty to false if data is present", () => {
        getComponentDataValue.mockReturnValue("Some value");
        hasValue.mockReturnValue(true);
        getTextResourceFromResourceBinding.mockReturnValue("Title");
        hasMissingTextResources.mockReturnValue([]);
        hasValidationMessages.mockReturnValue(false);

        const props = {
            resourceValues: { utfallType: "NO" }
        };
        const instance = new CustomGroupUtfallSvarType(props);

        expect(instance.isEmpty).toBe(false);
        expect(instance.resourceValues.data).toBe("Some value");
    });

    it("should set resourceValues.title to undefined if hideTitle is true", () => {
        getComponentDataValue.mockReturnValue("Value");
        hasValue.mockReturnValue(true);
        getTextResourceFromResourceBinding.mockReturnValue("Should not be used");
        hasMissingTextResources.mockReturnValue([]);
        hasValidationMessages.mockReturnValue(false);

        const props = {
            resourceValues: { utfallType: "YES" },
            hideTitle: true
        };
        const instance = new CustomGroupUtfallSvarType(props);

        expect(instance.resourceValues.title).toBeUndefined();
    });

    it("should call getValidationMessages and set validationMessages and hasValidationMessages", () => {
        getComponentDataValue.mockReturnValue("Value");
        hasValue.mockReturnValue(true);
        getTextResourceFromResourceBinding.mockReturnValue("Title");
        getTextResources.mockReturnValue(["resource1", "resource2"]);
        hasMissingTextResources.mockReturnValue(["Missing resource"]);
        hasValidationMessages.mockReturnValue(true);

        const props = {
            resourceValues: { utfallType: "YES" }
        };
        const instance = new CustomGroupUtfallSvarType(props);

        expect(instance.validationMessages).toEqual(["Missing resource"]);
        expect(instance.hasValidationMessages).toBe(true);
    });

    it("getResourceBindings should generate correct resource key", () => {
        const props = {
            resourceValues: { utfallType: "YES" }
        };
        const instance = new CustomGroupUtfallSvarType(props);
        const bindings = instance.getResourceBindings(props);
        expect(bindings.utfallSvarType.title).toBe("resource.utfallBesvarelse.utfallSvar.yes.header");
    });

    it("hasContent should delegate to hasValue", () => {
        hasValue.mockReturnValue(true);
        const props = {};
        const instance = new CustomGroupUtfallSvarType(props);
        expect(instance.hasContent("data")).toBe(true);
        expect(hasValue).toHaveBeenCalledWith("data");
    });

    it("getValueFromFormData should delegate to getComponentDataValue", () => {
        getComponentDataValue.mockReturnValue("formData");
        const props = {};
        const instance = new CustomGroupUtfallSvarType(props);
        expect(instance.getValueFromFormData(props)).toBe("formData");
        expect(getComponentDataValue).toHaveBeenCalledWith(props);
    });

    it("getValidationMessages should delegate to hasMissingTextResources", () => {
        getTextResources.mockReturnValue(["resource1"]);
        hasMissingTextResources.mockReturnValue(["msg"]);
        const props = {};
        const instance = new CustomGroupUtfallSvarType(props);
        const bindings = { utfallSvarType: { title: "key" } };
        expect(instance.getValidationMessages(bindings)).toEqual(["msg"]);
        expect(getTextResources).toHaveBeenCalled();
        expect(hasMissingTextResources).toHaveBeenCalledWith(["resource1"], bindings);
    });
});
