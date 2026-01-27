import MidlertidigBrukstillatelse from "./MidlertidigBrukstillatelse";
import GjenstaaendeArbeider from "./GjenstaaendeArbeider";
import Sikkerhet from "./Sikkerhet";

jest.mock("./GjenstaaendeArbeider");
jest.mock("./Sikkerhet");

describe("MidlertidigBrukstillatelse", () => {
    beforeEach(() => {
        GjenstaaendeArbeider.mockClear();
        Sikkerhet.mockClear();
    });

    it("should set erOkForMidlertidigBrukstillatelse when provided", () => {
        const instance = new MidlertidigBrukstillatelse({ erOkForMidlertidigBrukstillatelse: true });
        expect(instance.erOkForMidlertidigBrukstillatelse).toBe(true);
    });

    it("should instantiate GjenstaaendeArbeider when gjenstaaendeArbeider is provided", () => {
        const gaData = { foo: "bar" };
        new MidlertidigBrukstillatelse({ gjenstaaendeArbeider: gaData });
        expect(GjenstaaendeArbeider).toHaveBeenCalledWith(gaData);
    });

    it("should instantiate Sikkerhet when sikkerhet is provided", () => {
        const sikkerhetData = { baz: "qux" };
        new MidlertidigBrukstillatelse({ sikkerhet: sikkerhetData });
        expect(Sikkerhet).toHaveBeenCalledWith(sikkerhetData);
    });

    it("should set gjenstaaendeArbeider and sikkerhet to undefined if not provided", () => {
        const instance = new MidlertidigBrukstillatelse({});
        expect(instance.gjenstaaendeArbeider).toBeUndefined();
        expect(instance.sikkerhet).toBeUndefined();
    });

    it("should handle undefined props gracefully", () => {
        const instance = new MidlertidigBrukstillatelse();
        expect(instance.erOkForMidlertidigBrukstillatelse).toBeUndefined();
        expect(instance.gjenstaaendeArbeider).toBeUndefined();
        expect(instance.sikkerhet).toBeUndefined();
    });
});
