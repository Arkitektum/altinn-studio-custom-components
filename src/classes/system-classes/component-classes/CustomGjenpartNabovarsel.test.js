import CustomGjenpartNabovarsel from "./CustomGjenpartNabovarsel";
import GjenpartNabovarsel from "../../layout-classes/GjenpartNabovarsel.js";
import { getComponentResourceValue, hasValue } from "../../../functions/helpers.js";
import { hasMissingTextResources, hasValidationMessages } from "../../../functions/validations.js";

// Mocks for dependencies
jest.mock("../CustomComponent.js", () => {
    return jest.fn().mockImplementation(() => {});
});
jest.mock("../../layout-classes/GjenpartNabovarsel.js", () => {
    return jest.fn().mockImplementation((data) => ({ ...data, _isGjenpartNabovarsel: true }));
});
jest.mock("../../../functions/helpers.js", () => ({
    getComponentResourceValue: jest.fn(() => "EMPTY_FIELD_TEXT"),
    getTextResources: jest.fn(() => ({ mock: "resources" })),
    hasValue: jest.fn((data) => !!data && data.hasContent)
}));
jest.mock("../../../functions/validations.js", () => ({
    hasMissingTextResources: jest.fn(() => false),
    hasValidationMessages: jest.fn((val) => !!val)
}));

describe("CustomGjenpartNabovarsel", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should construct with default resourceBindings and set properties correctly when data is present", () => {
        const props = { formData: { hasContent: true } };
        const instance = new CustomGjenpartNabovarsel(props);

        expect(GjenpartNabovarsel).toHaveBeenCalledWith(props.formData);
        expect(instance.isEmpty).toBe(false);
        expect(instance.validationMessages).toBe(false);
        expect(instance.hasValidationMessages).toBe(false);
        expect(instance.resourceBindings.gjenpartNabovarsel.title).toBe("resource.gjenpartNabovarsel.title");
        expect(instance.resourceValues.data).toEqual({ ...props.formData, _isGjenpartNabovarsel: true });
    });

    it("should set isEmpty true and use emptyFieldText when data is empty", () => {
        hasValue.mockReturnValue(false);
        const props = { formData: null };
        const instance = new CustomGjenpartNabovarsel(props);

        expect(instance.isEmpty).toBe(true);
        expect(getComponentResourceValue).toHaveBeenCalledWith(props, "emptyFieldText");
        expect(instance.resourceValues.data).toBe("EMPTY_FIELD_TEXT");
    });

    it("should use resourceBindings overrides from props", () => {
        const props = {
            formData: { hasContent: true },
            resourceBindings: {
                gjenpartNabovarsel: { title: "custom.title", description: "custom.desc" },
                adresse: { title: "custom.adresse.title", emptyFieldText: "custom.empty" }
            }
        };
        const instance = new CustomGjenpartNabovarsel(props);

        expect(instance.resourceBindings.gjenpartNabovarsel.title).toBe("custom.title");
        expect(instance.resourceBindings.gjenpartNabovarsel.description).toBe("custom.desc");
        expect(instance.resourceBindings.adresse.title).toBe("custom.adresse.title");
        expect(instance.resourceBindings.adresse.emptyFieldText).toBe("custom.empty");
    });

    it("hasContent should delegate to hasValue", () => {
        const instance = new CustomGjenpartNabovarsel({});
        hasValue.mockReturnValue(true);
        expect(instance.hasContent({})).toBe(true);
        hasValue.mockReturnValue(false);
        expect(instance.hasContent({})).toBe(false);
    });

    it("getValueFromFormData should return a GjenpartNabovarsel instance", () => {
        const instance = new CustomGjenpartNabovarsel({});
        const props = { formData: { foo: "bar" } };
        const result = instance.getValueFromFormData(props);
        expect(GjenpartNabovarsel).toHaveBeenCalledWith(props.formData);
        expect(result).toEqual({ ...props.formData, _isGjenpartNabovarsel: true });
    });

    it("getValidationMessages should call hasMissingTextResources", () => {
        const instance = new CustomGjenpartNabovarsel({});
        const bindings = { foo: "bar" };
        instance.getValidationMessages(bindings);
        expect(hasMissingTextResources).toHaveBeenCalledWith(bindings);
    });

    it("getResourceBindings should return default keys if no overrides", () => {
        const instance = new CustomGjenpartNabovarsel({});
        const result = instance.getResourceBindings({});
        expect(result.gjenpartNabovarsel.title).toBe("resource.gjenpartNabovarsel.title");
        expect(result.adresse.emptyFieldText).toBe("resource.emptyFieldText.address");
        expect(result.eierNavn.title).toBe("resource.part.navn.title");
    });

    it("should set hasValidationMessages based on hasValidationMessages()", () => {
        hasValidationMessages.mockReturnValue(true);
        const instance = new CustomGjenpartNabovarsel({ formData: { hasContent: true } });
        expect(instance.hasValidationMessages).toBe(true);
    });
});
