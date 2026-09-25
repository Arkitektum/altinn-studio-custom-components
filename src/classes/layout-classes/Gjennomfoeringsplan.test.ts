import EiendomByggested from "../data-classes/EiendomByggested.ts";
import Gjennomfoeringsplan from "./Gjennomfoeringsplan.ts";
import Kode from "../data-classes/Kode.ts";
import KommunensSaksnummer from "../data-classes/KommunensSaksnummer.ts";
import Metadata from "../data-classes/Metadata.ts";
import Part from "../data-classes/Part.ts";

jest.mock("../data-classes/Part");
jest.mock("../data-classes/EiendomByggested");
jest.mock("../data-classes/Kode");
jest.mock("../data-classes/KommunensSaksnummer");
jest.mock("../data-classes/Metadata");

describe("Gjennomfoeringsplan", () => {
    beforeEach(() => {
        (Part as unknown as jest.Mock).mockClear();
        (EiendomByggested as unknown as jest.Mock).mockClear();
        (Kode as unknown as jest.Mock).mockClear();
        (KommunensSaksnummer as unknown as jest.Mock).mockClear();
        (Metadata as unknown as jest.Mock).mockClear();
    });

    it("should construct all properties when all props are provided", () => {
        const props = {
            ansvarligSoeker: { name: "Test Soeker" },
            ansvarligSoekerTiltaksklasse: { kodeverdi: "1", kodebeskrivelse: "Tiltaksklasse 1" },
            eiendomByggested: { address: "Test Address" },
            // A stand-in, not a real gjennomfoeringsplan. The test only checks that it is passed through.
            gjennomfoeringsplan: "Plan details" as unknown as { ansvarsomraade?: unknown },
            kommunensSaksnummer: { number: "123" },
            metadata: { created: "2024-01-01" },
            versjon: "1.0"
        };

        const instance = new Gjennomfoeringsplan(props);

        expect(Part).toHaveBeenCalledWith(props.ansvarligSoeker);
        expect(Kode).toHaveBeenCalledWith(props.ansvarligSoekerTiltaksklasse);
        expect(EiendomByggested).toHaveBeenCalledWith(props.eiendomByggested);
        expect(KommunensSaksnummer).toHaveBeenCalledWith(props.kommunensSaksnummer);
        expect(Metadata).toHaveBeenCalledWith(props.metadata);

        expect(instance.ansvarligSoeker).toBeInstanceOf(Part);
        expect(instance.ansvarligSoekerTiltaksklasse).toBeInstanceOf(Kode);
        expect(instance.eiendomByggested).toBeInstanceOf(EiendomByggested);
        expect(instance.gjennomfoeringsplan).toBe(props.gjennomfoeringsplan);
        expect(instance.kommunensSaksnummer).toBeInstanceOf(KommunensSaksnummer);
        expect(instance.metadata).toBeInstanceOf(Metadata);
        expect(instance.versjon).toBe(props.versjon);
    });

    it("should set properties to undefined if props are missing", () => {
        const instance = new Gjennomfoeringsplan({});

        expect(instance.ansvarligSoeker).toBeUndefined();
        expect(instance.ansvarligSoekerTiltaksklasse).toBeUndefined();
        expect(instance.eiendomByggested).toBeUndefined();
        expect(instance.gjennomfoeringsplan).toBeUndefined();
        expect(instance.kommunensSaksnummer).toBeUndefined();
        expect(instance.metadata).toBeUndefined();
        expect(instance.versjon).toBeUndefined();
    });

    it("should handle missing props argument gracefully", () => {
        const instance = new Gjennomfoeringsplan();

        expect(instance.ansvarligSoeker).toBeUndefined();
        expect(instance.ansvarligSoekerTiltaksklasse).toBeUndefined();
        expect(instance.eiendomByggested).toBeUndefined();
        expect(instance.gjennomfoeringsplan).toBeUndefined();
        expect(instance.kommunensSaksnummer).toBeUndefined();
        expect(instance.metadata).toBeUndefined();
        expect(instance.versjon).toBeUndefined();
    });

    it("should only instantiate classes for provided properties", () => {
        const props = {
            ansvarligSoeker: { name: "Test Soeker" },
            versjon: "2.0"
        };

        const instance = new Gjennomfoeringsplan(props);

        expect(Part).toHaveBeenCalledWith(props.ansvarligSoeker);
        expect(Kode).not.toHaveBeenCalled();
        expect(EiendomByggested).not.toHaveBeenCalled();
        expect(KommunensSaksnummer).not.toHaveBeenCalled();
        expect(Metadata).not.toHaveBeenCalled();

        expect(instance.ansvarligSoeker).toBeInstanceOf(Part);
        expect(instance.ansvarligSoekerTiltaksklasse).toBeUndefined();
        expect(instance.eiendomByggested).toBeUndefined();
        expect(instance.gjennomfoeringsplan).toBeUndefined();
        expect(instance.kommunensSaksnummer).toBeUndefined();
        expect(instance.metadata).toBeUndefined();
        expect(instance.versjon).toBe(props.versjon);
    });
});
