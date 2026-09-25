import type { ResourceBindingGroup } from "../../../types.ts";

import { getTextResourceFromResourceBinding, hasValue } from "@arkitektum/altinn-studio-custom-components-utils";
import { hasMissingTextResources, hasValidationMessages } from "../../../functions/validations.ts";
import CustomGroupAnsvarsrettErklaeringer from "./CustomGroupAnsvarsrettErklaeringer.ts";
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
jest.mock("../../data-classes/AnsvarsrettAnsvarsomraade.ts", () => {
    return jest.fn().mockImplementation((data, bindings) => ({ data, bindings }));
});
jest.mock("../../../functions/helpers.ts", () => ({
    getComponentDataValue: jest.fn()
}));
jest.mock("@arkitektum/altinn-studio-custom-components-utils", () => ({
    hasValue: jest.fn(),
    getTextResourceFromResourceBinding: jest.fn()
}));
jest.mock("../../../functions/validations.ts", () => ({
    hasMissingTextResources: jest.fn(),
    hasValidationMessages: jest.fn()
}));

describe("CustomGroupAnsvarsrettErklaeringer", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("constructor", () => {
        it("should set isEmpty, validationMessages, hasValidationMessages, and resourceValues correctly when data is empty", () => {
            const props = { resourceValues: { title: "Test Title" } };
            const validationMessages = ["msg"];
            (getComponentDataValue as unknown as jest.Mock).mockReturnValue(undefined);
            (hasValue as unknown as jest.Mock).mockReturnValue(false);
            (hasMissingTextResources as unknown as jest.Mock).mockReturnValue(validationMessages);
            (hasValidationMessages as unknown as jest.Mock).mockReturnValue(true);
            (getTextResourceFromResourceBinding as unknown as jest.Mock).mockReturnValue("Empty Field");

            const instance = new CustomGroupAnsvarsrettErklaeringer(props);

            expect(instance.isEmpty).toBe(true);
            expect(instance.validationMessages).toBe(validationMessages);
            expect(instance.hasValidationMessages).toBe(true);
            expect(instance.resourceBindings).toBeDefined();
            expect(instance.resourceValues.title).toBe("Test Title");
            expect(instance.resourceValues.data).toBe("Empty Field");
        });

        it("should set resourceValues.data to ansvarsomraadeList when data is present", () => {
            const props = { resourceValues: { title: "Test Title" } };
            const data = [{ foo: "bar" }];
            (getComponentDataValue as unknown as jest.Mock).mockReturnValue(data);
            (hasValue as unknown as jest.Mock).mockReturnValue(true);
            (hasMissingTextResources as unknown as jest.Mock).mockReturnValue([]);
            (hasValidationMessages as unknown as jest.Mock).mockReturnValue(false);

            const instance = new CustomGroupAnsvarsrettErklaeringer(props);

            expect(instance.isEmpty).toBe(false);
            expect(Array.isArray(instance.resourceValues.data)).toBe(true);
            expect((instance.resourceValues.data as unknown[])[0]).toHaveProperty("data", { foo: "bar" });
        });
    });

    describe("getValueFromFormData", () => {
        it("should call getComponentDataValue and getAnsvarsomraadeListFromData", () => {
            const props = {};
            const resourceBindings = {};
            const data = [{ a: 1 }];
            (getComponentDataValue as unknown as jest.Mock).mockReturnValue(data);
            (hasValue as unknown as jest.Mock).mockReturnValue(true);

            const instance = new CustomGroupAnsvarsrettErklaeringer(props);
            const result = instance.getValueFromFormData(props, resourceBindings) as unknown[];

            expect(getComponentDataValue).toHaveBeenCalledWith(props);
            expect(Array.isArray(result)).toBe(true);
            expect(result[0]).toHaveProperty("data", { a: 1 });
        });
    });

    describe("getAnsvarsomraadeListFromData", () => {
        it("should return undefined if hasValue returns false", () => {
            (hasValue as unknown as jest.Mock).mockReturnValue(false);
            const instance = new CustomGroupAnsvarsrettErklaeringer({});
            expect(instance.getAnsvarsomraadeListFromData(undefined, {})).toBeUndefined();
        });

        it("should return mapped AnsvarsrettAnsvarsomraade instances if data is array", () => {
            (hasValue as unknown as jest.Mock).mockReturnValue(true);
            const data = [{ foo: 1 }, { bar: 2 }];
            const resourceBindings = { test: true };
            const instance = new CustomGroupAnsvarsrettErklaeringer({});
            const result = instance.getAnsvarsomraadeListFromData(data, resourceBindings as unknown as Record<string, ResourceBindingGroup>);
            expect(Array.isArray(result)).toBe(true);
            expect(result![0]).toHaveProperty("data", { foo: 1 });
            expect(result![1]).toHaveProperty("data", { bar: 2 });
        });

        it("should return empty array if data is not array", () => {
            (hasValue as unknown as jest.Mock).mockReturnValue(true);
            const instance = new CustomGroupAnsvarsrettErklaeringer({});
            const result = instance.getAnsvarsomraadeListFromData("notArray", {});
            expect(result).toEqual([]);
        });
    });

    describe("getValidationMessages", () => {
        it("should call hasMissingTextResources with bindings", () => {
            (hasMissingTextResources as unknown as jest.Mock).mockReturnValue(["msg"]);
            const instance = new CustomGroupAnsvarsrettErklaeringer({});
            const result = instance.getValidationMessages({ foo: "bar" } as unknown as Record<string, ResourceBindingGroup>);
            expect(result).toEqual(["msg"]);
            expect(hasMissingTextResources).toHaveBeenCalledWith({ foo: "bar" } as unknown as Record<string, ResourceBindingGroup>);
        });
    });

    describe("hasContent", () => {
        it("should call hasValue", () => {
            (hasValue as unknown as jest.Mock).mockReturnValue(true);
            const instance = new CustomGroupAnsvarsrettErklaeringer({});
            expect(instance.hasContent("data")).toBe(true);
            expect(hasValue).toHaveBeenCalledWith("data");
        });
    });

    describe("getResourceBindings", () => {
        it("should return default resource bindings if no overrides", () => {
            const instance = new CustomGroupAnsvarsrettErklaeringer({});
            const result = instance.getResourceBindings({});
            expect(result.ansvarsrettErklaeringTekst!.title).toBe("resource.ansvarsrettErklaeringTekst.title");
            expect(result.ansvarsrettSOEKTekst!.title).toBe("resource.ansvarsrettSOEKTekst.title");
            expect(result.ansvarsrettPROTekst!.title).toBe("resource.ansvarsrettPROTekst.title");
            expect(result.ansvarsrettUTFTekst!.title).toBe("resource.ansvarsrettUTFTekst.title");
            expect(result.ansvarsrettKONTROLLTekst!.title).toBe("resource.ansvarsrettKONTROLLTekst.title");
            expect(result.erklaeringer!.emptyFieldText).toBe("resource.emptyFieldText.default");
        });

        it("should use overrides from props.resourceBindings", () => {
            const props = {
                resourceBindings: {
                    ansvarsrettErklaeringTekst: { title: "customTitle", emptyFieldText: "customEmpty" },
                    title: "customErklaeringerTitle",
                    emptyFieldText: "customErklaeringerEmpty"
                }
            };
            const instance = new CustomGroupAnsvarsrettErklaeringer(props);
            const result = instance.getResourceBindings(props);
            expect(result.ansvarsrettErklaeringTekst!.title).toBe("customTitle");
            expect(result.ansvarsrettErklaeringTekst!.emptyFieldText).toBe("customEmpty");
            expect(result.erklaeringer!.emptyFieldText).toBe("customErklaeringerEmpty");
        });

        it("should not set erklaeringer.emptyFieldText if hideIfEmpty is true", () => {
            const props = { hideIfEmpty: true };
            const instance = new CustomGroupAnsvarsrettErklaeringer(props);
            const result = instance.getResourceBindings(props);
            expect(result.erklaeringer).toBeUndefined();
        });
    });
});
