import CustomGroupKontrollErklaeringer from "./CustomGroupKontrollErklaeringer";
import KontrollAnsvarsomraade from "../../data-classes/KontrollAnsvarsomraade";
import { getComponentDataValue, getTextResourceFromResourceBinding, hasValue } from "../../../functions/helpers.js";
import { hasMissingTextResources, hasValidationMessages } from "../../../functions/validations.js";

// Mock dependencies
jest.mock("../CustomComponent.js", () => {
    return class {};
});
jest.mock("../../data-classes/KontrollAnsvarsomraade.js", () => {
    return jest.fn().mockImplementation((data, bindings) => ({
        mockData: data,
        mockBindings: bindings
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

describe("CustomGroupKontrollErklaeringer", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("constructor", () => {
        it("should set properties correctly when data is not empty", () => {
            const props = {
                resourceValues: { title: "Test Title" },
                resourceBindings: {}
            };
            const mockData = { foo: "bar" };
            getComponentDataValue.mockReturnValue(mockData);
            hasValue.mockReturnValue(true);
            hasMissingTextResources.mockReturnValue(["msg1"]);
            hasValidationMessages.mockReturnValue(true);

            const instance = new CustomGroupKontrollErklaeringer(props);

            expect(instance.isEmpty).toBe(false);
            expect(instance.validationMessages).toEqual(["msg1"]);
            expect(instance.hasValidationMessages).toBe(true);
            expect(instance.resourceBindings).toBeDefined();
            expect(instance.resourceValues.title).toBe("Test Title");
            expect(instance.resourceValues.data).toEqual({
                mockData,
                mockBindings: instance.resourceBindings
            });
        });

        it("should set properties correctly when data is empty", () => {
            const props = {
                resourceValues: {},
                resourceBindings: {}
            };
            getComponentDataValue.mockReturnValue(null);
            hasValue.mockReturnValue(false);
            hasMissingTextResources.mockReturnValue([]);
            hasValidationMessages.mockReturnValue(false);
            getTextResourceFromResourceBinding.mockReturnValue("Empty Text");

            const instance = new CustomGroupKontrollErklaeringer(props);

            expect(instance.isEmpty).toBe(true);
            expect(instance.validationMessages).toEqual([]);
            expect(instance.hasValidationMessages).toBe(false);
            expect(instance.resourceValues.data).toBe("Empty Text");
        });
    });

    describe("getValueFromFormData", () => {
        it("should return KontrollAnsvarsomraade instance", () => {
            const props = { foo: "bar" };
            const resourceBindings = { baz: "qux" };
            getComponentDataValue.mockReturnValue("data");
            const instance = new CustomGroupKontrollErklaeringer({});
            const result = instance.getValueFromFormData(props, resourceBindings);
            expect(KontrollAnsvarsomraade).toHaveBeenCalledWith("data", resourceBindings);
            expect(result).toEqual({
                mockData: "data",
                mockBindings: resourceBindings
            });
        });
    });

    describe("getValidationMessages", () => {
        it("should call hasMissingTextResources with bindings", () => {
            hasMissingTextResources.mockReturnValue(["msg"]);
            const instance = new CustomGroupKontrollErklaeringer({});
            const result = instance.getValidationMessages({ foo: "bar" });
            expect(hasMissingTextResources).toHaveBeenCalledWith({ foo: "bar" });
            expect(result).toEqual(["msg"]);
        });
    });

    describe("hasContent", () => {
        it("should call hasValue with data", () => {
            hasValue.mockReturnValue(true);
            const instance = new CustomGroupKontrollErklaeringer({});
            expect(instance.hasContent("data")).toBe(true);
            expect(hasValue).toHaveBeenCalledWith("data");
        });
    });

    describe("getResourceBindings", () => {
        it("should provide default resource bindings", () => {
            hasValue.mockReturnValue(false);
            const props = {};
            const instance = new CustomGroupKontrollErklaeringer({});
            const result = instance.getResourceBindings(props);
            expect(result.kontrollErklaeringTekst.title).toBe("resource.kontrollErklaeringTekst.title");
            expect(result.kontrollKONTROLLTekst.title).toBe("resource.kontrollKONTROLLTekst.title");
            expect(result.erklaeringer.title).toBe("resource.erklaeringer.title");
            expect(result.erklaeringer.emptyFieldText).toBe("resource.emptyFieldText.default");
        });

        it("should override resource bindings from props", () => {
            hasValue.mockReturnValue(false);
            const props = {
                resourceBindings: {
                    kontrollErklaeringTekst: { title: "Custom Title", emptyFieldText: "Custom Empty" },
                    kontrollKONTROLLTekst: { title: "Custom KONTROLL", emptyFieldText: "Custom KONTROLL Empty" },
                    title: "Custom Erklaeringer Title",
                    emptyFieldText: "Custom Erklaeringer Empty"
                }
            };
            const instance = new CustomGroupKontrollErklaeringer({});
            const result = instance.getResourceBindings(props);
            expect(result.kontrollErklaeringTekst.title).toBe("Custom Title");
            expect(result.kontrollErklaeringTekst.emptyFieldText).toBe("Custom Empty");
            expect(result.kontrollKONTROLLTekst.title).toBe("Custom KONTROLL");
            expect(result.kontrollKONTROLLTekst.emptyFieldText).toBe("Custom KONTROLL Empty");
            expect(result.erklaeringer.title).toBe("Custom Erklaeringer Title");
            expect(result.erklaeringer.emptyFieldText).toBe("Custom Erklaeringer Empty");
        });

        it("should not set erklaeringer.emptyFieldText if hideIfEmpty is true", () => {
            hasValue.mockReturnValue(false);
            const props = {
                hideIfEmpty: true
            };
            const instance = new CustomGroupKontrollErklaeringer({});
            const result = instance.getResourceBindings(props);
            expect(result.erklaeringer).toEqual({ title: "resource.erklaeringer.title" });
            expect(result.erklaeringer.emptyFieldText).toBeUndefined();
        });
    });
});
