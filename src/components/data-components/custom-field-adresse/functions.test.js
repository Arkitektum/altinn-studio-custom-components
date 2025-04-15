import { formatAdresse } from "./functions";

describe("formatAdresse", () => {
    it("should format a complete address with all fields", () => {
        const adresse = {
            adresselinje1: "Street 1",
            adresselinje2: "Street 2",
            adresselinje3: "Street 3",
            postnr: "1234",
            poststed: "CityName"
        };
        const result = formatAdresse(adresse);
        expect(result).toBe("Street 1\nStreet 2\nStreet 3\n1234 CityName");
    });

    it("should format an address with missing address lines", () => {
        const adresse = {
            adresselinje1: "Street 1",
            postnr: "1234",
            poststed: "CityName"
        };
        const result = formatAdresse(adresse);
        expect(result).toBe("Street 1\n1234 CityName");
    });

    it("should format an address with missing postal code", () => {
        const adresse = {
            adresselinje1: "Street 1",
            adresselinje2: "Street 2",
            poststed: "CityName"
        };
        const result = formatAdresse(adresse);
        expect(result).toBe("Street 1\nStreet 2\nCityName");
    });

    it("should format an address with missing city name", () => {
        const adresse = {
            adresselinje1: "Street 1",
            adresselinje2: "Street 2",
            postnr: "1234"
        };
        const result = formatAdresse(adresse);
        expect(result).toBe("Street 1\nStreet 2\n1234");
    });

    it("should format an address with only postal code and city", () => {
        const adresse = {
            postnr: "1234",
            poststed: "CityName"
        };
        const result = formatAdresse(adresse);
        expect(result).toBe("1234 CityName");
    });

    it("should return an empty string for an empty address object", () => {
        const adresse = {};
        const result = formatAdresse(adresse);
        expect(result).toBe("");
    });

    it("should handle null or undefined address lines gracefully", () => {
        const adresse = {
            adresselinje1: null,
            adresselinje2: undefined,
            adresselinje3: "Street 3",
            postnr: "1234",
            poststed: "CityName"
        };
        const result = formatAdresse(adresse);
        expect(result).toBe("Street 3\n1234 CityName");
    });
});
