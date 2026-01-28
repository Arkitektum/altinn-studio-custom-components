import CustomTableAnsvarsrettAnsvarsomraade from "./CustomTableAnsvarsrettAnsvarsomraade";
import AnsvarsrettAnsvarsomraade from "../../data-classes/AnsvarsrettAnsvarsomraade";
import { getComponentDataValue, getTextResourceFromResourceBinding, hasValue } from "../../../functions/helpers.js";
import { hasMissingTextResources, hasValidationMessages } from "../../../functions/validations.js";
// Mocks for helpers and validations
jest.mock("../../../functions/helpers.js", () => ({
    getComponentDataValue: jest.fn(),
    getTextResourceFromResourceBinding: jest.fn(),
    hasValue: jest.fn()
}));
jest.mock("../../../functions/validations.js", () => ({
    hasMissingTextResources: jest.fn(),
    hasValidationMessages: jest.fn()
}));

describe("CustomTableAnsvarsrettAnsvarsomraade", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("constructor", () => {
        it("should set isEmpty, validationMessages, hasValidationMessages, resourceBindings, and resourceValues when data is present", () => {
            const props = { formData: { foo: "bar" } };
            const fakeData = [{ a: 1 }];
            const fakeAnsvarsomraadeList = [new AnsvarsrettAnsvarsomraade({ a: 1 }, expect.any(Object))];
            getComponentDataValue.mockReturnValue(fakeData);
            hasValue.mockImplementation((data) => Array.isArray(data) && data.length > 0);
            hasMissingTextResources.mockReturnValue(["missing"]);
            hasValidationMessages.mockReturnValue(true);

            // Patch getAnsvarsomraadeListFromData to return fakeAnsvarsomraadeList
            const instance = new CustomTableAnsvarsrettAnsvarsomraade(props);
            jest.spyOn(instance, "getAnsvarsomraadeListFromData").mockReturnValue(fakeAnsvarsomraadeList);

            // Re-run constructor logic with patched method
            const resourceBindings = instance.getResourceBindings(props);
            const data = instance.getValueFromFormData(props, resourceBindings);
            const isEmpty = !instance.hasContent(data);
            const validationMessages = instance.getValidationMessages(resourceBindings);

            expect(instance.isEmpty).toBe(isEmpty);
            expect(instance.validationMessages).toBe(validationMessages);
            expect(instance.hasValidationMessages).toBe(true);
            expect(instance.resourceBindings).toEqual(resourceBindings);
            expect(instance.resourceValues).toHaveProperty("data");
        });

        it("should set isEmpty true and resourceValues.data to emptyFieldText when no data", () => {
            const props = {};
            getComponentDataValue.mockReturnValue(undefined);
            hasValue.mockReturnValue(false);
            getTextResourceFromResourceBinding.mockReturnValue("EMPTY");
            hasMissingTextResources.mockReturnValue(false);
            hasValidationMessages.mockReturnValue(false);

            const instance = new CustomTableAnsvarsrettAnsvarsomraade(props);

            expect(instance.isEmpty).toBe(true);
            expect(instance.resourceValues.data).toBe("EMPTY");
        });

        it("should use resourceValues.title if provided", () => {
            const props = { resourceValues: { title: "My Title" } };
            getComponentDataValue.mockReturnValue(undefined);
            hasValue.mockReturnValue(false);
            getTextResourceFromResourceBinding.mockReturnValue("EMPTY");
            hasMissingTextResources.mockReturnValue(false);
            hasValidationMessages.mockReturnValue(false);

            const instance = new CustomTableAnsvarsrettAnsvarsomraade(props);

            expect(instance.resourceValues.title).toBe("My Title");
        });
    });

    describe("getValueFromFormData", () => {
        it("should call getComponentDataValue and getAnsvarsomraadeListFromData", () => {
            const props = {};
            const resourceBindings = {};
            const data = [{ foo: 1 }];
            getComponentDataValue.mockReturnValue(data);
            const instance = new CustomTableAnsvarsrettAnsvarsomraade(props);
            const spy = jest.spyOn(instance, "getAnsvarsomraadeListFromData").mockReturnValue(["x"]);

            const result = instance.getValueFromFormData(props, resourceBindings);

            expect(getComponentDataValue).toHaveBeenCalledWith(props);
            expect(spy).toHaveBeenCalledWith(data, resourceBindings);
            expect(result).toEqual(["x"]);
        });
    });

    describe("getAnsvarsomraadeListFromData", () => {
        it("should return undefined if hasValue is false", () => {
            hasValue.mockReturnValue(false);
            const instance = new CustomTableAnsvarsrettAnsvarsomraade({});
            expect(instance.getAnsvarsomraadeListFromData(undefined, {})).toBeUndefined();
        });

        it("should return array of AnsvarsrettAnsvarsomraade if data is array", () => {
            hasValue.mockReturnValue(true);
            const data = [{ foo: 1 }, { bar: 2 }];
            const resourceBindings = {};
            const instance = new CustomTableAnsvarsrettAnsvarsomraade({});
            const result = instance.getAnsvarsomraadeListFromData(data, resourceBindings);
            expect(Array.isArray(result)).toBe(true);
            expect(result[0]).toBeInstanceOf(AnsvarsrettAnsvarsomraade);
        });

        it("should return empty array if data is not array but hasValue is true", () => {
            hasValue.mockReturnValue(true);
            const data = { foo: 1 };
            const instance = new CustomTableAnsvarsrettAnsvarsomraade({});
            const result = instance.getAnsvarsomraadeListFromData(data, {});
            expect(result).toEqual([]);
        });
    });

    describe("getValidationMessages", () => {
        it("should call hasMissingTextResources", () => {
            hasMissingTextResources.mockReturnValue(["missing"]);
            const instance = new CustomTableAnsvarsrettAnsvarsomraade({});
            const result = instance.getValidationMessages({ foo: "bar" });
            expect(hasMissingTextResources).toHaveBeenCalledWith({ foo: "bar" });
            expect(result).toEqual(["missing"]);
        });
    });

    describe("hasContent", () => {
        it("should call hasValue", () => {
            hasValue.mockReturnValue(true);
            const instance = new CustomTableAnsvarsrettAnsvarsomraade({});
            expect(instance.hasContent("abc")).toBe(true);
            expect(hasValue).toHaveBeenCalledWith("abc");
        });
    });

    describe("getResourceBindings", () => {
        it("should return default resource bindings if none provided", () => {
            const instance = new CustomTableAnsvarsrettAnsvarsomraade({ hideTitle: false });
            const result = instance.getResourceBindings({});
            expect(result.funksjon.title).toBe("resource.funksjon.title");
            expect(result.beskrivelseAvAnsvarsomraadet.title).toBe("resource.beskrivelseAvAnsvarsomraadet.title");
            expect(result.ansvarsomraader.emptyFieldText).toBe("resource.emptyFieldText.default");
        });

        it("should use provided resourceBindings and resourceValues", () => {
            const props = {
                resourceBindings: {
                    funksjon: { title: "custom.funksjon" },
                    title: "custom.ansvarsomraader",
                    emptyFieldText: "custom.empty"
                },
                hideTitle: false,
                resourceValues: {}
            };
            const instance = new CustomTableAnsvarsrettAnsvarsomraade(props);
            const result = instance.getResourceBindings(props);
            expect(result.funksjon.title).toBe("custom.funksjon");
            expect(result.ansvarsomraader.emptyFieldText).toBe("custom.empty");
        });

        it("should omit ansvarsomraader.title if hideTitle is true", () => {
            const props = { hideTitle: true };
            const instance = new CustomTableAnsvarsrettAnsvarsomraade(props);
            const result = instance.getResourceBindings(props);
            expect(result.ansvarsomraader?.title).toBeUndefined();
        });

        it("should omit ansvarsomraader.emptyFieldText if hideIfEmpty is true", () => {
            const props = { hideIfEmpty: true };
            const instance = new CustomTableAnsvarsrettAnsvarsomraade(props);
            const result = instance.getResourceBindings(props);
            expect(result.ansvarsomraader?.emptyFieldText).toBeUndefined();
        });
    });
});
