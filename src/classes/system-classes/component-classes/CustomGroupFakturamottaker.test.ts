import type { ComponentProps, ResourceBindingGroup } from "../../../types.ts";

import CustomGroupFakturamottaker from "./CustomGroupFakturamottaker.ts";
import { hasValue } from "@arkitektum/altinn-studio-custom-components-utils";
const Fakturamottaker = require("../../data-classes/Fakturamottaker.ts");

// Mocks
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
jest.mock("../../data-classes/Fakturamottaker.ts", () => {
    return jest.fn().mockImplementation((...args: unknown[]) => ({ mockFakturamottaker: true, data: args[0] }));
});
jest.mock("../../../functions/helpers.ts", () => ({
    getComponentDataValue: jest.fn((props: { mockData?: unknown }) => props.mockData || null)
}));
jest.mock("@arkitektum/altinn-studio-custom-components-utils", () => ({
    hasValue: jest.fn((val: unknown) => val !== null && val !== undefined && val !== ""),
    getTextResourceFromResourceBinding: jest.fn((key: string) => `text-for-${key}`),
    getTextResources: jest.fn(() => ({ resource1: "value1" }))
}));
jest.mock("../../../functions/validations.ts", () => ({
    hasMissingTextResources: jest.fn(() => ["missing resource"]),
    hasValidationMessages: jest.fn((messages) => Array.isArray(messages) && messages.length > 0)
}));

const { getComponentDataValue } = require("../../../functions/helpers.ts");
const { hasMissingTextResources } = require("../../../functions/validations.ts");

