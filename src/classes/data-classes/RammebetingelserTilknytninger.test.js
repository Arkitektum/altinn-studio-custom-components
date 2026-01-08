import RammebetingelserTilknytninger from "./RammebetingelserTilknytninger";
import Adkomst from "./Adkomst";
import Avloep from "./Avloep";
import Overvann from "./Overvann";
import Vannforsyning from "./Vannforsyning";

jest.mock("./Adkomst");
jest.mock("./Avloep");
jest.mock("./Overvann");
jest.mock("./Vannforsyning");

describe("RammebetingelserTilknytninger", () => {
    beforeEach(() => {
        Adkomst.mockClear();
        Avloep.mockClear();
        Overvann.mockClear();
        Vannforsyning.mockClear();
    });

    it("should create all properties when all props are provided", () => {
        const props = {
            adkomst: { foo: "bar" },
            avloep: { baz: "qux" },
            vannforsyning: { quux: "corge" }
        };

        const instance = new RammebetingelserTilknytninger(props);

        expect(Adkomst).toHaveBeenCalledWith(props.adkomst);
        expect(Avloep).toHaveBeenCalledWith(props.avloep);
        expect(Overvann).toHaveBeenCalledWith(props.avloep);
        expect(Vannforsyning).toHaveBeenCalledWith(props.vannforsyning);

        expect(instance.adkomst).toBeInstanceOf(Adkomst);
        expect(instance.avloep).toBeInstanceOf(Avloep);
        expect(instance.overvann).toBeInstanceOf(Overvann);
        expect(instance.vannforsyning).toBeInstanceOf(Vannforsyning);
    });

    it("should only create adkomst when only adkomst is provided", () => {
        const props = { adkomst: { foo: "bar" } };
        const instance = new RammebetingelserTilknytninger(props);

        expect(Adkomst).toHaveBeenCalledWith(props.adkomst);
        expect(instance.adkomst).toBeInstanceOf(Adkomst);

        expect(instance.avloep).toBeFalsy();
        expect(instance.overvann).toBeFalsy();
        expect(instance.vannforsyning).toBeFalsy();
    });

    it("should only create avloep and overvann when only avloep is provided", () => {
        const props = { avloep: { baz: "qux" } };
        const instance = new RammebetingelserTilknytninger(props);

        expect(Avloep).toHaveBeenCalledWith(props.avloep);
        expect(Overvann).toHaveBeenCalledWith(props.avloep);

        expect(instance.adkomst).toBeFalsy();
        expect(instance.avloep).toBeInstanceOf(Avloep);
        expect(instance.overvann).toBeInstanceOf(Overvann);
        expect(instance.vannforsyning).toBeFalsy();
    });

    it("should only create vannforsyning when only vannforsyning is provided", () => {
        const props = { vannforsyning: { quux: "corge" } };
        const instance = new RammebetingelserTilknytninger(props);

        expect(Vannforsyning).toHaveBeenCalledWith(props.vannforsyning);
        expect(instance.vannforsyning).toBeInstanceOf(Vannforsyning);

        expect(instance.adkomst).toBeFalsy();
        expect(instance.avloep).toBeFalsy();
        expect(instance.overvann).toBeFalsy();
    });

    it("should set all properties to falsy if no props are provided", () => {
        const instance = new RammebetingelserTilknytninger({});
        expect(instance.adkomst).toBeFalsy();
        expect(instance.avloep).toBeFalsy();
        expect(instance.overvann).toBeFalsy();
        expect(instance.vannforsyning).toBeFalsy();
    });

    it("should handle undefined props gracefully", () => {
        const instance = new RammebetingelserTilknytninger();
        expect(instance.adkomst).toBeFalsy();
        expect(instance.avloep).toBeFalsy();
        expect(instance.overvann).toBeFalsy();
        expect(instance.vannforsyning).toBeFalsy();
    });
});
