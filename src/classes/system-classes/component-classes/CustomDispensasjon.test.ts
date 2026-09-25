import type { ComponentProps, ResourceBindingGroup } from "../../../types.ts";

import CustomDispensasjon from "./CustomDispensasjon.ts";
import { hasValue } from "@arkitektum/altinn-studio-custom-components-utils";

// Mocks
jest.mock("../../layout-classes/Dispensasjon.ts", () => {
    return jest.fn().mockImplementation((...args: unknown[]) => ({ ...(args[0] as object), __isDispensasjon: true }));
});
jest.mock("../../../functions/helpers.ts", () => ({
    getComponentResourceValue: jest.fn((props: ComponentProps, key: string) => `resourceValue:${key}`)
}));
jest.mock("@arkitektum/altinn-studio-custom-components-utils", () => ({
    hasValue: jest.fn((val: unknown) => val !== undefined && val !== null && val !== "")
}));
jest.mock("../../../functions/validations.ts", () => ({
    hasMissingTextResources: jest.fn(() => ["missing"]),
    hasValidationMessages: jest.fn((messages: unknown[]) => Array.isArray(messages) && messages.length > 0)
}));

const { getComponentResourceValue } = require("../../../functions/helpers.ts");
const { hasMissingTextResources, hasValidationMessages } = require("../../../functions/validations.ts");

describe("CustomDispensasjon", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        globalThis.window = {} as Window & typeof globalThis;
    });

    describe("constructor", () => {
        it("shows the empty field text when there is no form data at all", () => {
            // hasValue as it really behaves, rather than forced to one answer: it reports any boolean as content,
            // which is what let an absent form data end up stored as false instead of the empty field text.
            (hasValue as unknown as jest.Mock).mockImplementation((value: unknown) => value !== undefined && value !== null && value !== "");
            const instance = new CustomDispensasjon({ formData: undefined } as unknown as ComponentProps);
            expect(instance.isEmpty).toBe(true);
            expect(instance.resourceValues.data).toBe("resourceValue:emptyFieldText");
        });
        it("should set isEmpty to true if formData is empty", () => {
            (hasValue as unknown as jest.Mock).mockReturnValue(false);
            const instance = new CustomDispensasjon({ formData: "" } as unknown as ComponentProps);
            expect(instance.isEmpty).toBe(true);
            expect(getComponentResourceValue).toHaveBeenCalledWith({ formData: "" }, "emptyFieldText");
            expect(instance.resourceValues.data).toBe("resourceValue:emptyFieldText");
        });

        it("should set isEmpty to false if formData is present", () => {
            (hasValue as unknown as jest.Mock).mockReturnValue(true);
            const instance = new CustomDispensasjon({ formData: { foo: "bar" } });
            expect(instance.isEmpty).toBe(false);
            expect(instance.resourceValues.data).toEqual(expect.objectContaining({ foo: "bar", __isDispensasjon: true }));
        });

        it("should set validationMessages and hasValidationMessages", () => {
            hasMissingTextResources.mockReturnValue(["missing"]);
            hasValidationMessages.mockReturnValue(true);
            const instance = new CustomDispensasjon({ formData: { foo: "bar" } });
            expect(instance.validationMessages).toEqual(["missing"]);
            expect(instance.hasValidationMessages).toBe(true);
        });

        it("should set resourceBindings and resourceValues", () => {
            (hasValue as unknown as jest.Mock).mockReturnValue(false);
            const instance = new CustomDispensasjon({ formData: null } as unknown as ComponentProps);
            expect(instance.resourceBindings).toHaveProperty("dispensasjonsreferanse");
            expect(instance.resourceValues).toHaveProperty("data");
        });
    });

    describe("hasContent", () => {
        it("returns true if hasValue returns true", () => {
            (hasValue as unknown as jest.Mock).mockReturnValue(true);
            const instance = new CustomDispensasjon({});
            expect(instance.hasContent("abc")).toBe(true);
        });

        it("returns false if hasValue returns false", () => {
            (hasValue as unknown as jest.Mock).mockReturnValue(false);
            const instance = new CustomDispensasjon({});
            expect(instance.hasContent("")).toBe(false);
        });
    });

    describe("getValueFromFormData", () => {
        it("returns Dispensasjon instance if hasValue is true", () => {
            (hasValue as unknown as jest.Mock).mockReturnValue(true);
            const props = { formData: { foo: "bar" } };
            const instance = new CustomDispensasjon(props);
            const value = instance.getValueFromFormData(props);
            expect(value).toEqual(expect.objectContaining({ foo: "bar", __isDispensasjon: true }));
        });

        it("returns false if hasValue is false", () => {
            (hasValue as unknown as jest.Mock).mockReturnValue(false);
            const props = { formData: null } as unknown as ComponentProps;
            const instance = new CustomDispensasjon(props);
            expect(instance.getValueFromFormData(props)).toBe(false);
        });
    });

    describe("getValidationMessages", () => {
        it("calls hasMissingTextResources with window.textResources and bindings", () => {
            const instance = new CustomDispensasjon({});
            instance.getValidationMessages({ key: "value" } as unknown as Record<string, ResourceBindingGroup>);
            expect(hasMissingTextResources).toHaveBeenCalledWith({ key: "value" });
        });

        it("uses empty array if window.textResources is undefined", () => {
            const instance = new CustomDispensasjon({});
            instance.getValidationMessages({ key: "value" } as unknown as Record<string, ResourceBindingGroup>);
            expect(hasMissingTextResources).toHaveBeenCalledWith({ key: "value" });
        });
    });

    describe("getResourceBindings", () => {
        it("returns an object with expected keys and values", () => {
            const instance = new CustomDispensasjon({});
            const bindings = instance.getResourceBindings();
            expect(bindings).toHaveProperty("dispensasjonsreferanse");
            expect(bindings.dispensasjonsreferanse).toHaveProperty("title");
            expect(bindings.varighetOenskesVarigDispensasjon).toHaveProperty("trueText");
            expect(bindings.generelleVilkaarNorskSvenskDansk).toHaveProperty("title");
            expect(bindings.generelleVilkaarNorskSvenskDansk).toHaveProperty("trueText");
        });
    });
});
