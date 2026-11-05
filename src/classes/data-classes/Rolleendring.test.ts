import Kode from "./Kode.ts";
import Part from "./Part.ts";
import Rolleendring from "./Rolleendring.ts";

describe("Rolleendring", () => {
    it("should initialize all properties correctly", () => {
        const instance = new Rolleendring({
            aktoer: { navn: "Ola Nordmann AS", organisasjonsnummer: "123456789" },
            aktoertype: { kodeverdi: "AnsvarligSoeker", kodebeskrivelse: "Ansvarlig søker" },
            aktoerendring: { kodeverdi: "ny", kodebeskrivelse: "Ny" },
            erRolleendringErklaert: true
        });
        expect(instance.aktoer).toBeInstanceOf(Part);
        expect(instance.aktoer!.navn).toBe("Ola Nordmann AS");
        expect(instance.aktoertype).toBeInstanceOf(Kode);
        expect(instance.aktoertype!.kodebeskrivelse).toBe("Ansvarlig søker");
        expect(instance.aktoerendring).toBeInstanceOf(Kode);
        expect(instance.aktoerendring!.kodeverdi).toBe("ny");
        expect(instance.erRolleendringErklaert).toBe(true);
    });

    it("keeps a false declaration rather than dropping it", () => {
        expect(new Rolleendring({ erRolleendringErklaert: false }).erRolleendringErklaert).toBe(false);
    });

    it("should handle missing optional properties", () => {
        const instance = new Rolleendring();
        expect(instance.aktoer).toBeFalsy();
        expect(instance.aktoertype).toBeFalsy();
        expect(instance.aktoerendring).toBeFalsy();
        expect(instance.erRolleendringErklaert).toBeUndefined();
    });
});
