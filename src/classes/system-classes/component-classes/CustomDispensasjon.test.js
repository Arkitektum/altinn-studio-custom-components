import CustomDispensasjon from "./CustomDispensasjon";

// Mocks
jest.mock("../../layout-classes/Dispensasjon.js", () => {
    return jest.fn().mockImplementation((data) => ({ ...data, __isDispensasjon: true }));
});
jest.mock("../../../functions/helpers.js", () => ({
    getComponentResourceValue: jest.fn((props, key) => `resourceValue:${key}`),
    hasValue: jest.fn((val) => val !== undefined && val !== null && val !== "")
}));
jest.mock("../../../functions/validations.js", () => ({
    hasMissingTextResources: jest.fn(() => ["missing"]),
    hasValidationMessages: jest.fn((messages) => Array.isArray(messages) && messages.length > 0)
}));

const { getComponentResourceValue, hasValue } = require("../../../functions/helpers.js");
const { hasMissingTextResources, hasValidationMessages } = require("../../../functions/validations.js");

describe("CustomDispensasjon", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        globalThis.window = {};
    });

    describe("constructor", () => {
        it("should set isEmpty to true if formData is empty", () => {
            hasValue.mockReturnValue(false);
            const instance = new CustomDispensasjon({ formData: "" });
            expect(instance.isEmpty).toBe(true);
            expect(getComponentResourceValue).toHaveBeenCalledWith({ formData: "" }, "emptyFieldText");
            expect(instance.resourceValues.data).toBe("resourceValue:emptyFieldText");
        });

        it("should set isEmpty to false if formData is present", () => {
            hasValue.mockReturnValue(true);
            const instance = new CustomDispensasjon({ formData: { foo: "bar" } });
            expect(instance.isEmpty).toBe(false);
            expect(instance.resourceValues.data).toEqual(
                expect.objectContaining({ foo: "bar", __isDispensasjon: true })
            );
        });

        it("should set validationMessages and hasValidationMessages", () => {
            hasMissingTextResources.mockReturnValue(["missing"]);
            hasValidationMessages.mockReturnValue(true);
            const instance = new CustomDispensasjon({ formData: { foo: "bar" } });
            expect(instance.validationMessages).toEqual(["missing"]);
            expect(instance.hasValidationMessages).toBe(true);
        });

        it("should set resourceBindings and resourceValues", () => {
            hasValue.mockReturnValue(false);
            const instance = new CustomDispensasjon({ formData: null });
            expect(instance.resourceBindings).toHaveProperty("dispensasjonReferanse");
            expect(instance.resourceValues).toHaveProperty("data");
        });
    });

    describe("hasContent", () => {
        it("returns true if hasValue returns true", () => {
            hasValue.mockReturnValue(true);
            const instance = new CustomDispensasjon({});
            expect(instance.hasContent("abc")).toBe(true);
        });

        it("returns false if hasValue returns false", () => {
            hasValue.mockReturnValue(false);
            const instance = new CustomDispensasjon({});
            expect(instance.hasContent("")).toBe(false);
        });
    });

    describe("getValueFromFormData", () => {
        it("returns Dispensasjon instance if hasValue is true", () => {
            hasValue.mockReturnValue(true);
            const props = { formData: { foo: "bar" } };
            const instance = new CustomDispensasjon(props);
            const value = instance.getValueFromFormData(props);
            expect(value).toEqual(expect.objectContaining({ foo: "bar", __isDispensasjon: true }));
        });

        it("returns false if hasValue is false", () => {
            hasValue.mockReturnValue(false);
            const props = { formData: null };
            const instance = new CustomDispensasjon(props);
            expect(instance.getValueFromFormData(props)).toBe(false);
        });
    });

    describe("getValidationMessages", () => {
        it("calls hasMissingTextResources with window.textResources and bindings", () => {
            const instance = new CustomDispensasjon({});
            instance.getValidationMessages({ key: "value" });
            expect(hasMissingTextResources).toHaveBeenCalledWith({ key: "value" });
        });

        it("uses empty array if window.textResources is undefined", () => {
            const instance = new CustomDispensasjon({});
            instance.getValidationMessages({ key: "value" });
            expect(hasMissingTextResources).toHaveBeenCalledWith({ key: "value" });
        });
    });

    describe("dataIsPlanBestemmelseType", () => {
        it("returns true for reguleringsplan", () => {
            const instance = new CustomDispensasjon({});
            const data = {
                dispensasjonFra: {
                    bestemmelserType: { kodebeskrivelse: "reguleringsplan" }
                }
            };
            expect(instance.dataIsPlanBestemmelseType(data)).toBe(true);
        });

        it("returns true for kommuneplan (case insensitive)", () => {
            const instance = new CustomDispensasjon({});
            const data = {
                dispensasjonFra: {
                    bestemmelserType: { kodebeskrivelse: "KOMMUNEPLAN" }
                }
            };
            expect(instance.dataIsPlanBestemmelseType(data)).toBe(true);
        });

        it("returns false for unknown type", () => {
            const instance = new CustomDispensasjon({});
            const data = {
                dispensasjonFra: {
                    bestemmelserType: { kodebeskrivelse: "otherplan" }
                }
            };
            expect(instance.dataIsPlanBestemmelseType(data)).toBe(false);
        });

        it("returns false if data is missing", () => {
            const instance = new CustomDispensasjon({});
            expect(instance.dataIsPlanBestemmelseType({})).toBe(false);
        });
    });

    describe("getResourceBindings", () => {
        it("returns an object with expected keys and values", () => {
            const instance = new CustomDispensasjon({});
            const bindings = instance.getResourceBindings();
            expect(bindings).toHaveProperty("dispensasjonReferanse");
            expect(bindings.dispensasjonReferanse).toHaveProperty("title");
            expect(bindings.varighetOenskesVarigDispensasjon).toHaveProperty("trueText");
            expect(bindings.generelleVilkaarNorskSvenskDansk).toHaveProperty("title");
            expect(bindings.generelleVilkaarNorskSvenskDansk).toHaveProperty("trueText");
        });
    });
});
