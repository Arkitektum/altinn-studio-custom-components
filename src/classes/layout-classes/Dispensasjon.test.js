import Dispensasjon from "./Dispensasjon.js";
import Kode from "../data-classes/Kode.js";

describe("Dispensasjon", () => {
    const baseProps = {
        begrunnelse: { hensynBakBestemmelsen: "test" },
        bestemmelsestype: { kodeverdi: "A", kodebeskrivelse: "desc" },
        dispensasjonsbeskrivelse: "desc",
        dispensasjonsreferanse: "ref",
        dispensasjonstema: { kodeverdi: "B", kodebeskrivelse: "tema" },
        eiendomByggested: { eiendom: [] },
        generelleVilkaar: ["vilkaar1", "vilkaar2"],
        kommunensSaksnummer: { saksaar: 2024, sakssekvensnummer: 1 },
        metadata: { ftbId: "id", prosjektnavn: "navn", prosjektnr: "nr" },
        nasjonalArealplanId: { kodeverdi: "C", kodebeskrivelse: "plan" },
        paragrafnummer: "§1",
        plannavn: "plan",
        stedfesting: { posisjon: { koordinater: "1,2" } },
        tiltakshaver: { navn: "Ola" },
        varighet: { oenskesVarigDispensasjon: true, oensketVarighetTil: "2026-01-01" },
        tiltakstyper: { kode: [{ kodeverdi: "X", kodebeskrivelse: "typeX" }] }
    };

    it("should construct with all properties", () => {
        const disp = new Dispensasjon(baseProps);
        expect(disp.begrunnelse).toBeDefined();
        expect(disp.bestemmelsestype).toBeInstanceOf(Kode);
        expect(disp.dispensasjonsbeskrivelse).toBe("desc");
        expect(disp.dispensasjonsreferanse).toBe("ref");
        expect(disp.dispensasjonstema).toBeInstanceOf(Kode);
        expect(disp.eiendomByggested).toBeDefined();
        expect(disp.generelleVilkaar).toEqual(["vilkaar1", "vilkaar2"]);
        expect(disp.kommunensSaksnummer).toBeDefined();
        expect(disp.metadata).toBeDefined();
        expect(disp.nasjonalArealplanId).toBeInstanceOf(Kode);
        expect(disp.paragrafnummer).toBe("§1");
        expect(disp.plannavn).toBe("plan");
        expect(disp.stedfesting).toBeDefined();
        expect(disp.tiltakshaver).toBeDefined();
        expect(disp.varighet).toBeDefined();
        expect(disp.tiltakstyper).toBeDefined();
        expect(Array.isArray(disp.tiltakstyper.kode)).toBe(true);
        expect(disp.tiltakstyper.kode[0]).toBeInstanceOf(Kode);
    });

    it("should handle missing props gracefully", () => {
        const disp = new Dispensasjon();
        expect(disp.begrunnelse).toBeUndefined();
        expect(disp.tiltakstyper).toBeUndefined();
    });

    describe("getTiltakstyperFromProps", () => {
        it("should return null if no tiltakstyper", () => {
            const disp = new Dispensasjon({});
            expect(disp.getTiltakstyperFromProps({})).toBeNull();
        });
        it("should return kode array if tiltakstyper present", () => {
            const disp = new Dispensasjon();
            const result = disp.getTiltakstyperFromProps({ tiltakstyper: { kode: [{ kodeverdi: "A", kodebeskrivelse: "desc" }] } });
            expect(result).toHaveProperty("kode");
            expect(Array.isArray(result.kode)).toBe(true);
            expect(result.kode[0]).toBeInstanceOf(Kode);
        });
    });

    describe("getKodeFromType", () => {
        it("should return null if kode is not array", () => {
            const disp = new Dispensasjon();
            expect(disp.getKodeFromType({})).toBeNull();
        });
        it("should return array of Kode if kode is array", () => {
            const disp = new Dispensasjon();
            const arr = disp.getKodeFromType({ kode: [{ kodeverdi: "A", kodebeskrivelse: "desc" }] });
            expect(Array.isArray(arr)).toBe(true);
            expect(arr[0]).toBeInstanceOf(Kode);
        });
    });
});