describe("CustomGroupFakturamottaker", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should initialize with default resource bindings and values", () => {
        const props = { mockData: "test-data" } as unknown as ComponentProps;
        const instance = new CustomGroupFakturamottaker(props);

        expect(getComponentDataValue).toHaveBeenCalledWith(props);
        expect(Fakturamottaker).toHaveBeenCalledWith("test-data");
        expect(instance.isEmpty).toBe(false);
        expect(instance.validationMessages).toEqual(["missing resource"]);
        expect(instance.hasValidationMessages).toBe(true);
        expect(instance.resourceValues.data).toEqual({ mockFakturamottaker: true, data: "test-data" });
    });

    it("gives every field its own default title", () => {
        // One assertion per field rather than a spot check, because a copied line reading the wrong binding is the
        // mistake this class invites.
        const instance = new CustomGroupFakturamottaker({});

        expect(Object.fromEntries(Object.entries(instance.resourceBindings).map(([field, binding]) => [field, binding!.title]))).toEqual({
            navn: "resource.navn.title",
            adresse: "resource.adresse.title",
            organisasjonsnummer: "resource.organisasjonsnummer.title",
            bestillerreferanse: "resource.bestillerreferanse.title",
            fakturareferanse: "resource.fakturareferanse.title",
            prosjektnummer: "resource.prosjektnummer.title",
            epost: "resource.epostadresse.title",
            fakturamottaker: "resource.tiltakshaver.fakturamottaker.title"
        });
    });

    it("leaves the address without an empty field text and gives every other field one", () => {
        const instance = new CustomGroupFakturamottaker({});

        expect(
            Object.entries(instance.resourceBindings)
                .filter(([, binding]) => !binding!.emptyFieldText)
                .map(([field]) => field)
        ).toEqual(["adresse"]);
    });

    it("should use custom resourceValues.title if provided", () => {
        const props = {
            mockData: "test-data",
            resourceValues: { title: "Custom Title" }
        };
        const instance = new CustomGroupFakturamottaker(props);
        expect(instance.resourceValues.title).toBe("Custom Title");
    });

    it("falls back to the group title when no title is given", () => {
        const instance = new CustomGroupFakturamottaker({});
        expect(instance.resourceValues.title).toBe("text-for-resource.tiltakshaver.fakturamottaker.title");
    });

    it("should set isEmpty true if no data", () => {
        (hasValue as unknown as jest.Mock).mockReturnValueOnce(false);
        const props = { mockData: null };
        const instance = new CustomGroupFakturamottaker(props as unknown as ComponentProps);
        expect(instance.isEmpty).toBe(true);
        expect(instance.resourceValues.data).toBe("text-for-resource.emptyFieldText.default");
    });

    it("hasContent should delegate to hasValue", () => {
        const instance = new CustomGroupFakturamottaker({});
        (hasValue as unknown as jest.Mock).mockReturnValueOnce(true);
        expect(instance.hasContent("some")).toBe(true);
        (hasValue as unknown as jest.Mock).mockReturnValueOnce(false);
        expect(instance.hasContent("")).toBe(false);
    });

    it("getValidationMessages should call hasMissingTextResources", () => {
        const instance = new CustomGroupFakturamottaker({});
        const bindings = { test: "value" } as unknown as Record<string, ResourceBindingGroup>;
        instance.getValidationMessages(bindings);
        expect(hasMissingTextResources).toHaveBeenCalled();
    });

    it("getValueFromFormData should return Fakturamottaker instance", () => {
        const instance = new CustomGroupFakturamottaker({});
        const props = { mockData: "fakturamottaker-data" };
        const result = instance.getValueFromFormData(props as unknown as ComponentProps);
        expect(Fakturamottaker).toHaveBeenCalledWith("fakturamottaker-data");
        expect(result).toEqual({ mockFakturamottaker: true, data: "fakturamottaker-data" });
    });

    it("getResourceBindings should use custom resource bindings", () => {
        const props = {
            resourceBindings: {
                navn: { title: "custom-navn", emptyFieldText: "custom-navn-empty" },
                adresse: { title: "custom-adresse" },
                organisasjonsnummer: { title: "custom-organisasjonsnummer" },
                bestillerreferanse: { title: "custom-bestillerreferanse" },
                fakturareferanse: { title: "custom-fakturareferanse" },
                prosjektnummer: { title: "custom-prosjektnummer" },
                epost: { title: "custom-epost" },
                title: "custom-fakturamottaker-title",
                emptyFieldText: "custom-empty"
            }
        };
        const instance = new CustomGroupFakturamottaker(props);

        expect(Object.fromEntries(Object.entries(instance.resourceBindings).map(([field, binding]) => [field, binding!.title]))).toEqual({
            navn: "custom-navn",
            adresse: "custom-adresse",
            organisasjonsnummer: "custom-organisasjonsnummer",
            bestillerreferanse: "custom-bestillerreferanse",
            fakturareferanse: "custom-fakturareferanse",
            prosjektnummer: "custom-prosjektnummer",
            epost: "custom-epost",
            fakturamottaker: "custom-fakturamottaker-title"
        });
        expect(instance.resourceBindings.navn!.emptyFieldText).toBe("custom-navn-empty");
        expect(instance.resourceBindings.fakturamottaker!.emptyFieldText).toBe("custom-empty");
    });

    it("getResourceBindings should omit fakturamottaker.title if hideTitle is true", () => {
        const props = { hideTitle: true };
        const instance = new CustomGroupFakturamottaker(props);
        expect(instance.resourceBindings.fakturamottaker).toEqual({ emptyFieldText: "resource.emptyFieldText.default" });
    });

    it("getResourceBindings should omit fakturamottaker.emptyFieldText if hideIfEmpty is true", () => {
        const props = { hideIfEmpty: true };
        const instance = new CustomGroupFakturamottaker(props);
        expect(instance.resourceBindings.fakturamottaker!.emptyFieldText).toBeUndefined();
    });

    it("names every component it renders with", () => {
        expect(new CustomGroupFakturamottaker({}).getComponentUsage()).toEqual([
            "custom-feedbacklist-validation-messages",
            "custom-field-adresse",
            "custom-field-data",
            "custom-header-text",
            "custom-paragraph"
        ]);
    });
});
