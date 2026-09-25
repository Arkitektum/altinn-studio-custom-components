import type { ComponentProps, ResourceBindingGroup } from "../../../types.ts";

import CustomDispensasjonsvarsel from "./CustomDispensasjonsvarsel.ts";

// Mock dependencies
jest.mock("../../layout-classes/Dispensasjonsvarsel", () => {
    return jest.fn().mockImplementation((...args: unknown[]) => ({ ...(args[0] as object), mock: true }));
});

const mockHasValue = jest.fn((val: unknown) => val !== undefined && val !== null && val !== "");
const mockHasMissingTextResources = jest.fn((bindings: object) => Object.keys(bindings).length === 0);

// Patch prototype for dependency injection
// The prototype is patched with stand-ins, which do not have the declared signatures: each test only checks that
// what went in came back out.
const prototype = CustomDispensasjonsvarsel.prototype as unknown as Record<string, unknown>;
prototype.hasContent = mockHasValue;
prototype.getValidationMessages = mockHasMissingTextResources;
prototype.getResourceBindings = function (props: ComponentProps) {
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
    let instance: CustomDispensasjonsvarsel;
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

    it("getValueFromFormData returns a Dispensasjonsvarsel instance, or undefined when there is no form data", () => {
        expect(instance.getValueFromFormData({ formData: { foo: "bar" } })).toEqual({ foo: "bar", mock: true });
        expect(instance.getValueFromFormData({ formData: "" } as unknown as ComponentProps)).toBeUndefined();
    });

    it("shows the empty field text when there is no form data at all", () => {
        // The real hasValue reports any boolean as content, which is how an absent form data used to end up stored
        // as false rather than the empty field text.
        const empty = new CustomDispensasjonsvarsel({ formData: undefined } as unknown as ComponentProps);
        expect(empty.isEmpty).toBe(true);
        expect(empty.resourceValues.data).not.toBe(false);
    });

    it("getValidationMessages returns correct value", () => {
        expect(instance.getValidationMessages({})).toBe(true);
        expect(instance.getValidationMessages({ a: 1 } as unknown as Record<string, ResourceBindingGroup>)).toBe(false);
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
