import CustomGroupOvervann from "./CustomGroupOvervann";
const { hasMissingTextResources, hasValidationMessages } = require("../../../functions/validations.js");
const Overvann = require("../../data-classes/Overvann.js");

// Mocks for dependencies
jest.mock("../CustomComponent.js", () => {
    return class {};
});
jest.mock("../../data-classes/Overvann.js", () => {
    return jest.fn().mockImplementation((data) => ({ ...data }));
});
jest.mock("../../../functions/helpers.js", () => ({
    getComponentDataValue: jest.fn((props) => props?.formData || {}),
    getTextResourceFromResourceBinding: jest.fn((key) => `text-for-${key}`),
    getTextResources: jest.fn(() => ({ a: "A", b: "B" })),
    hasValue: jest.fn((val) => val !== undefined && val !== null && val !== "")
}));
jest.mock("../../../functions/validations.js", () => ({
    hasMissingTextResources: jest.fn(() => false),
    hasValidationMessages: jest.fn((messages) => !!messages)
}));

const { getComponentDataValue, getTextResources, hasValue } = require("../../../functions/helpers.js");

describe("CustomGroupOvervann", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should initialize with default resource bindings and values when no props are provided", () => {
        const instance = new CustomGroupOvervann({});
        expect(instance.resourceBindings.ledesOvervannTilTerreng.title).toBe("resource.rammebetingelser.overvann.ledesOvervannTilTerreng.title");
        expect(instance.resourceBindings.ledesOvervannTilTerreng.trueText).toBe("resource.trueText.default");
        expect(instance.resourceBindings.ledesOvervannTilTerreng.falseText).toBe("resource.falseText.default");
        expect(instance.resourceBindings.ledesOvervannTilAvloepssystem.title).toBe(
            "resource.rammebetingelser.overvann.ledesOvervannTilAvloepssystem.title"
        );
        expect(instance.resourceBindings.overvann.title).toBeUndefined();
        expect(instance.resourceBindings.overvann.emptyFieldText).toBe("resource.emptyFieldText.default");
        expect(instance.resourceValues.data).toEqual({});
    });

    it("should use provided resourceValues.title if present", () => {
        const instance = new CustomGroupOvervann({
            resourceValues: { title: "Custom Title" }
        });
        expect(instance.resourceValues.title).toBe("Custom Title");
    });

    it("should use Overvann instance for data if not empty", () => {
        const formData = { foo: "bar" };
        hasValue.mockReturnValueOnce(true); // for isEmpty
        const instance = new CustomGroupOvervann({ formData });
        expect(instance.isEmpty).toBe(false);
        expect(Overvann).toHaveBeenCalledWith(formData);
        expect(instance.resourceValues.data).toEqual(expect.objectContaining({ foo: "bar" }));
    });

    it("should call getValidationMessages and set validationMessages", () => {
        hasMissingTextResources.mockReturnValueOnce(["Missing"]);
        hasValidationMessages.mockReturnValueOnce(true);
        const instance = new CustomGroupOvervann({});
        expect(instance.validationMessages).toEqual(["Missing"]);
        expect(instance.hasValidationMessages).toBe(true);
    });

    it("hasContent should delegate to hasValue", () => {
        const instance = new CustomGroupOvervann({});
        hasValue.mockReturnValueOnce(true);
        expect(instance.hasContent("abc")).toBe(true);
        hasValue.mockReturnValueOnce(false);
        expect(instance.hasContent("")).toBe(false);
    });

    it("getValidationMessages should call hasMissingTextResources with textResources and resourceBindings", () => {
        const instance = new CustomGroupOvervann({});
        instance.getValidationMessages({ foo: "bar" });
        expect(getTextResources).toHaveBeenCalled();
        expect(hasMissingTextResources).toHaveBeenCalledWith(expect.any(Object), { foo: "bar" });
    });

    it("getValueFromFormData should call getComponentDataValue and construct Overvann", () => {
        const instance = new CustomGroupOvervann({});
        const props = { formData: { a: 1 } };
        getComponentDataValue.mockReturnValueOnce({ a: 1 });
        const result = instance.getValueFromFormData(props);
        expect(getComponentDataValue).toHaveBeenCalledWith(props);
        expect(result).toEqual(expect.objectContaining({ a: 1 }));
    });

    it("getResourceBindings should use custom resourceBindings if provided", () => {
        const props = {
            resourceBindings: {
                ledesOvervannTilTerreng: {
                    title: "custom-title",
                    trueText: "yes",
                    falseText: "no"
                },
                ledesOvervannTilAvloepssystem: {
                    title: "custom-title2",
                    trueText: "yes2",
                    falseText: "no2"
                },
                title: "main-title",
                emptyFieldText: "empty"
            }
        };
        const instance = new CustomGroupOvervann(props);
        expect(instance.resourceBindings.ledesOvervannTilTerreng.title).toBe("custom-title");
        expect(instance.resourceBindings.ledesOvervannTilTerreng.trueText).toBe("yes");
        expect(instance.resourceBindings.ledesOvervannTilTerreng.falseText).toBe("no");
        expect(instance.resourceBindings.ledesOvervannTilAvloepssystem.title).toBe("custom-title2");
        expect(instance.resourceBindings.ledesOvervannTilAvloepssystem.trueText).toBe("yes2");
        expect(instance.resourceBindings.ledesOvervannTilAvloepssystem.falseText).toBe("no2");
        expect(instance.resourceBindings.overvann.title).toBeUndefined();
        expect(instance.resourceBindings.overvann.emptyFieldText).toBe("empty");
    });

    it("getResourceBindings should omit overvann.title if hideTitle is true", () => {
        const props = { hideTitle: true };
        const instance = new CustomGroupOvervann(props);
        expect(instance.resourceBindings.overvann).not.toHaveProperty("title");
    });

    it("getResourceBindings should omit overvann.emptyFieldText if hideIfEmpty is true", () => {
        const props = { hideIfEmpty: true };
        const instance = new CustomGroupOvervann(props);
        expect(instance.resourceBindings.overvann).not.toHaveProperty("emptyFieldText");
    });
});
