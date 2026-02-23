import CustomGrouplistVegtypeTillatelse from "./CustomGrouplistVegtypeTillatelse";
import { getComponentDataValue, getTextResourceFromResourceBinding, hasValue } from "../../../functions/helpers.js";
import { hasMissingTextResources, hasValidationMessages } from "../../../functions/validations.js";

// Mocks for dependencies
jest.mock("../CustomComponent.js", () => {
    return jest.fn().mockImplementation(() => {});
});
jest.mock("../data-classes/VegtypeTillatelseList.js", () => {
    return jest.fn().mockImplementation((data) => ({
        resourceValues: { data: data ? "mockedData" : undefined }
    }));
});
jest.mock("../../../functions/helpers.js", () => ({
    getComponentDataValue: jest.fn((props) => props?.formData),
    getTextResourceFromResourceBinding: jest.fn((key) => `text:${key}`),
    hasValue: jest.fn((data) => !!data)
}));
jest.mock("../../../functions/validations.js", () => ({
    hasMissingTextResources: jest.fn((bindings) => {
        if (bindings && bindings.vegtype && bindings.vegtype.title === "missing") {
            return ["Missing vegtype title"];
        }
        return [];
    }),
    hasValidationMessages: jest.fn((messages) => Array.isArray(messages) && messages.length > 0)
}));

describe("CustomGrouplistVegtypeTillatelse", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should set isEmpty to true and use emptyFieldText when data is empty", () => {
        hasValue.mockReturnValue(false);
        getComponentDataValue.mockReturnValue(undefined);

        const props = {
            formData: undefined,
            resourceBindings: {
                emptyFieldText: "custom.empty"
            }
        };
        const instance = new CustomGrouplistVegtypeTillatelse(props);

        expect(instance.isEmpty).toBe(true);
        expect(instance.resourceValues.data).toBe("text:custom.empty");
        expect(getTextResourceFromResourceBinding).toHaveBeenCalledWith("custom.empty");
    });

    it("should set isEmpty to false and use data when data is present", () => {
        hasValue.mockReturnValue(true);
        getComponentDataValue.mockReturnValue("someData");

        const props = {
            formData: "someData"
        };
        const instance = new CustomGrouplistVegtypeTillatelse(props);

        expect(instance.isEmpty).toBe(false);
        expect(instance.resourceValues.data).toBe("mockedData");
        expect(getTextResourceFromResourceBinding).not.toHaveBeenCalled();
    });

    it("should set validationMessages and hasValidationMessages correctly", () => {
        hasValue.mockReturnValue(true);
        getComponentDataValue.mockReturnValue("someData");
        hasMissingTextResources.mockReturnValue(["Missing something"]);
        hasValidationMessages.mockReturnValue(true);

        const props = {
            formData: "someData"
        };
        const instance = new CustomGrouplistVegtypeTillatelse(props);

        expect(instance.validationMessages).toEqual(["Missing something"]);
        expect(instance.hasValidationMessages).toBe(true);
    });

    it("should use default resource bindings if not provided", () => {
        hasValue.mockReturnValue(true);
        getComponentDataValue.mockReturnValue("someData");

        const props = {
            formData: "someData"
        };
        const instance = new CustomGrouplistVegtypeTillatelse(props);

        expect(instance.resourceBindings.vegtype.title).toBe("resource.rammebetingelser.adkomst.vegtype.title");
        expect(instance.resourceBindings.erTillatelseGitt.title).toBe("resource.rammebetingelser.adkomst.erTillatelseGitt.title");
        expect(instance.resourceBindings.erTillatelseGitt.trueText).toBe("resource.trueText.default");
        expect(instance.resourceBindings.erTillatelseGitt.falseText).toBe("resource.falseText.default");
        expect(instance.resourceBindings.erTillatelseGitt.defaultText).toBe("resource.emptyFieldText.default");
    });

    it("should override resource bindings if provided in props", () => {
        hasValue.mockReturnValue(true);
        getComponentDataValue.mockReturnValue("someData");

        const props = {
            formData: "someData",
            resourceBindings: {
                vegtype: { title: "custom.vegtype.title" },
                erTillatelseGitt: {
                    title: "custom.tillatelse.title",
                    trueText: "custom.true",
                    falseText: "custom.false",
                    defaultText: "custom.default"
                },
                emptyFieldText: "custom.empty"
            }
        };
        const instance = new CustomGrouplistVegtypeTillatelse(props);

        expect(instance.resourceBindings.vegtype.title).toBe("custom.vegtype.title");
        expect(instance.resourceBindings.erTillatelseGitt.title).toBe("custom.tillatelse.title");
        expect(instance.resourceBindings.erTillatelseGitt.trueText).toBe("custom.true");
        expect(instance.resourceBindings.erTillatelseGitt.falseText).toBe("custom.false");
        expect(instance.resourceBindings.erTillatelseGitt.defaultText).toBe("custom.default");
    });

    it("should omit vegtypeTillatelse resource binding if hideIfEmpty is true", () => {
        hasValue.mockReturnValue(true);
        getComponentDataValue.mockReturnValue("someData");

        const props = {
            formData: "someData",
            hideIfEmpty: true
        };
        const instance = new CustomGrouplistVegtypeTillatelse(props);

        expect(instance.getResourceBindings(props).vegtypeTillatelse).toBeUndefined();
    });

    it("hasContent should delegate to hasValue", () => {
        const instance = new CustomGrouplistVegtypeTillatelse({});
        hasValue.mockReturnValue(true);
        expect(instance.hasContent("abc")).toBe(true);
        hasValue.mockReturnValue(false);
        expect(instance.hasContent("")).toBe(false);
    });

    it("getValidationMessages should delegate to hasMissingTextResources", () => {
        const instance = new CustomGrouplistVegtypeTillatelse({});
        hasMissingTextResources.mockReturnValue(["msg"]);
        expect(instance.getValidationMessages({})).toEqual(["msg"]);
    });

    it("getValueFromFormData should return data from VegtypeTillatelseList.resourceValues", () => {
        getComponentDataValue.mockReturnValue("abc");
        const instance = new CustomGrouplistVegtypeTillatelse({});
        expect(instance.getValueFromFormData({ formData: "abc" })).toBe("mockedData");
    });

    it("getResourceBindings should provide defaults and allow overrides", () => {
        const instance = new CustomGrouplistVegtypeTillatelse({});
        const result = instance.getResourceBindings({});
        expect(result.vegtype.title).toBe("resource.rammebetingelser.adkomst.vegtype.title");
        expect(result.erTillatelseGitt.title).toBe("resource.rammebetingelser.adkomst.erTillatelseGitt.title");
        expect(result.vegtypeTillatelse.emptyFieldText).toBe("resource.emptyFieldText.default");

        const overrides = {
            resourceBindings: {
                vegtype: { title: "custom.vegtype" },
                erTillatelseGitt: { title: "custom.tillatelse", trueText: "yes", falseText: "no", defaultText: "none" },
                emptyFieldText: "empty"
            }
        };
        const result2 = instance.getResourceBindings(overrides);
        expect(result2.vegtype.title).toBe("custom.vegtype");
        expect(result2.erTillatelseGitt.title).toBe("custom.tillatelse");
        expect(result2.erTillatelseGitt.trueText).toBe("yes");
        expect(result2.erTillatelseGitt.falseText).toBe("no");
        expect(result2.erTillatelseGitt.defaultText).toBe("none");
        expect(result2.vegtypeTillatelse.emptyFieldText).toBe("empty");
    });
});
