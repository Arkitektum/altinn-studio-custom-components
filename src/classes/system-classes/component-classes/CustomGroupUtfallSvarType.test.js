import CustomGroupUtfallSvarType from "./CustomGroupUtfallSvarType";
import { getComponentDataValue, getComponentResourceValue, getTextResources, hasValue } from "../../../functions/helpers.js";
import { hasMissingTextResources, hasValidationMessages } from "../../../functions/validations.js";

// Mocks for dependencies
jest.mock("../../../functions/helpers.js", () => ({
    getComponentDataValue: jest.fn(),
    getComponentResourceValue: jest.fn(),
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

    it("should set isEmpty to true if hasContent returns false", () => {
        getComponentDataValue.mockReturnValue(null);
        hasValue.mockReturnValue(false);
        getComponentResourceValue.mockReturnValue("Empty");
        hasMissingTextResources.mockReturnValue([]);
        hasValidationMessages.mockReturnValue(false);

        const props = {};
        const instance = new CustomGroupUtfallSvarType(props);

        expect(instance.isEmpty).toBe(true);
        expect(instance.resourceValues.data).toBe("Empty");
    });

    it("should set isEmpty to false if hasContent returns true", () => {
        getComponentDataValue.mockReturnValue("Some value");
        hasValue.mockReturnValue(true);
        getComponentResourceValue.mockReturnValue("Should not be used");
        hasMissingTextResources.mockReturnValue([]);
        hasValidationMessages.mockReturnValue(false);

        const props = {};
        const instance = new CustomGroupUtfallSvarType(props);

        expect(instance.isEmpty).toBe(false);
        expect(instance.resourceValues.data).toBe("Some value");
    });

    it("should set validationMessages and hasValidationMessages correctly", () => {
        getComponentDataValue.mockReturnValue("data");
        hasValue.mockReturnValue(true);
        hasMissingTextResources.mockReturnValue(["Missing resource"]);
        hasValidationMessages.mockReturnValue(true);

        const props = {};
        const instance = new CustomGroupUtfallSvarType(props);

        expect(instance.validationMessages).toEqual(["Missing resource"]);
        expect(instance.hasValidationMessages).toBe(true);
    });

    it("should generate correct resourceBindings for utfallType", () => {
        getComponentDataValue.mockReturnValue("data");
        hasValue.mockReturnValue(true);
        hasMissingTextResources.mockReturnValue([]);
        hasValidationMessages.mockReturnValue(false);

        const props = { resourceValues: { utfallType: "YES" } };
        const instance = new CustomGroupUtfallSvarType(props);

        expect(instance.resourceBindings.title).toBe("resource.utfallBesvarelse.utfallSvar.yes.header");
    });

    it("hasContent should delegate to hasValue", () => {
        hasValue.mockReturnValue(true);
        const instance = new CustomGroupUtfallSvarType({});
        expect(instance.hasContent("abc")).toBe(true);
        expect(hasValue).toHaveBeenCalledWith("abc");
    });

    it("getValidationMessages should call hasMissingTextResources with textResources and resourceBindings", () => {
        getTextResources.mockReturnValue({ a: 1 });
        hasMissingTextResources.mockReturnValue("msg");
        const instance = new CustomGroupUtfallSvarType({});
        const result = instance.getValidationMessages({ foo: "bar" });
        expect(hasMissingTextResources).toHaveBeenCalledWith({ foo: "bar" });
        expect(result).toBe("msg");
    });

    it("getValueFromFormData should call getComponentDataValue with props", () => {
        getComponentDataValue.mockReturnValue("data");
        const instance = new CustomGroupUtfallSvarType({});
        const props = { some: "prop" };
        expect(instance.getValueFromFormData(props)).toBe("data");
        expect(getComponentDataValue).toHaveBeenCalledWith(props);
    });

    it("getResourceBindings should generate correct keys", () => {
        const instance = new CustomGroupUtfallSvarType({});
        const props = { resourceValues: { utfallType: "NO" } };
        const result = instance.getResourceBindings(props);
        expect(result.utfallSvarType.title).toBe("resource.utfallBesvarelse.utfallSvar.no.header");
    });

    it("getResourceBindings should handle missing utfallType gracefully", () => {
        const instance = new CustomGroupUtfallSvarType({});
        const props = {};
        const result = instance.getResourceBindings(props);
        expect(result.utfallSvarType.title).toBe("resource.utfallBesvarelse.utfallSvar.undefined.header");
    });
});
