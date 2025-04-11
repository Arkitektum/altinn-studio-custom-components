import { getDispensasjon, dispensasjonIsPlanBestemmelseType } from "./functions";
import Dispensasjon from "../../../classes/layout-classes/Dispensasjon";
import { hasValue } from "../../../functions/helpers";

jest.mock("../../../classes/layout-classes/Dispensasjon");
jest.mock("../../../functions/helpers");

describe("getDispensasjon", () => {
    it("should return a new Dispensasjon instance when formData is valid", () => {
        const mockFormData = { key: "value" };
        const mockComponent = { formData: mockFormData };
        hasValue.mockReturnValue(true);
        Dispensasjon.mockImplementation((data) => ({ data }));

        const result = getDispensasjon(mockComponent);

        expect(hasValue).toHaveBeenCalledWith(mockFormData);
        expect(result).toEqual({ data: mockFormData });
        expect(Dispensasjon).toHaveBeenCalledWith(mockFormData);
    });

    it("should return false when formData is invalid", () => {
        const mockComponent = { formData: null };
        hasValue.mockReturnValue(false);

        const result = getDispensasjon(mockComponent);

        expect(hasValue).toHaveBeenCalledWith(null);
        expect(result).toBe(false);
    });
});

describe("dispensasjonIsPlanBestemmelseType", () => {
    it("should return true when kodebeskrivelse matches a plan bestemmelse type", () => {
        const mockDispensasjon = {
            dispensasjonFra: {
                bestemmelserType: {
                    kodebeskrivelse: "kommuneplan"
                }
            }
        };

        const result = dispensasjonIsPlanBestemmelseType(mockDispensasjon);

        expect(result).toBe(true);
    });

    it("should return false when kodebeskrivelse does not match a plan bestemmelse type", () => {
        const mockDispensasjon = {
            dispensasjonFra: {
                bestemmelserType: {
                    kodebeskrivelse: "unknownType"
                }
            }
        };

        const result = dispensasjonIsPlanBestemmelseType(mockDispensasjon);

        expect(result).toBe(false);
    });

    it("should return false when kodebeskrivelse is undefined", () => {
        const mockDispensasjon = {
            dispensasjonFra: {
                bestemmelserType: {}
            }
        };

        const result = dispensasjonIsPlanBestemmelseType(mockDispensasjon);

        expect(result).toBe(false);
    });

    it("should return false when dispensasjonFra is undefined", () => {
        const mockDispensasjon = {};

        const result = dispensasjonIsPlanBestemmelseType(mockDispensasjon);

        expect(result).toBe(false);
    });
});
