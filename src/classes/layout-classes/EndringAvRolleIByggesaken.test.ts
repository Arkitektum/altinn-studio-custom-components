import EiendomByggested from "../data-classes/EiendomByggested.ts";
import EndringAvRolleIByggesaken from "./EndringAvRolleIByggesaken.ts";
import KommunensSaksnummer from "../data-classes/KommunensSaksnummer.ts";
import Part from "../data-classes/Part.ts";
import Rolleendring from "../data-classes/Rolleendring.ts";
import Rolleendringer from "../data-classes/Rolleendringer.ts";

describe("EndringAvRolleIByggesaken", () => {
    it("should initialize all properties correctly", () => {
        const soeknadGjelder = { type: { kode: [{ kodeverdi: "nyttbygg", kodebeskrivelse: "Nytt bygg" }] } };
        const instance = new EndringAvRolleIByggesaken({
            eiendomByggested: { eiendom: [{ kommunenavn: "Larvik" }] },
            endringMeldtAv: { navn: "Kari Nordmann AS" },
            gjelderFraDato: "2026-12-12",
            kommunensSaksnummer: { saksaar: 2024, sakssekvensnummer: 12345 },
            rolleendringer: { rolleendring: [{ erRolleendringErklaert: true }] },
            soeknadGjelder
        });
        expect(instance.eiendomByggested).toBeInstanceOf(EiendomByggested);
        expect(instance.endringMeldtAv).toBeInstanceOf(Part);
        expect(instance.endringMeldtAv!.navn).toBe("Kari Nordmann AS");
        expect(instance.gjelderFraDato).toBe("2026-12-12");
        expect(instance.kommunensSaksnummer).toBeInstanceOf(KommunensSaksnummer);
        expect(instance.kommunensSaksnummer!.saksaar).toBe(2024);
        expect(instance.rolleendringer).toBeInstanceOf(Rolleendringer);
        expect(instance.rolleendringer!.rolleendring![0]).toBeInstanceOf(Rolleendring);
        expect(instance.soeknadGjelder).toBe(soeknadGjelder);
    });

    it("should handle missing optional properties", () => {
        const instance = new EndringAvRolleIByggesaken();
        expect(instance.eiendomByggested).toBeFalsy();
        expect(instance.endringMeldtAv).toBeFalsy();
        expect(instance.gjelderFraDato).toBeUndefined();
        expect(instance.kommunensSaksnummer).toBeFalsy();
        expect(instance.rolleendringer).toBeFalsy();
        expect(instance.soeknadGjelder).toBeUndefined();
    });
});
