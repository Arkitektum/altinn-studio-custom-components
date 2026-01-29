import CustomGroupSamsvarAnsvarsomraade from "./CustomGroupSamsvarAnsvarsomraade";
import CustomComponent from "../CustomComponent";
import SamsvarAnsvarsomraade from "../../data-classes/SamsvarAnsvarsomraade";

// Mock dependencies
jest.mock("../../../functions/helpers.js", () => ({
    getComponentDataValue: jest.fn(),
    getTextResourceFromResourceBinding: jest.fn(),
    hasValue: jest.fn()
}));
jest.mock("../../../functions/validations.js", () => ({
    hasMissingTextResources: jest.fn(),
    hasValidationMessages: jest.fn()
}));
jest.mock("../../data-classes/SamsvarAnsvarsomraade");

const { getComponentDataValue, getTextResourceFromResourceBinding, hasValue } = require("../../../functions/helpers.js");
const { hasMissingTextResources, hasValidationMessages } = require("../../../functions/validations.js");

describe("CustomGroupSamsvarAnsvarsomraade", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should extend CustomComponent", () => {
        const instance = new CustomGroupSamsvarAnsvarsomraade({});
        expect(instance instanceof CustomComponent).toBe(true);
    });

    describe("constructor", () => {
        it("should set isEmpty to true and resourceValues.data to emptyFieldText when data is empty", () => {
            const props = { formData: {}, resourceBindings: {} };
            const fakeResourceBindings = {
                ansvarsomraade: { emptyFieldText: "emptyKey" }
            };
            const samsvarInstance = { foo: "bar" };

            // Mocks
            getComponentDataValue.mockReturnValue(undefined);
            SamsvarAnsvarsomraade.mockImplementation(() => samsvarInstance);
            hasValue.mockReturnValue(false);
            hasMissingTextResources.mockReturnValue([]);
            hasValidationMessages.mockReturnValue(false);
            getTextResourceFromResourceBinding.mockReturnValue("EMPTY_TEXT");

            // Spy on getResourceBindings to inject our fakeResourceBindings
            const spy = jest.spyOn(CustomGroupSamsvarAnsvarsomraade.prototype, "getResourceBindings");
            spy.mockReturnValue(fakeResourceBindings);

            const instance = new CustomGroupSamsvarAnsvarsomraade(props);

            expect(instance.isEmpty).toBe(true);
            expect(getTextResourceFromResourceBinding).toHaveBeenCalledWith("emptyKey");
            expect(instance.resourceValues.data).toBe("EMPTY_TEXT");
            expect(instance.validationMessages).toEqual([]);
            expect(instance.hasValidationMessages).toBe(false);

            spy.mockRestore();
        });

        it("should set isEmpty to false and resourceValues.data to data when data is present", () => {
            const props = { formData: { foo: "bar" }, resourceBindings: {} };
            const fakeResourceBindings = {
                ansvarsomraade: { emptyFieldText: "emptyKey" }
            };
            const samsvarInstance = { foo: "bar" };

            getComponentDataValue.mockReturnValue("someData");
            SamsvarAnsvarsomraade.mockImplementation(() => samsvarInstance);
            hasValue.mockReturnValue(true);
            hasMissingTextResources.mockReturnValue(["msg"]);
            hasValidationMessages.mockReturnValue(true);

            const spy = jest.spyOn(CustomGroupSamsvarAnsvarsomraade.prototype, "getResourceBindings");
            spy.mockReturnValue(fakeResourceBindings);

            const instance = new CustomGroupSamsvarAnsvarsomraade(props);

            expect(instance.isEmpty).toBe(false);
            expect(getTextResourceFromResourceBinding).not.toHaveBeenCalled();
            expect(instance.resourceValues.data).toBe(samsvarInstance);
            expect(instance.validationMessages).toEqual(["msg"]);
            expect(instance.hasValidationMessages).toBe(true);

            spy.mockRestore();
        });
    });

    describe("hasContent", () => {
        it("should delegate to hasValue", () => {
            const instance = new CustomGroupSamsvarAnsvarsomraade({});
            hasValue.mockReturnValue(true);
            expect(instance.hasContent("abc")).toBe(true);
            expect(hasValue).toHaveBeenCalledWith("abc");
        });
    });

    describe("getValidationMessages", () => {
        it("should delegate to hasMissingTextResources", () => {
            const instance = new CustomGroupSamsvarAnsvarsomraade({});
            hasMissingTextResources.mockReturnValue(["missing"]);
            expect(instance.getValidationMessages("bindings")).toEqual(["missing"]);
            expect(hasMissingTextResources).toHaveBeenCalledWith("bindings");
        });
    });

    describe("getValueFromFormData", () => {
        it("should return SamsvarAnsvarsomraade instance with data and resourceBindings", () => {
            const props = { formData: { foo: "bar" } };
            const resourceBindings = { test: 1 };
            getComponentDataValue.mockReturnValue("DATA");
            const samsvarInstance = { foo: "bar" };
            SamsvarAnsvarsomraade.mockImplementation(() => samsvarInstance);

            const instance = new CustomGroupSamsvarAnsvarsomraade({});
            const result = instance.getValueFromFormData(props, resourceBindings);

            expect(getComponentDataValue).toHaveBeenCalledWith(props);
            expect(SamsvarAnsvarsomraade).toHaveBeenCalledWith("DATA", resourceBindings);
            expect(result).toBe(samsvarInstance);
        });
    });

    describe("getResourceBindings", () => {
        it("should return default resource bindings when none are provided", () => {
            const instance = new CustomGroupSamsvarAnsvarsomraade({});
            const result = instance.getResourceBindings({});
            expect(result.funksjon.title).toBe("resource.funksjon.title");
            expect(result.ansvarsomraade.emptyFieldText).toBe("resource.emptyFieldText.default");
            expect(result.erAnsvarsomraadetAvsluttet.trueText).toBe("resource.trueText.default");
        });

        it("should override resource bindings when provided in props", () => {
            const props = {
                resourceBindings: {
                    funksjon: { title: "custom.title", emptyFieldText: "custom.empty" },
                    ansvarsomraade: { title: "ansvar.title", emptyFieldText: "ansvar.empty" },
                    erAnsvarsomraadetAvsluttet: {
                        title: "avsluttet.title",
                        trueText: { title: "yes" },
                        falseText: { title: "no" },
                        defaultText: "default"
                    }
                }
            };
            const instance = new CustomGroupSamsvarAnsvarsomraade({});
            const result = instance.getResourceBindings(props);
            expect(result.funksjon.title).toBe("custom.title");
            expect(result.funksjon.emptyFieldText).toBe("custom.empty");
            expect(result.ansvarsomraade.title).toBe("ansvar.title");
            expect(result.ansvarsomraade.emptyFieldText).toBe("ansvar.empty");
            expect(result.erAnsvarsomraadetAvsluttet.title).toBe("avsluttet.title");
            expect(result.erAnsvarsomraadetAvsluttet.trueText).toBe("yes");
            expect(result.erAnsvarsomraadetAvsluttet.falseText).toBe("no");
            expect(result.erAnsvarsomraadetAvsluttet.defaultText).toBe("default");
        });
    });
});
