import type { ResourceBindingGroup } from "../../../types.ts";

import { getTextResourceFromResourceBinding, getTextResources, hasValue } from "@arkitektum/altinn-studio-custom-components-utils";
import { hasMissingTextResources, hasValidationMessages } from "../../../functions/validations.ts";
import CustomTableAnsvarsomraade from "./CustomTableAnsvarsomraade.ts";
import { getComponentDataValue } from "../../../functions/helpers.ts";

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
jest.mock("../../data-classes/Ansvarsomraade.ts", () => {
    return function Ansvarsomraade(this: Record<string, unknown>, data: unknown, resourceBindings: unknown) {
        this.data = data;
        this.resourceBindings = resourceBindings;
    };
});
jest.mock("../../../functions/helpers.ts", () => ({
    getComponentDataValue: jest.fn()
}));
jest.mock("@arkitektum/altinn-studio-custom-components-utils", () => ({
    hasValue: jest.fn(),
    getTextResourceFromResourceBinding: jest.fn(),
    getTextResources: jest.fn()
}));
jest.mock("../../../functions/validations.ts", () => ({
    hasMissingTextResources: jest.fn(),
    hasValidationMessages: jest.fn()
}));

describe("CustomTableAnsvarsomraade", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("constructor", () => {
        it("should set isEmpty to true if no content", () => {
            (hasValue as unknown as jest.Mock).mockReturnValue(false);
            (getComponentDataValue as unknown as jest.Mock).mockReturnValue(undefined);
            (hasValidationMessages as unknown as jest.Mock).mockReturnValue(false);
            (getTextResourceFromResourceBinding as unknown as jest.Mock).mockReturnValue("Empty");

            const props = {};
            const instance = new CustomTableAnsvarsomraade(props);

            expect(instance.isEmpty).toBe(true);
            expect(instance.resourceValues.data).toBe("Empty");
        });

        it("should set isEmpty to false if there is content", () => {
            (hasValue as unknown as jest.Mock).mockReturnValue(true);
            (getComponentDataValue as unknown as jest.Mock).mockReturnValue([{ foo: "bar" }]);
            (hasValidationMessages as unknown as jest.Mock).mockReturnValue(false);

            const props = {};
            const instance = new CustomTableAnsvarsomraade(props);

            expect(instance.isEmpty).toBe(false);
            expect(Array.isArray(instance.resourceValues.data)).toBe(true);
        });

        it("should set validationMessages and hasValidationMessages", () => {
            (hasValue as unknown as jest.Mock).mockReturnValue(false);
            (getComponentDataValue as unknown as jest.Mock).mockReturnValue(undefined);
            (hasMissingTextResources as unknown as jest.Mock).mockReturnValue({ missing: true });
            (hasValidationMessages as unknown as jest.Mock).mockReturnValue(true);

            const props = {};
            const instance = new CustomTableAnsvarsomraade(props);

            expect(instance.validationMessages).toEqual({ missing: true });
            expect(instance.hasValidationMessages).toBe(true);
        });

        it("should set resourceValues.title from props", () => {
            (hasValue as unknown as jest.Mock).mockReturnValue(false);
            (getComponentDataValue as unknown as jest.Mock).mockReturnValue(undefined);

            const props = { resourceValues: { title: "My Title" } };
            const instance = new CustomTableAnsvarsomraade(props);

            expect(instance.resourceValues.title).toBe("My Title");
        });
    });

    describe("getValueFromFormData", () => {
        it("should call getComponentDataValue and getAnsvarsomraadeListFromData", () => {
            (getComponentDataValue as unknown as jest.Mock).mockReturnValue([{ foo: "bar" }]);
            (hasValue as unknown as jest.Mock).mockReturnValue(true);

            const props = {};
            const resourceBindings = {};
            const instance = new CustomTableAnsvarsomraade(props);

            const result = instance.getValueFromFormData(props, resourceBindings) as unknown[];
            expect(getComponentDataValue).toHaveBeenCalledWith(props);
            expect(Array.isArray(result)).toBe(true);
            expect(result[0]).toHaveProperty("data");
        });

        it("should return undefined if no value", () => {
            (getComponentDataValue as unknown as jest.Mock).mockReturnValue(undefined);
            (hasValue as unknown as jest.Mock).mockReturnValue(false);

            const props = {};
            const resourceBindings = {};
            const instance = new CustomTableAnsvarsomraade(props);

            const result = instance.getValueFromFormData(props, resourceBindings) as unknown[];
            expect(result).toBeUndefined();
        });
    });

    describe("getAnsvarsomraadeListFromData", () => {
        it("should return array of Ansvarsomraade if data is array and has value", () => {
            (hasValue as unknown as jest.Mock).mockReturnValue(true);
            const instance = new CustomTableAnsvarsomraade({});
            const data = [{ a: 1 }, { b: 2 }];
            const resourceBindings = { foo: "bar" };
            const result = instance.getAnsvarsomraadeListFromData(data, resourceBindings as unknown as Record<string, ResourceBindingGroup>);

            expect(Array.isArray(result)).toBe(true);
            expect(result![0]).toHaveProperty("data", { a: 1 });
            expect(result![1]).toHaveProperty("data", { b: 2 });
        });

        it("should return undefined if hasValue returns false", () => {
            (hasValue as unknown as jest.Mock).mockReturnValue(false);
            const instance = new CustomTableAnsvarsomraade({});
            const result = instance.getAnsvarsomraadeListFromData(undefined, {});
            expect(result).toBeUndefined();
        });

        it("should return empty array if data is not array but has value", () => {
            (hasValue as unknown as jest.Mock).mockReturnValue(true);
            const instance = new CustomTableAnsvarsomraade({});
            const result = instance.getAnsvarsomraadeListFromData({}, {});
            expect(result).toEqual([]);
        });
    });

    describe("getValidationMessages", () => {
        it("should call getTextResources and hasMissingTextResources", () => {
            (getTextResources as unknown as jest.Mock).mockReturnValue(["res1", "res2"]);
            (hasMissingTextResources as unknown as jest.Mock).mockReturnValue({ missing: true });

            const instance = new CustomTableAnsvarsomraade({});
            const result = instance.getValidationMessages({ foo: "bar" } as unknown as Record<string, ResourceBindingGroup>);

            expect(hasMissingTextResources).toHaveBeenCalledWith({ foo: "bar" } as unknown as Record<string, ResourceBindingGroup>);
            expect(result).toEqual({ missing: true });
        });
    });

    describe("hasContent", () => {
        it("should return result of hasValue", () => {
            (hasValue as unknown as jest.Mock).mockReturnValue(true);
            const instance = new CustomTableAnsvarsomraade({});
            expect(instance.hasContent("something")).toBe(true);

            (hasValue as unknown as jest.Mock).mockReturnValue(false);
            expect(instance.hasContent(null)).toBe(false);
        });
    });

    describe("getResourceBindings", () => {
        it("should return default resource bindings", () => {
            const instance = new CustomTableAnsvarsomraade({});
            const result = instance.getResourceBindings({});
            expect(result.tiltaksklasse!.title).toBe("resource.tiltaksklasse.title");
            expect(result.ansvarsomraade!.title).toBe("resource.beskrivelseAvAnsvarsomraadet.title");
            expect(result.foretak!.title).toBe("resource.ansvarligForetak.title");
            expect(result.ansvarsfordeling!.title).toBe("resource.ansvarsfordeling.title");
            expect(result.ansvarsfordeling!.emptyFieldText).toBe("resource.emptyFieldText.default");
        });

        it("should use overrides from props.resourceBindings", () => {
            const props = {
                resourceBindings: {
                    tiltaksklasse: { title: "custom.tiltaksklasse", emptyFieldText: "custom.empty" },
                    ansvarsomraade: { title: "custom.ansvarsomraade", emptyFieldText: "custom.empty" },
                    foretak: { title: "custom.foretak", emptyFieldText: "custom.empty" },
                    title: "custom.ansvarsfordeling",
                    emptyFieldText: "custom.emptyFieldText"
                }
            };
            const instance = new CustomTableAnsvarsomraade(props);
            const result = instance.getResourceBindings(props);
            expect(result.tiltaksklasse!.title).toBe("custom.tiltaksklasse");
            expect(result.tiltaksklasse!.emptyFieldText).toBe("custom.empty");
            expect(result.ansvarsomraade!.title).toBe("custom.ansvarsomraade");
            expect(result.ansvarsomraade!.emptyFieldText).toBe("custom.empty");
            expect(result.foretak!.title).toBe("custom.foretak");
            expect(result.foretak!.emptyFieldText).toBe("custom.empty");
            expect(result.ansvarsfordeling!.title).toBe("custom.ansvarsfordeling");
            expect(result.ansvarsfordeling!.emptyFieldText).toBe("custom.emptyFieldText");
        });

        it("should omit ansvarsfordeling.title if hideTitle is true", () => {
            const props = { hideTitle: true };
            const instance = new CustomTableAnsvarsomraade(props);
            const result = instance.getResourceBindings(props);
            expect(result.ansvarsfordeling).toEqual({ emptyFieldText: "resource.emptyFieldText.default" });
        });

        it("should omit ansvarsfordeling.emptyFieldText if hideIfEmpty is true", () => {
            const props = { hideIfEmpty: true };
            const instance = new CustomTableAnsvarsomraade(props);
            const result = instance.getResourceBindings(props);
            expect(result.ansvarsfordeling!.emptyFieldText).toBeUndefined();
        });
    });
});
