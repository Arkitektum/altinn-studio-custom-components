import CustomTableAnsvarsomraade from "./CustomTableAnsvarsomraade";
import { getComponentDataValue, getTextResourceFromResourceBinding, getTextResources, hasValue } from "../../../functions/helpers.js";
import { hasMissingTextResources, hasValidationMessages } from "../../../functions/validations.js";

// Mocks
jest.mock("../CustomComponent.js", () => {
    return class {};
});
jest.mock("../../data-classes/Ansvarsomraade.js", () => {
    return function Ansvarsomraade(data, resourceBindings) {
        this.data = data;
        this.resourceBindings = resourceBindings;
    };
});
jest.mock("../../../functions/helpers.js", () => ({
    getComponentDataValue: jest.fn(),
    getTextResourceFromResourceBinding: jest.fn(),
    getTextResources: jest.fn(),
    hasValue: jest.fn()
}));
jest.mock("../../../functions/validations.js", () => ({
    hasMissingTextResources: jest.fn(),
    hasValidationMessages: jest.fn()
}));

describe("CustomTableAnsvarsomraade", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("constructor", () => {
        it("should set isEmpty to true if no content", () => {
            hasValue.mockReturnValue(false);
            getComponentDataValue.mockReturnValue(undefined);
            hasValidationMessages.mockReturnValue(false);
            getTextResourceFromResourceBinding.mockReturnValue("Empty");

            const props = {};
            const instance = new CustomTableAnsvarsomraade(props);

            expect(instance.isEmpty).toBe(true);
            expect(instance.resourceValues.data).toBe("Empty");
        });

        it("should set isEmpty to false if there is content", () => {
            hasValue.mockReturnValue(true);
            getComponentDataValue.mockReturnValue([{ foo: "bar" }]);
            hasValidationMessages.mockReturnValue(false);

            const props = {};
            const instance = new CustomTableAnsvarsomraade(props);

            expect(instance.isEmpty).toBe(false);
            expect(Array.isArray(instance.resourceValues.data)).toBe(true);
        });

        it("should set validationMessages and hasValidationMessages", () => {
            hasValue.mockReturnValue(false);
            getComponentDataValue.mockReturnValue(undefined);
            hasMissingTextResources.mockReturnValue({ missing: true });
            hasValidationMessages.mockReturnValue(true);

            const props = {};
            const instance = new CustomTableAnsvarsomraade(props);

            expect(instance.validationMessages).toEqual({ missing: true });
            expect(instance.hasValidationMessages).toBe(true);
        });

        it("should set resourceValues.title from props", () => {
            hasValue.mockReturnValue(false);
            getComponentDataValue.mockReturnValue(undefined);

            const props = { resourceValues: { title: "My Title" } };
            const instance = new CustomTableAnsvarsomraade(props);

            expect(instance.resourceValues.title).toBe("My Title");
        });
    });

    describe("getValueFromFormData", () => {
        it("should call getComponentDataValue and getAnsvarsomraadeListFromData", () => {
            getComponentDataValue.mockReturnValue([{ foo: "bar" }]);
            hasValue.mockReturnValue(true);

            const props = {};
            const resourceBindings = {};
            const instance = new CustomTableAnsvarsomraade(props);

            const result = instance.getValueFromFormData(props, resourceBindings);
            expect(getComponentDataValue).toHaveBeenCalledWith(props);
            expect(Array.isArray(result)).toBe(true);
            expect(result[0]).toHaveProperty("data");
        });

        it("should return undefined if no value", () => {
            getComponentDataValue.mockReturnValue(undefined);
            hasValue.mockReturnValue(false);

            const props = {};
            const resourceBindings = {};
            const instance = new CustomTableAnsvarsomraade(props);

            const result = instance.getValueFromFormData(props, resourceBindings);
            expect(result).toBeUndefined();
        });
    });

    describe("getAnsvarsomraadeListFromData", () => {
        it("should return array of Ansvarsomraade if data is array and has value", () => {
            hasValue.mockReturnValue(true);
            const instance = new CustomTableAnsvarsomraade({});
            const data = [{ a: 1 }, { b: 2 }];
            const resourceBindings = { foo: "bar" };
            const result = instance.getAnsvarsomraadeListFromData(data, resourceBindings);

            expect(Array.isArray(result)).toBe(true);
            expect(result[0]).toHaveProperty("data", { a: 1 });
            expect(result[1]).toHaveProperty("data", { b: 2 });
        });

        it("should return undefined if hasValue returns false", () => {
            hasValue.mockReturnValue(false);
            const instance = new CustomTableAnsvarsomraade({});
            const result = instance.getAnsvarsomraadeListFromData(undefined, {});
            expect(result).toBeUndefined();
        });

        it("should return empty array if data is not array but has value", () => {
            hasValue.mockReturnValue(true);
            const instance = new CustomTableAnsvarsomraade({});
            const result = instance.getAnsvarsomraadeListFromData({}, {});
            expect(result).toEqual([]);
        });
    });

    describe("getValidationMessages", () => {
        it("should call getTextResources and hasMissingTextResources", () => {
            getTextResources.mockReturnValue(["res1", "res2"]);
            hasMissingTextResources.mockReturnValue({ missing: true });

            const instance = new CustomTableAnsvarsomraade({});
            const result = instance.getValidationMessages({ foo: "bar" });

            expect(hasMissingTextResources).toHaveBeenCalledWith({ foo: "bar" });
            expect(result).toEqual({ missing: true });
        });
    });

    describe("hasContent", () => {
        it("should return result of hasValue", () => {
            hasValue.mockReturnValue(true);
            const instance = new CustomTableAnsvarsomraade({});
            expect(instance.hasContent("something")).toBe(true);

            hasValue.mockReturnValue(false);
            expect(instance.hasContent(null)).toBe(false);
        });
    });

    describe("getResourceBindings", () => {
        it("should return default resource bindings", () => {
            const instance = new CustomTableAnsvarsomraade({});
            const result = instance.getResourceBindings({});
            expect(result.tiltaksklasse.title).toBe("resource.tiltaksklasse.title");
            expect(result.ansvarsomraade.title).toBe("resource.beskrivelseAvAnsvarsomraadet.title");
            expect(result.foretak.title).toBe("resource.foretak.title");
            expect(result.ansvarsfordeling.title).toBe("resource.ansvarsfordeling.title");
            expect(result.ansvarsfordeling.emptyFieldText).toBe("resource.emptyFieldText.default");
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
            expect(result.tiltaksklasse.title).toBe("custom.tiltaksklasse");
            expect(result.tiltaksklasse.emptyFieldText).toBe("custom.empty");
            expect(result.ansvarsomraade.title).toBe("custom.ansvarsomraade");
            expect(result.ansvarsomraade.emptyFieldText).toBe("custom.empty");
            expect(result.foretak.title).toBe("custom.foretak");
            expect(result.foretak.emptyFieldText).toBe("custom.empty");
            expect(result.ansvarsfordeling.title).toBe("custom.ansvarsfordeling");
            expect(result.ansvarsfordeling.emptyFieldText).toBe("custom.emptyFieldText");
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
            expect(result.ansvarsfordeling.emptyFieldText).toBeUndefined();
        });
    });
});
