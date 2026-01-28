import CustomGroupAvloep from "./CustomGroupAvloep";
const { hasMissingTextResources, hasValidationMessages } = require("../../../functions/validations.js");

// Mocks
jest.mock("../CustomComponent.js", () => {
    return class {};
});
jest.mock("../../data-classes/Avloep.js", () => {
    return jest.fn().mockImplementation((data) => ({ mockAvloep: true, data }));
});
jest.mock("../../../functions/helpers.js", () => ({
    getComponentDataValue: jest.fn((props) => props?.formData || null),
    getTextResourceFromResourceBinding: jest.fn((key) => `text-for-${key}`),
    getTextResources: jest.fn(() => ({ resource1: "text1" })),
    hasValue: jest.fn((val) => val !== null && val !== undefined && val !== "")
}));
jest.mock("../../../functions/validations.js", () => ({
    hasMissingTextResources: jest.fn(() => ["missing resource"]),
    hasValidationMessages: jest.fn((messages) => Array.isArray(messages) && messages.length > 0)
}));

const { getComponentDataValue, getTextResources, hasValue } = require("../../../functions/helpers.js");

describe("CustomGroupAvloep", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should initialize with empty data and default resource bindings", () => {
        getComponentDataValue.mockReturnValue(null);
        hasValue.mockReturnValue(false);
        hasMissingTextResources.mockReturnValue(["missing resource"]);
        hasValidationMessages.mockReturnValue(true);

        const props = {};
        const instance = new CustomGroupAvloep(props);

        expect(instance.isEmpty).toBe(true);
        expect(instance.validationMessages).toEqual(["missing resource"]);
        expect(instance.hasValidationMessages).toBe(true);
        expect(instance.resourceBindings).toHaveProperty("harTinglystErklaering");
        expect(instance.resourceBindings).toHaveProperty("krysserAvloepAnnensGrunn");
        expect(instance.resourceBindings).toHaveProperty("tilknytningstype");
        expect(instance.resourceBindings).toHaveProperty("avloep");
        expect(instance.resourceValues.data).toBe("text-for-resource.emptyFieldText.default");
    });

    it("should use provided resourceValues.title if present", () => {
        getComponentDataValue.mockReturnValue(null);
        hasValue.mockImplementation((val) => !!val);

        const props = {
            resourceValues: { title: "Custom Title" }
        };
        const instance = new CustomGroupAvloep(props);

        expect(instance.resourceValues.title).toBe("Custom Title");
    });

    it("should set resourceValues.data to Avloep instance if not empty", () => {
        getComponentDataValue.mockReturnValue("someData");
        hasValue.mockReturnValue(true);

        const props = { formData: "someData" };
        const instance = new CustomGroupAvloep(props);

        expect(instance.resourceValues.data).toEqual({ mockAvloep: true, data: "someData" });
    });

    it("hasContent should delegate to hasValue", () => {
        const instance = new CustomGroupAvloep({});
        hasValue.mockReturnValue(true);
        expect(instance.hasContent("abc")).toBe(true);
        hasValue.mockReturnValue(false);
        expect(instance.hasContent("")).toBe(false);
    });

    it("getValidationMessages should call hasMissingTextResources", () => {
        const instance = new CustomGroupAvloep({});
        const bindings = { test: "value" };
        instance.getValidationMessages(bindings);
        expect(hasMissingTextResources).toHaveBeenCalledWith(bindings);
    });

    it("getValueFromFormData should return Avloep instance", () => {
        getComponentDataValue.mockReturnValue("formData");
        const instance = new CustomGroupAvloep({});
        const result = instance.getValueFromFormData({ formData: "formData" });
        expect(result).toEqual({ mockAvloep: true, data: "formData" });
    });

    it("getResourceBindings should use custom resource bindings if provided", () => {
        const props = {
            resourceBindings: {
                harTinglystErklaering: { title: "customTitle", trueText: "yes", falseText: "no" },
                krysserAvloepAnnensGrunn: { title: "otherTitle", trueText: "yup", falseText: "nope" },
                tilknytningstype: { title: "typeTitle" },
                title: "mainTitle",
                emptyFieldText: "emptyText"
            }
        };
        const instance = new CustomGroupAvloep(props);
        expect(instance.resourceBindings.harTinglystErklaering.title).toBe("customTitle");
        expect(instance.resourceBindings.harTinglystErklaering.trueText).toBe("yes");
        expect(instance.resourceBindings.harTinglystErklaering.falseText).toBe("no");
        expect(instance.resourceBindings.krysserAvloepAnnensGrunn.title).toBe("otherTitle");
        expect(instance.resourceBindings.krysserAvloepAnnensGrunn.trueText).toBe("yup");
        expect(instance.resourceBindings.krysserAvloepAnnensGrunn.falseText).toBe("nope");
        expect(instance.resourceBindings.tilknytningstype.title).toBe("typeTitle");
        expect(instance.resourceBindings.avloep.title).toBe("mainTitle");
        expect(instance.resourceBindings.avloep.emptyFieldText).toBe("emptyText");
    });

    it("getResourceBindings should omit avloep.title if hideTitle is true", () => {
        const props = { hideTitle: true };
        const instance = new CustomGroupAvloep(props);
        expect(instance.resourceBindings.avloep).toHaveProperty("emptyFieldText");
        expect(instance.resourceBindings.avloep).not.toHaveProperty("title");
    });

    it("getResourceBindings should omit avloep.emptyFieldText if hideIfEmpty is true", () => {
        const props = { hideIfEmpty: true };
        const instance = new CustomGroupAvloep(props);
        expect(instance.resourceBindings.avloep).toHaveProperty("title");
        expect(instance.resourceBindings.avloep).not.toHaveProperty("emptyFieldText");
    });
});
