import type { ResourceBindingGroup } from "../../../types.ts";

import { getComponentDataValue, getComponentResourceValue } from "../../../functions/helpers.ts";
import CustomGrouplistUtfallSvarType from "./CustomGrouplistUtfallSvarType.ts";
import UtfallSvar from "../../data-classes/UtfallSvar.ts";
import { hasMissingTextResources } from "../../../functions/validations.ts";
import { hasValue } from "@arkitektum/altinn-studio-custom-components-utils";

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
jest.mock("../../data-classes/UtfallSvar.ts", () => {
    return jest.fn().mockImplementation((...args: unknown[]) => ({ ...(args[0] as object), __isUtfallSvar: true }));
});
jest.mock("../../../functions/helpers.ts", () => ({
    getComponentDataValue: jest.fn(),
    getComponentResourceValue: jest.fn()
}));
jest.mock("@arkitektum/altinn-studio-custom-components-utils", () => ({
    hasValue: jest.fn(),
    getTextResources: jest.fn()
}));
jest.mock("../../../functions/validations.ts", () => ({
    hasMissingTextResources: jest.fn()
}));

describe("CustomGrouplistUtfallSvarType", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("constructor", () => {
        it("should set isEmpty and resourceValues when data is empty", () => {
            const props = { hideTitle: false };
            (getComponentDataValue as unknown as jest.Mock).mockReturnValue([]);
            (hasValue as unknown as jest.Mock).mockReturnValue(false);
            (getComponentResourceValue as unknown as jest.Mock).mockImplementation((p, key) => `resource_${key}`);

            const instance = new CustomGrouplistUtfallSvarType(props);

            expect(instance.isEmpty).toBe(true);
            expect(instance.resourceValues.data).toBe("resource_emptyFieldText");
        });

        it("should set resourceValues.data to grouped data when not empty", () => {
            const props = { hideTitle: false };
            const groupedData = { foo: [new UtfallSvar({ utfallType: { kodeverdi: "foo" } })] };
            (getComponentDataValue as unknown as jest.Mock).mockReturnValue([
                {
                    utfallType: { kodeverdi: "foo" }
                }
            ]);
            (hasValue as unknown as jest.Mock).mockReturnValue(true);
            (getComponentResourceValue as unknown as jest.Mock).mockImplementation((p, key) => `resource_${key}`);

            const instance = new CustomGrouplistUtfallSvarType(props);

            expect(instance.isEmpty).toBe(false);
            expect(instance.resourceValues.data).toEqual(groupedData);
        });
    });

    describe("hasContent", () => {
        it("should return true if hasValue returns true", () => {
            (hasValue as unknown as jest.Mock).mockReturnValue(true);
            const instance = new CustomGrouplistUtfallSvarType({});
            expect(instance.hasContent("data")).toBe(true);
        });

        it("should return false if hasValue returns false", () => {
            (hasValue as unknown as jest.Mock).mockReturnValue(false);
            const instance = new CustomGrouplistUtfallSvarType({});
            expect(instance.hasContent(null)).toBe(false);
        });
    });

    describe("getValidationMessages", () => {
        it("should call hasMissingTextResources with textResources and resourceBindings", () => {
            const instance = new CustomGrouplistUtfallSvarType({});
            const resourceBindings = { title: "someTitle" };
            (hasMissingTextResources as unknown as jest.Mock).mockReturnValue(["missing"]);

            const result = instance.getValidationMessages(resourceBindings as unknown as Record<string, ResourceBindingGroup>);

            expect(hasMissingTextResources).toHaveBeenCalledWith(resourceBindings as unknown as Record<string, ResourceBindingGroup>);
            expect(result).toEqual(["missing"]);
        });
    });

    describe("getValueFromFormData", () => {
        it("should group array items by utfallType.kodeverdi", () => {
            const instance = new CustomGrouplistUtfallSvarType({});
            const array = [
                { utfallType: { kodeverdi: "A" }, foo: 1 },
                { utfallType: { kodeverdi: "B" }, foo: 2 },
                { utfallType: { kodeverdi: "A" }, foo: 3 },
                { utfallType: { kodeverdi: "" }, foo: 4 },
                { foo: 5 }
            ];
            (getComponentDataValue as unknown as jest.Mock).mockReturnValue(array);
            (hasValue as unknown as jest.Mock).mockReturnValue(true);

            const result = instance.getValueFromFormData({}) as Record<string, { foo?: unknown }[]>;

            expect(result.A!.length).toBe(2);
            expect(result.B!.length).toBe(1);
            expect(result.A![0]!.foo).toBe(1);
            expect(result.A![1]!.foo).toBe(3);
            expect(result.B![0]!.foo).toBe(2);
            expect(result).not.toHaveProperty("");
        });

        it("should return empty object if array is empty or has no value", () => {
            const instance = new CustomGrouplistUtfallSvarType({});
            (getComponentDataValue as unknown as jest.Mock).mockReturnValue([]);
            (hasValue as unknown as jest.Mock).mockReturnValue(false);

            const result = instance.getValueFromFormData({}) as Record<string, { foo?: unknown }[]>;
            expect(result).toEqual({});
        });
    });

    describe("groupArrayItemsByUtfallType", () => {
        it("should group items by utfallType.kodeverdi", () => {
            const instance = new CustomGrouplistUtfallSvarType({});
            (hasValue as unknown as jest.Mock).mockReturnValue(true);
            const array = [
                { utfallType: { kodeverdi: "X" }, bar: 1 },
                { utfallType: { kodeverdi: "Y" }, bar: 2 },
                { utfallType: { kodeverdi: "X" }, bar: 3 }
            ];
            const result = instance.groupArrayItemsByUtfallType(array) as Record<string, unknown[]>;

            expect(result.X!.length).toBe(2);
            expect(result.Y!.length).toBe(1);
            expect((result.X![0] as { bar?: unknown }).bar).toBe(1);
            expect((result.X![1] as { bar?: unknown }).bar).toBe(3);
            expect((result.Y![0] as { bar?: unknown }).bar).toBe(2);
        });

        it("should skip items without utfallType.kodeverdi", () => {
            const instance = new CustomGrouplistUtfallSvarType({});
            (hasValue as unknown as jest.Mock).mockReturnValue(true);
            const array = [{ utfallType: { kodeverdi: "" }, bar: 1 }, { bar: 2 }];
            const result = instance.groupArrayItemsByUtfallType(array) as Record<string, unknown[]>;

            expect(result).toEqual({});
        });

        it("should return empty object if array is falsy", () => {
            const instance = new CustomGrouplistUtfallSvarType({});
            (hasValue as unknown as jest.Mock).mockReturnValue(false);
            const result = instance.groupArrayItemsByUtfallType(null) as Record<string, unknown[]>;
            expect(result).toEqual({});
        });
    });
});
