import Vannforsyning from "./Vannforsyning";
import Kode from "./Kode";

describe("Vannforsyning", () => {
    it("should initialize all properties correctly", () => {
        const props = {
            beskrivelse: "Test beskrivelse",
            harTinglystErklaering: true,
            krysserVannforsyningAnnensGrunn: false,
            tilknytningstype: { kodeverdi: "A", kodebeskrivelse: "Type A" }
        };
        const vannforsyning = new Vannforsyning(props);

        expect(vannforsyning.beskrivelse).toBe(props.beskrivelse);
        expect(vannforsyning.harTinglystErklaering).toBe(props.harTinglystErklaering);
        expect(vannforsyning.krysserVannforsyningAnnensGrunn).toBe(props.krysserVannforsyningAnnensGrunn);
        expect(vannforsyning.tilknytningstype).toBeInstanceOf(Kode);
        expect(vannforsyning.tilknytningstype.kodeverdi).toBe(props.tilknytningstype.kodeverdi);
        expect(vannforsyning.tilknytningstype.kodebeskrivelse).toBe(props.tilknytningstype.kodebeskrivelse);
    });

    it("should set tilknytningstype to undefined if not provided", () => {
        const props = {
            beskrivelse: "Test",
            harTinglystErklaering: false,
            krysserVannforsyningAnnensGrunn: true
        };
        const vannforsyning = new Vannforsyning(props);

        expect(vannforsyning.tilknytningstype).toBeUndefined();
    });

    it("should handle missing props gracefully", () => {
        const vannforsyning = new Vannforsyning();

        expect(vannforsyning.beskrivelse).toBeUndefined();
        expect(vannforsyning.harTinglystErklaering).toBeUndefined();
        expect(vannforsyning.krysserVannforsyningAnnensGrunn).toBeUndefined();
        expect(vannforsyning.tilknytningstype).toBeUndefined();
    });

    it("should handle partial props", () => {
        const props = { beskrivelse: "Partial" };
        const vannforsyning = new Vannforsyning(props);

        expect(vannforsyning.beskrivelse).toBe("Partial");
        expect(vannforsyning.harTinglystErklaering).toBeUndefined();
        expect(vannforsyning.krysserVannforsyningAnnensGrunn).toBeUndefined();
        expect(vannforsyning.tilknytningstype).toBeUndefined();
    });
});
