import CustomGroupUtfallSvar from "./CustomGroupUtfallSvar";
import CustomComponent from "../CustomComponent";
import {
    getComponentDataValue,
    getComponentResourceValue,
    getTextResources,
    hasValue
} from "../../../functions/helpers";
import { hasMissingTextResources, hasValidationMessages } from "../../../functions/validations";

// Mock dependencies
jest.mock("../../../functions/helpers", () => ({
    getComponentDataValue: jest.fn(),
    getComponentResourceValue: jest.fn(),
    getTextResources: jest.fn(),
    hasValue: jest.fn()
}));
jest.mock("../../../functions/validations", () => ({
    hasMissingTextResources: jest.fn(),
    hasValidationMessages: jest.fn()
}));

describe("CustomGroupUtfallSvar", () => {
    let props;

    beforeEach(() => {
        props = { some: "prop" };
        getComponentDataValue.mockClear();
        getComponentResourceValue.mockClear();
        getTextResources.mockClear();
        hasValue.mockClear();
        hasMissingTextResources.mockClear();
        hasValidationMessages.mockClear();
    });

    it("should extend CustomComponent", () => {
        expect(CustomGroupUtfallSvar.prototype instanceof CustomComponent).toBe(true);
    });

    it("should set isEmpty to true if hasContent returns false", () => {
        getComponentDataValue.mockReturnValue(undefined);
        hasValue.mockReturnValue(false);
        getComponentResourceValue.mockReturnValue("empty");
        hasMissingTextResources.mockReturnValue(false);
        hasValidationMessages.mockReturnValue(false);

        const instance = new CustomGroupUtfallSvar(props);
        expect(instance.isEmpty).toBe(true);
        expect(instance.resourceValues.data).toBe("empty");
    });

    it("should set isEmpty to false if hasContent returns true", () => {
        getComponentDataValue.mockReturnValue("data");
        hasValue.mockReturnValue(true);
        hasMissingTextResources.mockReturnValue(false);
        hasValidationMessages.mockReturnValue(false);

        const instance = new CustomGroupUtfallSvar(props);
        expect(instance.isEmpty).toBe(false);
        expect(instance.resourceValues.data).toBe("data");
    });

    it("should set validationMessages and hasValidationMessages correctly", () => {
        getComponentDataValue.mockReturnValue("data");
        hasValue.mockReturnValue(true);
        hasMissingTextResources.mockReturnValue({ missing: true });
        hasValidationMessages.mockReturnValue(true);

        const instance = new CustomGroupUtfallSvar(props);
        expect(instance.validationMessages).toEqual({ missing: true });
        expect(instance.hasValidationMessages).toBe(true);
    });

    it("should set resourceBindings to utfallSvar object", () => {
        getComponentDataValue.mockReturnValue("data");
        hasValue.mockReturnValue(true);
        hasMissingTextResources.mockReturnValue(false);
        hasValidationMessages.mockReturnValue(false);

        const instance = new CustomGroupUtfallSvar(props);
        expect(instance.resourceBindings).toEqual({
            "status.title": "resource.utfallBesvarelse.utfallSvar.status.title",
            "tema.kodebeskrivelse.title": "resource.utfallBesvarelse.utfallSvar.tema.kodebeskrivelse.title",
            "kommentar.title": "resource.utfallBesvarelse.utfallSvar.kommentar.title",
            "vedleggsliste.vedlegg.title": "resource.utfallBesvarelse.utfallSvar.vedleggsliste.vedlegg.title"
        });
    });

    describe("hasContent", () => {
        it("should call hasValue with data", () => {
            hasValue.mockReturnValue(true);
            const instance = new CustomGroupUtfallSvar(props);
            instance.hasContent("abc");
            expect(hasValue).toHaveBeenCalledWith("abc");
        });
    });

    describe("getValidationMessages", () => {
        it("should call hasMissingTextResources with textResources and resourceBindings", () => {
            getTextResources.mockReturnValue({ txt: "res" });
            hasMissingTextResources.mockReturnValue(false);
            const instance = new CustomGroupUtfallSvar(props);
            const bindings = { foo: "bar" };
            instance.getValidationMessages(bindings);
            expect(getTextResources).toHaveBeenCalled();
            expect(hasMissingTextResources).toHaveBeenCalledWith({ txt: "res" }, bindings);
        });
    });

    describe("getValueFromFormData", () => {
        it("should call getComponentDataValue with props", () => {
            getComponentDataValue.mockReturnValue("value");
            const instance = new CustomGroupUtfallSvar(props);
            expect(instance.getValueFromFormData(props)).toBe("value");
            expect(getComponentDataValue).toHaveBeenCalledWith(props);
        });
    });

    describe("getResourceBindings", () => {
        it("should return correct resourceBindings object", () => {
            const instance = new CustomGroupUtfallSvar(props);
            expect(instance.getResourceBindings()).toEqual({
                utfallSvar: {
                    "status.title": "resource.utfallBesvarelse.utfallSvar.status.title",
                    "tema.kodebeskrivelse.title": "resource.utfallBesvarelse.utfallSvar.tema.kodebeskrivelse.title",
                    "kommentar.title": "resource.utfallBesvarelse.utfallSvar.kommentar.title",
                    "vedleggsliste.vedlegg.title": "resource.utfallBesvarelse.utfallSvar.vedleggsliste.vedlegg.title"
                }
            });
        });
    });
});
