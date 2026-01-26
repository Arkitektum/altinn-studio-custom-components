import CustomGroupAnsvarsrettErklaeringer from "./CustomGroupAnsvarsrettErklaeringer";
import { getComponentDataValue, getTextResourceFromResourceBinding, hasValue } from "../../../functions/helpers.js";
import { hasMissingTextResources, hasValidationMessages } from "../../../functions/validations.js";
import AnsvarsrettAnsvarsomraade from "../../data-classes/AnsvarsrettAnsvarsomraade.js";

// Mocks
jest.mock("../CustomComponent.js", () => {
    return class {};
});
jest.mock("../../data-classes/AnsvarsrettAnsvarsomraade.js", () => {
    return jest.fn().mockImplementation((data, bindings) => ({ data, bindings }));
});
jest.mock("../../../functions/helpers.js", () => ({
    getComponentDataValue: jest.fn(),
    getTextResourceFromResourceBinding: jest.fn(),
    hasValue: jest.fn()
}));
jest.mock("../../../functions/validations.js", () => ({
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
            getComponentDataValue.mockReturnValue(undefined);
            hasValue.mockReturnValue(false);
            hasMissingTextResources.mockReturnValue(validationMessages);
            hasValidationMessages.mockReturnValue(true);
            getTextResourceFromResourceBinding.mockReturnValue("Empty Field");

            const instance = new CustomGroupAnsvarsrettErklaeringer(props);
            console.log(instance);

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
            getComponentDataValue.mockReturnValue(data);
            hasValue.mockReturnValue(true);
            hasMissingTextResources.mockReturnValue([]);
            hasValidationMessages.mockReturnValue(false);

            const instance = new CustomGroupAnsvarsrettErklaeringer(props);

            expect(instance.isEmpty).toBe(false);
            expect(Array.isArray(instance.resourceValues.data)).toBe(true);
            expect(instance.resourceValues.data[0]).toHaveProperty("data", { foo: "bar" });
        });
    });

    describe("getValueFromFormData", () => {
        it("should call getComponentDataValue and getAnsvarsomraadeListFromData", () => {
            const props = {};
            const resourceBindings = {};
            const data = [{ a: 1 }];
            getComponentDataValue.mockReturnValue(data);
            hasValue.mockReturnValue(true);

            const instance = new CustomGroupAnsvarsrettErklaeringer(props);
            const result = instance.getValueFromFormData(props, resourceBindings);

            expect(getComponentDataValue).toHaveBeenCalledWith(props);
            expect(Array.isArray(result)).toBe(true);
            expect(result[0]).toHaveProperty("data", { a: 1 });
        });
    });

    describe("getAnsvarsomraadeListFromData", () => {
        it("should return undefined if hasValue returns false", () => {
            hasValue.mockReturnValue(false);
            const instance = new CustomGroupAnsvarsrettErklaeringer({});
            expect(instance.getAnsvarsomraadeListFromData(undefined, {})).toBeUndefined();
        });

        it("should return mapped AnsvarsrettAnsvarsomraade instances if data is array", () => {
            hasValue.mockReturnValue(true);
            const data = [{ foo: 1 }, { bar: 2 }];
            const resourceBindings = { test: true };
            const instance = new CustomGroupAnsvarsrettErklaeringer({});
            const result = instance.getAnsvarsomraadeListFromData(data, resourceBindings);
            expect(Array.isArray(result)).toBe(true);
            expect(result[0]).toHaveProperty("data", { foo: 1 });
            expect(result[1]).toHaveProperty("data", { bar: 2 });
        });

        it("should return empty array if data is not array", () => {
            hasValue.mockReturnValue(true);
            const instance = new CustomGroupAnsvarsrettErklaeringer({});
            const result = instance.getAnsvarsomraadeListFromData("notArray", {});
            expect(result).toEqual([]);
        });
    });

    describe("getValidationMessages", () => {
        it("should call hasMissingTextResources with bindings", () => {
            hasMissingTextResources.mockReturnValue(["msg"]);
            const instance = new CustomGroupAnsvarsrettErklaeringer({});
            const result = instance.getValidationMessages({ foo: "bar" });
            expect(result).toEqual(["msg"]);
            expect(hasMissingTextResources).toHaveBeenCalledWith({ foo: "bar" });
        });
    });

    describe("hasContent", () => {
        it("should call hasValue", () => {
            hasValue.mockReturnValue(true);
            const instance = new CustomGroupAnsvarsrettErklaeringer({});
            expect(instance.hasContent("data")).toBe(true);
            expect(hasValue).toHaveBeenCalledWith("data");
        });
    });

    describe("getResourceBindings", () => {
        it("should return default resource bindings if no overrides", () => {
            const instance = new CustomGroupAnsvarsrettErklaeringer({});
            const result = instance.getResourceBindings({});
            expect(result.erklaeringTekst.title).toBe("resource.erklaeringTekst.title");
            expect(result.SOEKTekst.title).toBe("resource.SOEKTekst.title");
            expect(result.PROTekst.title).toBe("resource.PROTekst.title");
            expect(result.UTFTekst.title).toBe("resource.UTFTekst.title");
            expect(result.KONTROLLTekst.title).toBe("resource.KONTROLLTekst.title");
            expect(result.erklaeringer.emptyFieldText).toBe("resource.emptyFieldText.default");
        });

        it("should use overrides from props.resourceBindings", () => {
            const props = {
                resourceBindings: {
                    erklaeringTekst: { title: "customTitle", emptyFieldText: "customEmpty" },
                    title: "customErklaeringerTitle",
                    emptyFieldText: "customErklaeringerEmpty"
                }
            };
            const instance = new CustomGroupAnsvarsrettErklaeringer(props);
            const result = instance.getResourceBindings(props);
            expect(result.erklaeringTekst.title).toBe("customTitle");
            expect(result.erklaeringTekst.emptyFieldText).toBe("customEmpty");
            expect(result.erklaeringer.emptyFieldText).toBe("customErklaeringerEmpty");
        });

        it("should not set erklaeringer.emptyFieldText if hideIfEmpty is true", () => {
            const props = { hideIfEmpty: true };
            const instance = new CustomGroupAnsvarsrettErklaeringer(props);
            const result = instance.getResourceBindings(props);
            expect(result.erklaeringer).toBeUndefined();
        });
    });
});
