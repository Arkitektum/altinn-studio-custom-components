import Adresse from "./Adresse";

describe("Adresse", () => {
    it("should set all properties when all props are provided", () => {
        const props = {
            adresselinje1: "Line 1",
            adresselinje2: "Line 2",
            adresselinje3: "Line 3",
            postnr: "1234",
            poststed: "Oslo",
            kommunenavn: "Oslo Kommune"
        };
        const adresse = new Adresse(props);

        expect(adresse.adresselinje1).toBe("Line 1");
        expect(adresse.adresselinje2).toBe("Line 2");
        expect(adresse.adresselinje3).toBe("Line 3");
        expect(adresse.postnr).toBe("1234");
        expect(adresse.poststed).toBe("Oslo");
        expect(adresse.kommunenavn).toBe("Oslo Kommune");
    });

    it("should set missing properties to undefined except kommunenavn which defaults to null", () => {
        const props = {
            adresselinje1: "Line 1",
            postnr: "5678"
        };
        const adresse = new Adresse(props);

        expect(adresse.adresselinje1).toBe("Line 1");
        expect(adresse.adresselinje2).toBeUndefined();
        expect(adresse.adresselinje3).toBeUndefined();
        expect(adresse.postnr).toBe("5678");
        expect(adresse.poststed).toBeUndefined();
        expect(adresse.kommunenavn).toBeNull();
    });

    it("should set kommunenavn to null if not provided", () => {
        const props = {};
        const adresse = new Adresse(props);

        expect(adresse.kommunenavn).toBeNull();
    });

    it("should set kommunenavn to null if explicitly set to null", () => {
        const props = { kommunenavn: null };
        const adresse = new Adresse(props);

        expect(adresse.kommunenavn).toBeNull();
    });

    it("should handle undefined props gracefully", () => {
        const adresse = new Adresse(undefined);

        expect(adresse.adresselinje1).toBeUndefined();
        expect(adresse.adresselinje2).toBeUndefined();
        expect(adresse.adresselinje3).toBeUndefined();
        expect(adresse.postnr).toBeUndefined();
        expect(adresse.poststed).toBeUndefined();
        expect(adresse.kommunenavn).toBeNull();
    });
});
