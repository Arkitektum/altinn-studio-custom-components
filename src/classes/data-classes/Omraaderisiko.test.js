import Omraaderisiko from "./Omraaderisiko";
import Kode from "./Kode";

jest.mock("./Kode");

describe("Omraaderisiko", () => {
    beforeEach(() => {
        Kode.mockClear();
    });

    it("should create risikotype and sikkerhetsklasse as Kode instances when provided", () => {
        const risikotypeObj = { code: "R1", description: "Risk type 1" };
        const sikkerhetsklasseObj = { code: "S1", description: "Security class 1" };

        const instance = new Omraaderisiko({
            risikotype: risikotypeObj,
            sikkerhetsklasse: sikkerhetsklasseObj
        });

        expect(Kode).toHaveBeenCalledWith(risikotypeObj);
        expect(Kode).toHaveBeenCalledWith(sikkerhetsklasseObj);
        expect(instance.risikotype).toBeInstanceOf(Kode);
        expect(instance.sikkerhetsklasse).toBeInstanceOf(Kode);
    });

    it("should set risikotype to undefined if not provided", () => {
        const instance = new Omraaderisiko({ sikkerhetsklasse: { code: "S2" } });
        expect(instance.risikotype).toBeUndefined();
        expect(instance.sikkerhetsklasse).toBeInstanceOf(Kode);
    });

    it("should set sikkerhetsklasse to undefined if not provided", () => {
        const instance = new Omraaderisiko({ risikotype: { code: "R2" } });
        expect(instance.sikkerhetsklasse).toBeUndefined();
        expect(instance.risikotype).toBeInstanceOf(Kode);
    });

    it("should set both risikotype and sikkerhetsklasse to undefined if not provided", () => {
        const instance = new Omraaderisiko({});
        expect(instance.risikotype).toBeUndefined();
        expect(instance.sikkerhetsklasse).toBeUndefined();
    });

    it("should handle undefined props gracefully", () => {
        const instance = new Omraaderisiko();
        expect(instance.risikotype).toBeUndefined();
        expect(instance.sikkerhetsklasse).toBeUndefined();
    });
});
