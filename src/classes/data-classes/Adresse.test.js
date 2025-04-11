import Adresse from "./Adresse";

describe("Adresse", () => {
    it("should create an instance with all properties defined", () => {
        const props = {
            adresselinje1: "Line 1",
            adresselinje2: "Line 2",
            adresselinje3: "Line 3",
            postnr: "1234",
            poststed: "City"
        };
        const adresse = new Adresse(props);

        expect(adresse.adresselinje1).toBe("Line 1");
        expect(adresse.adresselinje2).toBe("Line 2");
        expect(adresse.adresselinje3).toBe("Line 3");
        expect(adresse.postnr).toBe("1234");
        expect(adresse.poststed).toBe("City");
    });

    it("should create an instance with some properties undefined", () => {
        const props = {
            adresselinje1: "Line 1",
            postnr: "1234"
        };
        const adresse = new Adresse(props);

        expect(adresse.adresselinje1).toBe("Line 1");
        expect(adresse.adresselinje2).toBeUndefined();
        expect(adresse.adresselinje3).toBeUndefined();
        expect(adresse.postnr).toBe("1234");
        expect(adresse.poststed).toBeUndefined();
    });

    it("should create an instance with no properties when props is undefined", () => {
        const adresse = new Adresse();

        expect(adresse.adresselinje1).toBeUndefined();
        expect(adresse.adresselinje2).toBeUndefined();
        expect(adresse.adresselinje3).toBeUndefined();
        expect(adresse.postnr).toBeUndefined();
        expect(adresse.poststed).toBeUndefined();
    });
});
