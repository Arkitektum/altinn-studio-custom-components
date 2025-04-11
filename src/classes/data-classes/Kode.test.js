import Kode from "./Kode";

describe("Kode", () => {
    it("should create an instance of Kode with the provided kodebeskrivelse", () => {
        const props = { kodebeskrivelse: "Test description" };
        const kode = new Kode(props);

        expect(kode).toBeInstanceOf(Kode);
        expect(kode.kodebeskrivelse).toBe("Test description");
    });

    it("should create an instance of Kode with undefined kodebeskrivelse if no props are provided", () => {
        const kode = new Kode();

        expect(kode).toBeInstanceOf(Kode);
        expect(kode.kodebeskrivelse).toBeUndefined();
    });

    it("should create an instance of Kode with undefined kodebeskrivelse if props is an empty object", () => {
        const kode = new Kode({});

        expect(kode).toBeInstanceOf(Kode);
        expect(kode.kodebeskrivelse).toBeUndefined();
    });
});
