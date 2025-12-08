import CustomGroupAdkomst from "./CustomGroupAdkomst";
const Adkomst = require("../../data-classes/Adkomst.js");

// Mocks
jest.mock("../CustomComponent.js", () => {
    return class {};
});
jest.mock("../../data-classes/Adkomst.js", () => {
    return jest.fn().mockImplementation((data) => ({ mockAdkomst: true, data }));
});
jest.mock("../../../functions/helpers.js", () => ({
    getComponentDataValue: jest.fn((props) => props.mockData || null),
    getTextResourceFromResourceBinding: jest.fn((key) => `text-for-${key}`),
    getTextResources: jest.fn(() => ({ resource1: "value1" })),
    hasValue: jest.fn((val) => val !== null && val !== undefined && val !== "")
}));
jest.mock("../../../functions/validations.js", () => ({
    hasMissingTextResources: jest.fn(() => ["missing resource"]),
    hasValidationMessages: jest.fn((messages) => Array.isArray(messages) && messages.length > 0)
}));

const { getComponentDataValue, getTextResources, hasValue } = require("../../../functions/helpers.js");
const { hasMissingTextResources } = require("../../../functions/validations.js");

describe("CustomGroupAdkomst", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should initialize with default resource bindings and values", () => {
        const props = { mockData: "test-data" };
        const instance = new CustomGroupAdkomst(props);

        expect(getComponentDataValue).toHaveBeenCalledWith(props);
        expect(Adkomst).toHaveBeenCalledWith("test-data");
        expect(instance.isEmpty).toBe(false);
        expect(instance.validationMessages).toEqual(["missing resource"]);
        expect(instance.hasValidationMessages).toBe(true);
        expect(instance.resourceBindings.erNyEllerEndretAdkomst.title).toBe("resource.rammebetingelser.adkomst.erNyEllerEndretAdkomst.title");
        expect(instance.resourceBindings.vegtype.title).toBe("resource.rammebetingelser.adkomst.vegtype.title");
        expect(instance.resourceBindings.adkomst.title).toBeUndefined();
        expect(instance.resourceBindings.adkomst.emptyFieldText).toBe("resource.emptyFieldText.default");
        expect(instance.resourceValues.data).toEqual({ mockAdkomst: true, data: "test-data" });
    });

    it("should use custom resourceValues.title if provided", () => {
        const props = {
            mockData: "test-data",
            resourceValues: { title: "Custom Title" }
        };
        const instance = new CustomGroupAdkomst(props);
        expect(instance.resourceValues.title).toBe("Custom Title");
    });

    it("should set isEmpty true if no data", () => {
        hasValue.mockReturnValueOnce(false);
        const props = { mockData: null };
        const instance = new CustomGroupAdkomst(props);
        expect(instance.isEmpty).toBe(true);
        expect(instance.resourceValues.data).toBe("text-for-resource.emptyFieldText.default");
    });

    it("hasContent should delegate to hasValue", () => {
        const instance = new CustomGroupAdkomst({});
        hasValue.mockReturnValueOnce(true);
        expect(instance.hasContent("some")).toBe(true);
        hasValue.mockReturnValueOnce(false);
        expect(instance.hasContent("")).toBe(false);
    });

    it("getValidationMessages should call hasMissingTextResources", () => {
        const instance = new CustomGroupAdkomst({});
        const bindings = { test: "value" };
        instance.getValidationMessages(bindings);
        expect(getTextResources).toHaveBeenCalled();
        expect(hasMissingTextResources).toHaveBeenCalled();
    });

    it("getValueFromFormData should return Adkomst instance", () => {
        const instance = new CustomGroupAdkomst({});
        const props = { mockData: "adkomst-data" };
        const result = instance.getValueFromFormData(props);
        expect(Adkomst).toHaveBeenCalledWith("adkomst-data");
        expect(result).toEqual({ mockAdkomst: true, data: "adkomst-data" });
    });

    it("getResourceBindings should use custom resource bindings", () => {
        const props = {
            resourceBindings: {
                erNyEllerEndretAdkomst: {
                    title: "custom-title",
                    trueText: "custom-true",
                    falseText: "custom-false"
                },
                vegtype: {
                    title: "custom-vegtype"
                },
                title: "custom-adkomst-title",
                emptyFieldText: "custom-empty"
            }
        };
        const instance = new CustomGroupAdkomst(props);
        expect(instance.resourceBindings.erNyEllerEndretAdkomst.title).toBe("custom-title");
        expect(instance.resourceBindings.erNyEllerEndretAdkomst.trueText).toBe("custom-true");
        expect(instance.resourceBindings.erNyEllerEndretAdkomst.falseText).toBe("custom-false");
        expect(instance.resourceBindings.vegtype.title).toBe("custom-vegtype");
        expect(instance.resourceBindings.adkomst.title).toBeUndefined();
        expect(instance.resourceBindings.adkomst.emptyFieldText).toBe("custom-empty");
    });

    it("getResourceBindings should omit adkomst.title if hideTitle is true", () => {
        const props = { hideTitle: true };
        const instance = new CustomGroupAdkomst(props);
        expect(instance.resourceBindings.adkomst).toEqual({ emptyFieldText: "resource.emptyFieldText.default" });
    });

    it("getResourceBindings should omit adkomst.emptyFieldText if hideIfEmpty is true", () => {
        const props = { hideIfEmpty: true };
        const instance = new CustomGroupAdkomst(props);
        expect(instance.resourceBindings.adkomst.emptyFieldText).toBeUndefined();
    });
});
