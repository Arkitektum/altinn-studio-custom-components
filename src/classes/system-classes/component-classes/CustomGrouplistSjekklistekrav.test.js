import CustomGrouplistSjekklistekrav from "./CustomGrouplistSjekklistekrav";
import { getComponentDataValue, getTextResourceFromResourceBinding, getTextResources, hasValue } from "../../../functions/helpers.js";
import { hasMissingTextResources, hasValidationMessages } from "../../../functions/validations.js";

// Mocks
jest.mock("../CustomComponent.js", () => {
    return class {};
});
jest.mock("../../data-classes/Sjekklistekrav.js", () => {
    return function Sjekklistekrav(data) {
        this.mockData = data;
    };
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

describe("CustomGrouplistSjekklistekrav", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should set isEmpty to true if hasContent returns false", () => {
        hasValue.mockReturnValue(false);
        getComponentDataValue.mockReturnValue([]);
        getTextResourceFromResourceBinding.mockReturnValue("empty");
        hasMissingTextResources.mockReturnValue([]);
        hasValidationMessages.mockReturnValue(false);

        const props = {};
        const instance = new CustomGrouplistSjekklistekrav(props);

        expect(instance.isEmpty).toBe(true);
        expect(instance.resourceValues.data).toBe("empty");
    });

    it("should set isEmpty to false if hasContent returns true", () => {
        hasValue.mockReturnValue(true);
        getComponentDataValue.mockReturnValue([{ id: 1 }]);
        getTextResourceFromResourceBinding.mockImplementation((key) => key);
        hasMissingTextResources.mockReturnValue([]);
        hasValidationMessages.mockReturnValue(false);

        const props = {};
        const instance = new CustomGrouplistSjekklistekrav(props);

        expect(instance.isEmpty).toBe(false);
        expect(Array.isArray(instance.resourceValues.data)).toBe(true);
    });

    it("should call getValidationMessages and set validationMessages", () => {
        hasValue.mockReturnValue(true);
        getComponentDataValue.mockReturnValue([{ id: 1 }]);
        getTextResourceFromResourceBinding.mockReturnValue("title");
        hasMissingTextResources.mockReturnValue(["missing"]);
        hasValidationMessages.mockReturnValue(true);

        const props = {};
        const instance = new CustomGrouplistSjekklistekrav(props);

        expect(instance.validationMessages).toEqual(["missing"]);
        expect(instance.hasValidationMessages).toBe(true);
    });

    it("getValueFromFormData should return array of Sjekklistekrav instances", () => {
        getComponentDataValue.mockReturnValue([{ foo: "bar" }, { baz: "qux" }]);
        const props = {};
        const instance = new CustomGrouplistSjekklistekrav(props);
        const result = instance.getValueFromFormData(props);

        expect(result).toHaveLength(2);
        expect(result[0].mockData).toEqual({ foo: "bar" });
        expect(result[1].mockData).toEqual({ baz: "qux" });
    });

    it("getResourceBindings should use default values if not provided", () => {
        const props = {};
        const instance = new CustomGrouplistSjekklistekrav(props);
        const bindings = instance.getResourceBindings(props);

        expect(bindings.sjekklistekrav.trueText).toBe("resource.trueText.default");
        expect(bindings.sjekklistekrav.falseText).toBe("resource.falseText.default");
        expect(bindings.sjekklistekrav.defaultText).toBe("resource.defaultText.default");
        expect(bindings.sjekklistekrav.title).toBe("resource.krav.sjekklistekrav.title");
        expect(bindings.sjekklistekrav.emptyFieldText).toBe("resource.emptyFieldText.default");
    });

    it("getResourceBindings should override values from props.resourceBindings", () => {
        const props = {
            resourceBindings: {
                trueText: "yes",
                falseText: "no",
                defaultText: "maybe",
                title: "My Title",
                emptyFieldText: "Nothing here"
            }
        };
        const instance = new CustomGrouplistSjekklistekrav(props);
        const bindings = instance.getResourceBindings(props);

        expect(bindings.sjekklistekrav.trueText).toBe("yes");
        expect(bindings.sjekklistekrav.falseText).toBe("no");
        expect(bindings.sjekklistekrav.defaultText).toBe("maybe");
        expect(bindings.sjekklistekrav.title).toBe("My Title");
        expect(bindings.sjekklistekrav.emptyFieldText).toBe("Nothing here");
    });

    it("getResourceBindings should hide title if hideTitle is true", () => {
        const props = { hideTitle: true };
        const instance = new CustomGrouplistSjekklistekrav(props);
        const bindings = instance.getResourceBindings(props);

        expect(bindings.sjekklistekrav.title).toBeUndefined();
    });

    it("getResourceBindings should hide emptyFieldText if hideIfEmpty is true", () => {
        const props = { hideIfEmpty: true };
        const instance = new CustomGrouplistSjekklistekrav(props);
        const bindings = instance.getResourceBindings(props);

        expect(bindings.sjekklistekrav.emptyFieldText).toBeUndefined();
    });

    it("hasContent should delegate to hasValue", () => {
        hasValue.mockReturnValue(true);
        const props = {};
        const instance = new CustomGrouplistSjekklistekrav(props);
        expect(instance.hasContent("data")).toBe(true);
        expect(hasValue).toHaveBeenCalledWith("data");
    });

    it("getValidationMessages should call hasMissingTextResources", () => {
        hasMissingTextResources.mockReturnValue(["missing"]);
        const props = {};
        const instance = new CustomGrouplistSjekklistekrav(props);
        const result = instance.getValidationMessages({ foo: "bar" });
        expect(hasMissingTextResources).toHaveBeenCalledWith({ foo: "bar" });
        expect(result).toEqual(["missing"]);
    });
});
