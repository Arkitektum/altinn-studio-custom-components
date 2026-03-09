import Dispensasjonsvarsel from "./Dispensasjonsvarsel.js";
import Kode from "../data-classes/Kode.js";

describe("Dispensasjonsvarsel", () => {
    it("should initialize all properties correctly", () => {
        const props = {
            annetTema: "tema",
            bestemmelsesoverskrift: "overskrift",
            bestemmelsestekst: "tekst",
            bestemmelsestype: { kodeverdi: "type", kodebeskrivelse: "TypeNavn" },
            dispVarselBeskrivelse: "beskrivelse",
            dispensasjonstema: { kodeverdi: "disp", kodebeskrivelse: "DispNavn" },
            paragrafnummer: "§1",
            plannavn: "Planen"
        };
        const instance = new Dispensasjonsvarsel(props);
        expect(instance.annetTema).toBe("tema");
        expect(instance.bestemmelsesoverskrift).toBe("overskrift");
        expect(instance.bestemmelsestekst).toBe("tekst");
        expect(instance.bestemmelsestype).toBeInstanceOf(Kode);
        expect(instance.bestemmelsestype.kodeverdi).toBe("type");
        expect(instance.bestemmelsestype.kodebeskrivelse).toBe("TypeNavn");
        expect(instance.dispVarselBeskrivelse).toBe("beskrivelse");
        expect(instance.dispensasjonstema).toBeInstanceOf(Kode);
        expect(instance.dispensasjonstema.kodeverdi).toBe("disp");
        expect(instance.dispensasjonstema.kodebeskrivelse).toBe("DispNavn");
        expect(instance.paragrafnummer).toBe("§1");
        expect(instance.plannavn).toBe("Planen");
    });

    it("should handle missing optional properties", () => {
        const instance = new Dispensasjonsvarsel({});
        expect(instance.annetTema).toBeUndefined();
        expect(instance.bestemmelsesoverskrift).toBeUndefined();
        expect(instance.bestemmelsestekst).toBeUndefined();
        expect(instance.bestemmelsestype).toBeFalsy();
        expect(instance.dispVarselBeskrivelse).toBeUndefined();
        expect(instance.dispensasjonstema).toBeFalsy();
        expect(instance.paragrafnummer).toBeUndefined();
        expect(instance.plannavn).toBeUndefined();
    });
});
