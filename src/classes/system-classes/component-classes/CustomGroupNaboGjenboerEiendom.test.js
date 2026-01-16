import CustomGroupNaboGjenboerEiendom from "./CustomGroupNaboGjenboerEiendom";
import CustomComponent from "../CustomComponent";
import NaboGjenboerEiendom from "../../data-classes/NaboGjenboerEiendom";

// Mock helpers and validations
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

const {
    getComponentDataValue,
    getTextResourceFromResourceBinding,
    getTextResources,
    hasValue
} = require("../../../functions/helpers");
const { hasMissingTextResources, hasValidationMessages } = require("../../../functions/validations");

jest.mock("../../data-classes/NaboGjenboerEiendom");

describe("CustomGroupNaboGjenboerEiendom", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        NaboGjenboerEiendom.mockImplementation((data) => ({ ...data, _isNabo: true }));
        getTextResources.mockReturnValue(["resource1", "resource2"]);
        hasMissingTextResources.mockReturnValue(false);
        hasValidationMessages.mockReturnValue(false);
        getTextResourceFromResourceBinding.mockReturnValue("EMPTY");
    });

    it("should extend CustomComponent", () => {
        const instance = new CustomGroupNaboGjenboerEiendom({});
        expect(instance instanceof CustomComponent).toBe(true);
    });

    it("should set isEmpty to true if hasContent returns false", () => {
        hasValue.mockReturnValue(false);
        getComponentDataValue.mockReturnValue({});
        const instance = new CustomGroupNaboGjenboerEiendom({});
        expect(instance.isEmpty).toBe(true);
    });

    it("should set isEmpty to false if hasContent returns true", () => {
        hasValue.mockReturnValue(true);
        getComponentDataValue.mockReturnValue({ foo: "bar" });
        const instance = new CustomGroupNaboGjenboerEiendom({});
        expect(instance.isEmpty).toBe(false);
    });

    it("should call getComponentDataValue and wrap in NaboGjenboerEiendom", () => {
        hasValue.mockReturnValue(true);
        getComponentDataValue.mockReturnValue({ foo: "bar" });
        const instance = new CustomGroupNaboGjenboerEiendom({});
        expect(getComponentDataValue).toHaveBeenCalled();
        expect(NaboGjenboerEiendom).toHaveBeenCalledWith({ foo: "bar" });
        expect(instance.resourceValues.data).toEqual({ foo: "bar", _isNabo: true });
    });

    it("should set resourceValues.data to emptyFieldText if isEmpty", () => {
        hasValue.mockReturnValue(false);
        getComponentDataValue.mockReturnValue({});
        const props = {};
        const instance = new CustomGroupNaboGjenboerEiendom(props);
        expect(getTextResourceFromResourceBinding).toHaveBeenCalled();
        expect(instance.resourceValues.data).toBe("EMPTY");
    });

    it("should call hasMissingTextResources and hasValidationMessages", () => {
        hasValue.mockReturnValue(true);
        getComponentDataValue.mockReturnValue({ foo: "bar" });
        hasMissingTextResources.mockReturnValue(["missing"]);
        hasValidationMessages.mockReturnValue(true);
        const instance = new CustomGroupNaboGjenboerEiendom({});
        expect(hasMissingTextResources).toHaveBeenCalled();
        expect(instance.validationMessages).toEqual(["missing"]);
        expect(instance.hasValidationMessages).toBe(true);
    });

    it("getResourceBindings returns default resource keys", () => {
        const instance = new CustomGroupNaboGjenboerEiendom({});
        const bindings = instance.getResourceBindings({});
        expect(bindings.eiendomMatrikkelinformasjon.title).toBe(
            "resource.naboGjenboer.eiendommer.eiendom.matrikkelinformasjon.title"
        );
        expect(bindings.eier.title).toBe("resource.eier.title");
        expect(bindings.naboGjenboerEiendom.emptyFieldText).toBe("resource.emptyFieldText.default");
    });

    it("getResourceBindings uses custom resourceBindings from props", () => {
        const props = {
            resourceBindings: {
                eiendom: { title: "custom.eiendom.title" },
                emptyFieldText: "custom.empty.text"
            }
        };
        const instance = new CustomGroupNaboGjenboerEiendom(props);
        const bindings = instance.getResourceBindings(props);
        expect(bindings.eiendomMatrikkelinformasjon.title).toBe("custom.eiendom.title");
        expect(bindings.naboGjenboerEiendom.emptyFieldText).toBe("custom.empty.text");
    });

    it("getResourceBindings omits naboGjenboerEiendom if hideIfEmpty is true", () => {
        const props = { hideIfEmpty: true };
        const instance = new CustomGroupNaboGjenboerEiendom(props);
        const bindings = instance.getResourceBindings(props);
        expect(bindings.naboGjenboerEiendom).toBeUndefined();
    });

    it('getResourceBindings omits naboGjenboerEiendom if hideIfEmpty is "true"', () => {
        const props = { hideIfEmpty: "true" };
        const instance = new CustomGroupNaboGjenboerEiendom(props);
        const bindings = instance.getResourceBindings(props);
        expect(bindings.naboGjenboerEiendom).toBeUndefined();
    });

    it("hasContent delegates to hasValue", () => {
        hasValue.mockReturnValue(true);
        const instance = new CustomGroupNaboGjenboerEiendom({});
        expect(instance.hasContent("abc")).toBe(true);
        expect(hasValue).toHaveBeenCalledWith("abc");
    });

    it("getValidationMessages delegates to hasMissingTextResources", () => {
        getTextResources.mockReturnValue(["foo"]);
        hasMissingTextResources.mockReturnValue(["missing"]);
        const instance = new CustomGroupNaboGjenboerEiendom({});
        expect(instance.getValidationMessages({})).toEqual(["missing"]);
        expect(hasMissingTextResources).toHaveBeenCalled();
    });

    it("getValueFromFormData returns NaboGjenboerEiendom instance", () => {
        getComponentDataValue.mockReturnValue({ foo: "bar" });
        const instance = new CustomGroupNaboGjenboerEiendom({});
        const result = instance.getValueFromFormData({});
        expect(NaboGjenboerEiendom).toHaveBeenCalledWith({ foo: "bar" });
        expect(result).toEqual({ foo: "bar", _isNabo: true });
    });
});
