import Gjennomfoeringsplan from "./Gjennomfoeringsplan";
import Part from "../data-classes/Part";
import EiendomByggested from "../data-classes/EiendomByggested";
import KommunensSaksnummer from "../data-classes/KommunensSaksnummer";
import Metadata from "../data-classes/Metadata";

jest.mock("../data-classes/Part");
jest.mock("../data-classes/EiendomByggested");
jest.mock("../data-classes/KommunensSaksnummer");
jest.mock("../data-classes/Metadata");

describe("Gjennomfoeringsplan", () => {
    beforeEach(() => {
        Part.mockClear();
        EiendomByggested.mockClear();
        KommunensSaksnummer.mockClear();
        Metadata.mockClear();
    });

    it("should construct all properties when all props are provided", () => {
        const props = {
            ansvarligSoeker: { name: "Test Soeker" },
            eiendomByggested: { address: "Test Address" },
            gjennomfoeringsplan: "Plan details",
            kommunensSaksnummer: { number: "123" },
            metadata: { created: "2024-01-01" },
            versjon: "1.0"
        };

        const instance = new Gjennomfoeringsplan(props);

        expect(Part).toHaveBeenCalledWith(props.ansvarligSoeker);
        expect(EiendomByggested).toHaveBeenCalledWith(props.eiendomByggested);
        expect(KommunensSaksnummer).toHaveBeenCalledWith(props.kommunensSaksnummer);
        expect(Metadata).toHaveBeenCalledWith(props.metadata);

        expect(instance.ansvarligSoeker).toBeInstanceOf(Part);
        expect(instance.eiendomByggested).toBeInstanceOf(EiendomByggested);
        expect(instance.gjennomfoeringsplan).toBe(props.gjennomfoeringsplan);
        expect(instance.kommunensSaksnummer).toBeInstanceOf(KommunensSaksnummer);
        expect(instance.metadata).toBeInstanceOf(Metadata);
        expect(instance.versjon).toBe(props.versjon);
    });

    it("should set properties to undefined if props are missing", () => {
        const instance = new Gjennomfoeringsplan({});

        expect(instance.ansvarligSoeker).toBeUndefined();
        expect(instance.eiendomByggested).toBeUndefined();
        expect(instance.gjennomfoeringsplan).toBeUndefined();
        expect(instance.kommunensSaksnummer).toBeUndefined();
        expect(instance.metadata).toBeUndefined();
        expect(instance.versjon).toBeUndefined();
    });

    it("should handle missing props argument gracefully", () => {
        const instance = new Gjennomfoeringsplan();

        expect(instance.ansvarligSoeker).toBeUndefined();
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
        expect(EiendomByggested).not.toHaveBeenCalled();
        expect(KommunensSaksnummer).not.toHaveBeenCalled();
        expect(Metadata).not.toHaveBeenCalled();

        expect(instance.ansvarligSoeker).toBeInstanceOf(Part);
        expect(instance.eiendomByggested).toBeUndefined();
        expect(instance.gjennomfoeringsplan).toBeUndefined();
        expect(instance.kommunensSaksnummer).toBeUndefined();
        expect(instance.metadata).toBeUndefined();
        expect(instance.versjon).toBe(props.versjon);
    });
});
