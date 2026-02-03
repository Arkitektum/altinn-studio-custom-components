import CustomGrouplistSamsvarAnsvarsomraade from "./CustomGrouplistSamsvarAnsvarsomraade.js";

// Mock all imported helpers and validations
jest.mock("../../../functions/helpers.js", () => ({
    getComponentDataValue: jest.fn(),
    getTextResourceFromResourceBinding: jest.fn(),
    hasValue: jest.fn()
}));
jest.mock("../../../functions/validations.js", () => ({
    hasMissingTextResources: jest.fn(),
    hasValidationMessages: jest.fn()
}));

const { getComponentDataValue, getTextResourceFromResourceBinding, hasValue } = require("../../../functions/helpers.js");
const { hasMissingTextResources, hasValidationMessages } = require("../../../functions/validations.js");

describe("CustomGrouplistSamsvarAnsvarsomraade", () => {
    let props;

    beforeEach(() => {
        props = {
            formData: { some: "data" },
            resourceBindings: {
                ansvarsomraade: { title: "custom.title", emptyFieldText: "custom.empty" }
            }
        };
        getComponentDataValue.mockReset();
        getTextResourceFromResourceBinding.mockReset();
        hasValue.mockReset();
        hasMissingTextResources.mockReset();
        hasValidationMessages.mockReset();
    });

    it("should set isEmpty to true if hasContent returns false", () => {
        getComponentDataValue.mockReturnValue(undefined);
        hasValue.mockReturnValue(false);
        hasMissingTextResources.mockReturnValue([]);
        hasValidationMessages.mockReturnValue(false);
        getTextResourceFromResourceBinding.mockImplementation((key) => key);

        const instance = new CustomGrouplistSamsvarAnsvarsomraade(props);

        expect(instance.isEmpty).toBe(true);
        expect(hasValue).toHaveBeenCalled();
        expect(instance.resourceValues.data).toBe("custom.empty");
    });

    it("should set isEmpty to false if hasContent returns true", () => {
        getComponentDataValue.mockReturnValue("some value");
        hasValue.mockReturnValue(true);
        hasMissingTextResources.mockReturnValue([]);
        hasValidationMessages.mockReturnValue(false);
        getTextResourceFromResourceBinding.mockImplementation((key) => key);

        const instance = new CustomGrouplistSamsvarAnsvarsomraade(props);

        expect(instance.isEmpty).toBe(false);
        expect(instance.resourceValues.data).toBe("some value");
    });

    it("should call getComponentDataValue with props", () => {
        getComponentDataValue.mockReturnValue("data");
        hasValue.mockReturnValue(true);
        hasMissingTextResources.mockReturnValue([]);
        hasValidationMessages.mockReturnValue(false);
        getTextResourceFromResourceBinding.mockImplementation((key) => key);

        new CustomGrouplistSamsvarAnsvarsomraade(props);

        expect(getComponentDataValue).toHaveBeenCalledWith(props);
    });

    it("should call hasMissingTextResources and hasValidationMessages", () => {
        getComponentDataValue.mockReturnValue("data");
        hasValue.mockReturnValue(true);
        hasMissingTextResources.mockReturnValue(["missing"]);
        hasValidationMessages.mockReturnValue(true);
        getTextResourceFromResourceBinding.mockImplementation((key) => key);

        const instance = new CustomGrouplistSamsvarAnsvarsomraade(props);

        expect(hasMissingTextResources).toHaveBeenCalled();
        expect(hasValidationMessages).toHaveBeenCalledWith(["missing"]);
        expect(instance.validationMessages).toEqual(["missing"]);
        expect(instance.hasValidationMessages).toBe(true);
    });

    it("should use default resource bindings if not provided", () => {
        getComponentDataValue.mockReturnValue("data");
        hasValue.mockReturnValue(true);
        hasMissingTextResources.mockReturnValue([]);
        hasValidationMessages.mockReturnValue(false);
        getTextResourceFromResourceBinding.mockImplementation((key) => key);

        const instance = new CustomGrouplistSamsvarAnsvarsomraade({});

        expect(instance.resourceBindings.funksjon.title).toBe("resource.funksjon.title");
        expect(instance.resourceBindings.ansvarsomraade.title).toBe("resource.ansvarsomraade.title");
    });

    it("should override resource bindings if provided in props", () => {
        getComponentDataValue.mockReturnValue("data");
        hasValue.mockReturnValue(true);
        hasMissingTextResources.mockReturnValue([]);
        hasValidationMessages.mockReturnValue(false);
        getTextResourceFromResourceBinding.mockImplementation((key) => key);

        const customProps = {
            resourceBindings: {
                funksjon: { title: "custom.funksjon.title" },
                ansvarsomraade: { title: "custom.ansvarsomraade.title" }
            }
        };
        const instance = new CustomGrouplistSamsvarAnsvarsomraade(customProps);

        expect(instance.resourceBindings.funksjon.title).toBe("custom.funksjon.title");
        expect(instance.resourceBindings.ansvarsomraade.title).toBe("custom.ansvarsomraade.title");
    });

    it("hasContent should delegate to hasValue", () => {
        hasValue.mockReturnValue(true);
        const instance = Object.create(CustomGrouplistSamsvarAnsvarsomraade.prototype);
        expect(instance.hasContent("abc")).toBe(true);
        expect(hasValue).toHaveBeenCalledWith("abc");
    });

    it("getValidationMessages should delegate to hasMissingTextResources", () => {
        hasMissingTextResources.mockReturnValue(["missing"]);
        const instance = Object.create(CustomGrouplistSamsvarAnsvarsomraade.prototype);
        expect(instance.getValidationMessages("bindings")).toEqual(["missing"]);
        expect(hasMissingTextResources).toHaveBeenCalledWith("bindings");
    });

    it("getValueFromFormData should delegate to getComponentDataValue", () => {
        getComponentDataValue.mockReturnValue("value");
        const instance = Object.create(CustomGrouplistSamsvarAnsvarsomraade.prototype);
        expect(instance.getValueFromFormData("props")).toBe("value");
        expect(getComponentDataValue).toHaveBeenCalledWith("props");
    });

    it("getResourceBindings should return all keys with defaults if not provided", () => {
        const instance = Object.create(CustomGrouplistSamsvarAnsvarsomraade.prototype);
        const result = instance.getResourceBindings({});
        expect(result.funksjon.title).toBe("resource.funksjon.title");
        expect(result.ansvarsomraade.title).toBe("resource.ansvarsomraade.title");
        expect(result.Ferdigattest.emptyFieldText).toBe("resource.emptyFieldText.default");
    });
});
