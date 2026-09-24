import type { ComponentProps, ResourceBindingGroup } from "../../../types.ts";

import { hasMissingTextResources, hasValidationMessages } from "../../../functions/validations.ts";
import CustomGjenpartNabovarsel from "./CustomGjenpartNabovarsel.ts";
import GjenpartNabovarsel from "../../layout-classes/GjenpartNabovarsel.ts";
import { getComponentResourceValue } from "../../../functions/helpers.ts";
import { hasValue } from "@arkitektum/altinn-studio-custom-components-utils";

// Mocks for dependencies
jest.mock("../CustomComponent.ts", () => {
    const { hasValue } = require("@arkitektum/altinn-studio-custom-components-utils");
    const { hasMissingTextResources } = require("../../../functions/validations.ts");
    return class {
        hasContent(data: unknown) {
            return hasValue(data);
        }
        getValidationMessages(resourceBindings: unknown) {
            return hasMissingTextResources(resourceBindings);
        }
    };
});
jest.mock("../../layout-classes/GjenpartNabovarsel.ts", () => {
    return jest.fn().mockImplementation((...args: unknown[]) => ({ ...(args[0] as object), _isGjenpartNabovarsel: true }));
});
jest.mock("../../../functions/helpers.ts", () => ({
    getComponentResourceValue: jest.fn(() => "EMPTY_FIELD_TEXT")
}));
jest.mock("@arkitektum/altinn-studio-custom-components-utils", () => ({
    hasValue: jest.fn((data: { hasContent?: unknown }) => !!data && data.hasContent),
    getTextResources: jest.fn(() => ({ mock: "resources" }))
}));
jest.mock("../../../functions/validations.ts", () => ({
    hasMissingTextResources: jest.fn(() => false),
    hasValidationMessages: jest.fn((val: unknown) => !!val)
}));

describe("CustomGjenpartNabovarsel", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should construct with default resourceBindings and set properties correctly when data is present", () => {
        const props = { formData: { hasContent: true } } as unknown as ComponentProps;
        const instance = new CustomGjenpartNabovarsel(props);

        expect(GjenpartNabovarsel).toHaveBeenCalledWith(props.formData);
        expect(instance.isEmpty).toBe(false);
        expect(instance.validationMessages).toBe(false);
        expect(instance.hasValidationMessages).toBe(false);
        expect(instance.resourceBindings.gjenpartNabovarsel!.title).toBe("resource.gjenpartNabovarsel.title");
        expect(instance.resourceValues.data).toEqual({ ...props.formData, _isGjenpartNabovarsel: true });
    });

    it("should set isEmpty true and use emptyFieldText when data is empty", () => {
        (hasValue as unknown as jest.Mock).mockReturnValue(false);
        const props = { formData: null };
        const instance = new CustomGjenpartNabovarsel(props as unknown as ComponentProps);

        expect(instance.isEmpty).toBe(true);
        expect(getComponentResourceValue).toHaveBeenCalledWith(props as unknown as ComponentProps, "emptyFieldText");
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

        expect(instance.resourceBindings.gjenpartNabovarsel!.title).toBe("custom.title");
        expect(instance.resourceBindings.gjenpartNabovarsel!.description).toBe("custom.desc");
        expect(instance.resourceBindings.adresse!.title).toBe("custom.adresse.title");
        expect(instance.resourceBindings.adresse!.emptyFieldText).toBe("custom.empty");
    });

    it("hasContent should delegate to hasValue", () => {
        const instance = new CustomGjenpartNabovarsel({});
        (hasValue as unknown as jest.Mock).mockReturnValue(true);
        expect(instance.hasContent({})).toBe(true);
        (hasValue as unknown as jest.Mock).mockReturnValue(false);
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
        const bindings = { foo: "bar" } as unknown as Record<string, ResourceBindingGroup>;
        instance.getValidationMessages(bindings);
        expect(hasMissingTextResources).toHaveBeenCalledWith(bindings);
    });

    it("getResourceBindings should return default keys if no overrides", () => {
        const instance = new CustomGjenpartNabovarsel({});
        const result = instance.getResourceBindings({});
        expect(result.gjenpartNabovarsel.title).toBe("resource.gjenpartNabovarsel.title");
        expect(result.adresse.emptyFieldText).toBe("resource.emptyFieldText.address");
        expect(result.eierNavn.title).toBe("resource.navn.title");
    });

    it("should set hasValidationMessages based on hasValidationMessages()", () => {
        (hasValidationMessages as unknown as jest.Mock).mockReturnValue(true);
        const instance = new CustomGjenpartNabovarsel({ formData: { hasContent: true } });
        expect(instance.hasValidationMessages).toBe(true);
    });
});
