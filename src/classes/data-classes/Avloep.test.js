import Avloep from "./Avloep";
import Kode from "./Kode";

describe("Avloep", () => {
    it("should initialize properties correctly", () => {
        const props = {
            harTinglystErklaering: true,
            krysserAvloepAnnensGrunn: false,
            tilknytningstype: { kodeverdi: "A", kodebeskrivelse: "Test" },
            skalInstallereVannklosett: true,
            harUtslippstillatelse: false
        };
        const avloep = new Avloep(props);

        expect(avloep.harTinglystErklaering).toBe(true);
        expect(avloep.krysserAvloepAnnensGrunn).toBe(false);
        expect(avloep.tilknytningstype).toBeInstanceOf(Kode);
        expect(avloep.tilknytningstype.kodeverdi).toBe("A");
        expect(avloep.tilknytningstype.kodebeskrivelse).toBe("Test");
        expect(avloep.skalInstallereVannklosett).toBe(true);
        expect(avloep.harUtslippstillatelse).toBe(false);
    });

    it("should handle missing tilknytningstype", () => {
        const props = {
            harTinglystErklaering: false,
            krysserAvloepAnnensGrunn: true
        };
        const avloep = new Avloep(props);

        expect(avloep.harTinglystErklaering).toBe(false);
        expect(avloep.krysserAvloepAnnensGrunn).toBe(true);
        expect(avloep.tilknytningstype).toBeUndefined();
        expect(avloep.skalInstallereVannklosett).toBeUndefined();
        expect(avloep.harUtslippstillatelse).toBeUndefined();
    });

    it("should handle undefined props", () => {
        const avloep = new Avloep();

        expect(avloep.harTinglystErklaering).toBeUndefined();
        expect(avloep.krysserAvloepAnnensGrunn).toBeUndefined();
        expect(avloep.tilknytningstype).toBeUndefined();
        expect(avloep.skalInstallereVannklosett).toBeUndefined();
        expect(avloep.harUtslippstillatelse).toBeUndefined();
    });
});
