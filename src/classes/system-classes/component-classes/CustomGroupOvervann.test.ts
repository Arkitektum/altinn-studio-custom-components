import type { ComponentProps, ResourceBindingGroup } from "../../../types.ts";

import CustomGroupOvervann from "./CustomGroupOvervann.ts";
import { hasValue } from "@arkitektum/altinn-studio-custom-components-utils";
const { hasMissingTextResources, hasValidationMessages } = require("../../../functions/validations.ts");
const Overvann = require("../../data-classes/Overvann.ts");

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
jest.mock("../../data-classes/Overvann.ts", () => {
    return jest.fn().mockImplementation((...args: unknown[]) => ({ ...(args[0] as object) }));
});
jest.mock("../../../functions/helpers.ts", () => ({
    getComponentDataValue: jest.fn((props: ComponentProps) => props?.formData || {})
}));
jest.mock("@arkitektum/altinn-studio-custom-components-utils", () => ({
    hasValue: jest.fn((val: unknown) => val !== undefined && val !== null && val !== ""),
    getTextResourceFromResourceBinding: jest.fn((key: string) => `text-for-${key}`),
    getTextResources: jest.fn(() => ({ a: "A", b: "B" }))
}));
jest.mock("../../../functions/validations.ts", () => ({
    hasMissingTextResources: jest.fn(() => false),
    hasValidationMessages: jest.fn((messages) => !!messages)
}));

const { getComponentDataValue } = require("../../../functions/helpers.ts");

describe("CustomGroupOvervann", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should initialize with default resource bindings and values when no props are provided", () => {
        const instance = new CustomGroupOvervann({});
        expect(instance.resourceBindings.ledesOvervannTilTerreng!.title).toBe("resource.rammebetingelser.overvann.ledesOvervannTilTerreng.title");
        expect(instance.resourceBindings.ledesOvervannTilTerreng!.trueText).toBe("resource.trueText.default");
        expect(instance.resourceBindings.ledesOvervannTilTerreng!.falseText).toBe("resource.falseText.default");
        expect(instance.resourceBindings.ledesOvervannTilAvloepssystem!.title).toBe(
            "resource.rammebetingelser.overvann.ledesOvervannTilAvloepssystem.title"
        );
        expect(instance.resourceBindings.overvann!.title).toBe("resource.overvann.title");
        expect(instance.resourceBindings.overvann!.emptyFieldText).toBe("resource.emptyFieldText.default");
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
        (hasValue as unknown as jest.Mock).mockReturnValueOnce(true); // for isEmpty
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
        (hasValue as unknown as jest.Mock).mockReturnValueOnce(true);
        expect(instance.hasContent("abc")).toBe(true);
        (hasValue as unknown as jest.Mock).mockReturnValueOnce(false);
        expect(instance.hasContent("")).toBe(false);
    });

    it("getValidationMessages should call hasMissingTextResources with textResources and resourceBindings", () => {
        const instance = new CustomGroupOvervann({});
        instance.getValidationMessages({ foo: "bar" } as unknown as Record<string, ResourceBindingGroup>);
        expect(hasMissingTextResources).toHaveBeenCalledWith({ foo: "bar" });
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
        expect(instance.resourceBindings.ledesOvervannTilTerreng!.title).toBe("custom-title");
        expect(instance.resourceBindings.ledesOvervannTilTerreng!.trueText).toBe("yes");
        expect(instance.resourceBindings.ledesOvervannTilTerreng!.falseText).toBe("no");
        expect(instance.resourceBindings.ledesOvervannTilAvloepssystem!.title).toBe("custom-title2");
        expect(instance.resourceBindings.ledesOvervannTilAvloepssystem!.trueText).toBe("yes2");
        expect(instance.resourceBindings.ledesOvervannTilAvloepssystem!.falseText).toBe("no2");
        expect(instance.resourceBindings.overvann!.title).toBe("main-title");
        expect(instance.resourceBindings.overvann!.emptyFieldText).toBe("empty");
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
