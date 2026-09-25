import GjenstaaendeArbeider from "./GjenstaaendeArbeider.ts";
import MidlertidigBrukstillatelse from "./MidlertidigBrukstillatelse.ts";
import Sikkerhet from "./Sikkerhet.ts";

jest.mock("./GjenstaaendeArbeider");
jest.mock("./Sikkerhet");

describe("MidlertidigBrukstillatelse", () => {
    beforeEach(() => {
        (GjenstaaendeArbeider as unknown as jest.Mock).mockClear();
        (Sikkerhet as unknown as jest.Mock).mockClear();
    });

    it("should set erOkForMidlertidigBrukstillatelse from props", () => {
        const instance = new MidlertidigBrukstillatelse({ erOkForMidlertidigBrukstillatelse: true });
        expect(instance.erOkForMidlertidigBrukstillatelse).toBe(true);
    });

    it("should instantiate GjenstaaendeArbeider if props.gjenstaaendeArbeider is provided", () => {
        const gaProps = { foo: "bar" };
        const fakeGA = { some: "instance" };
        (GjenstaaendeArbeider as unknown as jest.Mock).mockImplementation(() => fakeGA);

        const instance = new MidlertidigBrukstillatelse({ gjenstaaendeArbeider: gaProps });
        expect(GjenstaaendeArbeider).toHaveBeenCalledWith(gaProps);
        expect(instance.gjenstaaendeArbeider).toBe(fakeGA);
    });

    it("should not instantiate GjenstaaendeArbeider if props.gjenstaaendeArbeider is not provided", () => {
        const instance = new MidlertidigBrukstillatelse({});
        expect(GjenstaaendeArbeider).not.toHaveBeenCalled();
        expect(instance.gjenstaaendeArbeider).toBeFalsy();
    });

    it("should instantiate Sikkerhet if props.sikkerhet is provided", () => {
        const sikkerhetProps = { baz: "qux" };
        const fakeSikkerhet = { another: "instance" };
        (Sikkerhet as unknown as jest.Mock).mockImplementation(() => fakeSikkerhet);

        const instance = new MidlertidigBrukstillatelse({ sikkerhet: sikkerhetProps });
        expect(Sikkerhet).toHaveBeenCalledWith(sikkerhetProps);
        expect(instance.sikkerhet).toBe(fakeSikkerhet);
    });

    it("should not instantiate Sikkerhet if props.sikkerhet is not provided", () => {
        const instance = new MidlertidigBrukstillatelse({});
        expect(Sikkerhet).not.toHaveBeenCalled();
        expect(instance.sikkerhet).toBeFalsy();
    });

    it("should handle undefined props gracefully", () => {
        const instance = new MidlertidigBrukstillatelse();
        expect(instance.erOkForMidlertidigBrukstillatelse).toBeUndefined();
        expect(instance.gjenstaaendeArbeider).toBeUndefined();
        expect(instance.sikkerhet).toBeUndefined();
    });
});
