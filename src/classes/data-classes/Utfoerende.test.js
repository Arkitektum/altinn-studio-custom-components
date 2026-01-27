import Utfoerende from "./Utfoerende";
import MidlertidigBrukstillatelse from "./MidlertidigBrukstillatelse";

jest.mock("./MidlertidigBrukstillatelse");

describe("Utfoerende", () => {
    beforeEach(() => {
        MidlertidigBrukstillatelse.mockClear();
    });

    it("should set midlertidigBrukstillatelse as an instance when provided", () => {
        const mbData = { some: "data" };
        const instance = new Utfoerende({ midlertidigBrukstillatelse: mbData });
        expect(MidlertidigBrukstillatelse).toHaveBeenCalledWith(mbData);
        expect(instance.midlertidigBrukstillatelse).toBeInstanceOf(MidlertidigBrukstillatelse);
    });

    it("should not set midlertidigBrukstillatelse when not provided", () => {
        const instance = new Utfoerende({});
        expect(instance.midlertidigBrukstillatelse).toBeFalsy();
        expect(MidlertidigBrukstillatelse).not.toHaveBeenCalled();
    });

    it("should set erOkForFerdigattest when provided", () => {
        const instance = new Utfoerende({ erOkForFerdigattest: true });
        expect(instance.erOkForFerdigattest).toBe(true);
    });

    it("should set erOkForFerdigattest as undefined when not provided", () => {
        const instance = new Utfoerende({});
        expect(instance.erOkForFerdigattest).toBeUndefined();
    });

    it("should handle undefined props gracefully", () => {
        const instance = new Utfoerende();
        expect(instance.midlertidigBrukstillatelse).toBeFalsy();
        expect(instance.erOkForFerdigattest).toBeUndefined();
    });
});
