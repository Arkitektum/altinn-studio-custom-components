import GjenpartNabovarsel from "./GjenpartNabovarsel";
import Part from "./Part";
import EiendomByggested from "./EiendomByggested";
import NaboGjenboerEiendommer from "./NaboGjenboerEiendommer";
import Planer from "./Planer";

describe("GjenpartNabovarsel", () => {
    const mockPart = { navn: "Ola Nordmann", adresse: "Testveien 1" };
    const mockEiendomByggested = { adresse: "Byggested 2" };
    const mockNaboGjenboerEiendommer = { eiendommer: ["Eiendom 1", "Eiendom 2"] };
    const mockPlaner = { planNavn: "Reguleringsplan" };
    const mockSoeknadGjelder = "Garasje";

    it("should create an instance with all properties set", () => {
        const props = {
            ansvarligSoeker: mockPart,
            eiendomByggested: mockEiendomByggested,
            kontaktpersonForNabovarselet: mockPart,
            naboGjenboerEiendommer: mockNaboGjenboerEiendommer,
            planer: mockPlaner,
            soeknadGjelder: mockSoeknadGjelder,
            tiltakshaver: mockPart
        };
        const instance = new GjenpartNabovarsel(props);

        expect(instance.ansvarligSoeker).toBeInstanceOf(Part);
        expect(instance.eiendomByggested).toBeInstanceOf(EiendomByggested);
        expect(instance.kontaktpersonForNabovarselet).toBeInstanceOf(Part);
        expect(instance.naboGjenboerEiendommer).toBeInstanceOf(NaboGjenboerEiendommer);
        expect(instance.planer).toBeInstanceOf(Planer);
        expect(instance.soeknadGjelder).toBe(mockSoeknadGjelder);
        expect(instance.tiltakshaver).toBeInstanceOf(Part);
    });

    it("should handle missing optional properties", () => {
        const instance = new GjenpartNabovarsel({});
        expect(instance.ansvarligSoeker).toBeFalsy();
        expect(instance.eiendomByggested).toBeFalsy();
        expect(instance.kontaktpersonForNabovarselet).toBeFalsy();
        expect(instance.naboGjenboerEiendommer).toBeFalsy();
        expect(instance.planer).toBeFalsy();
        expect(instance.soeknadGjelder).toBeUndefined();
        expect(instance.tiltakshaver).toBeFalsy();
    });

    it("should not instantiate classes if props are null or undefined", () => {
        const props = {
            ansvarligSoeker: null,
            eiendomByggested: undefined,
            kontaktpersonForNabovarselet: null,
            naboGjenboerEiendommer: undefined,
            planer: null,
            soeknadGjelder: null,
            tiltakshaver: undefined
        };
        const instance = new GjenpartNabovarsel(props);
        expect(instance.ansvarligSoeker).toBeFalsy();
        expect(instance.eiendomByggested).toBeFalsy();
        expect(instance.kontaktpersonForNabovarselet).toBeFalsy();
        expect(instance.naboGjenboerEiendommer).toBeFalsy();
        expect(instance.planer).toBeFalsy();
        expect(instance.soeknadGjelder).toBeNull();
        expect(instance.tiltakshaver).toBeFalsy();
    });

    it("should only instantiate provided properties", () => {
        const props = {
            ansvarligSoeker: mockPart,
            soeknadGjelder: mockSoeknadGjelder
        };
        const instance = new GjenpartNabovarsel(props);
        expect(instance.ansvarligSoeker).toBeInstanceOf(Part);
        expect(instance.soeknadGjelder).toBe(mockSoeknadGjelder);
        expect(instance.eiendomByggested).toBeFalsy();
        expect(instance.kontaktpersonForNabovarselet).toBeFalsy();
        expect(instance.naboGjenboerEiendommer).toBeFalsy();
        expect(instance.planer).toBeFalsy();
        expect(instance.tiltakshaver).toBeFalsy();
    });
});
