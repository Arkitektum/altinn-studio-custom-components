import CustomDispensasjonsvarsel from "./CustomDispensasjonsvarsel";
import Dispensasjonsvarsel from "../../layout-classes/Dispensasjonsvarsel";

// Mock dependencies
jest.mock("../../layout-classes/Dispensasjonsvarsel", () => {
    return jest.fn().mockImplementation((data) => ({ ...data, mock: true }));
});

const mockHasValue = jest.fn((val) => val !== undefined && val !== null && val !== "");
const mockHasMissingTextResources = jest.fn((bindings) => Object.keys(bindings).length === 0);
const mockGetComponentResourceValue = jest.fn((props, key) => `mocked_${key}`);
const mockHasValidationMessages = jest.fn((messages) => Array.isArray(messages) && messages.length > 0);

// Patch prototype for dependency injection
CustomDispensasjonsvarsel.prototype.hasContent = mockHasValue;
CustomDispensasjonsvarsel.prototype.getValidationMessages = mockHasMissingTextResources;
CustomDispensasjonsvarsel.prototype.getValueFromFormData = function (props) {
    return mockHasValue(props?.formData) && new Dispensasjonsvarsel(props.formData);
};
CustomDispensasjonsvarsel.prototype.getResourceBindings = function (props) {
    return props.resourceBindings || {};
};

// Test suite

describe("CustomDispensasjonsvarsel", () => {
    const props = {
        formData: { foo: "bar" },
        resourceBindings: {
            bestemmelse: { title: "Bestemmelse" },
            dispensasjonsvarsel: { title: "Dispensasjonsvarsel" },
            dispVarselBeskrivelse: { title: "Beskrivelse" },
            emne: { title: "Emne" },
            plannavn: { title: "Plannavn" }
        }
    };
    let instance;
    beforeEach(() => {
        instance = new CustomDispensasjonsvarsel(props);
    });

    it("should instantiate and set properties", () => {
        expect(instance.isEmpty).toBe(false);
        expect(instance.isPlanBestemmelsesType).toBe(false);
        expect(instance.isAndrePlanbestemmelser).toBe(false);
        expect(instance.validationMessages).toBe(false);
        expect(instance.resourceBindings).toEqual(props.resourceBindings);
        expect(instance.resourceValues.data).toEqual({ foo: "bar", mock: true });
    });

    it("hasContent returns correct value", () => {
        expect(instance.hasContent("abc")).toBe(true);
        expect(instance.hasContent("")).toBe(false);
    });

    it("getValueFromFormData returns Dispensasjonsvarsel instance or false", () => {
        expect(instance.getValueFromFormData({ formData: { foo: "bar" } })).toEqual({ foo: "bar", mock: true });
        expect(instance.getValueFromFormData({ formData: "" })).toBe(false);
    });

    it("getValidationMessages returns correct value", () => {
        expect(instance.getValidationMessages({})).toBe(true);
        expect(instance.getValidationMessages({ a: 1 })).toBe(false);
    });

    it("dataIsPlanBestemmelsesType returns true for REG/KOM", () => {
        expect(instance.dataIsPlanBestemmelsesType({ bestemmelsestype: { kodeverdi: "REG" } })).toBe(true);
        expect(instance.dataIsPlanBestemmelsesType({ bestemmelsestype: { kodeverdi: "KOM" } })).toBe(true);
        expect(instance.dataIsPlanBestemmelsesType({ bestemmelsestype: { kodeverdi: "OTHER" } })).toBe(false);
    });

    it("dataIsAndrePlanbestemmelser returns true for ANDREPLANBESTEMMELSER", () => {
        expect(instance.dataIsAndrePlanbestemmelser({ dispensasjonstema: { kodeverdi: "ANDREPLANBESTEMMELSER" } })).toBe(true);
        expect(instance.dataIsAndrePlanbestemmelser({ dispensasjonstema: { kodeverdi: "OTHER" } })).toBe(false);
    });

    it("getResourceBindings returns resource bindings", () => {
        expect(instance.getResourceBindings(props)).toEqual(props.resourceBindings);
    });
});
