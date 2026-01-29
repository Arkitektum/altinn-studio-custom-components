import Utfoerende from "./Utfoerende";
import MidlertidigBrukstillatelse from "./MidlertidigBrukstillatelse";

jest.mock("./MidlertidigBrukstillatelse");

describe("Utfoerende", () => {
    beforeEach(() => {
        MidlertidigBrukstillatelse.mockClear();
    });

    it("should create an instance with midlertidigBrukstillatelse and erOkForFerdigattest", () => {
        const mbData = { some: "data" };
        const props = {
            midlertidigBrukstillatelse: mbData,
            erOkForFerdigattest: true
        };

        const instance = new Utfoerende(props);

        expect(MidlertidigBrukstillatelse).toHaveBeenCalledWith(mbData);
        expect(instance.midlertidigBrukstillatelse).toBeInstanceOf(MidlertidigBrukstillatelse);
        expect(instance.erOkForFerdigattest).toBe(true);
    });

    it("should set midlertidigBrukstillatelse to undefined if not provided", () => {
        const props = { erOkForFerdigattest: false };
        const instance = new Utfoerende(props);

        expect(MidlertidigBrukstillatelse).not.toHaveBeenCalled();
        expect(instance.midlertidigBrukstillatelse).toBeUndefined();
        expect(instance.erOkForFerdigattest).toBe(false);
    });

    it("should handle missing props gracefully", () => {
        const instance = new Utfoerende({});
        expect(instance.midlertidigBrukstillatelse).toBeUndefined();
        expect(instance.erOkForFerdigattest).toBeUndefined();
    });

    it("should handle undefined props gracefully", () => {
        const instance = new Utfoerende();
        expect(instance.midlertidigBrukstillatelse).toBeUndefined();
        expect(instance.erOkForFerdigattest).toBeUndefined();
    });
});
