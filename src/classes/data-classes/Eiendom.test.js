import Eiendom from "./Eiendom";
import Adresse from "./Adresse";
import Eiendomsidentifikasjon from "./Eiendomsidentifikasjon";

jest.mock("./Adresse");
jest.mock("./Eiendomsidentifikasjon");

describe("Eiendom", () => {
    beforeEach(() => {
        Adresse.mockClear();
        Eiendomsidentifikasjon.mockClear();
    });

    it("should create Adresse with props.adresse if provided", () => {
        const adresseObj = { gate: "Testgate", nummer: 1 };
        new Eiendom({ adresse: adresseObj });
        expect(Adresse).toHaveBeenCalledWith(adresseObj);
    });

    it("should create Adresse with props if props.adresse is not provided", () => {
        const props = { foo: "bar" };
        new Eiendom(props);
        expect(Adresse).toHaveBeenCalledWith(props);
    });

    it("should create Eiendomsidentifikasjon if props.eiendomsidentifikasjon is provided", () => {
        const eiendomsidentifikasjonObj = { id: "123" };
        new Eiendom({ eiendomsidentifikasjon: eiendomsidentifikasjonObj });
        expect(Eiendomsidentifikasjon).toHaveBeenCalledWith(eiendomsidentifikasjonObj);
    });

    it("should not create Eiendomsidentifikasjon if props.eiendomsidentifikasjon is not provided", () => {
        new Eiendom({});
        expect(Eiendomsidentifikasjon).not.toHaveBeenCalled();
    });

    it("should set bolignummer, bygningsnummer, and kommunenavn from props", () => {
        const props = {
            bolignummer: "B1",
            bygningsnummer: "BYG1",
            kommunenavn: "Oslo"
        };
        const eiendom = new Eiendom(props);
        expect(eiendom.bolignummer).toBe("B1");
        expect(eiendom.bygningsnummer).toBe("BYG1");
        expect(eiendom.kommunenavn).toBe("Oslo");
    });

    it("should set kommunenavn to null if not provided", () => {
        const eiendom = new Eiendom({});
        expect(eiendom.kommunenavn).toBeNull();
    });
});
