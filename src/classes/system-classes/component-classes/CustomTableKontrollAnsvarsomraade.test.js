import CustomTableKontrollAnsvarsomraade from "./CustomTableKontrollAnsvarsomraade";
import { getComponentDataValue, getTextResourceFromResourceBinding, hasValue } from "../../../functions/helpers.js";
import { hasMissingTextResources, hasValidationMessages } from "../../../functions/validations.js";
import KontrollAnsvarsomraade from "../../data-classes/KontrollAnsvarsomraade.js";

jest.mock("../../../functions/helpers.js", () => ({
    getComponentDataValue: jest.fn(),
    getTextResourceFromResourceBinding: jest.fn(),
    hasValue: jest.fn()
}));
jest.mock("../../../functions/validations.js", () => ({
    hasMissingTextResources: jest.fn(),
    hasValidationMessages: jest.fn()
}));

describe("CustomTableKontrollAnsvarsomraade", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("constructor", () => {
        it("should set isEmpty, validationMessages, hasValidationMessages, resourceBindings, and resourceValues correctly when data is present", () => {
            const props = {
                formData: [{ id: 1 }]
            };
            const mockData = [{ id: 1 }];
            const fakeAnsvarsomraadeList = [new KontrollAnsvarsomraade({ a: 1 }, expect.any(Object))];
            getComponentDataValue.mockReturnValue(mockData);
            hasValue.mockImplementation((data) => Array.isArray(data) && data.length > 0);
            hasMissingTextResources.mockReturnValue(["missing"]);
            hasValidationMessages.mockReturnValue(true);

            // getTextResourceFromResourceBinding should not be called when data is present
            getTextResourceFromResourceBinding.mockReturnValue("empty");

            const instance = new CustomTableKontrollAnsvarsomraade(props);
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

        it("should set isEmpty true and resourceValues.data to emptyFieldText when data is empty", () => {
            const props = {
                formData: [],
                resourceBindings: {},
                resourceValues: {}
            };
            getComponentDataValue.mockReturnValue([]);
            hasValue.mockReturnValue(false);
            hasMissingTextResources.mockReturnValue(false);
            hasValidationMessages.mockReturnValue(false);
            getTextResourceFromResourceBinding.mockReturnValue("empty text");

            const instance = new CustomTableKontrollAnsvarsomraade(props);

            expect(instance.isEmpty).toBe(true);
            expect(instance.resourceValues.data).toBe("empty text");
            expect(getTextResourceFromResourceBinding).toHaveBeenCalled();
        });

        it("should use resourceValues.title if provided", () => {
            const props = {
                formData: [],
                resourceBindings: {},
                resourceValues: { title: "Custom Title" }
            };
            getComponentDataValue.mockReturnValue([]);
            hasValue.mockReturnValue(false);
            hasMissingTextResources.mockReturnValue(false);
            hasValidationMessages.mockReturnValue(false);
            getTextResourceFromResourceBinding.mockReturnValue("empty text");

            const instance = new CustomTableKontrollAnsvarsomraade(props);

            expect(instance.resourceValues.title).toBe("Custom Title");
        });
    });

    describe("getValueFromFormData", () => {
        it("should call getComponentDataValue and getAnsvarsomraadeListFromData", () => {
            const props = { formData: [{ id: 2 }] };
            const resourceBindings = {};
            const mockData = [{ id: 2 }];
            const mockList = [{ id: 2, _resourceBindings: resourceBindings }];
            getComponentDataValue.mockReturnValue(mockData);

            const instance = new CustomTableKontrollAnsvarsomraade({});
            instance.getAnsvarsomraadeListFromData = jest.fn().mockReturnValue(mockList);

            const result = instance.getValueFromFormData(props, resourceBindings);

            expect(getComponentDataValue).toHaveBeenCalledWith(props);
            expect(instance.getAnsvarsomraadeListFromData).toHaveBeenCalledWith(mockData, resourceBindings);
            expect(result).toBe(mockList);
        });
    });

    describe("getAnsvarsomraadeListFromData", () => {
        it("should return undefined if hasValue is false", () => {
            hasValue.mockReturnValue(false);
            const instance = new CustomTableKontrollAnsvarsomraade({});
            expect(instance.getAnsvarsomraadeListFromData(undefined, {})).toBeUndefined();
        });

        it("should return array of KontrollAnsvarsomraade if data is array", () => {
            hasValue.mockReturnValue(true);
            const data = [{ foo: 1 }, { bar: 2 }];
            const resourceBindings = {};
            const instance = new CustomTableKontrollAnsvarsomraade({});
            const result = instance.getAnsvarsomraadeListFromData(data, resourceBindings);
            expect(Array.isArray(result)).toBe(true);
            expect(result[0]).toBeInstanceOf(KontrollAnsvarsomraade);
        });

        it("should return empty array if data is not array but hasValue is true", () => {
            hasValue.mockReturnValue(true);
            const data = { foo: 1 };
            const instance = new CustomTableKontrollAnsvarsomraade({});
            const result = instance.getAnsvarsomraadeListFromData(data, {});
            expect(result).toEqual([]);
        });
    });

    describe("getValidationMessages", () => {
        it("should call hasMissingTextResources", () => {
            hasMissingTextResources.mockReturnValue(["msg"]);
            const instance = new CustomTableKontrollAnsvarsomraade({});
            const result = instance.getValidationMessages({ foo: "bar" });
            expect(result).toEqual(["msg"]);
            expect(hasMissingTextResources).toHaveBeenCalledWith({ foo: "bar" });
        });
    });

    describe("hasContent", () => {
        it("should call hasValue", () => {
            hasValue.mockReturnValue(true);
            const instance = new CustomTableKontrollAnsvarsomraade({});
            expect(instance.hasContent([1])).toBe(true);
            expect(hasValue).toHaveBeenCalledWith([1]);
        });
    });

    describe("getResourceBindings", () => {
        it("should return default resource bindings if none provided", () => {
            const instance = new CustomTableKontrollAnsvarsomraade({});
            const result = instance.getResourceBindings({});
            expect(result.funksjon.title).toBe("resource.funksjon.title");
            expect(result.beskrivelseAvAnsvarsomraadet.title).toBe("resource.beskrivelseAvAnsvarsomraadet.title");
            expect(result.datoAnsvarsrettErklaert.title).toBe("resource.datoAnsvarsrettErklaert.title");
            expect(result.erAnsvarsomraadetAvsluttet.title).toBe("resource.erAnsvarsomraadetAvsluttet.title");
            expect(result.ansvarsomraade.emptyFieldText).toBe("resource.emptyFieldText.default");
        });

        it("should use provided resourceBindings overrides", () => {
            const props = {
                resourceBindings: {
                    funksjon: { title: "custom.funksjon", emptyFieldText: "custom.empty" },
                    beskrivelseAvAnsvarsomraadet: { title: "custom.beskrivelse", emptyFieldText: "custom.empty" },
                    datoAnsvarsrettErklaert: { title: "custom.dato", emptyFieldText: "custom.empty" },
                    erAnsvarsomraadetAvsluttet: {
                        title: "custom.avsluttet",
                        trueText: { title: "custom.true" },
                        falseText: { title: "custom.false" },
                        defaultText: "custom.default"
                    },
                    title: "custom.ansvarsomraade",
                    emptyFieldText: "custom.emptyFieldText"
                }
            };
            const instance = new CustomTableKontrollAnsvarsomraade({});
            const result = instance.getResourceBindings(props);
            expect(result.funksjon.title).toBe("custom.funksjon");
            expect(result.beskrivelseAvAnsvarsomraadet.title).toBe("custom.beskrivelse");
            expect(result.datoAnsvarsrettErklaert.title).toBe("custom.dato");
            expect(result.erAnsvarsomraadetAvsluttet.title).toBe("custom.avsluttet");
            expect(result.erAnsvarsomraadetAvsluttet.trueText).toBe("custom.true");
            expect(result.erAnsvarsomraadetAvsluttet.falseText).toBe("custom.false");
            expect(result.erAnsvarsomraadetAvsluttet.defaultText).toBe("custom.default");
            expect(result.ansvarsomraade.emptyFieldText).toBe("custom.emptyFieldText");
        });

        it("should not include ansvarsomraade.emptyFieldText if hideIfEmpty is true", () => {
            const props = { hideIfEmpty: true };
            const instance = new CustomTableKontrollAnsvarsomraade({});
            expect(instance.getResourceBindings(props).ansvarsomraade).toBeUndefined();
        });
    });
});
