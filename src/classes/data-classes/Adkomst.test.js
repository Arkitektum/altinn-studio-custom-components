import Adkomst from "./Adkomst";
import Kode from "./Kode";

jest.mock("./Kode");

describe("Adkomst", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should set erNyEllerEndretAdkomst when provided", () => {
        const adkomst = new Adkomst({ erNyEllerEndretAdkomst: true });
        expect(adkomst.erNyEllerEndretAdkomst).toBe(true);
    });

    it("should set erNyEllerEndretAdkomst to undefined when not provided", () => {
        const adkomst = new Adkomst({});
        expect(adkomst.erNyEllerEndretAdkomst).toBeUndefined();
    });

    it("should instantiate Kode for vegtype when provided", () => {
        const vegtypeObj = { code: "123" };
        const kodeInstance = {};
        Kode.mockImplementation(() => kodeInstance);

        const adkomst = new Adkomst({ vegtype: vegtypeObj });
        expect(Kode).toHaveBeenCalledWith(vegtypeObj);
        expect(adkomst.vegtype).toBe(kodeInstance);
    });

    it("should set vegtype to undefined when not provided", () => {
        const adkomst = new Adkomst({});
        expect(adkomst.vegtype).toBeUndefined();
    });

    it("should handle undefined props gracefully", () => {
        const adkomst = new Adkomst();
        expect(adkomst.erNyEllerEndretAdkomst).toBeUndefined();
        expect(adkomst.vegtype).toBeUndefined();
    });
});
