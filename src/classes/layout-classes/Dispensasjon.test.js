import Dispensasjon from "./Dispensasjon";
import Begrunnelse from "../data-classes/Begrunnelse.js";
import DispensasjonBeskrivelse from "../data-classes/DispensasjonBeskrivelse.js";
import DispensasjonFra from "../data-classes/DispensasjonFra.js";
import EiendomByggested from "../data-classes/EiendomByggested.js";
import Kode from "../data-classes/Kode.js";
import KommunensSaksnummer from "../data-classes/KommunensSaksnummer.js";
import Metadata from "../data-classes/Metadata.js";
import Part from "../data-classes/Part.js";
import Stedfesting from "../data-classes/Stedfesting.js";
import Varighet from "../data-classes/Varighet.js";

describe("Dispensasjon", () => {
    it("should initialize with all properties when valid props are provided", () => {
        const props = {
            dispensasjonBeskrivelse: { description: "Test description" },
            dispensasjonReferanse: "REF123",
            soeknadstype: { code: "TYPE1" },
            kommunensSaksnummer: { number: "12345" },
            metadata: { createdBy: "user" },
            eiendomByggested: { address: "Test address" },
            tiltakshaver: { name: "Test Party" },
            dispensasjonFra: { reason: "Test reason" },
            stedfesting: { location: "Test location" },
            varighet: { duration: "1 year" },
            begrunnelse: { justification: "Test justification" },
            generelleVilkaar: "Test conditions"
        };

        const instance = new Dispensasjon(props);

        expect(instance.dispensasjonBeskrivelse).toBeInstanceOf(DispensasjonBeskrivelse);
        expect(instance.dispensasjonReferanse).toBe("REF123");
        expect(instance.soeknadstype).toBeInstanceOf(Kode);
        expect(instance.kommunensSaksnummer).toBeInstanceOf(KommunensSaksnummer);
        expect(instance.metadata).toBeInstanceOf(Metadata);
        expect(instance.eiendomByggested).toBeInstanceOf(EiendomByggested);
        expect(instance.tiltakshaver).toBeInstanceOf(Part);
        expect(instance.dispensasjonFra).toBeInstanceOf(DispensasjonFra);
        expect(instance.stedfesting).toBeInstanceOf(Stedfesting);
        expect(instance.varighet).toBeInstanceOf(Varighet);
        expect(instance.begrunnelse).toBeInstanceOf(Begrunnelse);
        expect(instance.generelleVilkaar).toBe("Test conditions");
    });

    it("should initialize with undefined properties when no props are provided", () => {
        const instance = new Dispensasjon({});

        expect(instance.dispensasjonBeskrivelse).toBeUndefined();
        expect(instance.dispensasjonReferanse).toBeUndefined();
        expect(instance.soeknadstype).toBeUndefined();
        expect(instance.kommunensSaksnummer).toBeUndefined();
        expect(instance.metadata).toBeUndefined();
        expect(instance.eiendomByggested).toBeUndefined();
        expect(instance.tiltakshaver).toBeUndefined();
        expect(instance.dispensasjonFra).toBeUndefined();
        expect(instance.stedfesting).toBeUndefined();
        expect(instance.varighet).toBeUndefined();
        expect(instance.begrunnelse).toBeUndefined();
        expect(instance.generelleVilkaar).toBeUndefined();
    });

    it("should handle partial props correctly", () => {
        const props = {
            dispensasjonReferanse: "REF123",
            generelleVilkaar: "Test conditions"
        };

        const instance = new Dispensasjon(props);

        expect(instance.dispensasjonBeskrivelse).toBeUndefined();
        expect(instance.dispensasjonReferanse).toBe("REF123");
        expect(instance.soeknadstype).toBeUndefined();
        expect(instance.generelleVilkaar).toBe("Test conditions");
    });
});
