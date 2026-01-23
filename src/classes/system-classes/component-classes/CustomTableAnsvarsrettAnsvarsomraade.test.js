import CustomTableAnsvarsrettAnsvarsomraade from "./CustomTableAnsvarsrettAnsvarsomraade";
import AnsvarsrettAnsvarsomraade from "../../data-classes/AnsvarsrettAnsvarsomraade.js";
import { getComponentDataValue, getTextResourceFromResourceBinding, hasValue } from "../../../functions/helpers.js";
import { hasMissingTextResources, hasValidationMessages } from "../../../functions/validations.js";

// Mocks
jest.mock("../CustomComponent.js", () => {
    return jest.fn().mockImplementation(() => ({}));
});
jest.mock("../../data-classes/AnsvarsrettAnsvarsomraade.js", () => {
    return jest.fn().mockImplementation((data, resourceBindings) => ({
        ...data,
        _resourceBindings: resourceBindings
    }));
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
describe("CustomTableAnsvarsrettAnsvarsomraade", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("constructor", () => {
        it("should set isEmpty, validationMessages, hasValidationMessages, resourceBindings, and resourceValues when data is present", () => {
            const props = {
                resourceBindings: {},
                resourceValues: {}
            };
            const mockData = [{ foo: "bar" }];
            getComponentDataValue.mockReturnValue(mockData);
            hasValue.mockImplementation((val) => (Array.isArray(val) ? val.length > 0 : !!val));
            hasMissingTextResources.mockReturnValue(["missing"]);
            hasValidationMessages.mockReturnValue(true);
            getTextResourceFromResourceBinding.mockReturnValue("empty");

            const instance = new CustomTableAnsvarsrettAnsvarsomraade(props);

            expect(instance.isEmpty).toBe(false);
            expect(instance.validationMessages).toEqual(["missing"]);
            expect(instance.hasValidationMessages).toBe(true);
            expect(instance.resourceBindings).toBeDefined();
            expect(instance.resourceValues.title).toBeUndefined();
            expect(instance.resourceValues.data).toEqual([expect.objectContaining({ foo: "bar", _resourceBindings: expect.any(Object) })]);
        });

        it("should set isEmpty true and resourceValues.data to emptyFieldText when no data", () => {
            const props = {
                resourceBindings: {},
                resourceValues: {}
            };
            getComponentDataValue.mockReturnValue(undefined);
            hasValue.mockReturnValue(false);
            hasMissingTextResources.mockReturnValue(false);
            hasValidationMessages.mockReturnValue(false);
            getTextResourceFromResourceBinding.mockReturnValue("empty text");

            const instance = new CustomTableAnsvarsrettAnsvarsomraade(props);

            expect(instance.isEmpty).toBe(true);
            expect(instance.resourceValues.data).toBe("empty text");
        });

        it("should use resourceValues.title if provided", () => {
            const props = {
                resourceBindings: {},
                resourceValues: { title: "Custom Title" }
            };
            getComponentDataValue.mockReturnValue([{ foo: 1 }]);
            hasValue.mockReturnValue(true);
            hasMissingTextResources.mockReturnValue(false);
            hasValidationMessages.mockReturnValue(false);

            const instance = new CustomTableAnsvarsrettAnsvarsomraade(props);

            expect(instance.resourceValues.title).toBe("Custom Title");
        });
    });

    describe("getValueFromFormData", () => {
        it("should call getComponentDataValue and getAnsvarsomraadeListFromData", () => {
            const props = {};
            const resourceBindings = {};
            const data = [{ a: 1 }];
            getComponentDataValue.mockReturnValue(data);
            const instance = new CustomTableAnsvarsrettAnsvarsomraade({});
            const spy = jest.spyOn(instance, "getAnsvarsomraadeListFromData");
            instance.getValueFromFormData(props, resourceBindings);
            expect(getComponentDataValue).toHaveBeenCalledWith(props);
            expect(spy).toHaveBeenCalledWith(data, resourceBindings);
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
            const resourceBindings = { test: 1 };
            const instance = new CustomTableAnsvarsrettAnsvarsomraade({});
            const result = instance.getAnsvarsomraadeListFromData(data, resourceBindings);
            expect(Array.isArray(result)).toBe(true);
            expect(result[0]).toMatchObject({ foo: 1, _resourceBindings: resourceBindings });
            expect(result[1]).toMatchObject({ bar: 2, _resourceBindings: resourceBindings });
        });

        it("should return empty array if data is not array but hasValue is true", () => {
            hasValue.mockReturnValue(true);
            const instance = new CustomTableAnsvarsrettAnsvarsomraade({});
            expect(instance.getAnsvarsomraadeListFromData("notArray", {})).toEqual([]);
        });
    });

    describe("getValidationMessages", () => {
        it("should call hasMissingTextResources", () => {
            hasMissingTextResources.mockReturnValue(["msg"]);
            const instance = new CustomTableAnsvarsrettAnsvarsomraade({});
            expect(instance.getValidationMessages({ foo: 1 })).toEqual(["msg"]);
            expect(hasMissingTextResources).toHaveBeenCalledWith({ foo: 1 });
        });
    });

    describe("hasContent", () => {
        it("should call hasValue", () => {
            hasValue.mockReturnValue(true);
            const instance = new CustomTableAnsvarsrettAnsvarsomraade({});
            expect(instance.hasContent([1, 2])).toBe(true);
            expect(hasValue).toHaveBeenCalledWith([1, 2]);
        });
    });

    describe("getResourceBindings", () => {
        it("should return default resource bindings if none provided", () => {
            hasValue.mockReturnValue(false);
            const instance = new CustomTableAnsvarsrettAnsvarsomraade({});
            const result = instance.getResourceBindings({});
            expect(result.funksjon.title).toBe("resource.funksjon.title");
            expect(result.ansvarsomraader.title).toBe("resource.ansvarsomraader.title");
            expect(result.ansvarsomraader.emptyFieldText).toBe("resource.emptyFieldText.default");
        });

        it("should use provided resourceBindings and resourceValues", () => {
            hasValue.mockReturnValue(true); // Simulate resourceValues.title exists
            const props = {
                resourceBindings: {
                    funksjon: { title: "custom.funksjon", emptyFieldText: "custom.empty" },
                    title: "custom.ansvarsomraader",
                    emptyFieldText: "custom.emptyFieldText"
                },
                resourceValues: { title: "provided" }
            };
            const instance = new CustomTableAnsvarsrettAnsvarsomraade({});
            const result = instance.getResourceBindings(props);
            expect(result.funksjon.title).toBe("custom.funksjon");
            expect(result.funksjon.emptyFieldText).toBe("custom.empty");
            expect(result.ansvarsomraader).toBeUndefined();
        });

        it("should omit ansvarsomraader.title if hideTitle is true", () => {
            hasValue.mockReturnValue(false);
            const props = { hideTitle: true };
            const instance = new CustomTableAnsvarsrettAnsvarsomraade({});
            const result = instance.getResourceBindings(props);
            expect(result.ansvarsomraader.title).toBeUndefined();
        });

        it("should omit ansvarsomraader.emptyFieldText if hideIfEmpty is true", () => {
            hasValue.mockReturnValue(false);
            const props = { hideIfEmpty: true };
            const instance = new CustomTableAnsvarsrettAnsvarsomraade({});
            const result = instance.getResourceBindings(props);
            expect(result.ansvarsomraader.emptyFieldText).toBeUndefined();
        });
    });
});
