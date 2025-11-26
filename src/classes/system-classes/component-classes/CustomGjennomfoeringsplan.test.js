import CustomGjennomfoeringsplan from "./CustomGjennomfoeringsplan";
import Gjennomfoeringsplan from "../../layout-classes/Gjennomfoeringsplan";
import { getComponentResourceValue, getTextResources, hasValue } from "../../../functions/helpers";
import { hasMissingTextResources, hasValidationMessages } from "../../../functions/validations";

jest.mock("../../layout-classes/Gjennomfoeringsplan");
jest.mock("../CustomComponent");
jest.mock("../../../functions/helpers");
jest.mock("../../../functions/validations");

describe("CustomGjennomfoeringsplan", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const mockFormData = { some: "data" };
    const mockResourceBindings = {
        tiltaksklasse: { title: "custom.title", emptyFieldText: "custom.empty" }
    };

    getComponentResourceValue.mockReturnValue("EMPTY_FIELD_TEXT");
    getTextResources.mockReturnValue({ resource: "value" });
    hasValue.mockImplementation((data) => !!data);
    hasMissingTextResources.mockReturnValue({ missing: false });
    hasValidationMessages.mockReturnValue(false);
    Gjennomfoeringsplan.mockImplementation((data) => ({ ...data, isGjennomfoeringsplan: true }));

    it("should initialize with non-empty data", () => {
        const props = { formData: mockFormData };
        const instance = new CustomGjennomfoeringsplan(props);

        expect(instance.isEmpty).toBe(false);
        expect(instance.resourceValues.data).toEqual({ ...mockFormData, isGjennomfoeringsplan: true });
        expect(instance.resourceBindings.gjennomfoeringsplan.title).toBe("resource.gjennomfoeringsplan.title");
        expect(instance.hasValidationMessages).toBe(false);
        expect(instance.validationMessages).toEqual({ missing: false });
    });

    it("should initialize with empty data", () => {
        hasValue.mockReturnValue(false);
        const props = { formData: null };
        const instance = new CustomGjennomfoeringsplan(props);

        expect(instance.isEmpty).toBe(true);
        expect(getComponentResourceValue).toHaveBeenCalledWith(props, "emptyFieldText");
        expect(instance.resourceValues.data).toBe("EMPTY_FIELD_TEXT");
    });

    it("should apply resourceBindings overrides", () => {
        const props = { formData: mockFormData, resourceBindings: mockResourceBindings };
        const instance = new CustomGjennomfoeringsplan(props);

        expect(instance.resourceBindings.tiltaksklasse.title).toBe("custom.title");
        expect(instance.resourceBindings.tiltaksklasse.emptyFieldText).toBe("custom.empty");
        expect(instance.resourceBindings.ansvarsomraade.emptyFieldText).toBe("resource.emptyFieldText.default");
    });

    it("hasContent should delegate to hasValue", () => {
        const instance = new CustomGjennomfoeringsplan({ formData: mockFormData });
        hasValue.mockReturnValue(true);
        expect(instance.hasContent("abc")).toBe(true);
        hasValue.mockReturnValue(false);
        expect(instance.hasContent("")).toBe(false);
    });

    it("getValueFromFormData should return Gjennomfoeringsplan instance", () => {
        const instance = new CustomGjennomfoeringsplan({ formData: mockFormData });
        const result = instance.getValueFromFormData({ formData: mockFormData });
        expect(result).toEqual({ ...mockFormData, isGjennomfoeringsplan: true });
        expect(Gjennomfoeringsplan).toHaveBeenCalledWith(mockFormData);
    });

    it("getValidationMessages should call hasMissingTextResources", () => {
        const instance = new CustomGjennomfoeringsplan({ formData: mockFormData });
        const bindings = { foo: "bar" };
        instance.getValidationMessages(bindings);
        expect(getTextResources).toHaveBeenCalled();
        expect(hasMissingTextResources).toHaveBeenCalledWith({ resource: "value" }, bindings);
    });

    it("getResourceBindings should return default and overridden bindings", () => {
        const instance = new CustomGjennomfoeringsplan({ resourceBindings: mockResourceBindings });
        const bindings = instance.getResourceBindings({ resourceBindings: mockResourceBindings });
        expect(bindings.tiltaksklasse.title).toBe("custom.title");
        expect(bindings.tiltaksklasse.emptyFieldText).toBe("custom.empty");
        expect(bindings.ansvarsfordeling.title).toBe("resource.ansvarsfordeling.title");
    });
});
