import type { ComponentProps, ResourceBindingGroup } from "../../../types.ts";

import { getComponentDataValue, getComponentResourceValue } from "../../../functions/helpers.ts";
import { getTextResources, hasValue } from "@arkitektum/altinn-studio-custom-components-utils";
import { hasMissingTextResources, hasValidationMessages } from "../../../functions/validations.ts";
import CustomGroupUtfallSvarType from "./CustomGroupUtfallSvarType.ts";

// Mocks for dependencies
jest.mock("../../../functions/helpers.ts", () => ({
    getComponentDataValue: jest.fn(),
    getComponentResourceValue: jest.fn()
}));
jest.mock("@arkitektum/altinn-studio-custom-components-utils", () => ({
    hasValue: jest.fn(),
    getTextResources: jest.fn()
}));
jest.mock("../../../functions/validations.ts", () => ({
    hasMissingTextResources: jest.fn(),
    hasValidationMessages: jest.fn()
}));

describe("CustomGroupUtfallSvarType", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should set isEmpty to true if hasContent returns false", () => {
        (getComponentDataValue as unknown as jest.Mock).mockReturnValue(null);
        (hasValue as unknown as jest.Mock).mockReturnValue(false);
        (getComponentResourceValue as unknown as jest.Mock).mockReturnValue("Empty");
        (hasMissingTextResources as unknown as jest.Mock).mockReturnValue([]);
        (hasValidationMessages as unknown as jest.Mock).mockReturnValue(false);

        const props = {};
        const instance = new CustomGroupUtfallSvarType(props);

        expect(instance.isEmpty).toBe(true);
        expect(instance.resourceValues.data).toBe("Empty");
    });

    it("should set isEmpty to false if hasContent returns true", () => {
        (getComponentDataValue as unknown as jest.Mock).mockReturnValue("Some value");
        (hasValue as unknown as jest.Mock).mockReturnValue(true);
        (getComponentResourceValue as unknown as jest.Mock).mockReturnValue("Should not be used");
        (hasMissingTextResources as unknown as jest.Mock).mockReturnValue([]);
        (hasValidationMessages as unknown as jest.Mock).mockReturnValue(false);

        const props = {};
        const instance = new CustomGroupUtfallSvarType(props);

        expect(instance.isEmpty).toBe(false);
        expect(instance.resourceValues.data).toBe("Some value");
    });

    it("should set validationMessages and hasValidationMessages correctly", () => {
        (getComponentDataValue as unknown as jest.Mock).mockReturnValue("data");
        (hasValue as unknown as jest.Mock).mockReturnValue(true);
        (hasMissingTextResources as unknown as jest.Mock).mockReturnValue(["Missing resource"]);
        (hasValidationMessages as unknown as jest.Mock).mockReturnValue(true);

        const props = {};
        const instance = new CustomGroupUtfallSvarType(props);

        expect(instance.validationMessages).toEqual(["Missing resource"]);
        expect(instance.hasValidationMessages).toBe(true);
    });

    it("hasContent should delegate to hasValue", () => {
        (hasValue as unknown as jest.Mock).mockReturnValue(true);
        const instance = new CustomGroupUtfallSvarType({});
        expect(instance.hasContent("abc")).toBe(true);
        expect(hasValue).toHaveBeenCalledWith("abc");
    });

    it("getValidationMessages should call hasMissingTextResources with textResources and resourceBindings", () => {
        (getTextResources as unknown as jest.Mock).mockReturnValue({ a: 1 });
        (hasMissingTextResources as unknown as jest.Mock).mockReturnValue("msg");
        const instance = new CustomGroupUtfallSvarType({});
        const result = instance.getValidationMessages({ foo: "bar" } as unknown as Record<string, ResourceBindingGroup>);
        expect(hasMissingTextResources).toHaveBeenCalledWith({ foo: "bar" } as unknown as Record<string, ResourceBindingGroup>);
        expect(result).toBe("msg");
    });

    it("getValueFromFormData should call getComponentDataValue with props", () => {
        (getComponentDataValue as unknown as jest.Mock).mockReturnValue("data");
        const instance = new CustomGroupUtfallSvarType({});
        const props = { some: "prop" };
        expect(instance.getValueFromFormData(props as unknown as ComponentProps)).toBe("data");
        expect(getComponentDataValue).toHaveBeenCalledWith(props as unknown as ComponentProps);
    });
});
