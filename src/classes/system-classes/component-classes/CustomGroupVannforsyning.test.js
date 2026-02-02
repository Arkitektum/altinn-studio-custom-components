import CustomGroupVannforsyning from "./CustomGroupVannforsyning";
const { hasMissingTextResources } = require("../../../functions/validations.js");
const Vannforsyning = require("../../data-classes/Vannforsyning.js");

// Mocks
jest.mock("../CustomComponent.js", () => {
    return class {};
});
jest.mock("../../data-classes/Vannforsyning.js", () => {
    return jest.fn().mockImplementation((data) => ({ ...data, __isVannforsyning: true }));
});
jest.mock("../../../functions/helpers.js", () => ({
    getComponentDataValue: jest.fn((props) => props.formData || null),
    getTextResourceFromResourceBinding: jest.fn((key) => `RES_${key}`),
    getTextResources: jest.fn(() => ({ a: "A", b: "B" })),
    hasValue: jest.fn((val) => val !== undefined && val !== null && val !== "")
}));
jest.mock("../../../functions/validations.js", () => ({
    hasMissingTextResources: jest.fn(() => false),
    hasValidationMessages: jest.fn((messages) => !!messages)
}));

const { getComponentDataValue, hasValue } = require("../../../functions/helpers.js");

describe("CustomGroupVannforsyning", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should initialize with default resource bindings and values", () => {
        getComponentDataValue.mockReturnValue({ foo: "bar" });
        hasValue.mockReturnValue(true);

        const props = { formData: { foo: "bar" } };
        const instance = new CustomGroupVannforsyning(props);

        expect(instance.isEmpty).toBe(false);
        expect(instance.resourceBindings.vannforsyning.title).toBe("resource.rammebetingelser.vannforsyning.title");
        expect(instance.resourceValues.title).toBeUndefined();
        expect(instance.resourceValues.data).toEqual({ foo: "bar", __isVannforsyning: true });
        expect(instance.hasValidationMessages).toBe(false);
        expect(Vannforsyning).toHaveBeenCalledWith({ foo: "bar" });
    });

    it("should use resourceValues.title if provided", () => {
        getComponentDataValue.mockReturnValue({ foo: "bar" });
        hasValue.mockImplementation((val) => !!val);

        const props = {
            formData: { foo: "bar" },
            resourceValues: { title: "Custom Title" }
        };
        const instance = new CustomGroupVannforsyning(props);

        expect(instance.resourceValues.title).toBe("Custom Title");
    });

    it("should set isEmpty true if no content", () => {
        getComponentDataValue.mockReturnValue(null);
        hasValue.mockReturnValue(false);

        const props = { formData: null };
        const instance = new CustomGroupVannforsyning(props);

        expect(instance.isEmpty).toBe(true);
        expect(instance.resourceValues.data).toBe("RES_resource.emptyFieldText.default");
    });

    it("should omit vannforsyning.title if hideTitle is true", () => {
        const props = { hideTitle: true };
        const instance = new CustomGroupVannforsyning(props);

        expect(instance.resourceBindings.vannforsyning?.title).toBeUndefined();
    });

    it('should omit vannforsyning.title if hideTitle is "true"', () => {
        const props = { hideTitle: "true" };
        const instance = new CustomGroupVannforsyning(props);

        expect(instance.resourceBindings.vannforsyning?.title).toBeUndefined();
    });

    it("should omit vannforsyning.emptyFieldText if hideIfEmpty is true", () => {
        const props = { hideIfEmpty: true };
        const instance = new CustomGroupVannforsyning(props);

        expect(instance.resourceBindings.vannforsyning?.emptyFieldText).toBeUndefined();
    });

    it('should omit vannforsyning.emptyFieldText if hideIfEmpty is "true"', () => {
        const props = { hideIfEmpty: "true" };
        const instance = new CustomGroupVannforsyning(props);

        expect(instance.resourceBindings.vannforsyning?.emptyFieldText).toBeUndefined();
    });

    it("should use custom resourceBindings if provided", () => {
        const props = {
            resourceBindings: {
                beskrivelse: { title: "custom.beskrivelse.title" },
                title: "custom.vannforsyning.title",
                emptyFieldText: "custom.emptyFieldText"
            }
        };
        const instance = new CustomGroupVannforsyning(props);

        expect(instance.resourceBindings.beskrivelse.title).toBe("custom.beskrivelse.title");
        expect(instance.resourceBindings.vannforsyning.title).toBe("custom.vannforsyning.title");
        expect(instance.resourceBindings.vannforsyning.emptyFieldText).toBe("custom.emptyFieldText");
    });

    it("hasContent returns true for non-empty data", () => {
        const instance = new CustomGroupVannforsyning({});
        hasValue.mockReturnValue(true);
        expect(instance.hasContent("abc")).toBe(true);
    });

    it("hasContent returns false for empty data", () => {
        const instance = new CustomGroupVannforsyning({});
        hasValue.mockReturnValue(false);
        expect(instance.hasContent("")).toBe(false);
    });

    it("getValidationMessages returns result from hasMissingTextResources", () => {
        const instance = new CustomGroupVannforsyning({});
        hasMissingTextResources.mockReturnValue(["missing"]);
        expect(instance.getValidationMessages({})).toEqual(["missing"]);
    });

    it("getValueFromFormData returns Vannforsyning instance", () => {
        getComponentDataValue.mockReturnValue({ foo: "bar" });
        const instance = new CustomGroupVannforsyning({});
        const result = instance.getValueFromFormData({ formData: { foo: "bar" } });
        expect(result).toEqual({ foo: "bar", __isVannforsyning: true });
    });

    it("getResourceBindings returns defaults if not provided", () => {
        const instance = new CustomGroupVannforsyning({});
        const bindings = instance.getResourceBindings({});
        expect(bindings.beskrivelse.title).toBe("resource.beskrivelse.title");
        expect(bindings.vannforsyning.title).toBe("resource.rammebetingelser.vannforsyning.title");
        expect(bindings.vannforsyning.emptyFieldText).toBe("resource.emptyFieldText.default");
    });
});
