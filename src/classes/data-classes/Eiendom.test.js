import Eiendom from "./Eiendom";
import Adresse from "./Adresse";
import Eiendomsidentifikasjon from "./Eiendomsidentifikasjon";

jest.mock("./Adresse");
jest.mock("./Eiendomsidentifikasjon");

describe("Eiendom", () => {
    it("should create an instance of Eiendom with all properties", () => {
        const props = {
            adresse: { street: "Test Street", city: "Test City" },
            eiendomsidentifikasjon: { id: "12345" },
            bolignummer: "H0101",
            bygningsnummer: "B123"
        };

        const eiendom = new Eiendom(props);

        expect(Adresse).toHaveBeenCalledWith(props.adresse);
        expect(Eiendomsidentifikasjon).toHaveBeenCalledWith(props.eiendomsidentifikasjon);
        expect(eiendom.adresse).toBeInstanceOf(Adresse);
        expect(eiendom.eiendomsidentifikasjon).toBeInstanceOf(Eiendomsidentifikasjon);
        expect(eiendom.bolignummer).toBe(props.bolignummer);
        expect(eiendom.bygningsnummer).toBe(props.bygningsnummer);
    });

    it("should create an instance of Eiendom with missing optional properties", () => {
        const props = {
            bolignummer: "H0101"
        };

        const eiendom = new Eiendom(props);

        expect(eiendom.adresse).toBeUndefined();
        expect(eiendom.eiendomsidentifikasjon).toBeUndefined();
        expect(eiendom.bolignummer).toBe(props.bolignummer);
        expect(eiendom.bygningsnummer).toBeUndefined();
    });

    it("should handle undefined props gracefully", () => {
        const eiendom = new Eiendom();

        expect(eiendom.adresse).toBeUndefined();
        expect(eiendom.eiendomsidentifikasjon).toBeUndefined();
        expect(eiendom.bolignummer).toBeUndefined();
        expect(eiendom.bygningsnummer).toBeUndefined();
    });
});
