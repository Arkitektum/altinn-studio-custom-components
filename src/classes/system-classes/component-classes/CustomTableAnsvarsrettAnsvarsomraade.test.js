import CustomTableAnsvarsrettAnsvarsomraade from "./CustomTableAnsvarsrettAnsvarsomraade";
import AnsvarsrettAnsvarsomraade from "../../data-classes/AnsvarsrettAnsvarsomraade";
import * as helpers from "../../../functions/helpers";
import * as validations from "../../../functions/validations";

// Mock dependencies
jest.mock("../../data-classes/AnsvarsrettAnsvarsomraade");
jest.mock("../../../functions/helpers");
jest.mock("../../../functions/validations");

describe("CustomTableAnsvarsrettAnsvarsomraade", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("getResourceBindings", () => {
        it("should return default resource bindings if none are provided", () => {
            const instance = new CustomTableAnsvarsrettAnsvarsomraade({});
            const bindings = instance.getResourceBindings({});
            expect(bindings.funksjon.title).toBe("resource.funksjon.title");
            expect(bindings.funksjon.emptyFieldText).toBe("resource.emptyFieldText.default");
            expect(bindings.ansvarsomraader.titleSingle).toBe("resource.ansvarsomraade.title");
            expect(bindings.ansvarsomraader.titlePlural).toBe("resource.ansvarsomraader.title");
            expect(bindings.ansvarsomraader.emptyFieldText).toBe("resource.emptyFieldText.default");
        });

        it("should use provided resource bindings", () => {
            const props = {
                resourceBindings: {
                    funksjon: { title: "custom.title", emptyFieldText: "custom.empty" },
                    titleSingle: "custom.single",
                    titlePlural: "custom.plural",
                    emptyFieldText: "custom.emptyFieldText"
                }
            };
            const instance = new CustomTableAnsvarsrettAnsvarsomraade(props);
            const bindings = instance.getResourceBindings(props);
            expect(bindings.funksjon.title).toBe("custom.title");
            expect(bindings.funksjon.emptyFieldText).toBe("custom.empty");
            expect(bindings.ansvarsomraader.titleSingle).toBe("custom.single");
            expect(bindings.ansvarsomraader.titlePlural).toBe("custom.plural");
            expect(bindings.ansvarsomraader.emptyFieldText).toBe("custom.emptyFieldText");
        });

        it("should omit ansvarsomraader title if hideTitle is true", () => {
            const props = { hideTitle: true };
            const instance = new CustomTableAnsvarsrettAnsvarsomraade(props);
            const bindings = instance.getResourceBindings(props);
            expect(bindings.ansvarsomraader.titleSingle).toBeUndefined();
            expect(bindings.ansvarsomraader.titlePlural).toBeUndefined();
        });

        it("should omit ansvarsomraader emptyFieldText if hideIfEmpty is true", () => {
            const props = { hideIfEmpty: true };
            const instance = new CustomTableAnsvarsrettAnsvarsomraade(props);
            const bindings = instance.getResourceBindings(props);
            expect(bindings.ansvarsomraader?.emptyFieldText).toBeUndefined();
        });
    });

    describe("getValueFromFormData", () => {
        it("should call getComponentDataValue and getAnsvarsomraadeListFromData", () => {
            const props = { formData: { a: 1, simpleBinding: "x" } };
            const resourceBindings = {};
            const fakeData = [{ foo: "bar" }];
            const fakeList = ["ansvarsomraade1"];
            helpers.getComponentDataValue.mockReturnValue(fakeData);

            const instance = new CustomTableAnsvarsrettAnsvarsomraade({});
            jest.spyOn(instance, "getAnsvarsomraadeListFromData").mockReturnValue(fakeList);

            const result = instance.getValueFromFormData(props, resourceBindings);

            expect(helpers.getComponentDataValue).toHaveBeenCalledWith({
                ...props,
                formData: { a: 1 }
            });
            expect(instance.getAnsvarsomraadeListFromData).toHaveBeenCalledWith(fakeData, resourceBindings);
            expect(result).toBe(fakeList);
        });
    });

    describe("getAnsvarsomraadeListFromData", () => {
        it("should return undefined if hasValue returns false", () => {
            helpers.hasValue.mockReturnValue(false);
            const instance = new CustomTableAnsvarsrettAnsvarsomraade({});
            expect(instance.getAnsvarsomraadeListFromData(null, {})).toBeUndefined();
        });

        it("should return array of AnsvarsrettAnsvarsomraade if data is array", () => {
            helpers.hasValue.mockReturnValue(true);
            const data = [{ a: 1 }, { b: 2 }];
            const resourceBindings = { foo: "bar" };
            AnsvarsrettAnsvarsomraade.mockImplementation((obj, rb) => ({ ...obj, _rb: rb }));

            const instance = new CustomTableAnsvarsrettAnsvarsomraade({});
            const result = instance.getAnsvarsomraadeListFromData(data, resourceBindings);

            expect(Array.isArray(result)).toBe(true);
            expect(result[0]).toEqual({ a: 1, _rb: resourceBindings });
            expect(result[1]).toEqual({ b: 2, _rb: resourceBindings });
        });

        it("should return empty array if data is not array but hasValue is true", () => {
            helpers.hasValue.mockReturnValue(true);
            const instance = new CustomTableAnsvarsrettAnsvarsomraade({});
            expect(instance.getAnsvarsomraadeListFromData("notArray", {})).toEqual([]);
        });
    });

    describe("getValidationMessages", () => {
        it("should call hasMissingTextResources", () => {
            validations.hasMissingTextResources.mockReturnValue(["msg"]);
            const instance = new CustomTableAnsvarsrettAnsvarsomraade({});
            const result = instance.getValidationMessages({ foo: "bar" });
            expect(validations.hasMissingTextResources).toHaveBeenCalledWith({ foo: "bar" });
            expect(result).toEqual(["msg"]);
        });
    });

    describe("hasContent", () => {
        it("should call hasValue", () => {
            helpers.hasValue.mockReturnValue(true);
            const instance = new CustomTableAnsvarsrettAnsvarsomraade({});
            expect(instance.hasContent("abc")).toBe(true);
            expect(helpers.hasValue).toHaveBeenCalledWith("abc");
        });
    });

    describe("constructor", () => {
        it("should set isEmpty, validationMessages, hasValidationMessages, resourceBindings, resourceValues", () => {
            const props = {
                formData: { simpleBinding: "sb", foo: "bar" },
                resourceValues: { title: "myTitle" }
            };
            const fakeBindings = { ansvarsomraader: { emptyFieldText: "empty" } };
            const fakeData = ["data"];
            const fakeValidationMessages = ["validation"];
            const fakeHasValidationMessages = true;

            const getResourceBindings = jest
                .spyOn(CustomTableAnsvarsrettAnsvarsomraade.prototype, "getResourceBindings")
                .mockReturnValue(fakeBindings);
            const getValueFromFormData = jest.spyOn(CustomTableAnsvarsrettAnsvarsomraade.prototype, "getValueFromFormData").mockReturnValue(fakeData);
            const hasContent = jest.spyOn(CustomTableAnsvarsrettAnsvarsomraade.prototype, "hasContent").mockReturnValue(true);
            const getValidationMessages = jest
                .spyOn(CustomTableAnsvarsrettAnsvarsomraade.prototype, "getValidationMessages")
                .mockReturnValue(fakeValidationMessages);
            validations.hasValidationMessages.mockReturnValue(fakeHasValidationMessages);

            const instance = new CustomTableAnsvarsrettAnsvarsomraade(props);

            expect(getResourceBindings).toHaveBeenCalledWith(props);
            expect(getValueFromFormData).toHaveBeenCalledWith(props, fakeBindings);
            expect(hasContent).toHaveBeenCalledWith(fakeData);
            expect(getValidationMessages).toHaveBeenCalledWith(fakeBindings);
            expect(instance.isEmpty).toBe(false);
            expect(instance.validationMessages).toBe(fakeValidationMessages);
            expect(instance.hasValidationMessages).toBe(fakeHasValidationMessages);
            expect(instance.resourceBindings).toBe(fakeBindings);
            expect(instance.resourceValues.title).toBe("myTitle");
            expect(instance.resourceValues.data).toBe(fakeData);
            expect(instance.resourceValues.simpleBinding).toBe("sb");

            getResourceBindings.mockRestore();
            getValueFromFormData.mockRestore();
            hasContent.mockRestore();
            getValidationMessages.mockRestore();
        });

        it("should set resourceValues.data to emptyFieldText if isEmpty", () => {
            const props = { formData: {}, resourceValues: {} };
            const fakeBindings = { ansvarsomraader: { emptyFieldText: "emptyKey" } };
            const fakeData = undefined;
            const fakeValidationMessages = [];
            const fakeHasValidationMessages = false;

            const getResourceBindings = jest
                .spyOn(CustomTableAnsvarsrettAnsvarsomraade.prototype, "getResourceBindings")
                .mockReturnValue(fakeBindings);
            const getValueFromFormData = jest.spyOn(CustomTableAnsvarsrettAnsvarsomraade.prototype, "getValueFromFormData").mockReturnValue(fakeData);
            const hasContent = jest.spyOn(CustomTableAnsvarsrettAnsvarsomraade.prototype, "hasContent").mockReturnValue(false);
            const getValidationMessages = jest
                .spyOn(CustomTableAnsvarsrettAnsvarsomraade.prototype, "getValidationMessages")
                .mockReturnValue(fakeValidationMessages);
            validations.hasValidationMessages.mockReturnValue(fakeHasValidationMessages);
            helpers.getTextResourceFromResourceBinding.mockReturnValue("EMPTY_TEXT");

            const instance = new CustomTableAnsvarsrettAnsvarsomraade(props);

            expect(instance.resourceValues.data).toBe("EMPTY_TEXT");
            expect(helpers.getTextResourceFromResourceBinding).toHaveBeenCalledWith("emptyKey");

            getResourceBindings.mockRestore();
            getValueFromFormData.mockRestore();
            hasContent.mockRestore();
            getValidationMessages.mockRestore();
        });
    });
});
