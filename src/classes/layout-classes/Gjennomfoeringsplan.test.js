import Gjennomfoeringsplan from "./Gjennomfoeringsplan";
import EiendomByggested from "../data-classes/EiendomByggested";
import KommunensSaksnummer from "../data-classes/KommunensSaksnummer";
import Metadata from "../data-classes/Metadata";

jest.mock("../data-classes/EiendomByggested");
jest.mock("../data-classes/KommunensSaksnummer");
jest.mock("../data-classes/Metadata");

describe("Gjennomfoeringsplan", () => {
    beforeEach(() => {
        EiendomByggested.mockClear();
        KommunensSaksnummer.mockClear();
        Metadata.mockClear();
    });

    it("should initialize all properties when props are provided", () => {
        const props = {
            eiendomByggested: { foo: "bar" },
            kommunensSaksnummer: { baz: "qux" },
            metadata: { meta: "data" },
            versjon: "1.0"
        };

        const instance = new Gjennomfoeringsplan(props);

        expect(EiendomByggested).toHaveBeenCalledWith(props.eiendomByggested);
        expect(KommunensSaksnummer).toHaveBeenCalledWith(props.kommunensSaksnummer);
        expect(Metadata).toHaveBeenCalledWith(props.metadata);
        expect(instance.versjon).toBe("1.0");
    });

    it("should set properties to undefined if not provided", () => {
        const instance = new Gjennomfoeringsplan({});
        expect(instance.eiendomByggested).toBeFalsy();
        expect(instance.kommunensSaksnummer).toBeFalsy();
        expect(instance.metadata).toBeFalsy();
        expect(instance.versjon).toBeUndefined();
    });

    it("should handle missing props argument", () => {
        const instance = new Gjennomfoeringsplan();
        expect(instance.eiendomByggested).toBeFalsy();
        expect(instance.kommunensSaksnummer).toBeFalsy();
        expect(instance.metadata).toBeFalsy();
        expect(instance.versjon).toBeUndefined();
    });

    it("should not instantiate classes if corresponding prop is undefined", () => {
        const props = { versjon: "2.0" };
        const instance = new Gjennomfoeringsplan(props);
        expect(EiendomByggested).not.toHaveBeenCalled();
        expect(KommunensSaksnummer).not.toHaveBeenCalled();
        expect(Metadata).not.toHaveBeenCalled();
        expect(instance.versjon).toBe("2.0");
    });
});
